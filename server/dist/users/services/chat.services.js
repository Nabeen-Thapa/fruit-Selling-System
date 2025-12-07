"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatServices = void 0;
const response_utils_1 = require("../../common/utils/response.utils");
const dbORM_config_1 = require("../../config/dbORM.config");
const chat_model_1 = require("../models/chat.model");
const http_status_codes_1 = require("http-status-codes");
class chatServices {
    chatRepo = dbORM_config_1.falfulConnection.getRepository(chat_model_1.userChat);
    async storeChat(chatData) {
        try {
            const newMessage = this.chatRepo.create({ ...chatData });
            await this.chatRepo.save(newMessage);
        }
        catch (error) {
            console.error('Error storing chat:', error.message);
            throw new Error(`Failed to store chat message:${error.message}`);
        }
        ;
    }
    async getChats(senderId, receiverId) {
        try {
            const chats = await this.chatRepo.find({
                where: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
                order: { createdAt: "ASC" }, // optional: sort oldest to newest
            });
            if (!chats)
                throw new response_utils_1.AppError("you have no messages", http_status_codes_1.StatusCodes.NOT_FOUND);
            return chats;
        }
        catch (error) {
            console.error('Error storing chat:', error.message);
            throw new response_utils_1.AppError("Failed to store chat message", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.chatServices = chatServices;
