"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRefreshToken = checkRefreshToken;
const http_status_codes_1 = require("http-status-codes");
const response_utils_1 = require("../../common/utils/response.utils");
const jwt_config_1 = require("../../config/jwt.config");
async function checkRefreshToken(req, res) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "No token found");
    }
    try {
        const payload = (0, jwt_config_1.verifyRefreshToken)(refreshToken);
        return (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Valid token", { sellerId: payload.userId });
    }
    catch (err) {
        return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid token");
    }
}
