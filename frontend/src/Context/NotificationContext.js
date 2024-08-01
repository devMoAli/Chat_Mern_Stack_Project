// NotificationContext.js
import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    setNotifications((prev) => {
      const existingNotificationIndex = prev.findIndex(
        (notif) => notif.senderId === notification.senderId
      );
      // if you want to make number for each msg in notification
      //     if (existingNotificationIndex >= 0) {
      //       // Update the existing notification count
      //       const updatedNotifications = [...prev];
      //       updatedNotifications[existingNotificationIndex] = {
      //         ...updatedNotifications[existingNotificationIndex],
      //         count: updatedNotifications[existingNotificationIndex].count + 1,
      //       };
      //       return updatedNotifications;
      //     } else {
      //       // Add a new notification
      //       return [...prev, { ...notification, count: 1 }];
      //     }
      //   });
      // };
      // if you want to make 1 number for all msg's from same sender in notification
      if (existingNotificationIndex >= 0) {
        // Update existing notification count
        const updatedNotifications = [...prev];
        updatedNotifications[existingNotificationIndex].count += 1;
        return updatedNotifications;
      } else {
        // Add a new notification
        return [...prev, { ...notification, count: 1 }];
      }
    });
  };
  
  const markAllAsRead = () => {
    setNotifications([]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== notificationId)
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllAsRead,
        markNotificationAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};


