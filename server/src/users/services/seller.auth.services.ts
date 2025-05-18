import { StatusCodes } from "http-status-codes";
import { AppError } from "../../common/utils/response.utils";
import { falfulConnection } from "../../config/dbORM.config";
import { serllerDto } from "../dtos/seller.dot";
import { seller } from "../models/seller.model";
import { UserSession } from "../models/userSession.model";
import { compare } from "bcrypt";
import { LoginResponse, TokenPayload, UserType } from "../types/auth.types";
import { generateAccessToken, generateRefreshToken } from "../../config/jwt.config";
import { redisService } from "../../common/services/redis.service";
import { SessionService } from "./session.service";

export class SellerAuthServices {
  protected sellerRegisterRepo = falfulConnection.getRepository(seller);
  private sessionService = new SessionService();
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sellerLogin(sellerData: serllerDto): Promise<LoginResponse> {
    const queryRunner = falfulConnection.createQueryRunner();
    const { password, email } = sellerData;
    try {
      // Always delay to prevent timing attacks
      await this.delay(500);
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const seller = await this.sellerRegisterRepo.findOne({ where: { email } });

      //Ensures constant-time comparison, making it impossible to distinguish between "invalid email" and "wrong password."
      //More secure than a fixed delay.
      const dummyHash = "$2a$10$dkdfsAbiugiuW2bhfdb@h+$A%"; // A fake bcrypt hash
      const hashToCheck = seller ? seller.password : dummyHash;
      const isPasswordValid = await compare(password, hashToCheck);
      if (!seller || !isPasswordValid) throw new AppError("invalid credential", StatusCodes.NOT_FOUND);

      const hasActiveSession = await this.sessionService.checkActiveSession(seller.id);
      if (hasActiveSession)
        return {
          message: "You are already logged in",
          isAlreadyLoggedIn: true
        };

      const payload: TokenPayload = {
        userId: seller.id,
        email: seller.email,
        role: seller.role,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

        // Store refresh token in Redis with expiration
         const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Store tokens
      await redisService.set(`refresh_token:${seller.id}`, refreshToken, 60 * 60 * 24 * 7);
      await this.sessionService.createUserSession(
        seller.id,
        refreshToken,
        UserType.SELLER,
        expiresAt
      );
      await queryRunner.commitTransaction();
      return {
        accessToken,
        user: {
          id: seller.id,
          email: seller.email,
          role: seller.role,
        },
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log("Login error:", (error as Error).message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}