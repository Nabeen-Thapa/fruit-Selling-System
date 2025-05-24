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
exports.sellerController = void 0;
const controller_decoder_1 = require("../../common/decorators/controller.decoder");
const route_decoder_1 = require("../../common/decorators/route.decoder");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const serller_services_1 = require("../services/serller.services");
let sellerController = class sellerController {
    constructor() {
        this.newSeller = new serller_services_1.sellerServices();
    }
    async sellerRegisterController(req, res) {
        try {
            const sellerData = {
                ...req.body,
                role: "seller"
            };
            console.log(sellerData);
            await this.newSeller.sellerRegister(sellerData);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully registered");
        }
        catch (error) {
            console.log("seller register controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
    async viewsellerController(req, res) {
        try {
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully view");
        }
        catch (error) {
            console.log("seller view controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
    async deletesellerController(req, res) {
        try {
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully view");
        }
        catch (error) {
            console.log("seller delete controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
};
exports.sellerController = sellerController;
__decorate([
    (0, route_decoder_1.Route)("post", "/register"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], sellerController.prototype, "sellerRegisterController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/view"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], sellerController.prototype, "viewsellerController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], sellerController.prototype, "deletesellerController", null);
exports.sellerController = sellerController = __decorate([
    (0, controller_decoder_1.Controller)("/seller")
], sellerController);
