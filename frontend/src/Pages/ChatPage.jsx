import React from "react";
import { Box } from "@chakra-ui/react";
import { useUser } from "../Context/UserContext";
import Header from "../Components/Header/Header";
import bg3 from "../assets/bg3.png";
import ChatList from "../Components/Chat/ChatList";
import MsgBox from "../Components/Chat/MsgBox";

const ChatPage = () => {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box
        style={{
          width: "90%",
          justifyContent: "center",
          margin: "0 auto",
          mt: "10px",
        }}
      >
        {user && <Header />}
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="space-between"
          w="100%"
          h="65vh"
          p="10px"
          rounded="md"
          bg="rgba(255, 255, 255, 1)"
          sx={{
            backdropFilter: "blur(1px)",
            WebkitBackdropFilter: "blur(1px)",
            background: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Box
            w={{ base: "100%", md: "30%" }}
            bg="rgba(255, 255, 255, 0.2)"
            rounded="md"
          >
            <ChatList />
          </Box>
          <Box
            w={{ base: "100%", md: "68%" }}
            bg="rgba(255, 255, 255, 0.2)"
            rounded="md"
          >
            <MsgBox />
          </Box>
        </Box>
      </Box>
      <img src={bg3} width="450px" alt="Br Img" className="br-image" />
    </>
  );
};

export default ChatPage;
