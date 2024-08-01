import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Spinner,
  useToast,
  Box,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { BsX } from "react-icons/bs";
import UserListItem from "../User/UserListItem";
import { useChat } from "../../Context/ChatContext";
import { useUser } from "../../Context/UserContext";
import UserBadgeItem from "../User/UserBadgeItem";

const EditGroupChatModal = ({ groupChat, onClose }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const {
    renameGroup,
    addToGroup,
    removeFromGroup,
    fetchChatDetails,
    deleteGroupChat,
    exitGroupChat,
  } = useChat();
  const { searchUsers, user } = useUser();

  useEffect(() => {
    if (groupChat) {
      setGroupChatName(groupChat.chatTitle);
      setSelectedUsers(groupChat.users);
    }
  }, [groupChat]);

  const isAdmin = groupChat?.groupAdmin?.includes(user?._id);

  const handleGroup = async (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      await addToGroup(groupChat._id, userToAdd._id);
      setSelectedUsers([...selectedUsers, userToAdd]);
      await fetchChatDetails(groupChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Add User",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const data = await searchUsers(query);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDelete = async (delUser) => {
    try {
      await removeFromGroup(groupChat._id, delUser._id);
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
      await fetchChatDetails(groupChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Remove User",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      await renameGroup(groupChat._id, groupChatName);
      await fetchChatDetails(groupChat._id);
      onClose();
      toast({
        title: "Group Chat Updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Update the Chat!",
        description: error.response?.data || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroupChat(groupChat._id);
      onClose();
      toast({
        title: "Group Chat Deleted!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Delete the Group Chat!",
        description: error.response?.data || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleExitGroup = async () => {
    try {
      await exitGroupChat(groupChat._id);
      onClose();
      toast({
        title: "You have exited the group chat!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Exit the Group Chat!",
        description: error.response?.data || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Modal onClose={onClose} isOpen={true} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="20px"
          color="#109ade"
          fontWeight="bold"
          fontFamily="nunito"
          display="flex"
          justifyContent="center"
        >
          Edit Group Chat 📬
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody d="flex" flexDir="column" alignItems="center">
          <Text fontFamily="nunito" color="#109ade">
            Title
          </Text>
          <FormControl>
            <Input
              placeholder="Chat Name"
              mb={3}
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              isDisabled={!isAdmin} // Only admins can change the chat name
            />
          </FormControl>
          <Text fontFamily="nunito" color="#109ade">
            Users
          </Text>
          <Box w="100%" d="flex" flexWrap="wrap" gap={2} mb={3}>
            {selectedUsers.map((u) => (
              <Box
                key={u._id}
                d="flex"
                alignItems="center"
                bg={
                  groupChat.groupAdmin.includes(u._id)
                    ? "#FEBD93"
                    : "transparent"
                }
                p={1}
                borderRadius="md"
                flexShrink={0}
                display="inline-flex"
              >
                <UserBadgeItem
                  user={u}
                  handleFunction={
                    isAdmin && !groupChat.groupAdmin.includes(u._id)
                      ? () => handleDelete(u)
                      : undefined
                  }
                />
                {isAdmin && !groupChat.groupAdmin.includes(u._id) && (
                  <IconButton
                    icon={<BsX />}
                    aria-label="Remove user"
                    color="gray"
                    onClick={() => handleDelete(u)}
                    size="sm"
                  />
                )}
              </Box>
            ))}
          </Box>

          <FormControl>
            <Input
              placeholder="Add User to group"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
              isDisabled={!isAdmin} // Only admins can add users
            />
          </FormControl>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={isAdmin ? () => handleGroup(user) : undefined}
                isAdmin={isAdmin}
              />
            ))
          )}
        </ModalBody>

        <ModalFooter>
          {isAdmin ? (
            <>
              <Button
                onClick={handleDeleteGroup}
                fontSize="12px"
                colorScheme="red"
                mr={3}
              >
                Delete Group
              </Button>
              <Button onClick={handleSubmit} fontSize="12px" colorScheme="blue">
                Update Group
              </Button>
            </>
          ) : (
            <Button
              onClick={handleExitGroup}
              fontSize="12px"
              colorScheme="orange"
              mr={3}
            >
              Exit Group
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditGroupChatModal;



