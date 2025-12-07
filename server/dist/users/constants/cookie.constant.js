"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_COOKIE_OPTIONS = void 0;
exports.AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
};
