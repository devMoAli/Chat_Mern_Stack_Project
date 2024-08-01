import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  Box,
  IconButton,
  Avatar,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { BsSend, BsPencilSquare, BsTrash } from "react-icons/bs";
import { useMessage } from "../../Context/MessageContext";
import { useChat } from "../../Context/ChatContext";
import { useUser } from "../../Context/UserContext";
import ChatLoading from "./ChatLoading";
import ChatNotSelected from "./ChatNotSelected";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { extractTime } from "../../Utils/extractTime";
import EditGroupChatModal from "../Modals/EditGroupChatModal";
import { getLastMessageBySender } from "../../Utils/ChatLogics";
import TypingIndicator from "../../animations/TypingIndicator";
import EmojiPicker from "../../Utils/EmojiPicker";

const MessageDisplay = () => {
  const {
    selectedChatId,
    setSelectedChatId,
    selectedChatDetails,
    softDeleteDirectChat,
  } = useChat();
  const { user } = useUser();
  const {
    messages,
    fetchMessages,
    sendMessage,
    startTyping,
    stopTyping,
    typingUsers,
  } = useMessage();
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toast = useToast();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (selectedChatId) {
        setLoading(true);
        try {
          await fetchMessages(selectedChatId);
        } catch (error) {
          console.error("Error fetching messages:", error);
          toast({
            title: "Error",
            description: "Failed to load messages. Please try again later.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
          scrollToBottom();
        }
      }
    };

    loadMessages();
  }, [selectedChatId, fetchMessages, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!selectedChatId || !selectedChatDetails) {
      toast({
        title: "No Chat Selected",
        description: "Please select a chat to send a message.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await sendMessage(messageInput, selectedChatId);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessageInput(value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (value.trim()) {
      startTyping(selectedChatId);
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(selectedChatId);
      }, 2000);
    } else {
      stopTyping(selectedChatId);
    }
  };

  const isLastMessageFromSender = (message) => {
    const lastMessage = getLastMessageBySender(messages, message.senderId._id);
    return message._id === lastMessage._id;
  };

  const isSameTime = (message1, message2) => {
    const time1 = new Date(message1.createdAt).getTime();
    const time2 = new Date(message2.createdAt).getTime();
    return Math.abs(time1 - time2) < 3600000; // 1 hour
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!selectedChatId || !selectedChatDetails) {
    return <ChatNotSelected />;
  }

  const senderDetails = (message) =>
    selectedChatDetails.users.find((u) => u._id === message.senderId._id);

  const typingUserIds = Object.keys(typingUsers).filter(
    (userId) => typingUsers[userId]
  );

  const handleSelectEmoji = (emoji) => {
    setMessageInput((prev) => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {selectedChatDetails && (
        <Box mb={4} flexShrink={0}>
          <Heading
            textAlign="center"
            color="#226080"
            fontFamily="nunito"
            size="sm"
            mb={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bg="gray.200"
            rounded="md"
            p={2}
          >
            <Box display="flex" alignItems="center" flex={1}>
              <IconButton
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChatId(null)}
                aria-label="Go back"
                variant="ghost"
                size="sm"
                mr={2}
              />
              <Box
                flex={1}
                textAlign="center"
                display="flex"
                alignItems="center"
              >
                {!selectedChatDetails.isGroupChat && (
                  <Avatar
                    size="sm"
                    name={
                      selectedChatDetails.users.find((u) => u._id !== user._id)
                        ?.username || "Unknown"
                    }
                    src={
                      selectedChatDetails.users.find((u) => u._id !== user._id)
                        ?.profilePic?.url || ""
                    }
                    mr={3}
                  />
                )}
                <Text>
                  {selectedChatDetails.isGroupChat
                    ? selectedChatDetails.chatTitle
                    : selectedChatDetails.users.find((u) => u._id !== user._id)
                        ?.username || "Unknown"}
                </Text>
              </Box>
              {!selectedChatDetails.isGroupChat && (
                <IconButton
                  icon={<BsTrash />}
                  onClick={() => softDeleteDirectChat(selectedChatId)}
                  aria-label="Delete Chat"
                  variant="ghost"
                  size="sm"
                />
              )}
              {selectedChatDetails.isGroupChat && (
                <IconButton
                  icon={<BsPencilSquare />}
                  onClick={() => setIsEditModalOpen(true)}
                  aria-label="Edit Group"
                  variant="ghost"
                  size="sm"
                  ml={2}
                />
              )}
            </Box>
          </Heading>
        </Box>
      )}
      <Box flex={1} p={4} className="message-container">
        {loading ? (
          <ChatLoading />
        ) : (
          <>
            {messages.map((message, index) => {
              const isFromCurrentUser = message.senderId._id === user._id;
              const sender = senderDetails(message);
              const isFirst =
                index === 0 || !isSameTime(message, messages[index - 1]);
              const isLast = isLastMessageFromSender(message);

              return (
                <Box key={message._id} mb={isFirst ? 2 : 1}>
                  {isFirst && (
                    <Text
                      textAlign="center"
                      color="gray.500"
                      fontSize="xs"
                      mb={2}
                    >
                      {extractTime(message.createdAt)}
                    </Text>
                  )}
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection={isFromCurrentUser ? "row-reverse" : "row"}
                    mb={isFirst ? 1 : 0}
                  >
                    {isFromCurrentUser && isLast && (
                      <Avatar
                        size="sm"
                        name={user.username || "Unknown"}
                        src={user.profilePic?.url || ""}
                        mr={!isFromCurrentUser ? 2 : 1}
                      />
                    )}
                    {!isFromCurrentUser && isLast && (
                      <Avatar
                        size="sm"
                        name={sender?.username || "Unknown"}
                        src={sender?.profilePic?.url || ""}
                        ml={isFromCurrentUser ? 2 : 1}
                      />
                    )}
                    <Box
                      bg={isFromCurrentUser ? "transparent" : "#6395c7"}
                      p={1.5}
                      color={isFromCurrentUser ? "#4a6a8a" : "#fff"}
                      rounded="md"
                      maxWidth="75%"
                      ml={!isFromCurrentUser && isLast ? 2 : 1}
                    >
                      <Text>{message.content}</Text>
                    </Box>
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef}></div>
          </>
        )}
      </Box>

      <Box
        p={4}
        borderTop="1px solid"
        borderColor="gray.200"
        position="relative"
      >
        {typingUserIds.length > 0 && <TypingIndicator visible bg="none" />}
        {isEmojiPickerOpen && <EmojiPicker onSelectEmoji={handleSelectEmoji} />}
        <InputGroup>
          <Input
            value={messageInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            size="md"
            bg="white"
            p={2}
          />
          <InputRightElement>
            <IconButton
              aria-label="Emoji Picker"
              onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
              variant="ghost"
              fontSize="xl"
              color="orange.400"
              _hover={{ color: "orange.600" }}
              icon={
                <span role="img" aria-label="emoji">
                  🙂
                </span>
              }
            />
            <IconButton
              colorScheme="blue"
              bg="gray.200"
              borderLeft="1px skyblue solid"
              icon={<BsSend />}
              onClick={handleSendMessage}
              aria-label="Send Message"
              variant="ghost"
            />
          </InputRightElement>
        </InputGroup>
      </Box>
      {isEditModalOpen && selectedChatDetails && (
        <EditGroupChatModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          groupChat={selectedChatDetails}
        />
      )}
    </Box>
  );
};

export default MessageDisplay;
