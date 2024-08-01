const { Server } = require("socket.io");

let io;
const userSocketMap = {};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = userSocketMap[userId] || [];
      userSocketMap[userId].push(socket.id);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    } else {
      console.warn("User ID is undefined during socket connection");
    }

    socket.on("disconnect", () => {
      console.log(`User disconnected with Socket ID: ${socket.id}`);
      Object.keys(userSocketMap).forEach((userId) => {
        userSocketMap[userId] = userSocketMap[userId].filter(
          (id) => id !== socket.id
        );
        if (userSocketMap[userId].length === 0) {
          delete userSocketMap[userId];
        }
      });
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("setup", (userData) => {
      if (userData && userData._id) {
        socket.join(userData._id);
        socket.emit("connected");
      } else {
        console.warn("User data is missing or invalid during setup.");
      }
    });

    socket.on("join chat", (chatId) => {
      if (chatId) {
        socket.join(chatId);
      } else {
        console.warn("Chat ID is missing or invalid during join chat.");
      }
    });

    socket.on("leave chat", (chatId) => {
      if (chatId) {
        socket.leave(chatId);
      } else {
        console.warn("Chat ID is missing or invalid during leave chat.");
      }
    });

    socket.on("typing", (chatId) => {
      socket.broadcast.emit("typing", { userId: socket.id, chatId });
    });

    socket.on("stop typing", (chatId) => {
      socket.broadcast.emit("stop typing", { userId: socket.id, chatId });
    });
    socket.on("new message", (newMessageReceived) => {
      const { chatId, senderId, content, _id } = newMessageReceived;

      if (
        !chatId ||
        !chatId._id ||
        !chatId.users ||
        !senderId ||
        !content ||
        !_id
      ) {
        console.error(
          "Message details are incomplete or invalid:",
          newMessageReceived
        );
        return;
      }

      console.log("New message received:", newMessageReceived);

      if (chatId.isGroupChat) {
        chatId.users.forEach((user) => {
          if (user._id !== senderId._id) {
            userSocketMap[user._id]?.forEach((socketId) => {
              io.to(socketId).emit("message received", newMessageReceived);
            });
          }
        });
      } else {
        const receiverId = chatId.users.find(
          (user) => user._id !== senderId._id
        )?._id;
        if (receiverId) {
          userSocketMap[receiverId]?.forEach((socketId) => {
            io.to(socketId).emit("message received", newMessageReceived);
          });
        } else {
          console.warn("Receiver ID not found.");
        }
      }
    });

    socket.on("send notification", (notification) => {
      const { receiverId, senderId } = notification;

      if (!receiverId || !senderId) {
        console.error(
          "Receiver ID or Sender ID is missing in notification:",
          notification
        );
        return;
      }

      console.log(`Sending notification to user ${receiverId}:`, notification);

      userSocketMap[receiverId]?.forEach((socketId) => {
        io.to(socketId).emit("notification received", notification);
      });
    });
  });
};

const getReceiverSocketIds = (receiverId) => {
  return userSocketMap[receiverId] || [];
};

const getIo = () => io;

module.exports = {
  initializeSocket,
  getReceiverSocketIds,
  getIo,
};
