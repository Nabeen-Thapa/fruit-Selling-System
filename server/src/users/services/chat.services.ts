import { AppError } from "../../common/utils/response.utils";
import { falfulConnection } from "../../config/dbORM.config";
import { chatDto } from "../dtos/chat.dto";
import { userChat } from "../models/chat.model";
import { StatusCodes } from "http-status-codes";

export class chatServices {
    private chatRepo = falfulConnection.getRepository(userChat);
    async storeChat(chatData: chatDto) {
        try {
            const newMessage = this.chatRepo.create({ ...chatData });
            await this.chatRepo.save(newMessage);
        } catch (error) {
            console.error('Error storing chat:', (error as Error).message);
            throw new Error(`Failed to store chat message:${(error as Error).message}`);
        };
    }

    async getChats(senderId: string, receiverId: string) {
        try {
            const chats = await this.chatRepo.find({
                where: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
                order: { createdAt: "ASC" }, // optional: sort oldest to newest
            });

            if (!chats) throw new AppError("you have no messages", StatusCodes.NOT_FOUND);
            return chats;
        } catch (error) {
            console.error('Error storing chat:', (error as Error).message);
            throw new AppError("Failed to store chat message", StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}