const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

/**-----------------------------------------------
 * @desc    Create Direct Chat
 * @route   POST /api/chat
 * @access  Protected
 ------------------------------------------------*/
module.exports.createDirectChatCtl = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .send({ message: "UserId param not sent with request" });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await Chat.populate(isChat, {
    path: "latestMessage.sender",
    select: "username profilePic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatTitle: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

/**-----------------------------------------------
 * @desc    Create New Group Chat
 * @route   POST /api/chat/group
 * @access  Protected
 ------------------------------------------------*/
module.exports.createGroupChatCtl = asyncHandler(async (req, res) => {
  const { chatTitle, users } = req.body;

  if (!chatTitle || !users) {
    return res.status(400).json({ message: "Please fill required fields" });
  }

  const userArray = JSON.parse(users);

  if (userArray.length < 2) {
    return res
      .status(400)
      .json({ message: "At least 2 users are required for a group chat" });
  }

  if (!userArray.includes(req.user._id.toString())) {
    userArray.push(req.user._id.toString());
  }

  try {
    const groupChat = await Chat.create({
      chatTitle,
      users: userArray,
      isGroupChat: true,
      groupAdmin: req.user._id, // Only one admin
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

/**-----------------------------------------------
 * @desc    Rename Group
 * @route   PUT /api/chats/group/rename
 * @access  Protected
 ------------------------------------------------*/
module.exports.renameGroupCtl = asyncHandler(async (req, res) => {
  const { chatId, chatTitle } = req.body;

  if (!chatId || !chatTitle) {
    return res
      .status(400)
      .json({ message: "ChatId and chatTitle are required" });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Only admin can rename the group" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatTitle },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

/**-----------------------------------------------
 * @desc    Add User to Group
 * @route   PUT /api/chats/group/add
 * @access  Protected
 ------------------------------------------------*/
module.exports.addToGroupCtl = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Only admin can add members" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

/**-----------------------------------------------
 * @desc    Remove User from Group
 * @route   PUT /api/chats/group/remove
 * @access  Protected
 ------------------------------------------------*/
module.exports.removeFromGroupCtl = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Only admin can remove members" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

/**-----------------------------------------------
 * @desc    Fetch All Chats for User
 * @route   GET /api/chat
 * @access  Protected
 ------------------------------------------------*/
module.exports.fetchChatsCtl = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
      deletedBy: { $ne: req.user._id }, // Exclude chats soft-deleted by the user
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const fullChats = await Chat.populate(chats, {
      path: "latestMessage.sender",
      select: "username profilePic email",
    });

    res.status(200).json(fullChats);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});
/**-----------------------------------------------
 * @desc    Fetch Chat by ID for User
 * @route   GET /api/chat/:chatId
 * @access  Protected
 ------------------------------------------------*/
module.exports.fetchChatByIdCtl = asyncHandler(async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "username profilePic email")
      .populate("latestMessage");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});
/**-----------------------------------------------
 * @desc    Delete Group Chat
 * @route   DELETE /api/chat/group/:chatId
 * @access  Protected
 ------------------------------------------------*/
module.exports.deleteGroupChatCtl = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Only admin can delete the group chat" });
    }

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ message: "Group chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

/**-----------------------------------------------
 * @desc    Exit Group Chat
 * @route   PUT /api/chat/group/exit
 * @access  Protected
 ------------------------------------------------*/
module.exports.exitGroupChatCtl = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.users.includes(req.user._id)) {
      return res.status(400).json({ message: "User not in chat" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: req.user._id } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

/**-----------------------------------------------
 * @desc    Soft Delete Direct Chat
 * @route   PUT /api/chat/direct/delete
 * @access  Protected
 ------------------------------------------------*/
module.exports.softDeleteDirectChatCtl = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.isGroupChat) {
      return res
        .status(400)
        .json({ message: "Use the group chat delete route for groups" });
    }

    if (!chat.users.includes(req.user._id)) {
      return res.status(400).json({ message: "User not in chat" });
    }

    // Add user to deletedBy array for soft delete
    if (!chat.deletedBy.includes(req.user._id)) {
      chat.deletedBy.push(req.user._id);
    }

    await chat.save();

    res.status(200).json({ message: "Chat deleted from your side", chat });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

