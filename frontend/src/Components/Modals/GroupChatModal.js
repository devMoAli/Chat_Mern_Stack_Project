// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   useDisclosure,
//   FormControl,
//   Input,
//   useToast,
//   Box,
//   Text,
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { useChat } from "../../Context/ChatContext";
// import UserBadgeItem from "../User/UserBadge";
// import UserListItem from "../User/UserListItem";
// import { useUser } from "../../Context/UserContext";

// const GroupChatModal = ({ children }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [groupChatName, setGroupChatName] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();

//   const { createGroupChat } = useChat();
//   const { user, searchUsers } = useUser();

//   const handleGroup = (userToAdd) => {
//     if (selectedUsers.includes(userToAdd)) {
//       toast({
//         title: "User already added",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "top",
//       });
//       return;
//     }
//     setSelectedUsers([...selectedUsers, userToAdd]);
//   };

//   const handleSearch = async (query) => {
//     setSearch(query);
//     if (!query) {
//       return;
//     }
//     try {
//       setLoading(true);
//       const data = await searchUsers(query);
//       setLoading(false);
//       setSearchResult(data);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to Load the Search Results",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom-left",
//       });
//     }
//   };

//   const handleDelete = (delUser) => {
//     setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
//   };

//   const handleSubmit = async () => {
//     if (!groupChatName || !selectedUsers.length) {
//       toast({
//         title: "Please fill all the fields",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "top",
//       });
//       return;
//     }
//     try {
//       await createGroupChat(groupChatName, selectedUsers.map((u) => u._id));
//       onClose();
//       toast({
//         title: "New Group Chat Created!",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     } catch (error) {
//       toast({
//         title: "Failed to Create the Chat!",
//         description: error.response?.data || error.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     }
//   };

//   return (
//     <>
//       <Box onClick={onOpen} cursor="pointer">
//         {children}
//       </Box>
//       <Modal onClose={onClose} isOpen={isOpen} isCentered>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader
//             fontSize="20px"
//             color="#109ade"
//             fontWeight="bold"
//             fontFamily="nunito"
//             display="flex"
//             justifyContent="center"
//           >
//             Create Group Chat 📬
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody d="flex" flexDir="column" alignItems="center">
//             <FormControl>
//               <Input
//                 placeholder="Chat Name"
//                 mb={3}
//                 value={groupChatName}
//                 onChange={(e) => setGroupChatName(e.target.value)}
//               />
//             </FormControl>
//             <FormControl>
//               <Input
//                 placeholder="Add Users eg: Mo, Sam, Randa, Jane"
//                 mb={1}
//                 value={search}
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </FormControl>
//             <Box d="flex" flexWrap="wrap">
//               {selectedUsers.map((u) => (
//                 <UserBadgeItem
//                   key={u._id}
//                   user={u}
//                   handleFunction={() => handleDelete(u)}
//                 />
//               ))}
//             </Box>
//             {loading ? (
//               <Text>Loading...</Text>
//             ) : (
//               searchResult?.slice(0, 4).map((user) => (
//                 <UserListItem
//                   key={user._id}
//                   user={user}
//                   handleFunction={() => handleGroup(user)}
//                 />
//               ))
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button onClick={handleSubmit} colorScheme="blue">
//               + Create Chat
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default GroupChatModal;

// ==========================================

// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   useDisclosure,
//   FormControl,
//   Input,
//   useToast,
//   Box,
//   Text,
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { useChat } from "../../Context/ChatContext";
// import UserBadgeItem from "../User/UserBadge";
// import UserListItem from "../User/UserListItem";
// import { useUser } from "../../Context/UserContext";

// const GroupChatModal = ({ children }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [groupChatName, setGroupChatName] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();

//   const { fetchChats, createGroupChat } = useChat();
//   const { user, searchUsers } = useUser();

//   const handleGroup = (userToAdd) => {
//     if (selectedUsers.includes(userToAdd)) {
//       toast({
//         title: "User already added",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "top",
//       });
//       return;
//     }
//     setSelectedUsers([...selectedUsers, userToAdd]);
//   };

//   const handleSearch = async (query) => {
//     setSearch(query);
//     if (!query) {
//       return;
//     }
//     try {
//       setLoading(true);
//       const data = await searchUsers(query);
//       setLoading(false);
//       setSearchResult(data);
//     } catch (error) {
//       toast({
//         title: "Error Occurred!",
//         description: "Failed to Load the Search Results",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom-left",
//       });
//     }
//   };

//   const handleDelete = (delUser) => {
//     setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
//   };

//   const handleSubmit = async () => {
//     if (!groupChatName || !selectedUsers.length) {
//       toast({
//         title: "Please fill all the fields",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "top",
//       });
//       return;
//     }
//     try {
//       const newChat = await createGroupChat(groupChatName, selectedUsers.map((u) => u._id));
//       console.log("Chat created:", newChat); // Add log
//       await fetchChats(); // Refresh the chat list
//       onClose();
//       toast({
//         title: "New Group Chat Created!",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     } catch (error) {
//       toast({
//         title: "Failed to Create the Chat!",
//         description: error.response?.data || error.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     }
//   };

//   return (
//     <>
//       <Box onClick={onOpen} cursor="pointer">
//         {children}
//       </Box>
//       <Modal onClose={onClose} isOpen={isOpen} isCentered>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader
//             fontSize="20px"
//             color="#109ade"
//             fontWeight="bold"
//             fontFamily="nunito"
//             display="flex"
//             justifyContent="center"
//           >
//             Create Group Chat 📬
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody d="flex" flexDir="column" alignItems="center">
//             <FormControl>
//               <Input
//                 placeholder="Chat Name"
//                 mb={3}
//                 value={groupChatName}
//                 onChange={(e) => setGroupChatName(e.target.value)}
//               />
//             </FormControl>
//             <FormControl>
//               <Input
//                 placeholder="Add Users eg: Mo, Sam, Randa, Jane"
//                 mb={1}
//                 value={search}
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </FormControl>
//             <Box d="flex" flexWrap="wrap">
//               {selectedUsers.map((u) => (
//                 <UserBadgeItem
//                   key={u._id}
//                   user={u}
//                   handleFunction={() => handleDelete(u)}
//                 />
//               ))}
//             </Box>
//             {loading ? (
//               <Text>Loading...</Text>
//             ) : (
//               searchResult?.slice(0, 4).map((user) => (
//                 <UserListItem
//                   key={user._id}
//                   user={user}
//                   handleFunction={() => handleGroup(user)}
//                 />
//               ))
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button onClick={handleSubmit} colorScheme="blue">
//               + Create Chat
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default GroupChatModal;

// =======================================
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useChat } from "../../Context/ChatContext";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";
import { useUser } from "../../Context/UserContext";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { fetchChats, createGroupChat, setSelectedChatId } = useChat();
  const { searchUsers } = useUser();

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);
    }
  }, [isOpen]);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const data = await searchUsers(query);
      setLoading(false);
      setSearchResult(data);
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

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
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
      await createGroupChat(
        groupChatName,
        selectedUsers.map((u) => u._id)
      );
      onClose();
      await fetchChats(); 
     
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response?.data || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <Box onClick={onOpen} cursor="pointer">
        {children}
      </Box>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
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
            Create Group Chat 📬
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Mo, Sam, Randa, Jane"
                mb={1}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
