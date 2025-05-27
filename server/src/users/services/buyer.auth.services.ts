import { falfulConnection } from "src/config/dbORM.config";
import { buyer } from "../models/buyer.model";
import { SessionService } from "./session.service";
import { buyerDto } from "../dtos/buyer.dto";
import { LoginResponse, TokenPayload, UserType } from "../types/auth.types";
import { AppError } from "src/common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "src/config/jwt.config";
import { redisService } from "src/common/services/redis.service";

export class buyerAuthServices {
    protected buyerRegisterRepo = falfulConnection.getRepository(buyer);
    private sessionService = new SessionService();

    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async buyerLogin(buyerData: buyerDto): Promise<LoginResponse> {
        const queryRunner = falfulConnection.createQueryRunner();
        const { email, password } = buyerData;
        try {
            await this.delay(400);
            await queryRunner.startTransaction();

            const buyer = await this.buyerRegisterRepo.findOne({ where: { email } });
            if (!buyer) throw new AppError("user is not found", StatusCodes.NOT_FOUND);

            const dummeyHash = "$H!DT0os3x4ty+&WMkir%d*+/#vd!mVmfR5";
            const hashToCheck = buyer ? buyer?.password : dummeyHash;
            const isPasswordValid = await compare(password, hashToCheck);
            if (!isPasswordValid) throw new AppError("invalid password", StatusCodes.NOT_FOUND);

            const hasActiveSeeeion = await this.sessionService.checkActiveSession(buyer.id);

            if (hasActiveSeeeion)
                return {
                    message: "You are already logged in",
                    isAlreadyLoggedIn: true
                };
                
            const payload: TokenPayload = {
                userId: buyer.id,
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
                role: buyer.role,
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            await redisService.set(`refresh_token:${buyer.id}`, refreshToken, 60 * 60 * 24 * 7);
            await this.sessionService.createUserSession(buyer.id, refreshToken, UserType.BUYER, expiresAt);
            await queryRunner.commitTransaction();


            return {
                accessToken,
                refreshToken,
                user: {
                    id: buyer.id,
                    name: buyer.name,
                    email: buyer.email,
                    phone: buyer.phone,
                    role: buyer.role,
                },
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