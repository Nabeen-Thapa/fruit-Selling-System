"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "Q@SpU87P17rByoN0odlu?gVO2-zieRdGAq!%UDLExA3K";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "GIKDWc4Agoi&qvZ$qem+DkSGhMG?qbM8OEuLAzV+IdYTE4";
const ACCESS_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY = '7d';
const generateAccessToken = (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    if (!token) {
        throw new Error("Access token must be provided");
    }
    return (0, jsonwebtoken_1.verify)(token, ACCESS_TOKEN_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    if (!token) {
        throw new Error("Refresh token must be provided");
    }
    return (0, jsonwebtoken_1.verify)(token, REFRESH_TOKEN_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
