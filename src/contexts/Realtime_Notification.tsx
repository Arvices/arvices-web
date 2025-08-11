import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSocket } from "./SocketContext"; // adjust import
import { useDispatch } from "react-redux";
import {
  ArviceNotification,
  ArviceNotificationRequestPayload,
  setNotifications,
} from "../store/notificationSlice";
import { getAllUserNotifications } from "../api-services/notificationservice";
import { useAuth } from "./AuthContext";
import { parseHttpError } from "../api-services/parseReqError";
import { useNotificationContext } from "./NotificationContext";

// adjust import

interface NotificationRealtimeContextType {
  latestNotification: ArviceNotification | null;
  getNotifications: (page: number) => Promise<void>;
  notificationLoading: boolean;
  notificationError: string;
  sendNotification: (data: ArviceNotificationRequestPayload) => void;
}

const NotificationRealtimeContext = createContext<
  NotificationRealtimeContextType | undefined
>(undefined);

export const useNotificationRealtime = (): NotificationRealtimeContextType => {
  const context = useContext(NotificationRealtimeContext);
  if (!context) {
    throw new Error(
      "useNotificationRealtime must be used within NotificationRealtimeProvider",
    );
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const NotificationRealtimeProvider: React.FC<Props> = ({ children }) => {
  let auth = useAuth();
  const { notificationsSocket } = useSocket();
  const { openNotification } = useNotificationContext();
  const [latestNotification, setLatestNotification] = useState<any | null>(
    null,
  );
  const dispatch = useDispatch();

  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  // WE CAN GET
  const getNotifications = async (page = 1) => {
    setNotificationError("");
    try {
      setNotificationLoading(true);
      const response = await getAllUserNotifications({
        token: auth.token,
        page: page,
        limit: 15,
      });

      //const response = await getAllNotifications(auth.token);

      // response.data will contain your notifications
      console.log("Notifications:", response.data);
      let data = response.data.response;
      if (data.length === 0) {
        openNotification(
          "topRight",
          "No more notifications to show",
          "",
          "info",
        );
        return;
      }
      dispatch(setNotifications(data));
    } catch (error) {
      let message = parseHttpError(error);
      setNotificationError(message);
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  // WE CAN SEND
  const sendNotification = (data: ArviceNotificationRequestPayload) => {
    console.log({ sendingNotification: true, payload: data });
    if (notificationsSocket) {
      notificationsSocket.emit("sendnotification", data);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    if (!notificationsSocket) return;

    // WE CAN INTERCEPT
    // Example: listen to new notifications
    notificationsSocket.on("notificationsent", (data) => {
      console.log("Received notification:", data);
      setLatestNotification(data);
    });

    // Example: listen to new notifications
    notificationsSocket.on("notificationsent", (data) => {
      console.log("Received notification:", data);
      setLatestNotification(data);
    });

    return () => {
      notificationsSocket.off("notificationsent");
    };
  }, [notificationsSocket, dispatch]);

  return (
    <NotificationRealtimeContext.Provider
      value={{
        latestNotification,
        getNotifications,
        notificationLoading,
        notificationError,
        sendNotification,
      }}
    >
      {children}
    </NotificationRealtimeContext.Provider>
  );
};
