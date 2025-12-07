"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = getCurrentUser;
const response_utils_1 = require("../../common/utils/response.utils");
const jwt_config_1 = require("../../config/jwt.config");
async function getCurrentUser(req, res) {
    const accessToken = req.cookies?.access_token; // safe optional chaining
    if (!accessToken) {
        return (0, response_utils_1.sendError)(res, 401, "Access token must be provided");
    }
    try {
        const payload = (0, jwt_config_1.verifyAccessToken)(accessToken);
        if (!payload) {
            return (0, response_utils_1.sendError)(res, 401, "Unauthorized");
        }
        return (0, response_utils_1.sendSuccess)(res, 200, "User authenticated", {
            userId: payload.userId,
            role: payload.role,
            name: payload.name,
            email: payload.email,
            phone: payload.phone
        });
    }
    catch (error) {
        return (0, response_utils_1.sendError)(res, 401, "Invalid or expired token");
    }
}
