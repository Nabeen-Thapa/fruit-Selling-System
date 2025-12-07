"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRefreshToken = checkRefreshToken;
const jwt_config_1 = require("../../config/jwt.config");
async function checkRefreshToken(req) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken)
        throw new Error("No token found");
    const payload = (0, jwt_config_1.verifyRefreshToken)(refreshToken);
    if (!payload)
        throw new Error("Invalid token");
    return payload;
}
