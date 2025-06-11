import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useChat from '../../hooks/user/useChat.hooks';
import { userChat } from '../../types/userChat.types';
import { Message } from '../../types/user.types';

const UsersChat: React.FC = () => {
  const { id: receiverId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);

  const { storeNewChat, isLoading, error } = useChat();

  const [newMessage, setNewMessage] = useState<Omit<userChat, 'id' | 'createdAt' | 'senderId'>>({
  message: '',
  receiverId: receiverId || '',
});


 const handleSend = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newMessage.message.trim()) return;

  const success = await storeNewChat(newMessage);
  if (success) {
    setNewMessage((prev) => ({ ...prev, message: '' }));
  }
};

  return (
    <div className="mt-10 pt-5">
      <div className="max-w-2xl mx-auto mt-12 pt-6 bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Chat with Seller</h2>

        {/* Chat message list */}
        <div className="h-96 overflow-y-auto border rounded p-2 mb-4 bg-gray-50">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-2 flex ${msg.senderId === 'you' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded-lg text-sm max-w-xs ${
                    msg.senderId === 'you' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))
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
