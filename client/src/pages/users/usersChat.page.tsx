
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Message } from '../../types/user.types';


const UsersChat: React.FC = () => {
    const sellerId = useParams<{ id: string }>();
    const buyerId = localStorage.getItem('userId'); // or from auth context
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                //fetch previous message
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };
        fetchMessages();
    }, [sellerId]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        try {
            const { data } = await axios.post('/api/messages/send', {
                senderId: buyerId,
                receiverId: sellerId,
                message: newMessage,
            });

            setMessages((prev) => [...prev, data]);
            setNewMessage('');
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <div className='mt-10 pt-5'>
            <div className="max-w-2xl mx-auto mt-12 pt-6 bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">Chat with Seller</h2>

                {/* <div className="h-96 overflow-y-auto border rounded p-2 mb-4 bg-gray-50">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`mb-2 flex ${msg.senderId === buyerId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`p-2 rounded-lg text-sm max-w-xs ${msg.senderId === buyerId ? 'bg-blue-100 text-blue-900' : 'bg-gray-200'
                                    }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No messages yet.</p>
                )}
            </div> */}

                <div className="flex gap-2">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={handleSend}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UsersChat;
