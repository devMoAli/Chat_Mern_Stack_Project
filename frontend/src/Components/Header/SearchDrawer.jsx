import React, { useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Button,
  Box,
  Spinner,
  useToast,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { useChat } from "../../Context/ChatContext";
import { useUser } from "../../Context/UserContext";
import UserListItem from "../User/UserListItem";

const SearchDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { searchUsers } = useUser();
  const { createDirectChat, setSelectedChatId } = useChat();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const data = await searchUsers(search);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const newChat = await createDirectChat(userId);
      setSelectedChatId(newChat._id); // Select the new chat
      onClose(); // Close the drawer
    } catch (error) {
      console.error("Error creating chat:", error); // Log error for debugging
      toast({
        title: "Error Occurred!",
        description: "Failed to create a chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box>
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            w="100%"
            justifyContent="space-between"
            variant="ghost"
            style={{ border: "1px white solid" }}
            onClick={onOpen}
          >
            <Text
              display={{ base: "none", md: "flex" }}
              style={{ color: "#107791" }}
              px={1}
            >
              Search Users...
            </Text>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 20 20"
            >
              <path
                fill="#33abe8"
                d="M12.14 4.18a5.504 5.504 0 0 1 .72 6.89c.12.1.22.21.36.31c.2.16.47.36.81.59c.34.24.56.39.66.47c.42.31.73.57.94.78c.32.32.6.65.84 1c.25.35.44.69.59 1.04c.14.35.21.68.18 1q-.03.48-.36.81c-.33.33-.49.34-.81.36c-.31.02-.65-.04-.99-.19c-.35-.14-.7-.34-1.04-.59c-.35-.24-.68-.52-1-.84c-.21-.21-.47-.52-.77-.93c-.1-.13-.25-.35-.47-.66c-.22-.32-.4-.57-.56-.78c-.16-.2-.29-.35-.44-.5a5.5 5.5 0 0 1-6.44-.98c-2.14-2.15-2.14-5.64 0-7.78a5.5 5.5 0 0 1 7.78 0m-1.41 6.36a3.513 3.513 0 0 0 0-4.95a3.495 3.495 0 0 0-4.95 0a3.495 3.495 0 0 0 0 4.95a3.495 3.495 0 0 0 4.95 0"
              ></path>
            </svg>
          </Button>
        </Tooltip>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" color="gray">
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="User name..."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="1.5em"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="#33abe8"
                    d="M12.14 4.18a5.504 5.504 0 0 1 .72 6.89c.12.1.22.21.36.31c.2.16.47.36.81.59c.34.24.56.39.66.47c.42.31.73.57.94.78c.32.32.6.65.84 1c.25.35.44.69.59 1.04c.14.35.21.68.18 1q-.03.48-.36.81c-.33.33-.49.34-.81.36c-.31.02-.65-.04-.99-.19c-.35-.14-.7-.34-1.04-.59c-.35-.24-.68-.52-1-.84c-.21-.21-.47-.52-.77-.93c-.1-.13-.25-.35-.47-.66c-.22-.32-.4-.57-.56-.78c-.16-.2-.29-.35-.44-.5a5.5 5.5 0 0 1-6.44-.98c-2.14-2.15-2.14-5.64 0-7.78a5.5 5.5 0 0 1 7.78 0m-1.41 6.36a3.513 3.513 0 0 0 0-4.95a3.495 3.495 0 0 0-4.95 0a3.495 3.495 0 0 0 0 4.95a3.495 3.495 0 0 0 4.95 0"
                  ></path>
                </svg>
              </Button>
            </Box>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleUserClick(user._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchDrawer;
