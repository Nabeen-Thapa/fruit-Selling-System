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
const seller_dot_1 = require("../dtos/seller.dot");
const dtoValidateResponse_utils_1 = require("../../common/utils/dtoValidateResponse.utils");
const auth_middleware_1 = require("../middleware/auth.middleware");
const sellerUpdate_dto_1 = require("../dtos/sellerUpdate.dto");
let sellerController = class sellerController {
    sellerServices = new serller_services_1.sellerServices();
    async sellerRegisterController(req, res) {
        console.log("seller controller", req.body);
        try {
            const sellerData = {
                ...req.body,
                role: "seller"
            };
            const sellerDtoValidate = await (0, dtoValidateResponse_utils_1.validateDto)(seller_dot_1.serllerDto, sellerData, res);
            if (!sellerDtoValidate.valid)
                return;
            await this.sellerServices.sellerRegister(sellerDtoValidate.data);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully registered");
        }
        catch (error) {
            console.log("seller register service error:", error.message);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
    async viewsellerController(req, res) {
        try {
            if (!req.user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "bad request");
            const id = req.user?.id;
            const sellerViewResult = await this.sellerServices.sellerView(id);
            // console.log("seller contoller",sellerViewResult);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully view", sellerViewResult);
        }
        catch (error) {
            console.log("seller view controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to view");
        }
    }
    async updateSellerController(req, res) {
        try {
            if (!req.user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "bad request");
            const id = req.user?.id;
            const sellerUpdatedData = { ...req.body.updatedUser, role: "seller" };
            const updatedDataDto = await (0, dtoValidateResponse_utils_1.validateDto)(sellerUpdate_dto_1.serllerUpdateDto, sellerUpdatedData, res);
            if (!updatedDataDto.valid)
                return;
            await this.sellerServices.sellerUpdate(id, updatedDataDto.data);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully updated");
        }
        catch (error) {
            console.log("seller update controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to update");
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
    async viewBuyersController(req, res) {
        try {
            if (!req.user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authrized to view buyers");
            const viewBuyersResult = await this.sellerServices.viewBuyers();
            return (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "seller list", viewBuyersResult);
        }
        catch (error) {
            console.log("error in seller controller view sellers:", error.message);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "internal server error");
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
    (0, route_decoder_1.Route)("get", "/view", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], sellerController.prototype, "viewsellerController", null);
__decorate([
    (0, route_decoder_1.Route)("put", "/update", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], sellerController.prototype, "updateSellerController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], sellerController.prototype, "deletesellerController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/viewbuyers", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], sellerController.prototype, "viewBuyersController", null);
exports.sellerController = sellerController = __decorate([
    (0, controller_decoder_1.Controller)("/seller")
], sellerController);
