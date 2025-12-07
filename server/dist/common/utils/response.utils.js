"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.sendError = exports.sendSuccess = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendSuccess = (res, StatusCode, message, data) => {
    return res.status(StatusCode).json({
        success: true,
        message,
        data,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode, error) => {
    return res.status(statusCode).json({
        success: false,
        message: error?.message || "Something went wrong",
    });
};
exports.sendError = sendError;
class AppError extends Error {
    message;
    statusCode;
    constructor(message, statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
