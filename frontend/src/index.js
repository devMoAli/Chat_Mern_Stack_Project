import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ChatProvider } from "./Context/ChatContext";
import { MessageProvider } from "./Context/MessageContext";
import { UserProvider } from "./Context/UserContext";
import { NotificationProvider } from "./Context/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ChatProvider>
          <NotificationProvider>
            <MessageProvider>
              <ChakraProvider
                toastOptions={{
                  defaultOptions: {
                    position: "top",
                    duration: 5000,
                    isClosable: true,
                  },
                }}
              >
                <App />
              </ChakraProvider>
            </MessageProvider>
          </NotificationProvider>
        </ChatProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
