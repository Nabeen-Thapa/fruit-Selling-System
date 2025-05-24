"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerAuthServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_utils_1 = require("../../common/utils/response.utils");
const dbORM_config_1 = require("../../config/dbORM.config");
const seller_model_1 = require("../models/seller.model");
const bcrypt_1 = require("bcrypt");
const auth_types_1 = require("../types/auth.types");
const jwt_config_1 = require("../../config/jwt.config");
const redis_service_1 = require("../../common/services/redis.service");
const session_service_1 = require("./session.service");
class SellerAuthServices {
    constructor() {
        this.sellerRegisterRepo = dbORM_config_1.falfulConnection.getRepository(seller_model_1.seller);
        this.sessionService = new session_service_1.SessionService();
    }
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async sellerLogin(sellerData) {
        const queryRunner = dbORM_config_1.falfulConnection.createQueryRunner();
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
            const isPasswordValid = await (0, bcrypt_1.compare)(password, hashToCheck);
            if (!seller || !isPasswordValid)
                throw new response_utils_1.AppError("invalid credential", http_status_codes_1.StatusCodes.NOT_FOUND);
            const hasActiveSession = await this.sessionService.checkActiveSession(seller.id);
            if (hasActiveSession)
                return {
                    message: "You are already logged in",
                    isAlreadyLoggedIn: true
                };
            const payload = {
                userId: seller.id,
                name: seller.name,
                email: seller.email,
                phone: seller.phone,
                role: seller.role,
            };
            const accessToken = (0, jwt_config_1.generateAccessToken)(payload);
            const refreshToken = (0, jwt_config_1.generateRefreshToken)(payload);
            // Store refresh token in Redis with expiration
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            // Store tokens
            await redis_service_1.redisService.set(`refresh_token:${seller.id}`, refreshToken, 60 * 60 * 24 * 7);
            await this.sessionService.createUserSession(seller.id, refreshToken, auth_types_1.UserType.SELLER, expiresAt);
            await queryRunner.commitTransaction();
            return {
                refreshToken,
                user: {
                    id: seller.id,
                    name: seller.name,
                    email: seller.email,
                    phone: seller.phone,
                    role: seller.role,
                },
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.log("Login error:", error.message);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.SellerAuthServices = SellerAuthServices;
