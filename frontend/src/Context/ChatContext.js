import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useUser } from "./UserContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useUser();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChatDetails, setSelectedChatDetails] = useState(null);

  const fetchChats = async () => {
    try {
      const response = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchChatDetails = useCallback(
    async (chatId) => {
      try {
        const response = await axios.get(`/api/chat/${chatId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setSelectedChatDetails(response.data);
      } catch (error) {
        console.error("Error fetching chat details:", error);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user && user.token) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChatId) {
      fetchChatDetails(selectedChatId);
    }
  }, [selectedChatId, fetchChatDetails]);

  const createDirectChat = async (userId) => {
    // Check if the chat already exists
    const existingChat = chats.find(
      (chat) =>
        !chat.isGroupChat && chat.users.some((user) => user._id === userId)
    );

    if (existingChat) {
      // If chat already exists, set it as the selected chat
      setSelectedChatId(existingChat._id);
      return existingChat;
    }

    // If chat does not exist, create a new one
    try {
      const response = await axios.post(
        "/api/chat",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const newChat = response.data;
      setChats([...chats, newChat]);
      setSelectedChatId(newChat._id);
      return newChat;
    } catch (error) {
      console.error("Error creating direct chat:", error);
    }
  };

  const createGroupChat = async (chatTitle, users) => {
    try {
      const response = await axios.post(
        "/api/chat/group",
        { chatTitle, users: JSON.stringify(users) },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const newChat = response.data;
      setChats([...chats, newChat]);
      setSelectedChatId(newChat._id);
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  };

  const renameGroup = async (chatId, chatTitle) => {
    try {
      const response = await axios.put(
        "/api/chat/group/rename",
        { chatId, chatTitle },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const updatedChat = response.data;
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat
        )
      );
    } catch (error) {
      console.error("Error renaming group chat:", error);
    }
  };

  const addToGroup = async (chatId, userId) => {
    try {
      const response = await axios.put(
        "/api/chat/group/add",
        { chatId, userId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const updatedChat = response.data;
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat
        )
      );
    } catch (error) {
      console.error("Error adding user to group chat:", error);
    }
  };

  const removeFromGroup = async (chatId, userId) => {
    try {
      const response = await axios.put(
        "/api/chat/group/remove",
        { chatId, userId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const updatedChat = response.data;
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat
        )
      );
    } catch (error) {
      console.error("Error removing user from group chat:", error);
    }
  };

  const deleteGroupChat = async (chatId) => {
    try {
      await axios.delete(`/api/chat/group/${chatId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
      setSelectedChatId(null);
    } catch (error) {
      console.error("Error deleting group chat:", error);
    }
  };

  const exitGroupChat = async (chatId) => {
    try {
      const response = await axios.put(
        "/api/chat/group/exit",
        { chatId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const updatedChat = response.data;
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat
        )
      );
      fetchChats();
    } catch (error) {
      console.error("Error exiting group chat:", error);
    }
  };

  const softDeleteDirectChat = async (chatId) => {
    try {
      await axios.put(
        "/api/chat/direct/delete",
        { chatId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Remove the deleted chat from the UI
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));

      // Clear selected chat if it was the deleted one
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
    } catch (error) {
      console.error("Error soft deleting direct chat:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        fetchChats,
        selectedChatId,
        setSelectedChatId,
        selectedChatDetails,
        fetchChatDetails,
        createDirectChat,
        createGroupChat,
        renameGroup,
        addToGroup,
        removeFromGroup,
        deleteGroupChat,
        exitGroupChat,
        softDeleteDirectChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
