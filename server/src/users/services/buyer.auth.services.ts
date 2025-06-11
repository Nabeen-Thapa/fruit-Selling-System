import { falfulConnection } from "../../config/dbORM.config";
import { buyer } from "../models/buyer.model";
import { SessionService } from "./session.service";
import { buyerDto } from "../dtos/buyer.dto";
import { LoginResponse, TokenPayload, UserType } from "../types/auth.types";
import { AppError } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../config/jwt.config";
import { redisService } from "../../common/services/redis.service";
import { delay } from "../utils/loginDelay.utils";
import { loginDto } from "../dtos/login.dto";

export class buyerAuthServices {
    protected buyerRegisterRepo = falfulConnection.getRepository(buyer);
    private sessionService = new SessionService();

    async buyerLogin(buyerData: loginDto): Promise<LoginResponse> {
        const queryRunner = falfulConnection.createQueryRunner();
        const { email, password } = buyerData;
        try {
            await delay(500);
            await queryRunner.startTransaction();

            const buyer = await this.buyerRegisterRepo.findOne({ where: { email } });
            if (!buyer) throw new AppError("user is not found", StatusCodes.NOT_FOUND);

            const dummeyHash = process.env.DUMMY_BCRYPT_HASH || "$H!DT0os3x4ty+&WMkir%d*+/#vd!mVmfR5";
            const hashToCheck = buyer ? buyer?.password : dummeyHash;
            const isPasswordValid = await compare(password, hashToCheck);
            if (!isPasswordValid) throw new AppError("invalid password", StatusCodes.UNAUTHORIZED);

            const hasActiveSeeeion = await this.sessionService.checkActiveSession(buyer.id);

            const payload: TokenPayload = {
                userId: buyer.id,
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
                role: buyer.role,
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            const expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
            await redisService.set(`refresh_token:${buyer.id}`, refreshToken,  (7 * 24 * 60 * 60 * 1000));
            
            if (!hasActiveSeeeion) {
                await this.sessionService.createUserSession(buyer.id, refreshToken, UserType.BUYER, expiresAt);
            }

            await queryRunner.commitTransaction();

            const { id, name, phone, role } = buyer;
            return {
                accessToken,
                refreshToken,
                user: { id, name, email, phone, role, },
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log("Login error:", (error as Error).message);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}