import { StatusCodes } from "http-status-codes";
import { AppError } from "../../common/utils/response.utils";
import { falfulConnection } from "../../config/dbORM.config";
import { serllerDto } from "../dtos/seller.dot";
import { seller } from "../models/seller.model";
import { compare } from "bcrypt";
import { LoginResponse, TokenPayload, UserType } from "../types/auth.types";
import { generateAccessToken, generateRefreshToken } from "../../config/jwt.config";
import { redisService } from "../../common/services/redis.service";
import { SessionService } from "./session.service";
import { delay } from "../utils/loginDelay.utils";
import dotenv from "dotenv";
dotenv.config();

export class SellerAuthServices {
  protected sellerRegisterRepo = falfulConnection.getRepository(seller);
  private sessionService = new SessionService();
  
  async sellerLogin(sellerData: serllerDto): Promise<LoginResponse> {
    const queryRunner = falfulConnection.createQueryRunner();
    const { password, email } = sellerData;
    try {
      // Always delay to prevent timing attacks
      await delay(500);
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const seller = await this.sellerRegisterRepo.findOne({ where: { email } });

      const dummyHash = process.env.DUMMY_BCRYPT_HASH || "$2a$10$dkdfsAbiugiuW2bhfdb@h+$A%"; 
      const hashToCheck = seller ? seller.password : dummyHash;
      const isPasswordValid = await compare(password, hashToCheck);
      if (!seller || !isPasswordValid) throw new AppError("invalid credential", StatusCodes.UNAUTHORIZED);

      const hasActiveSession = await this.sessionService.checkActiveSession(seller.id);
      if (hasActiveSession)isAlreadyLoggedIn: true;

      const payload: TokenPayload = {
        userId: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        role: seller.role,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      // Store refresh token in Redis with expiration
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Store tokens
      //const REFRESH_TOKEN_EXPIRY = parseInt(process.env.REFRESH_TOKEN_EXPIRY || "604800");
      await redisService.set(`refresh_token:${seller.id}`, refreshToken, 60 * 60 * 24 * 7);
      await this.sessionService.createUserSession(
        seller.id,
        refreshToken,
        UserType.SELLER,
        expiresAt
      );
      await queryRunner.commitTransaction();
      const { id, name, phone, role } = seller;
      return {
        accessToken,
        refreshToken,
         user: { id, name, email, phone, role }
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