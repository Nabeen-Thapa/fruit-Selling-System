import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useChat from '../../hooks/user/useChat.hooks';
import { userChat } from '../../types/userChat.types';
import { Message } from '../../types/user.types';
import { fetchCurrentUser } from '../../services/auth.fetchCurrentUser.utils';

const UsersChat: React.FC = () => {
  const { id: receiverId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { storeNewChat, getOldChat, isLoading, error } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState<Omit<userChat, 'id' | 'createdAt' | 'senderId'>>({
    message: '',
    receiverId: receiverId || '',
  });

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchCurrentUser();
      if (user?.userId) {
        setCurrentUserId(user.userId);
      }
    };
    loadUser();
  }, []);

  // Fetch chat messages
  useEffect(() => {
    if (receiverId) fetchChats(receiverId);
  }, [receiverId]);

  const fetchChats = async (id: string) => {
    const chats = await getOldChat(id);
    if (chats) {
      const mappedMessages = chats.data.map((chat: Message) => ({
        _id: chat._id,
        message: chat.message,
        senderId: chat.senderId,
        receiverId: chat.receiverId,
        timestamp: chat.timestamp,
      }));
      setMessages(mappedMessages);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.message.trim()) return;

    const success = await storeNewChat(newMessage);
    if (success && receiverId) {
      setNewMessage((prev) => ({ ...prev, message: '' }));
      fetchChats(receiverId); // ✅ Pass the ID here
    }
  };

  return (
    <div className="mt-10 pt-5">
      <div className="max-w-2xl mx-auto mt-12 pt-6 bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Chat with Seller</h2>

        {/* Chat message list */}
        <div className="h-96 overflow-y-auto border rounded p-2 mb-4 bg-gray-50">
          {messages.length > 0 ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-2 flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-2 rounded-lg text-sm max-w-xs ${msg.senderId === currentUserId
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-gray-200'
                      }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={bottomRef}></div>
            </>
          ) : (
            <p className="text-center text-gray-400">No messages yet.</p>
          )}
        </div>

        {/* Send message form */}
        <form className="flex gap-2" onSubmit={handleSend}>
          <input
            value={newMessage.message}
            onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
            className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default UsersChat;
