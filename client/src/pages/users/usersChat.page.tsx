import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useChat from '../../hooks/user/useChat.hooks';
import { userChat } from '../../types/userChat.types';
import { Message } from '../../types/user.types';
import { fetchCurrentUser } from '../../services/auth.fetchCurrentUser.utils';
import { FiSend, FiMessageSquare, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UsersChat: React.FC = () => {
  const { id: receiverId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const { storeNewChat, getOldChat, isLoading, error } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
        setCurrentUserName(typeof user.name === 'string' ? user.name : '');
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
        createdAt: chat.createdAt, // ✅ match the actual key from the backend
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
      fetchChats(receiverId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br mt-6 from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto pt-8 pb-12  mt-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-xl rounded-2xl overflow-hidden"
        >
          {/* Chat header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-full text-white hover:bg-blue-700 transition-colors duration-200"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-white">Chat Conversation</h2>
                <p className="text-blue-100 text-lg">{currentUserName}</p>
              </div>
            </div>
          </div>

          {/* Chat message list */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === currentUserId
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                    >
                      <div className="text-lg">{msg.message}</div>
                      <div
                        className={`mt-0 text-right ${msg.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'}`}
                        style={{ fontSize: '11px' }}>
                        {new Date(msg.createdAt ?? "").toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <FiMessageSquare size={48} className="mb-4" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {/* Send message form */}
          <form
            onSubmit={handleSend}
            className="border-t border-gray-200 p-4 bg-white"
          >
            <div className="flex items-center space-x-2">
              <input
                value={newMessage.message}
                onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                className="flex-grow px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !newMessage.message.trim()}
                className={`p-3 rounded-full ${isLoading || !newMessage.message.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition-colors duration-200`}
              >
                <FiSend size={20} />
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UsersChat;