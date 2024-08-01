import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useUser } from "./UserContext";
import { useNotification } from "./NotificationContext";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { user } = useUser();
  const { addNotification } = useNotification();
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [socket, setSocket] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    if (user) {
      const socketInstance = io("http://localhost:8000", {
        query: { userId: user._id },
      });

      setSocket(socketInstance);

      socketInstance.on("connected", () => console.log("Connected to socket.io"));

      socketInstance.on("message received", (newMessage) => {
        if (newMessage.chatId._id === currentChatId) {
          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some((message) => message._id === newMessage._id);
            if (!isDuplicate) {
              return [...prevMessages, newMessage];
            }
            return prevMessages;
          });
        } else {
          addNotification({
            type: "message",
            content: `You have a new message from ${newMessage.senderId?.username || "Unknown"}`,
            timestamp: new Date(),
            senderUsername: newMessage.senderId?.username || "Unknown",
            chatId: newMessage.chatId._id,
          });
        }
      });

      socketInstance.on("notification received", (notification) => {
        addNotification(notification);
      });

      socketInstance.on("typing", (userId) => {
        setTypingUsers((prev) => ({ ...prev, [userId]: true }));
      });

      socketInstance.on("stop typing", (userId) => {
        setTypingUsers((prev) => {
          const { [userId]: _, ...rest } = prev;
          return rest;
        });
      });

      return () => {
        socketInstance.disconnect();
        socketInstance.off("connected");
        socketInstance.off("message received");
        socketInstance.off("notification received");
        socketInstance.off("typing");
        socketInstance.off("stop typing");
      };
    }
  }, [user, addNotification, currentChatId]);

  useEffect(() => {
    if (socket && currentChatId) {
      socket.emit("join chat", currentChatId);
      return () => {
        socket.emit("leave chat", currentChatId);
      };
    }
  }, [socket, currentChatId]);

  const fetchMessages = useCallback(
    async (chatId) => {
      if (!chatId || typeof chatId !== "string") {
        console.error("Invalid chatId");
        return;
      }

      try {
        const response = await axios.get(`/api/message/${chatId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setMessages(response.data);
        setCurrentChatId(chatId);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [user]
  );

  const sendMessage = async (content, chatId) => {
    if (!content || !chatId) {
      console.error("Content or chatId is missing.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/message",
        { content, chatId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const newMessage = response.data;

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (socket) {
        socket.emit("new message", newMessage);
        console.log(`Emitting message to socket IDs: ${newMessage.chatId._id}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const startTyping = (chatId) => {
    if (chatId && socket) socket.emit("typing", chatId);
  };

  const stopTyping = (chatId) => {
    if (chatId && socket) socket.emit("stop typing", chatId);
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        fetchMessages,
        sendMessage,
        startTyping,
        stopTyping,
        typingUsers,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
