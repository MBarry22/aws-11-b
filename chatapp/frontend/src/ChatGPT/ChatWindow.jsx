import React, { useState, useEffect } from "react";
import { Auth, API, Storage } from "aws-amplify";
import Message from "./MessageItem";





function ChatWindow({ chat }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);

  async function getMessages() {
    const response = await API.get("api", `/chats/${chat.id}/messages`);
    const messages = response.messages;
    for (const message of messages) {
      if (message.content_type === "image") {
        // get a signed url for that message content
        console.log("message",messages);
         message.content = await Storage.get(message.content, {
          identityId: message.user_id,
        })
      }
    }
    setMessages(messages);

  }
  
    useEffect(() => {
  
      getMessages();
      console.log("messages",messages);
      
      
    }, [chat]);
  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSend = async () => {
    try {
      if (file) {
        // Upload the file to S3
        const uniqueFilename = `${Date.now()}-${file.name}`;
        const s3Options = {
          contentType: file.type,
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded / progress.total}`);
          },
        };
        const fileUploadResult = await Storage.put(uniqueFilename, file, s3Options);
        console.log("File uploaded successfully!", fileUploadResult);
  
        // Send the chat message with the file
        const messageSendResult = await API.post("api", `/chats/${chat.id}/messages`, {
          body: {
            content: uniqueFilename,
            content_type: "image",
          },
        });
        const newMessage = messageSendResult.message;
        setMessages([...messages, newMessage]);
        setInput("");
        setFile(null);
      } else {
        const messageSendResult = await API.post("api", `/chats/${chat.id}/messages`, {
          body: {
            content: input,
            content_type: "text",
          },
        });
        const newMessage = messageSendResult.message;
        setMessages([...messages, newMessage]);
        setInput("");
      }
    } catch (error) {
      alert("Error");
      console.log(error);
    }
  };
  

  const handleMessageUpdate = async (id, content) => {
    // Implement updating the message here
    const result = await API.put(
      "api",
      `/chats/${chat.id}/messages/${id}`,
      {
        body: { content: content },
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
      }
    );
  };

  const handleMessageDelete = async (id, chatId) => {
    const result = await API.del("api", `/chats/${chatId}/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    });
    const updatedMessages = messages.filter((message) => message.id !== id);
    setMessages(updatedMessages);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-grow overflow-y-auto">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onUpdate={handleMessageUpdate}
            onDelete={handleMessageDelete}
          />
        ))}
      </div>
      <div className="flex items-center p-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="mr-4"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 mr-4 rounded"
        />
        <button
          onClick={handleSend}
          className="p-2 rounded bg-blue-500 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}


export default ChatWindow;

