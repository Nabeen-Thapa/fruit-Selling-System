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
exports.buyerAuthController = void 0;
const controller_decoder_1 = require("../../common/decorators/controller.decoder");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const route_decoder_1 = require("../../common/decorators/route.decoder");
const buyer_auth_services_1 = require("../services/buyer.auth.services");
const authCookie_utils_1 = require("../utils/authCookie.utils");
const getCurrentUser_utils_1 = require("../utils/getCurrentUser.utils");
const dtoValidateResponse_utils_1 = require("../../common/utils/dtoValidateResponse.utils");
const login_dto_1 = require("../dtos/login.dto");
let buyerAuthController = class buyerAuthController {
    buyerAuthServices = new buyer_auth_services_1.buyerAuthServices();
    async correntUser(req, res) {
        return (0, getCurrentUser_utils_1.getCurrentUser)(req, res);
    }
    async buyerLoginController(req, res) {
        try {
            const buyerLoginData = req.body;
            const buyerData = await (0, dtoValidateResponse_utils_1.validateDto)(login_dto_1.loginDto, buyerLoginData, res);
            if (!buyerData.valid)
                return;
            const result = await this.buyerAuthServices.buyerLogin(buyerData.data);
            if ('isAlreadyLoggedIn' in result)
                return (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.CONFLICT, result.message);
            (0, authCookie_utils_1.setAuthCookies)(res, result.accessToken, result.refreshToken);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "seccess login as buyer");
        }
        catch (error) {
            console.log("buyer auth login controller:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
        }
    }
};
exports.buyerAuthController = buyerAuthController;
__decorate([
    (0, route_decoder_1.Route)("get", "/me"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], buyerAuthController.prototype, "correntUser", null);
__decorate([
    (0, route_decoder_1.Route)("post", "/login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], buyerAuthController.prototype, "buyerLoginController", null);
exports.buyerAuthController = buyerAuthController = __decorate([
    (0, controller_decoder_1.Controller)("/buyer/auth")
], buyerAuthController);
