import { falfulConnection } from "../../config/dbORM.config";
import { chatDto } from "../dtos/chat.dto";
import { userChat } from "../models/chat.model";

export class chatServices {
    private chatRepo = falfulConnection.getRepository(userChat);
    async storeChat(chatData: chatDto) {
       console.log("chat service:",chatData)
        try {
            const newMessage = this.chatRepo.create({ ...chatData});
            await this.chatRepo.save(newMessage);
        } catch (error) {
             console.error('Error storing chat:', (error as Error).message);
            throw new Error(`Failed to store chat message:${ (error as Error).message}`);
        };
    }
}