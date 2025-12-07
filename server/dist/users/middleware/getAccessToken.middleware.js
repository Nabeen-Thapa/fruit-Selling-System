"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewAccessToken = getNewAccessToken;
const http_status_codes_1 = require("http-status-codes");
const response_utils_1 = require("../../common/utils/response.utils");
const jwt_config_1 = require("../../config/jwt.config");
const dbORM_config_1 = require("../../config/dbORM.config");
const userSession_model_1 = require("../../users/models/userSession.model");
const seller_model_1 = require("../models/seller.model");
const buyer_model_1 = require("../models/buyer.model");
const auth_types_1 = require("../types/auth.types");
async function getNewAccessToken(req) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken)
        throw new response_utils_1.AppError("not token found", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    try {
        const payload = (0, jwt_config_1.verifyRefreshToken)(refreshToken);
        if (!payload)
            throw new response_utils_1.AppError("Invalid token", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        const userSessionRepo = dbORM_config_1.falfulConnection.getRepository(userSession_model_1.UserSession);
        const sellerRepo = dbORM_config_1.falfulConnection.getRepository(seller_model_1.seller);
        const buyerRepo = dbORM_config_1.falfulConnection.getRepository(buyer_model_1.Buyer);
        const userRepo = payload.role === auth_types_1.UserType.BUYER ? buyerRepo : sellerRepo;
        const refreshFromDb = await userSessionRepo.findOne({ where: { token: refreshToken } });
        if (!refreshFromDb)
            throw new response_utils_1.AppError("invalid refresh token");
        //  const verifyRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        // if (!verifyRefresh) throw new AppError("token is not verify", StatusCodes.UNAUTHORIZED);
        const user = await userRepo.findOne({ where: { id: payload.userId } });
        if (!user)
            throw new response_utils_1.AppError("user is not found", http_status_codes_1.StatusCodes.NOT_FOUND);
        const tokenPayload = {
            userId: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };
        const accessToken = (0, jwt_config_1.generateAccessToken)(tokenPayload);
        const newRefreshToken = (0, jwt_config_1.generateRefreshToken)(tokenPayload);
        const updateRefreshDb = await userSessionRepo.update({ token: refreshToken }, { token: newRefreshToken });
        return { accessToken, refreshToken: newRefreshToken };
    }
    catch (err) {
        console.error("Token verification error:", err);
        const message = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
        throw new response_utils_1.AppError(message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
}
