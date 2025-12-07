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
exports.ChatControllers = void 0;
const controller_decoder_1 = require("../../common/decorators/controller.decoder");
const route_decoder_1 = require("../../common/decorators/route.decoder");
const dtoValidateResponse_utils_1 = require("../../common/utils/dtoValidateResponse.utils");
const chat_dto_1 = require("../dtos/chat.dto");
const chat_services_1 = require("../services/chat.services");
const logger_1 = __importDefault(require("../../common/utils/logger"));
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const auth_middleware_1 = require("../middleware/auth.middleware");
let ChatControllers = class ChatControllers {
    chatService = new chat_services_1.chatServices();
    async storeChatController(req, res) {
        try {
            if (!req.user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorized");
            const senderId = req.user.id;
            const chatData = {
                ...req.body, senderId
            };
            const chatValidData = await (0, dtoValidateResponse_utils_1.validateDto)(chat_dto_1.chatDto, chatData, res);
            if (!chatValidData.valid)
                return;
            const chatResult = await this.chatService.storeChat(chatValidData.data);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.CREATED, "chat successfully stored", chatResult);
        }
        catch (error) {
            logger_1.default.error("error in chat controller", error.message);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "internal servier error");
        }
    }
    async getChatControllers(req, res) {
        try {
            if (!req.user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorized");
            const { receiverId } = req.params;
            const { id } = req.user;
            const getChatResult = await this.chatService.getChats(id, receiverId);
            return (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "successfully accessed", getChatResult);
        }
        catch (error) {
            logger_1.default.error("error in chat controller", error.message);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "internal servier error");
        }
    }
};
exports.ChatControllers = ChatControllers;
__decorate([
    (0, route_decoder_1.Route)("post", "/store", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatControllers.prototype, "storeChatController", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/view/:receiverId", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatControllers.prototype, "getChatControllers", null);
exports.ChatControllers = ChatControllers = __decorate([
    (0, controller_decoder_1.Controller)("/chat")
], ChatControllers);
