import React from "react";
import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Box,
} from "@chakra-ui/react";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";
import { useUser } from "../Context/UserContext";
import ChatPage from "./ChatPage";
import notification from "../assets/notification.png";
import chat from "../assets/chat.png";
import bg3 from "../assets/bg3.png";
import "./home.css";

const Home = () => {
  const { user } = useUser();

  return (
    <div className="home-container">
      <div className="content-container">
        <Container maxW="xl" centerContent>
          {user ? (
            <ChatPage />
          ) : (
            <>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={6}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
                position="relative"
                overflow="hidden"
              >
                <Text
                  fontSize="5xl"
                  fontFamily="nunito"
                  color="white"
                  fontWeight="extrabold"
                  textAlign="center"
                  lineHeight="1.2"
                  letterSpacing="wider"
                  textShadow="2px 2px 4px rgba(0, 0, 0, 0.7)"
                >
                  <img
                    src={chat}
                    alt="Chat Icon"
                    className="background-image top-left-image"
                  />
                  Chat Project
                  <img
                    src={notification}
                    alt="Notification Icon"
                    className="background-image bottom-right-image"
                  />
                </Text>
              </Box>
              <Box
                bg="white"
                w="100%"
                p={4}
                borderRadius="lg"
                borderWidth="1px"
              >
                <Tabs isFitted variant="soft-rounded">
                  <TabList mb="1em">
                    <Tab>Login</Tab>
                    <Tab>Sign Up</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Login />
                    </TabPanel>
                    <TabPanel>
                      <Signup />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </>
          )}
        </Container>
      </div>
      <img src={bg3} alt="Br Img" className="br-image" />
    </div>
  );
};

export default Home;
