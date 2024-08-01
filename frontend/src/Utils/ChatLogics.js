export const isSameSenderMargin = (messages, currentMessage, index, userId) => {
  if (
    !currentMessage ||
    !currentMessage.senderId ||
    !currentMessage.senderId._id
  ) {
    return "auto";
  }

  const nextMessage = messages[index + 1];

  if (
    nextMessage &&
    nextMessage.senderId &&
    nextMessage.senderId._id === currentMessage.senderId._id
  ) {
    return 0; // Return 0 instead of "auto" when next message is from the same sender
  } else {
    return "auto";
  }
};

export const isSameSender = (messages, currentMessage, index, userId) => {
  const nextMessage = messages[index + 1];
  return (
    nextMessage &&
    (nextMessage.senderId?._id === currentMessage.senderId?._id ||
      !nextMessage.senderId?._id) &&
    currentMessage.senderId?._id !== userId
  );
};

export const getLastMessageBySender = (messages, senderId) => {
  let lastMessage = null;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderId._id === senderId) {
      lastMessage = messages[i];
      break;
    }
  }
  return lastMessage;
};

export const isLastMessage = (messages, index, userId) => {
  const lastMessage = messages[messages.length - 1];
  return index === messages.length - 1 && lastMessage.senderId?._id === userId;
};

export const isSameUser = (messages, currentMessage, index) => {
  const previousMessage = messages[index - 1];
  return (
    previousMessage &&
    previousMessage.senderId._id === currentMessage.senderId._id
  );
};

export const getSender = (loggedUser, users) => {
  const sender =
    Array.isArray(users) && users.find((user) => user._id !== loggedUser._id);
  return sender ? sender.username : "";
};

export const getSenderFull = (loggedUser, users) => {
  return users.find((user) => user._id !== loggedUser._id);
};


