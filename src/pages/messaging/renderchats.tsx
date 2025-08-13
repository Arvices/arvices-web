import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {
  Send,
  Smile,
  Paperclip,
  MoreHorizontal,
  ArrowLeft,
} from "feather-icons-react";

import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArviceMessage,
  useMessageRealtime,
} from "../../contexts/Realtime_Messaging";
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  Conversation,
  setConversations,
  setMessages,
  updateUnreadCount,
} from "../../store/messageSlice";
import moment from "moment";
import {
  getAllMessagesInUserConversation,
  getUserConversation,
  updateMessageToRead,
} from "../../api-services/messageservice";
import { parseHttpError } from "../../api-services/parseReqError";
import { getInitials } from "../../util/getInitials";
import { reverseArray } from "../util/arrayUils";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { generateConversation } from "../../util/mainutils";
import { getAccountById } from "../../api-services/auth-re";
import { UserAccount } from "../../api-services/auth";

const RenderChats: React.FC = () => {
  const auth = useAuth();
  const [SearchParam] = useSearchParams();
  const { openNotification } = useNotificationContext();
  const chattingWith = SearchParam.get("with");
  const userId = Number(auth?.user?.id);
  const toUser = Number(chattingWith);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messageRealTime = useMessageRealtime();

  const conversations = useSelector(
    (state: RootState) => state.message.conversations,
  );

  const messages = useSelector((state: RootState) => state.message.messages);
  console.log({ messages });
  let userConvoMessages = messages[Number(chattingWith)] || [];
  let reversed = reverseArray(userConvoMessages);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversationLoading, setConversationLoading] =
    useState<boolean>(false);
  const [conversationError, setConversationError] = useState("");

  const unreadMessages = userConvoMessages.filter((x) => !x.read);

  const readMessage = async (messageId: number) => {
    await updateMessageToRead(messageId, auth.token);
  };

  const lastMessageByMe =
    conversation?.lastmessage?.user?.id === auth?.user?.id;

  console.log({ lastMessageByMe, unreadMessages, lastMessage: conversation?.lastmessage, userid: auth?.user?.id });

  useEffect(() => {
    // Only proceed if the user is authenticated and there are unread messages to process.
    if (auth.user && unreadMessages.length > 0 && !lastMessageByMe) {
      // Collect all the promises from the updateMessageToRead calls
      const updatePromises = unreadMessages.map((message) =>
        readMessage(message.id),
      );

      // Wait for all messages to be marked as read
      Promise.all(updatePromises)
        .then(() => {
          console.log("All unread messages have been marked as read.");
          dispatch(updateUnreadCount({conversationId: conversation?.id ? conversation.id : -1, count: 0}))
        })
        .catch((error) => {
          console.error("Failed to mark all messages as read:", error);
        });
    }
  }, [auth.user, messages]);

  const fetchConversation = async () => {
    setConversationError("");
    try {
      if (!chattingWith) return;
      setConversationLoading(true);
      console.log("Fetching user convo:", auth.user);
      let userId = Number(auth?.user?.id);
      const toUser = Number(chattingWith);
      console.log({ userId, toUser });
      const response = await getUserConversation(userId, toUser, auth.token);
      let data = response.data.response;
      console.log("Retrieved by id", response);
      setConversation(data);
      fetchMessages();
    } catch (error) {
      const message = parseHttpError(error);
      if (message === "conversation not found") {
        // if not found. then trigger the initialization.
        // first fetch user.
        initializeConversation();
      } else {
        openNotification("topRight", message.toString(), "", "error");
        setConversationError(message);
      }

      console.error("Failed to fetch conversation:", error);
    } finally {
      setConversationLoading(false);
    }
  };

  // FUNCTIONAL SCOPE OF THE MESSAGING.
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState("");

  const fetchMessages = async () => {
    setMessagesError("");
    try {
      if (!chattingWith) return;
      setMessagesLoading(true);
      const response = await getAllMessagesInUserConversation(
        auth.user?.id || -1,
        Number(chattingWith),
        { page: 1, limit: 30 },
        auth.token,
      );
      let messagesData = response.data.response;
      dispatch(
        setMessages({
          conversationId: String(chattingWith),
          messages: messagesData,
        }),
      );
      console.log("Fetched Messages : -", messagesData);
    } catch (error) {
      const message = parseHttpError(error);
      setMessagesError(message);
      console.error("Failed to fetch messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const [initializeError, setInitializeError] = useState("");
  const [initializeLoading, setInitializeLoading] = useState(false);

  const initializeConversation = async () => {
    setInitializeLoading(true);
    setInitializeError("");

    try {
      console.log({ initializingConversation: true });

      const response = await getAccountById(
        chattingWith ? chattingWith : "",
        auth.token,
      );

      const data = response.data.response as UserAccount;
      console.log({ userData: data, response });

      const newConvo = generateConversation(
        Number(chattingWith),
        new Date().toDateString(),
        data.fullName,
        data.picture,
        null,
      );

      dispatch(setConversations([newConvo]));
      setConversation(newConvo);
    } catch (error: any) {
      console.error("Error initializing conversation:", error);
      setInitializeError(
        error?.response?.data?.message || error.message || "An error occurred",
      );
    } finally {
      setInitializeLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() && newMessage.trim().length === 0) {
      // Add message logic here
      return;
    }
    let payload: ArviceMessage = {
      message: newMessage,
      userId: Number(auth?.user?.id),
      toUserId: Number(chattingWith),
      file: ["string"],
      fileName: ["string"],
    };
    messageRealTime.sendMessage(payload);
    setNewMessage("");
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    console.log({ userId, toUser });
    if (chattingWith) {
      // check the conversations and check it i'm already chatting with that user.
      let existingConvo = conversations.find((convo) => {
        return Number(convo.id) === toUser;
      });
      if (existingConvo) {
        setConversation(existingConvo);
        let userConvoMessages = messages[Number(chattingWith)] || [];
        if (userConvoMessages.length == 0) {
          fetchMessages();
        }
      } else if (!Number.isNaN(userId) && !Number.isNaN(toUser)) {
        fetchConversation();
      }
    }
  }, [chattingWith, auth.user]);

  console.log({ conversationLoading, messagesLoading, initializeLoading });

  return (
    <div
      className={`${Number(chattingWith) ? "flex" : "hidden md:flex"}  h-[calc(100vh-60px)] overflow-y-auto w-full md:w-2/3 flex-col`}
    >
      {conversationLoading && (
        <ChatReqLoading message={"Fetching conversation details..."} />
      )}
      {initializeLoading && (
        <ChatReqLoading message={"Initializing chat, please wait..."} />
      )}

      {conversationError && (
        <ChatReqErrorView
          message="Failed to load conversation details. Please try again."
          reloadBtnText="Reload Conversation"
          reloadFunction={fetchConversation}
        />
      )}
      {initializeError && (
        <ChatReqErrorView
          message="There was a problem starting this chat. Please try again."
          reloadBtnText="Re-Start Conversation"
          reloadFunction={initializeConversation}
        />
      )}
      {chattingWith &&
        !conversationLoading &&
        !conversationError &&
        !initializeLoading &&
        !initializeError &&
        conversation && (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r bg-gray-400 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => goBack()}
                    className="md:hidden p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-gray-200 text-gray-800 font-semibold text-sm">
                      <span>{getInitials(conversation.fullName || "")}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium">{conversation.fullName}</h3>
                    <p className="text-sm text-white/80">
                      Loading user active status
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-purple-50/30"
            >
              {messagesLoading && (
                <ChatReqLoading message={"Loading messages..."} />
              )}

              {messagesError && (
                <ChatReqErrorView
                  message="Couldn't retrieve messages for this conversation."
                  reloadBtnText="Reload Messages"
                  reloadFunction={fetchMessages}
                />
              )}

              {!messagesLoading &&
                !messagesError &&
                userConvoMessages &&
                reversed.map((message) => {
                  let isOwn = message.user.id === auth?.user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}
                      >
                        <div
                          className={`p-4 rounded-2xl shadow-sm ${
                            isOwn
                              ? "bg-gradient-to-r bg-royalblue-tint3 text-white rounded-br-md"
                              : "bg-white text-gray-900 rounded-bl-md border border-gray-100"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.message}
                          </p>
                        </div>
                        <p
                          className={`text-xs mt-1 ${isOwn ? "text-right text-gray-500" : "text-left text-gray-500"}`}
                        >
                          {moment(message.createdDate).fromNow()}
                        </p>
                      </div>
                      {!isOwn && (
                        <div className="order-1 mr-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-gray-200 text-gray-800 font-semibold text-sm">
                              <span>
                                {getInitials(conversation.fullName || "")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Typing indicator */}
              <div className="hidden justify-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-gray-200 text-gray-800 font-semibold text-sm">
                      <span>{getInitials(conversation.fullName || "")}</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-bl-md border border-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="flex items-end gap-3">
                <button className="p-3 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded-full transition-all duration-200">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter Message"
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-purple-500 transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}

      {!chattingWith && (
        /* Empty State */<div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
  <div className="w-full h-full bg-gray-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M16 10h.01M12 16h.01M21 12c0-4.418-4.03-8-9-8s-9 3.582-9 8c0 1.58.623 3.037 1.623 4.237L3 21l3.523-1.077A9.003 9.003 0 0012 21c4.97 0 9-3.582 9-8z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
      Select a conversation
    </h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm">
      Choose from your existing conversations to start chatting.
    </p>
  </div>
</div>
      )}
    </div>
  );
};

export default RenderChats;

interface ChatReqLoadingProps {
  message: string;
}

const ChatReqLoading: React.FC<ChatReqLoadingProps> = ({ message }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 h-full">
      <div className="w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-slate-500 dark:text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356-2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2.126M15 15H9"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
          Loading
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
      </div>
    </div>
  );
};

interface ChatReqErrorViewProps {
  message: string;
  reloadFunction: () => void;
  reloadBtnText: string;
}

const ChatReqErrorView: React.FC<ChatReqErrorViewProps> = ({
  message,
  reloadFunction,
  reloadBtnText,
}) => {
  return (
    <div className="flex-1 h-full p-4 flex items-center justify-center">
      <div className="w-full h-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600 dark:text-red-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.994-1.85L21 17V7c0-1.054-.816-1.918-1.85-1.994L19 5H5c-1.054 0-1.918.816-1.994 1.85L3 7v10c0 1.054.816 1.918 1.85 1.994L5 19z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
          Something went wrong
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
        <button
          className="px-4 py-2 mt-2 font-medium text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-slate-400 dark:focus:ring-slate-600"
          onClick={reloadFunction}
        >
          {reloadBtnText}
        </button>
      </div>
    </div>
  );
};
