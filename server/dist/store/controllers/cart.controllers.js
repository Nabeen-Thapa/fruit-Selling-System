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
exports.cartControllers = void 0;
const controller_decoder_1 = require("../../common/decorators/controller.decoder");
const route_decoder_1 = require("../../common/decorators/route.decoder");
const auth_middleware_1 = require("../../users/middleware/auth.middleware");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const cart_services_1 = require("../services/cart.services");
let cartControllers = class cartControllers {
    cartServices = new cart_services_1.cartServices();
    async addToCartController(req, res) {
        try {
            if (!req.user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorized");
            const { productId, quantity } = req.body;
            const buyerId = req.user?.id;
            await this.cartServices.addToCart(buyerId, productId, quantity);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "added successfully");
        }
        catch (error) {
            console.log("add to cart service error:", error.message);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "internal server error");
        }
    }
    async viewMyCartController(req, res) {
        try {
            if (!req.user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you arte not authorized");
            const { id } = req.user;
            const viewMyCartResult = await this.cartServices.viewMyCart(id);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully view", viewMyCartResult);
        }
        catch (error) {
            console.log("errro duirng view my cart:", error.message);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async deleteFromCartConteroller(req, res) {
        const cartItemId = req.params.id;
        const quantity = Number(req.params.qty);
        try {
            if (!req.user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authrized");
            console.log("imte deleted");
            const result = await this.cartServices.deleteFromCart(cartItemId, quantity);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "items is deleted successfully from cart");
        }
        catch (error) {
            console.log("error during delete item form cart:", error.message);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
};
exports.cartControllers = cartControllers;
__decorate([
    (0, route_decoder_1.Route)("post", "/add", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], cartControllers.prototype, "addToCartController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/myCart", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], cartControllers.prototype, "viewMyCartController", null);
__decorate([
    (0, route_decoder_1.Route)("delete", "/:id/:qty/delete", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], cartControllers.prototype, "deleteFromCartConteroller", null);
exports.cartControllers = cartControllers = __decorate([
    (0, controller_decoder_1.Controller)("/falful/cart")
], cartControllers);
