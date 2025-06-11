import React from 'react';
import { ChatService } from '../../services/userChats.service';
import { userChat } from '../../types/userChat.types';

const useChat = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const chatService = React.useMemo(() => new ChatService(), []);

    const storeNewChat = async (chatData: Omit<userChat, 'id' | 'createdAt' | 'senderId'>) => {
        setIsLoading(true);
        setError(null);
        try {
            await chatService.storeChat(chatData);
            return true; // Indicate success
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return false; // Indicate failure
        } finally {
            setIsLoading(false);
        }
    };

    const getOldChat = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const chats = await chatService.getUserChats(id);
            return chats;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return null; // Indicate failure
        } finally {
            setIsLoading(false);
        }
    };

    return {
        storeNewChat,
        getOldChat,
        isLoading,
        error,
        clearError: () => setError(null),
    };
};

export default useChat;