// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const connectToDb = require("./config/connectToDb");
// require("dotenv").config();
// const { JSDOM } = require("jsdom");
// const helmet = require("helmet");
// const hpp = require("hpp");
// const rateLimit = require("express-rate-limit");
// const { errorHandler } = require("./middlewares/errorMiddleware");
// const userRoutes = require("./routes/userRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const messageRoutes = require("./routes/messageRoutes");
// const createDOMPurify = require("dompurify");

// // connection to DB
// connectToDb();

// // Init App
// const app = express();
// const server = http.createServer(app);

// // Socket.io setup
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
//   pingTimeout: 60000,
// });

// io.on("connection", (socket) => {
//   console.log("Connected to socket.io");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("User Joined Room: " + room);
//   });

//   socket.on("typing", (room) => socket.in(room).emit("typing"));
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

//   socket.on("new message", (newMessageReceived) => {
//     const { chat, sender } = newMessageReceived;

//     if (!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id == sender._id) return;

//       socket.in(user._id).emit("message received", newMessageReceived);
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected");
//   });
// });

// // Determine if behind a proxy (e.g., Heroku, AWS ELB, Nginx, etc.)
// app.set("trust proxy", 1); // trust first proxy

// // Middlewares
// app.use(express.json());
// app.use(helmet());
// app.use(hpp());

// // Rate Limiting
// app.use(
//   rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: 100,
//   })
// );

// // Cors Policy
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

// // Prevent (Cross Site Scripting) Attacks
// const window = new JSDOM("").window;
// const DOMPurify = createDOMPurify(window);

// app.post("/sanitize", (req, res) => {
//   const sanitizedInput = DOMPurify.sanitize(req.body.input);
//   res.send({ sanitizedInput });
// });

// // Routes
// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);

// // Error Handlers
// app.use(errorHandler);

// // Running The Server
// const PORT = process.env.PORT || 8000;
// server.listen(PORT, () =>
//   console.log(
//     `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
//   )
// );


const express = require("express");
const cors = require("cors");
const http = require("http");
const connectToDb = require("./config/connectToDb");
require("dotenv").config();
const { JSDOM } = require("jsdom");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const createDOMPurify = require("dompurify");
const { initializeSocket, getIo } = require("./services/socketService");

// Connection to DB
connectToDb();

// Init App
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Determine if behind a proxy (e.g., Heroku, AWS ELB, Nginx, etc.)
app.set("trust proxy", 1);

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(hpp());

// Rate Limiting
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
  })
);

// Cors Policy
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Prevent (Cross Site Scripting) Attacks
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

app.post("/sanitize", (req, res) => {
  const sanitizedInput = DOMPurify.sanitize(req.body.input);
  res.send({ sanitizedInput });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handlers
app.use(errorHandler);

// Running The Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

module.exports = { app, getIo };
