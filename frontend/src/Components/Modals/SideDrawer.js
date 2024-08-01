import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Text, Box } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../Chat/ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";

import { getSender } from "../../Utils/ChatLogics";
import UserListItem from "../User/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { useAuth } from "../../Context/UserContext";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,

    chats,
    setChats,
  } = ChatState();
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <>
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
          {/* <Link onClick={() => setSelectedChat("")}> */}
          <Link>
            <Text
              fontSize="3xl"
              fontFamily="nunito"
              color="white"
              fontWeight="extrabold"
              textAlign="center"
              lineHeight="1.2"
              letterSpacing="wider"
              textShadow="2px 2px 4px rgba(0, 0, 0, 0.7)"
            >
              Chat Project
            </Text>
          </Link>
        </Box>
        <Box w="50%">
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button
              w="100%"
              justifyContent="space-between"
              variant="ghost"
              style={{ border: "1px #72c9e0 solid" }}
              onClick={onOpen}
            >
              <Text
                display={{ base: "none", md: "flex" }}
                style={{ color: "gray" }}
                px={1}
              >
                Search Users...
              </Text>
              <i className="fas fa-search" style={{ color: "orange" }}></i>
            </Button>
          </Tooltip>
        </Box>

        <Box position="relative">
          <Menu>
            <MenuButton p={1}>
              {/* {notification.length > 0 && ( */}
              <Box
                position="absolute"
                top="6px"
                right="6px"
                bg="rgb(94, 177, 224)"
                borderRadius="50%"
                width="14px"
                height="14px"
                zIndex="docked"
              />
              {/* )} */}
              <BellIcon fontSize="2xl" m={1} color={"gray"} />
            </MenuButton>
            <MenuList pl={2}>
              {/* {!notification.length && "No New Messages"} */}
              {/* {notification.map((notif) => ( */}
              <MenuItem
                // key={notif._id}
                onClick={() => {
                  // setSelectedChat(notif.chat);
                  // setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {/* {notif.chat.isGroupChat */}
                {/* ? `New Message in ${notif.chat.chatName}` */}: `New Message
                from
                {/* ${getSender(user, notif.chat.users)}`} */}
              </MenuItem>
              {/* ))} */}
            </MenuList>
          </Menu>
        </Box>
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
          <MenuList p={0} mt={3} mr={5}>
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
              onClick={logoutHandler}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            borderBottomWidth="1px"
            fontSize={"15px"}
            w="90%"
            justifyContent="center"
            m="auto"
            mb="20px"
            borderBottom={"1px orange solid"}
          >
            Search Users by Name/Email...
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="👤 ....."
                mr={2}
                border="skyblue 1px solid"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                {" "}
                <i className="fas fa-search" style={{ color: "orange" }}></i>
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
