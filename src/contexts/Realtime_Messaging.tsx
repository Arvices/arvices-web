import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSocket } from "./SocketContext";
import { useDispatch } from "react-redux"; // adjust import
import { getAllUserConversations } from "../api-services/messageservice";
import { useAuth } from "./AuthContext";
import { parseHttpError } from "../api-services/parseReqError";
import { addMessage, Message, setConversations } from "../store/messageSlice";
import { useNotificationContext } from "./NotificationContext";
import { UserAccount } from "../api-services/auth";

export interface ArviceMessage {
  message: string;
  userId: number;
  toUserId: number;
  file?: string[] | null;
  fileName?: string[] | null;
  user?: UserAccount;
  toUser?: UserAccount;
}

interface MessageRealtimeContextType {
  loadUserConversations: () => Promise<void>;
  sendMessage: (data: ArviceMessage) => Promise<void> | void;
  conversationLoadError: string;
  conversationsLoading: boolean;
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
  const auth = useAuth();
  const { openNotification } = useNotificationContext();
  const dispatch = useDispatch();

  const [conversationLoadError, setConversationLoadError] = useState("");
  const [conversationsLoading, setConversationsLoading] = useState(false);

  const loadUserConversations = async () => {
    setConversationsLoading(true);
    setConversationLoadError("");

    try {
      const response = await getAllUserConversations(
        auth?.user?.id as number,
        "",
        auth.token,
      );
      let conversations = response.data.response;
      console.log({ conversations });

      console.log("Conversations:", conversations);
      dispatch(setConversations(conversations));
      if (conversations.length === 0) {
        openNotification("topRight", "No messages to show", "", "info");
        return;
      }
    } catch (error) {
      const message = parseHttpError(error);
      setConversationLoadError(message);
    } finally {
      setConversationsLoading(false);
    }
  };

  const sendMessage = async (data: ArviceMessage) => {
    console.log({ message: true, payload: data });
    if (messagesSocket) {
      messagesSocket.emit("sendmessage", data);
    }
  };

  useEffect(() => {
    if (auth?.user?.id) {
      loadUserConversations();
    }
  }, [auth.user]);

  useEffect(() => {
    if (!messagesSocket) return;

    // Example: listen to new messages

    messagesSocket.on("messagesuccessful", (data: Message) => {
      dispatch(
        addMessage({ conversationId: String(data.toUser.id), message: data }),
      );
    });

    messagesSocket.on("messagesent", (data: Message) => {
      dispatch(
        addMessage({ conversationId: String(data?.user?.id), message: data }),
      );
    });

    return () => {
      messagesSocket.off("messagesent");
      messagesSocket.off("messagesuccessful");
    };
  }, [messagesSocket, dispatch]);

  return (
    <MessageRealtimeContext.Provider
      value={{
        loadUserConversations,
        sendMessage,
        conversationLoadError,
        conversationsLoading,
      }}
    >
      {children}
    </MessageRealtimeContext.Provider>
  );
};
