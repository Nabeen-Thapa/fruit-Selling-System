"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerAuthServices = void 0;
const dbORM_config_1 = require("../../config/dbORM.config");
const buyer_model_1 = require("../models/buyer.model");
const session_service_1 = require("./session.service");
const auth_types_1 = require("../types/auth.types");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = require("bcrypt");
const jwt_config_1 = require("../../config/jwt.config");
const redis_service_1 = require("../../common/services/redis.service");
const loginDelay_utils_1 = require("../utils/loginDelay.utils");
class buyerAuthServices {
    buyerRegisterRepo = dbORM_config_1.falfulConnection.getRepository(buyer_model_1.Buyer);
    sessionService = new session_service_1.SessionService();
    async buyerLogin(buyerData) {
        const queryRunner = dbORM_config_1.falfulConnection.createQueryRunner();
        const { email, password } = buyerData;
        try {
            await (0, loginDelay_utils_1.delay)(500);
            await queryRunner.startTransaction();
            const buyer = await this.buyerRegisterRepo.findOne({ where: { email } });
            if (!buyer)
                throw new response_utils_1.AppError("user is not found", http_status_codes_1.StatusCodes.NOT_FOUND);
            const dummeyHash = process.env.DUMMY_BCRYPT_HASH || "$H!DT0os3x4ty+&WMkir%d*+/#vd!mVmfR5";
            const hashToCheck = buyer ? buyer?.password : dummeyHash;
            const isPasswordValid = await (0, bcrypt_1.compare)(password, hashToCheck);
            if (!isPasswordValid)
                throw new response_utils_1.AppError("invalid password", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            const hasActiveSeeeion = await this.sessionService.checkActiveSession(buyer.id);
            const payload = {
                userId: buyer.id,
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
                role: buyer.role,
            };
            const accessToken = (0, jwt_config_1.generateAccessToken)(payload);
            const refreshToken = (0, jwt_config_1.generateRefreshToken)(payload);
            const expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
            await redis_service_1.redisService.set(`refresh_token:${buyer.id}`, refreshToken, (7 * 24 * 60 * 60 * 1000));
            if (!hasActiveSeeeion) {
                await this.sessionService.createUserSession(buyer.id, refreshToken, auth_types_1.UserType.BUYER, expiresAt);
            }
            await queryRunner.commitTransaction();
            const { id, name, phone, role } = buyer;
            return {
                accessToken,
                refreshToken,
                user: { id, name, email, phone, role, },
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
exports.buyerAuthServices = buyerAuthServices;
