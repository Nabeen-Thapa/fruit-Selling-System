"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutController = void 0;
const http_status_codes_1 = require("http-status-codes");
const controller_decoder_1 = require("../decorators/controller.decoder");
const route_decoder_1 = require("../decorators/route.decoder");
const logout_service_1 = require("../services/logout.service");
const response_utils_1 = require("../utils/response.utils");
const getAccessToken_middleware_1 = require("../../users/middleware/getAccessToken.middleware");
const authCookie_utils_1 = require("../../users/utils/authCookie.utils");
let LogoutController = class LogoutController {
    async logoutController(req, res) {
        try {
            await (0, logout_service_1.userLogOut)(req, res);
            return (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "logout success");
        }
        catch (error) {
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async getaccessToken(req, res) {
        try {
            const newAccessToken = await (0, getAccessToken_middleware_1.getNewAccessToken)(req);
            (0, authCookie_utils_1.clearAuthCookies)(res);
            (0, authCookie_utils_1.setAuthCookies)(res, newAccessToken.accessToken, newAccessToken.refreshToken);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "accessed success");
        }
        catch (error) {
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
};
exports.LogoutController = LogoutController;
__decorate([
    (0, route_decoder_1.Route)("get", "/logout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LogoutController.prototype, "logoutController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/new-access-token"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LogoutController.prototype, "getaccessToken", null);
exports.LogoutController = LogoutController = __decorate([
    (0, controller_decoder_1.Controller)("/user")
], LogoutController);
