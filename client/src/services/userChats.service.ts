import { userChat } from "../types/userChat.types";

export class  ChatService{
    protected BASE_URL = "http://localhost:5000/chat"
    async storeChat(userChats: Omit<userChat, 'id' | 'createdAt' | "senderId">){
        const storeResponse = await fetch(`http://localhost:5000/chat/store`,{
            method: "POST",
            credentials: "include",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userChats),
        });
        console.log("chat fornt service:", userChats)
        if(!storeResponse.ok) throw new Error("faile to store message");
    }
}