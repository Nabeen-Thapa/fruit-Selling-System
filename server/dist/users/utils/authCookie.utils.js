"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookies = setAuthCookies;
exports.clearAuthCookies = clearAuthCookies;
const cookie_constant_1 = require("../constants/cookie.constant");
function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie("access_token", accessToken, cookie_constant_1.AUTH_COOKIE_OPTIONS);
    res.cookie("refresh_token", refreshToken, cookie_constant_1.AUTH_COOKIE_OPTIONS);
}
//for logout
function clearAuthCookies(res) {
    res.clearCookie("access_token", { ...cookie_constant_1.AUTH_COOKIE_OPTIONS });
    res.clearCookie("refresh_token", { ...cookie_constant_1.AUTH_COOKIE_OPTIONS });
}
