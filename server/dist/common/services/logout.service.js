"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogOut = void 0;
const response_utils_1 = require("../utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const authCookie_utils_1 = require("../../users/utils/authCookie.utils");
const checkToken_utils_1 = require("../utils/checkToken.utils");
const userLogOut = async (req, res) => {
    const payload = (0, checkToken_utils_1.checkRefreshToken)(req);
    if (!payload)
        return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "invalid or missong token");
    try {
        (0, authCookie_utils_1.clearAuthCookies)(res);
    }
    catch (error) {
        (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "problem in logout");
    }
};
exports.userLogOut = userLogOut;
