import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  Button,
  Box,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Avatar,
  Container,
} from "@chakra-ui/react";
import group from "../../assets/group.png";
import not from "../../assets/not.png";
import "./styles.css";
import ChatLoading from "./ChatLoading";
import { useUser } from "../../Context/UserContext";
import { useChat } from "../../Context/ChatContext";
import { getSender, isSameSenderMargin } from "../../Utils/ChatLogics";
import GroupChatModal from "../Modals/GroupChatModal";

const ChatList = () => {
  const { chats, fetchChats, selectedChatId, setSelectedChatId } = useChat();
  const { user } = useUser();

  useEffect(() => {
    fetchChats();
  }, []);

  const [selectedTab, setSelectedTab] = useState("messages");

  const handleTabChange = (index) => {
    setSelectedTab(index === 0 ? "messages" : "groups");
    setSelectedChatId(null); // Reset selected chat ID on tab change
  };

  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId);
  };

  const renderChats = () => {
    const filteredChats =
      selectedTab === "messages"
        ? chats.filter((chat) => !chat.isGroupChat)
        : chats.filter((chat) => chat.isGroupChat);

    return filteredChats.map((chat, index) => {
      const margin =
        user && chat
          ? isSameSenderMargin(filteredChats, chat, index, user._id)
          : "auto";
      const chatTitle = chat.isGroupChat
        ? chat.chatTitle
        : getSender(user, chat.users);
      const senderAvatar = chat.isGroupChat
        ? null
        : chat.users.find((u) => u._id !== user._id)?.profilePic?.url;

      return (
        <Box
          key={chat._id}
          onClick={() => handleChatClick(chat._id)}
          p={3}
          cursor="pointer"
          bg={selectedChatId === chat._id ? "gray.200" : "transparent"}
          _hover={{ bg: "gray.100" }}
          ml={margin}
          display="flex"
          alignItems="center"
        >
          {!chat.isGroupChat && (
            <Avatar size="sm" name={chatTitle} src={senderAvatar} mr={2} />
          )}
          <Box>
            <Text>{chatTitle}</Text>
          </Box>
        </Box>
      );
    });
  };

  return (
    <Container h="100%">
      <Box
        p={2}
        borderRadius="lg"
        h="75%"
        display={{ base: selectedChatId ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
      >
        <Tabs isFitted variant="soft-rounded" onChange={handleTabChange}>
          <TabList>
            <Tab
              fontSize="14px"
              color="gray"
              _selected={{ color: "#1f82b5", bg: "#FFC7A7" }}
            >
              Messages <img src={not} alt="Group Icon" className="groupIcon" />
            </Tab>
            <Tab
              fontSize="14px"
              color="gray"
              _selected={{ color: "#1f82b5", bg: "#FFC7A7" }}
            >
              Groups <img src={group} alt="Group Icon" className="groupIcon" />
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel display="flex" justifyContent="center">
              <Stack spacing={1} mt={1} p={0} w="100%" alignItems="flex-start">
                <Box
                  w="100%"
                  fontSize="14px"
                  color="#226080"
                  borderRadius="lg"
                  borderWidth="1px"
                  fontWeight="bold"
                >
                  {chats ? renderChats() : <ChatLoading />}
                </Box>
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack
                w="100%"
                spacing={1}
                mt={1}
                p={0}
                display="flex"
                justifyContent="flex-start"
              >
                <Box
                  w="100%"
                  fontSize="14px"
                  color="#226080"
                  borderRadius="lg"
                  borderWidth="1px"
                  fontWeight="bold"
                >
                  {chats ? renderChats() : <ChatLoading />}
                </Box>
                <GroupChatModal>
                  <Box display="flex" justifyContent="center">
                    <Button
                      bg="#6395c7"
                      color="white"
                      cursor="pointer"
                      mt="20px"
                      fontSize={{ base: "12px", md: "10px", lg: "13px" }}
                    >
                      + Create Group
                    </Button>
                  </Box>
                </GroupChatModal>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default ChatList;
