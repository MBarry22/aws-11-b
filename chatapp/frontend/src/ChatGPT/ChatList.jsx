import React, { useState, useEffect } from 'react';
import ChatItem from './ChatItem';
import NewChatButton from './NewChatButton';
import axios from 'axios';
import { API, Auth } from 'aws-amplify';
 
const ChatList = ({ onSelect, selectedChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChat = async () => {
        const response = await API.get('api', '/chats');
        console.log('response', response.chats)
        setChats(response.chats)
    }
    getChat()
}, [])


  const updateChat = async (id, newName) => {
    try {
      console.log('Updating chat with ID:', id);
      console.log('New name:', newName);

      // Update the chat in the database
      await API.put('api', `/chats/${id}`, {
        body: { name: newName },
      });

      console.log('Chat updated successfully in database');
  
      // Update the local state with the updated chat name
      setChats(chats.map(chat => chat.id === id ? {...chat, name: newName } : chat));
      console.log('Local state updated with new chat name');
    } catch (error) {
      console.log(error);
    }
    
  };
  
  
  const deleteChat = async (id) => {
    try {
      // delete the chat
      await API.del('api', `/chats/${id}`, {
      });
      // remove the deleted chat from the local state
      const updatedChats = chats.filter((chat) => chat.id !== id);
      setChats(updatedChats);
    } catch (error) {
      console.log(error);
    }
  };
  
  const createChat = async (name) => {
    try {
      // create the chat
      const result = await API.post('api', '/chats', {
        body: { name: name },
      });
      console.log(result)
      const newChat = result.chats;
      console.log(newChat)
      // add the new chat to the local state
      setChats([...chats, newChat]);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(chats);

  return (
    <div className="overflow-y-auto text-white">
      {chats.length > 0 && chats.map((chat) => (
        <ChatItem selected={chat.id == selectedChat?.id} key={chat.id} chat={chat} onSelect={onSelect} onUpdate={updateChat} onDelete={deleteChat} />
      ))}
      <NewChatButton onCreate={createChat} />
    </div>
  );
  
};

export default ChatList;