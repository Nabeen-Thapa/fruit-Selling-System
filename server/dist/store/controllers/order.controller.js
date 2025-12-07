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
exports.orderController = void 0;
const controller_decoder_1 = require("../../common/decorators/controller.decoder");
const order_services_1 = require("../services/order.services");
const route_decoder_1 = require("../../common/decorators/route.decoder");
const auth_middleware_1 = require("../../users/middleware/auth.middleware");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const dtoValidateResponse_utils_1 = require("../../common/utils/dtoValidateResponse.utils");
const orders_dto_1 = require("../dtos/orders.dto");
let orderController = class orderController {
    orderService = new order_services_1.OrderServices();
    async placeOrderContrlller(req, res) {
        try {
            if (!req.user)
                (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorized");
            const buyerId = req.user?.id;
            const orderData = req.body;
            console.log("order dat contrller:", orderData);
            const orderDtoValidate = await (0, dtoValidateResponse_utils_1.validateDto)(orders_dto_1.ordersDtos, orderData, res);
            if (!orderDtoValidate.valid)
                return;
            console.log("order dat contrller dto:", orderDtoValidate);
            await this.orderService.placeOrder(orderDtoValidate.data, buyerId);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully ordered");
        }
        catch (error) {
            console.log("place order controller error:", error.message);
            return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async viewSellerOrdersController(req, res) {
        try {
            if (!req.user)
                (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorized");
            const sellerId = req.user?.id;
        }
        catch (error) {
            console.log("view seller order controller error:", error.message);
            return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async viewBuyerOrdersController(req, res) {
        try {
            if (!req.user)
                (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorized");
            const buyerId = req.user?.id;
            const orders = await this.orderService.viewBuyerOrders(buyerId);
            if (orders)
                return (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "your orders", orders);
        }
        catch (error) {
            console.log("view buyer order controller error:", error.message);
            return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async cancelOrderContrlller(req, res) {
    }
};
exports.orderController = orderController;
__decorate([
    (0, route_decoder_1.Route)("post", "/placeorder", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], orderController.prototype, "placeOrderContrlller", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/viewSellerOrders", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], orderController.prototype, "viewSellerOrdersController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/viewBuyerOrders", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], orderController.prototype, "viewBuyerOrdersController", null);
__decorate([
    (0, route_decoder_1.Route)("post", "/cancelorder", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], orderController.prototype, "cancelOrderContrlller", null);
exports.orderController = orderController = __decorate([
    (0, controller_decoder_1.Controller)("/product/order")
], orderController);
