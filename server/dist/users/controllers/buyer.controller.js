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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerController = void 0;
const controller_decoder_1 = require("../../common/decorators/controller.decoder");
const route_decoder_1 = require("../../common/decorators/route.decoder");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const buyer_dto_1 = require("../dtos/buyer.dto");
const buyer_services_1 = require("../services/buyer.services");
const dtoValidateResponse_utils_1 = require("../../common/utils/dtoValidateResponse.utils");
const auth_middleware_1 = require("../middleware/auth.middleware");
const logger_1 = __importDefault(require("../../common/utils/logger"));
const buyerUpdated_dto_1 = require("../dtos/buyerUpdated.dto");
let buyerController = class buyerController {
    buyerServices = new buyer_services_1.buyerServices();
    async buyerRegisterController(req, res) {
        try {
            const buyerData = {
                ...req.body,
                role: "buyer"
            };
            const buerDtoValidate = await (0, dtoValidateResponse_utils_1.validateDto)(buyer_dto_1.buyerDto, buyerData, res);
            if (!buerDtoValidate.valid)
                return;
            const newBuyer = await this.buyerServices.buyerRegister(buerDtoValidate.data);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully registered");
        }
        catch (error) {
            console.log("buyer register controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
    // @Route("get", "/view")
    // async viewBuyerController(req: Request, res: Response) {
    //     try {
    //         sendSuccess(res, StatusCodes.OK, "successfully view");
    //     } catch (error) {
    //         console.log("buyer view controller error:", error)
    //         sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
    //     }
    // }
    async deleteBuyerController(req, res) {
        try {
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully view");
        }
        catch (error) {
            console.log("buyer delete controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
    async viewBuyerController(req, res) {
        try {
            if (!req.user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "bad request");
            const id = req.user?.id;
            const buyerViewResult = await this.buyerServices.buyerView(id);
            console.log("buyer contoller", buyerViewResult);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully view", buyerViewResult);
        }
        catch (error) {
            console.log("buyer view controller error:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to view");
        }
    }
    async updateBuyerController(req, res) {
        try {
            if (!req.user)
                (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorized");
            const id = req.user?.id;
            const buyerData = {
                ...req.body.updatedBuyerData,
                role: "buyer"
            };
            console.log("buyer controller update:", buyerData);
            const buyerUpdateData = await (0, dtoValidateResponse_utils_1.validateDto)(buyerUpdated_dto_1.buyerUpdateDto, buyerData, res);
            if (!buyerUpdateData.valid)
                return;
            const buyerUpdate = await this.buyerServices.buyerUpdate(id, buyerData);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully updated");
        }
        catch (error) {
            console.log("buyer update controller error:", error.message);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "fail to update");
        }
    }
    async viewAllSellers(req, res) {
        // if (!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
        try {
            const allSellers = await this.buyerServices.viewAllSellers();
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully accessed", allSellers);
        }
        catch (error) {
            logger_1.default.error("error in buyer controller:", error.message);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
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
    (0, route_decoder_1.Route)("get", "/delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], buyerController.prototype, "deleteBuyerController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/viewData", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], buyerController.prototype, "viewBuyerController", null);
__decorate([
    (0, route_decoder_1.Route)("put", "/update", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], buyerController.prototype, "updateBuyerController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/viewSellers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], buyerController.prototype, "viewAllSellers", null);
exports.buyerController = buyerController = __decorate([
    (0, controller_decoder_1.Controller)("/buyer")
], buyerController);
