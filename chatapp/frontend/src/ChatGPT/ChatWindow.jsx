import React, { useEffect, useState } from 'react';
import Message from './MessageItem';
import axios from 'axios';

const ChatWindow = ({chat}) => {
  // Replace the array with actual message data
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // fetch the messages
    const apiURL = import.meta.env.VITE_API_URL;
    const fetchMessages = async () => {
      const result = await axios(`${apiURL}/chats/${chat.id}/messages`);
      setMessages(result.data.messages);
    }
    fetchMessages();
  }, [chat])


  const handleSend = async () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const result = await axios.post(`${apiURL}/chats/${chat.id}/messages`, {
      chat_id: chat.id, // Add chat_id to the request body
      content: input,
    });
    setMessages([...messages, result.data.message]);  
  };
  

  const handleMessageUpdate = async (id, content) => {
    // Implement updating the message here
    const apiURL = import.meta.env.VITE_API_URL;
    await axios.put(`${apiURL}/chats/${chat.id}/messages/${id}`, { content: content });
    const updatedMessages = messages.map((message) =>
      message.id === id ? { ...message, content: content } : message
    );
    console.log(id, content)
  }

  const handleMessageDelete = async (id, chatId) => {
    const apiURL = import.meta.env.VITE_API_URL;
    await axios.delete(`${apiURL}/chats/${chatId}/messages/${id}`);
    const updatedMessages = messages.filter((message) => message.id !== id);
    setMessages(updatedMessages);
    console.log(id);
  };
  

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-grow overflow-y-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} onUpdate={handleMessageUpdate} onDelete={handleMessageDelete} />
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded bg-gray-900 text-white"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-gray-600 border-slate-400 text-white font-semibold rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
