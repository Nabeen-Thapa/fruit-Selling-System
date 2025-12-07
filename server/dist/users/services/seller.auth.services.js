"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const loginDelay_utils_1 = require("../utils/loginDelay.utils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SellerAuthServices {
    sellerRegisterRepo = dbORM_config_1.falfulConnection.getRepository(seller_model_1.seller);
    sessionService = new session_service_1.SessionService();
    async sellerLogin(sellerData) {
        const queryRunner = dbORM_config_1.falfulConnection.createQueryRunner();
        const { password, email } = sellerData;
        try {
            // Always delay to prevent timing attacks
            await (0, loginDelay_utils_1.delay)(500);
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const seller = await this.sellerRegisterRepo.findOne({ where: { email } });
            const dummyHash = process.env.DUMMY_BCRYPT_HASH || "$2a$10$dkdfsAbiugiuW2bhfdb@h+$A%";
            const hashToCheck = seller ? seller.password : dummyHash;
            const isPasswordValid = await (0, bcrypt_1.compare)(password, hashToCheck);
            if (!seller || !isPasswordValid)
                throw new response_utils_1.AppError("invalid credentialss", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            const hasActiveSession = await this.sessionService.checkActiveSession(seller.id);
            if (hasActiveSession)
                isAlreadyLoggedIn: true;
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
            const expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days
            // Store tokens
            //const REFRESH_TOKEN_EXPIRY = parseInt(process.env.REFRESH_TOKEN_EXPIRY || "604800");
            await redis_service_1.redisService.set(`refresh_token:${seller.id}`, refreshToken, (7 * 24 * 60 * 60 * 1000));
            await this.sessionService.createUserSession(seller.id, refreshToken, auth_types_1.UserType.SELLER, expiresAt);
            await queryRunner.commitTransaction();
            const { id, name, phone, role } = seller;
            return {
                accessToken,
                refreshToken,
                user: { id, name, email, phone, role }
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
