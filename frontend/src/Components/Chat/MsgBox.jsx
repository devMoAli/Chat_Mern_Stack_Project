import React from "react";
import { Box } from "@chakra-ui/react";
import MessageDisplay from "./MessageDisplay";
import "./styles.css";

function MsgBox() {
  return (
    <Box
      // display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      h="100%"
      w="100%"
      // w={{base: "100%", md: "68%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <MessageDisplay />
    </Box>
  );
}

export default MsgBox;
