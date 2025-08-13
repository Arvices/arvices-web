import React from "react";
import { Search } from "feather-icons-react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useMessageRealtime } from "../../contexts/Realtime_Messaging";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import moment from "moment";
import { getInitials } from "../../util/getInitials";
import { useAuth } from "../../contexts/AuthContext";

const RenderConversations: React.FC = () => {
  let auth = useAuth();
  const [SearchParam] = useSearchParams();
  const chattingWith = SearchParam.get("with");
  const navigate = useNavigate();
  const messageRealTime = useMessageRealtime();
  const conversations = useSelector(
    (state: RootState) => state.message.conversations,
  );

  let isOnline = true;

  const goToConversation = (id: number) => {
    let url = `/messaging/conversations?with=${id}`;
    navigate(url);
  };

  return (
    <div
      className={`${chattingWith ? "hidden md:flex" : "flex"} h-[calc(100vh-60px)] overflow-y-auto border-l border-r border-gray-200 w-full md:w-1/3 flex-col  `}
    >
      {/* Header */}
      <div className="p-6 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
      {messageRealTime.conversationsLoading && (
        <div className="flex-1 h-full p-4">
          <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-500 dark:border-neutral-700 dark:border-t-neutral-300 rounded-full animate-spin" />
              <p className="text-neutral-500 text-sm">
                Loading conversations...
              </p>
            </div>
          </div>
        </div>
      )}
      {!messageRealTime.conversationsLoading &&
        messageRealTime.conversationLoadError && (
          <div className="flex-1 h-full p-4">
            <div className="w-full h-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600 dark:text-red-300"
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
              <p className="text-slate-700 dark:text-slate-300 font-medium text-center max-w-sm">
                {messageRealTime.conversationLoadError}
              </p>
              <button
                className="px-4 py-2 mt-2 w-full font-medium text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-slate-400 dark:focus:ring-slate-600"
                onClick={messageRealTime.loadUserConversations}
              >
                Reload Conversations
              </button>
            </div>
          </div>
        )}
      {!messageRealTime.conversationsLoading &&
        !messageRealTime.conversationLoadError &&
        conversations.length === 0 && (
          <div className="flex-1 h-full p-4">
            <div className="w-full h-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-600 dark:text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium text-center max-w-sm">
                No conversations available.
              </p>
              <button
                className="px-4 py-2 mt-2 font-medium text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-slate-400 dark:focus:ring-slate-600"
                onClick={messageRealTime.loadUserConversations}
              >
                Reload
              </button>
            </div>
          </div>
        )}
      {!messageRealTime.conversationsLoading &&
        !messageRealTime.conversationLoadError &&
        conversations.length > 0 && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.map((conversation) => {
              
  const lastMessageByMe =
    conversation?.lastmessage?.user?.id === auth?.user?.id;
    console.log("Render conversation", {lastMessageByMe, user: conversation?.lastmessage?.user.fullName})

              return (
              <div
                key={Number(conversation.id)}
                onClick={() => goToConversation(Number(conversation.id))}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                  chattingWith &&
                  Number(chattingWith) === Number(conversation.id)
                    ? "bg-gradient-to-r bg-royalblue-tint3 text-white shadow-lg"
                    : "bg-white/80 hover:bg-white text-gray-900 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-blue-200 flex items-center justify-center">
                      <span className="text-lg font-semibold text-white">
                        {getInitials(conversation.fullName)}{" "}
                        {/* Replace with actual initials */}
                      </span>
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-medium truncate ${Number(chattingWith) === Number(conversation.id) ? "text-white" : "text-gray-900"}`}
                      >
                        {conversation.fullName}
                      </h3>
                      <span
                        className={`text-xs ${Number(chattingWith) === Number(conversation.id) ? "text-white/80" : "text-gray-500"}`}
                      >
                        {moment(
                          conversation?.lastmessage?.createdDate,
                        ).fromNow()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm truncate ${Number(chattingWith) === Number(conversation.id) ? "text-white/90" : "text-gray-600"}`}
                      >
                        {conversation?.lastmessage?.message ||
                          "Start New Conversation"}
                      </p>
                        {conversation.unreadCount !== null && conversation.unreadCount > 0 && !lastMessageByMe && (
                          <div className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
    </div>
  );
};

export default RenderConversations;
