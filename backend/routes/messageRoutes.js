const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { getMessagesCtl, sendMessageCtl } = require("../controllers/messageControllers");

// Get all messages for a chat
router.get("/:chatId", protect, getMessagesCtl);

// Send a new message
router.post("/", protect, sendMessageCtl);

module.exports = router;
