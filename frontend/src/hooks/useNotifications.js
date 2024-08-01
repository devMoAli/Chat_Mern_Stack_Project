import { useState } from "react";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const updateNotifications = (newMessage) => {
    setNotifications((prevNotifications) => {
      const existingNotificationIndex = prevNotifications.findIndex(
        (notification) => notification.senderId === newMessage.sender._id
      );

      if (existingNotificationIndex !== -1) {
        // If notification exists, update count
        const updatedNotifications = [...prevNotifications];
        updatedNotifications[existingNotificationIndex].count += 1;
        return updatedNotifications;
      } else {
        // Otherwise, add new notification
        return [
          ...prevNotifications,
          {
            senderId: newMessage.sender._id,
            senderName: newMessage.sender.username,
            count: 1,
          },
        ];
      }
    });
  };

  return { notifications, updateNotifications };
};

export default useNotifications;
