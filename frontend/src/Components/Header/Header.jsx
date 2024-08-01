// Header.js
import React from "react";
import {
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import bell from "../../assets/bell.png";
import { useUser } from "../../Context/UserContext";
import { useChat } from "../../Context/ChatContext";
import { useNotification } from "../../Context/NotificationContext";
import { useMessage } from "../../Context/MessageContext";
import SearchDrawer from "./SearchDrawer";
import ProfileModal from "../Modals/ProfileModal";

const Header = () => {
  const { user, logout } = useUser();
  const { setSelectedChatId, fetchChats } = useChat();
  const { notifications, markAllAsRead, markNotificationAsRead } =
    useNotification();
  const { fetchMessages } = useMessage();

  const handleChatProjectClick = () => {
    setSelectedChatId(null);
  };

  const handleLogout = () => {
    logout();
  };

  const handleNotificationClick = async (notification) => {
    const chatId =
      typeof notification.chatId === "object"
        ? notification.chatId._id
        : notification.chatId;

    if (!chatId || typeof chatId !== "string") {
      console.error("Invalid Chat ID:", chatId);
      return;
    }

    try {
      markNotificationAsRead(notification._id);
      await fetchChats(chatId);
      await fetchMessages(chatId);
      setSelectedChatId(chatId);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      p="5px 10px"
      rounded="md"
      mt="10px"
      mb="20px"
      borderWidth="2px"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={1}
        w="30%"
        m="0"
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="1px 1px 6px rgba(0, 0, 0, 0.7)"
        position="relative"
        overflow="hidden"
      >
        <Text
          onClick={handleChatProjectClick}
          fontSize="3xl"
          fontFamily="nunito"
          color="white"
          cursor="pointer"
          fontWeight="extrabold"
          textAlign="center"
          lineHeight="1.2"
          letterSpacing="wider"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.7)"
        >
          Chat Project
        </Text>
      </Box>
      <Box w="40%">
        <SearchDrawer />
      </Box>
      <Box display="flex" p={0} justifyContent="center" alignItems="center">
        <Menu>
          <MenuButton>
            <Box position="relative">
              <img
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "25px",
                  height: "25px",
                }}
                src={bell}
                alt="Notification Icon"
                className="notif"
              />
              {notifications.length > 0 && (
                <Box
                  position="absolute"
                  top="-10px"
                  right="-10px"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  width="20px"
                  height="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                >
                  <Text>{notifications.reduce((acc, notif) => acc + notif.count, 0)}</Text>
                </Box>
              )}
            </Box>
          </MenuButton>
          <MenuList p={0} mt={3} mr={-3} bg="#FDC8A7">
            <MenuItem
              bg="#15aad4"
              _hover={{ bg: "#31bae0" }}
              justifyContent="center"
              rounded="md"
              fontWeight="bold"
              color="#fff"
              onClick={markAllAsRead}
            >
              Mark All as Read
            </MenuItem>
            <MenuDivider />
            {notifications.length === 0 ? (
              <MenuItem
                bg="#1d86a3"
                justifyContent="center"
                rounded="md"
                fontWeight="bold"
                color="#fff"
              >
                No notifications
              </MenuItem>
            ) : (
              notifications.map((notification) => (
                <MenuItem
                  key={notification._id}
                  bg="#1d86a3"
                  _hover={{ bg: "#e6703e" }}
                  justifyContent="center"
                  rounded="md"
                  fontWeight="bold"
                  color="#fff"
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.senderUsername
                    ? `Message from ${notification.senderUsername} (${notification.count})`
                    : `Message from Unknown Sender (${notification.count})`}
                </MenuItem>
              ))
            )}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} bg="gray-200" rightIcon={<ChevronDownIcon />}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.username}
              src={user.profilePic?.url}
              boxSize="40px"
            />
          </MenuButton>
          <MenuList p={0} mt={3} mr={-3} bg="#FDC8A7">
            <ProfileModal user={user}>
              <MenuItem
                bg="#15aad4"
                _hover={{ bg: "#31bae0" }}
                justifyContent="center"
                rounded="md"
                fontWeight="bold"
                color="#fff"
              >
                Account
              </MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem
              bg="#1d86a3"
              _hover={{ bg: "#e6703e" }}
              justifyContent="center"
              rounded="md"
              fontWeight="bold"
              color="#fff"
              onClick={handleLogout}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;