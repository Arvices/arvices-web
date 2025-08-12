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
import { Conversation, setMessages } from "../../store/messageSlice";
import moment from "moment";
import {
  getAllMessagesInUserConversation,
  getUserConversation,
} from "../../api-services/messageservice";
import { parseHttpError } from "../../api-services/parseReqError";
import { getInitials } from "../../util/getInitials";
import { reverseArray } from "../util/arrayUils";

const RenderChats: React.FC = () => {
  const auth = useAuth();
  const [SearchParam] = useSearchParams();
  const chattingWith = SearchParam.get("with");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messageRealTime = useMessageRealtime();
  
  const conversations = useSelector(
    (state: RootState) => state.message.conversations,
  );

  // FUNCTIONAL SCOPE OF THE MESSAGING.

  const messages = useSelector((state: RootState) => state.message.messages);
  console.log({ messages });

  let userConvoMessages = messages[Number(chattingWith)] || [];
  let reversed = reverseArray(userConvoMessages);

  const [conversation, setConversation] = useState<Conversation | null>(null);

  const [conversationLoading, setConversationLoading] =
    useState<boolean>(false);
  const [conversationError, setConversationError] = useState("");
  console.log({conversationError})

  // New state for messages
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState("");

  const fetchConversation = async () => {
    setConversationError("");
    try {
      if (!chattingWith) return;
      setConversationLoading(true);
      console.log("Fetching user convo:", auth.user);
      const response = await getUserConversation(
        Number(auth?.user?.id),
        Number(chattingWith),
        auth.token,
      );
      let data = response.data.response;
      console.log("Retrieved by id", response);
      setConversation(data);
    } catch (error) {
      const message = parseHttpError(error)
      if(message === 'conversation not found'){

      }
      else {
        
      }
      setConversationError(message);

      console.error("Failed to fetch conversation:", error);
    } finally {
      setConversationLoading(false);
    }
  };

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

  // Example of using the fetch functions
  useEffect(() => {
    if (auth.user) {
      fetchConversation();
      fetchMessages();
    }
  }, [chattingWith, auth.user]);

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

  useEffect(() => {
    if (chattingWith) {
      // check the conversations and check it i'm already chatting with that user.

      let existingConvo = conversations.find((convo) => {
        console.log(
          "Conversation ID in find:",
          convo.id,
          "Chatting With in find:",
          chattingWith,
        );

        return Number(convo.id) === parseInt(chattingWith);
      });
      console.log({ existingConvo });
      if (existingConvo) {
        setConversation(existingConvo);
      } else {
        fetchConversation();
      }
    }
  }, [chattingWith]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`${Number(chattingWith) ? "flex" : "hidden md:flex"}  h-[calc(100vh-60px)] overflow-y-auto w-full md:w-2/3 flex-col`}
    >
        
      {(conversationLoading || messagesLoading) && (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 m-10 border border-gray-300 rounded">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <span className="text-3xl">⏳</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Loading conversations...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your conversation and messages.
            </p>
          </div>
        </div>
      )}

      {chattingWith &&
        !conversationLoading &&
        !messagesLoading &&
        conversation &&
        !messagesError && (
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
            <div  ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-purple-50/30">
              {userConvoMessages &&
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
        /* Empty State */
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 m-10 border border-gray-300 rounded">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-600">
              Choose from your existing conversations to start chatting!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderChats;
