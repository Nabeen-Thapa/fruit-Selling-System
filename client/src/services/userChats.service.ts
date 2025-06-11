import { userChat } from "../types/userChat.types";

export class ChatService {
    protected BASE_URL = "http://localhost:5000/chat"
    async storeChat(userChats: Omit<userChat, 'id' | 'createdAt' | "senderId">) {
        const storeResponse = await fetch(`http://localhost:5000/chat/store`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userChats),
        });
        console.log("chat fornt service:", userChats)
        if (!storeResponse.ok) throw new Error("faile to store message");
    }

    async getUserChats(receiverId: string) {
        try {
            const chats = await fetch(`http://localhost:5000/chat/view/${receiverId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!chats.ok) throw new Error("unable to access chat");
            const userChats = chats.json();
            return userChats;
        } catch (error) {
            console.log("error in fronted service get chats", error.message);
            throw new Error("eror in forntend service to get user chat");
        }
    }
}