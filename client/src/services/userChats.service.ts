import { userChat } from "../types/userChat.types";

const APIURL = import.meta.env.VITE_API_URL;
export class ChatService {
    async storeChat(userChats: Omit<userChat, 'id' | 'createdAt' | "senderId">) {
        const storeResponse = await fetch(`${APIURL}/chat/store`, {
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
            const chats = await fetch(`${APIURL}/chat/view/${receiverId}`, {
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
            console.log("error in fronted service get chats", (error as Error).message);
            throw new Error("eror in forntend service to get user chat");
        }
    }
}