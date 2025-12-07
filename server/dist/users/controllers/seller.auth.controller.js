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
exports.sellerAuthController = void 0;
const controller_decoder_1 = require("../../common/decorators/controller.decoder");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const route_decoder_1 = require("../../common/decorators/route.decoder");
const seller_auth_services_1 = require("../services/seller.auth.services");
const getCurrentUser_utils_1 = require("../utils/getCurrentUser.utils");
const authCookie_utils_1 = require("../utils/authCookie.utils");
let sellerAuthController = class sellerAuthController {
    async correntUser(req, res) {
        return (0, getCurrentUser_utils_1.getCurrentUser)(req, res);
    }
    sellerAuthServices = new seller_auth_services_1.SellerAuthServices();
    async sellerLoginController(req, res) {
        try {
            const result = await this.sellerAuthServices.sellerLogin(req.body);
            if ('isAlreadyLoggedIn' in result)
                return (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.CONFLICT, result.message);
            (0, authCookie_utils_1.setAuthCookies)(res, result.accessToken, result.refreshToken);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Login successful", {
                user: result.user,
            });
        }
        catch (error) {
            console.log("seller auth login controller:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
};
exports.sellerAuthController = sellerAuthController;
__decorate([
    (0, route_decoder_1.Route)("get", "/me"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], sellerAuthController.prototype, "correntUser", null);
__decorate([
    (0, route_decoder_1.Route)("post", "/login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], sellerAuthController.prototype, "sellerLoginController", null);
exports.sellerAuthController = sellerAuthController = __decorate([
    (0, controller_decoder_1.Controller)("/seller/auth")
], sellerAuthController);
