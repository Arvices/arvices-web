import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSocket } from "./SocketContext";
import { useDispatch } from "react-redux"; // adjust import

interface MessageRealtimeContextType {
  latestMessage: any | null;
}

const MessageRealtimeContext = createContext<
  MessageRealtimeContextType | undefined
>(undefined);

export const useMessageRealtime = (): MessageRealtimeContextType => {
  const context = useContext(MessageRealtimeContext);
  if (!context) {
    throw new Error(
      "useMessageRealtime must be used within MessageRealtimeProvider",
    );
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const MessageRealtimeProvider: React.FC<Props> = ({ children }) => {
  const { messagesSocket } = useSocket();
  const [latestMessage, setLatestMessage] = useState<any | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!messagesSocket) return;

    // Example: listen to new messages

    messagesSocket.on("messagesuccessful", (data) => {
      console.log("Received message:", data);
      setLatestMessage(data);
    });

    messagesSocket.on("messagesent", (data) => {
      console.log("Received message:", data);
      setLatestMessage(data);
    });

    return () => {
      messagesSocket.off("messagesent");
      messagesSocket.off("messagesuccessful");
    };
  }, [messagesSocket, dispatch]);

  return (
    <MessageRealtimeContext.Provider value={{ latestMessage }}>
      {children}
    </MessageRealtimeContext.Provider>
  );
};
