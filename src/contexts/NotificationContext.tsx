import React, { createContext, useContext, useMemo } from "react";
import { notification } from "antd";
import type { NotificationArgsProps } from "antd";
type NotificationPlacement = NotificationArgsProps["placement"];
type NotificationType = NotificationArgsProps["type"];
interface NotificationContextType {
  openNotification: (
    placement: NotificationPlacement,
    message: string,
    description: string,
    type: NotificationType,
  ) => void;
}
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);
export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider",
    );
  }
  return context;
};
export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    placement: NotificationPlacement,
    message: string,
    description: string,
    type: NotificationType,
  ) => {
    console.log({
      notificationType: type,
    });
    if (type == "info") {
      api.info({
        message,
        description,
        placement,
        showProgress: true,
      });
    } else if (type == "error") {
      api.error({
        message,
        description,
        placement,
        showProgress: true,
      });
    } else if (type == "warning") {
      api.warning({
        message,
        description,
        placement,
        showProgress: true,
      });
    } else {
      api.success({
        message,
        description,
        placement,
        showProgress: true,
      });
    }
  };
  const contextValue = useMemo(
    () => ({
      openNotification,
    }),
    [],
  );
  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
