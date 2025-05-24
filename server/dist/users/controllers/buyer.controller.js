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
exports.buyerController = void 0;
const controller_decoder_1 = require("../../common/decorators/controller.decoder");
const route_decoder_1 = require("../../common/decorators/route.decoder");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const buyer_services_1 = require("../services/buyer.services");
let buyerController = class buyerController {
    constructor() {
        this.buyerServices = new buyer_services_1.buyerServices();
    }
    async buyerRegisterController(req, res) {
        try {
            const buyerData = {
                ...req.body,
                role: "buyer"
            };
            console.log("buyer controller data:", buyerData);
            const newBuyer = await this.buyerServices.buyerRegister(buyerData);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully registered");
        }
        catch (error) {
            console.log("buyer register controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
    async viewBuyerController(req, res) {
        try {
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully view");
        }
        catch (error) {
            console.log("buyer view controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
    async deleteBuyerController(req, res) {
        try {
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully view");
        }
        catch (error) {
            console.log("buyer delete controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
};
exports.buyerController = buyerController;
__decorate([
    (0, route_decoder_1.Route)("post", "/register"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], buyerController.prototype, "buyerRegisterController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/view"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], buyerController.prototype, "viewBuyerController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], buyerController.prototype, "deleteBuyerController", null);
exports.buyerController = buyerController = __decorate([
    (0, controller_decoder_1.Controller)("/buyer")
], buyerController);
