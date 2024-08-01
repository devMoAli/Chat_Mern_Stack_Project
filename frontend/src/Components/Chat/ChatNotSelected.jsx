import { Link, Text, Box } from "@chakra-ui/react";
import React from "react";
import "./styles.css";
import chat from "../../assets/chat.png";
import { GrTechnology } from "react-icons/gr";
import { useUser } from "../../Context/UserContext";
function ChatNotSelected() {
  const { user } = useUser();
  return (
    <>
      <Box
        display="block"
        height="100%"
        width="100%"
        rounded="md"
        position="relative"
        overflow="hidden"
      >
        {/* Project features */}
        <Text
          fontSize="lg"
          p={2}
          rounded="md"
          fontWeight="bold"
          fontFamily="nunito"
          color="#17a1e6"
          m="auto"
          textAlign="center"
        >
          Welcome 👋 {user.username} 🌟
        </Text>
        <Text
          fontSize="lg"
          ml={5}
          mt={5}
          fontWeight="bold"
          fontFamily="nunito"
          color="#e6822c"
        >
          📑 Project Features
        </Text>
        <Box ml={5} mt={5} p={2} rounded="md">
          <Text
            fontSize="sm"
            fontWeight="bold"
            fontFamily="nunito"
            color="#37819e"
          >
            <i className="fas fa-search" style={{ color: "orange" }}></i> Search
            Users by Name or Email
          </Text>
        </Box>
        <Box ml={5} mt={5} p={2} rounded="md">
          <Text
            fontSize="sm"
            fontWeight="bold"
            fontFamily="nunito"
            color="#37819e"
          >
            🗳️ Select Single or Group Chat
          </Text>
        </Box>
        <Box ml={5} mt={5} p={2} rounded="md">
          <Text
            fontSize="sm"
            fontWeight="bold"
            fontFamily="nunito"
            color="#37819e"
          >
            🛰️ Enjoy Real Time Messaging Service at your fingertips
          </Text>
        </Box>
        <Box ml={5} mt={5} display="flex" alignItems="center">
          <Text mr={2} mt={1} color="green">
            <GrTechnology />
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            fontFamily="nunito"
            color="#e6822c"
          >
            Technologies Used
          </Text>
        </Box>
        <Box ml={5} mt={5} p={2} rounded="md">
          <Text
            fontSize="sm"
            fontWeight="bold"
            fontFamily="nunito"
            color="#37819e"
          >
            🤖 React - Nodejs - Express - MongoDB - ReactContext - ChakraUI -
            Socket.Io
          </Text>
        </Box>
        {/* Contact information */}
        <Text
          fontSize="lg"
          ml={5}
          mt={5}
          fontWeight="bold"
          fontFamily="nunito"
          color="#e6822c"
          rounded="md"
          p={2}
        >
          📧 Contact
        </Text>
        <Box>
          <Box ml={5} mt={1} p={2} rounded="md">
            <Text
              fontSize="sm"
              fontWeight="bold"
              fontFamily="nunito"
              color="#37819e"
            >
              <Link href="mailto:dev.mohamed.ali1@gmail.com">
                Email: dev.mohamed.ali1@gmail.com
              </Link>
            </Text>
          </Box>
          {/* GitHub link */}
          <Box ml={5} mt={5} p={2} width="40%" rounded="md">
            <Text
              fontSize="sm"
              fontWeight="bold"
              fontFamily="nunito"
              color="#37819e"
            >
              <Link href="https://github.com/devMoAli" isExternal>
                Github: https://github.com/devMoAli
              </Link>
            </Text>
          </Box>
          {/* Copyright */}
          <Box
            ml={5}
            mt={5}
            p={2}
            rounded="md"
            bg="transparent"
            textAlign="left"
          >
            <Text
              fontSize="sm"
              fontWeight="bold"
              fontFamily="nunito"
              color="#929695"
            >
              Copyright © 2024 All Rights Reserved®
            </Text>
          </Box>
        </Box>
      </Box>
      <img src={chat} alt="chat Img" className="chat-image" />
    </>
  );
}

export default ChatNotSelected;
