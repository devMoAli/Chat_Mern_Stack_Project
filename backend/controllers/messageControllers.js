const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const { getReceiverSocketIds, getIo } = require("../services/socketService");
// // /**-----------------------------------------------
// //  * @desc    Get Messages
// //  * @route   /api/Message/:chatId
// //  * @method  GET
// //  * @access  Protected
// //  ------------------------------------------------*/
module.exports.getMessagesCtl = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.find({ chatId })
      .populate("senderId", "username profilePic email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// /**-----------------------------------------------
//  * @desc    Send Message
//  * @route   /api/Message
//  * @method  POST
//  * @access  Protected
//  ------------------------------------------------*/
module.exports.sendMessageCtl = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Content and chatId are required" });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.deletedBy.includes(req.user._id)) {
      chat.deletedBy = chat.deletedBy.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
      await chat.save();
    }

    let message = await Message.create({
      senderId: req.user._id,
      content,
      chatId,
    });

    message = await Message.findById(message._id)
      .populate("senderId", "username profilePic email")
      .populate({
        path: "chatId",
        populate: { path: "users", select: "username profilePic email" },
      });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    const receiverIds = chat.users
      .map((user) => user._id.toString())
      .filter((userId) => userId !== req.user._id.toString());

    receiverIds.forEach((receiverId) => {
      const socketIds = getReceiverSocketIds(receiverId);
      socketIds.forEach((socketId) => {
        getIo()
          .to(socketId)
          .emit("message received", {
            ...message.toObject(),
            senderUsername: message.senderId.username,
          });
      });
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
