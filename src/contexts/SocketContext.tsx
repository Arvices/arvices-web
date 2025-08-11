import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
let backendUrl = "https://arvicesapigateway.denateonlineservice.com/";

// Define the shape of the context value
interface SocketContextType {
  notificationsSocket: Socket | null;
  messagesSocket: Socket | null;
}

// Create a context with an initial value of null
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Custom hook to use the SocketContext
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Define the Props type for the provider
interface SocketProviderProps {
  children: ReactNode;
}

// Socket Provider component that wraps your app
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const auth = useAuth();
  const [notificationsSocket, setNotificationsSocket] = useState<Socket | null>(
    null,
  );
  const [messagesSocket, setMessagesSocket] = useState<Socket | null>(null);
  useEffect(() => {
    // Initialize the socket connection
    if (!auth.isAuthenticated) {
      console.log("cannot connect socket until user logs in");
      return;
    }

    const notifications = io(`${backendUrl}notificationgateway`, {
      extraHeaders: {
        authorization: `bearer ${auth.token}`,
      },
    });

    const messages = io(`${backendUrl}messagegateway`, {
      extraHeaders: {
        authorization: `bearer ${auth.token}`,
      },
    });

    notifications.on("connect", () =>
      console.log("Connected to /notificationgateway"),
    );
    messages.on("connect", () => console.log("Connected to /messagegateway"));

    setNotificationsSocket(notifications);
    setMessagesSocket(messages);

    // Clean up the connection when the component unmounts
    return () => {
      notifications.disconnect();
      messages.disconnect();
    };
  }, [auth.isAuthenticated]);

  return (
    <SocketContext.Provider value={{notificationsSocket,messagesSocket}}>
      {children}
    </SocketContext.Provider>
  );
};
