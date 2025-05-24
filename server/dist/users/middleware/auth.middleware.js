"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const redis_service_1 = require("../../common/services/redis.service");
const dbORM_config_1 = require("../../config/dbORM.config");
const seller_model_1 = require("../models/seller.model");
const userSession_model_1 = require("../models/userSession.model");
const typeorm_1 = require("typeorm");
const authenticate = async (req, res, next) => {
    try {
        // 1. Extract access token
        const token = req.cookies?.access_token ||
            req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new response_utils_1.AppError('Authentication token required', http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        // 2. Verify and decode token
        const jwtKey = process.env.JWT_SECRET || 'hQ7@SpU87P17rByoN8odlu$ggVO2+zieRdGASq!%UDLExA5k';
        const decoded = jsonwebtoken_1.default.verify(token, jwtKey);
        // 3. Check if token is blacklisted in Redis
        const isBlacklisted = await redis_service_1.redisService.exists(`blacklist:${token}`);
        if (isBlacklisted) {
            throw new response_utils_1.AppError('Token revoked', http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        // 4. Check seller existence
        const sellerRepo = dbORM_config_1.falfulConnection.getRepository(seller_model_1.seller);
        const sellerExist = await sellerRepo.findOne({ where: { id: decoded.userId } });
        if (!sellerExist)
            throw new response_utils_1.AppError('Seller not found', http_status_codes_1.StatusCodes.UNAUTHORIZED);
        // 5. Check for active session in DB
        const sessionRepo = dbORM_config_1.falfulConnection.getRepository(userSession_model_1.UserSession);
        const activeSession = await sessionRepo.findOne({
            where: {
                userId: decoded.userId,
                isValid: true,
                expiresAt: (0, typeorm_1.MoreThan)(new Date()),
            },
        });
        if (!activeSession)
            throw new response_utils_1.AppError('Session expired or invalid', http_status_codes_1.StatusCodes.UNAUTHORIZED);
        // 6. Validate session token matches Redis refresh token
        const storedRefreshToken = await redis_service_1.redisService.get(`refresh_token:${decoded.userId}`);
        if (!storedRefreshToken || storedRefreshToken !== activeSession.token) {
            throw new response_utils_1.AppError('Invalid session token', http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        // 7. Attach user to request for further access
        req.user = {
            id: decoded.userId,
            name: decoded.name,
            email: decoded.email,
            phone: decoded.phone,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid or expired token',
                code: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            });
        }
        const statusCode = error instanceof response_utils_1.AppError
            ? error.statusCode
            : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).json({
            success: false,
            message: error instanceof Error ? error.message : 'Authentication failed',
            code: statusCode,
        });
    }
};
exports.authenticate = authenticate;
