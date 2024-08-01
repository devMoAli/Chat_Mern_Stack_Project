const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createDirectChatCtl,
  fetchChatsCtl,
  fetchChatByIdCtl,
  createGroupChatCtl,
  renameGroupCtl,
  addToGroupCtl,
  removeFromGroupCtl,
  deleteGroupChatCtl,
  exitGroupChatCtl,
  softDeleteDirectChatCtl,
} = require("../controllers/chatControllers");

// Create a new chat
router.post("/", protect, createDirectChatCtl);

// Create a new group chat
router.post("/group", protect, createGroupChatCtl);

// Rename a group chat
router.put("/group/rename", protect, renameGroupCtl);

// Add a user to a group chat
router.put("/group/add", protect, addToGroupCtl);

// Remove a user from a group chat
router.put("/group/remove", protect, removeFromGroupCtl);

// Fetch all chats for a user
router.get("/", protect, fetchChatsCtl);

// Fetch a chat by ID for a user
router.get("/:chatId", protect, fetchChatByIdCtl);

// Delete Group Chat
router.delete("/group/:chatId", protect, deleteGroupChatCtl);

// Exit Group Chat
router.put("/group/exit", protect, exitGroupChatCtl);

// Soft Delete Direct Chat
router.put("/direct/delete", protect, softDeleteDirectChatCtl);

module.exports = router;
