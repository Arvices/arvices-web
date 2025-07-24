import React from "react";
import { useState } from "react";
import {
  X,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  Search,
  ArrowLeft,
} from "feather-icons-react";

import imgShape from "../../assets/images/pro-sample-img.png";

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
  avatar?: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isOnline: boolean;
}

const Conversations = (): React.ReactNode => {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Ashabi Lane",
      lastMessage: "Hi, I thought you could do..",
      time: "4m",
      unread: 2,
      avatar: imgShape,
      isOnline: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      lastMessage: "Perfect! When can we schedule?",
      time: "12m",
      unread: 0,
      avatar: imgShape,
      isOnline: true,
    },
    {
      id: "3",
      name: "Mike Chen",
      lastMessage: "Thanks for the excellent service!",
      time: "1h",
      unread: 1,
      avatar: imgShape,
      isOnline: false,
    },
    {
      id: "4",
      name: "Emma Williams",
      lastMessage: "Could you send me the quote?",
      time: "2h",
      unread: 0,
      avatar: imgShape,
      isOnline: true,
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      sender: "Ashabi Lane",
      content:
        "Hi! I saw your work on the platform and I'm really impressed. 💫",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      content: "Thank you so much! I'd love to help with your project. ✨",
      time: "10:32 AM",
      isOwn: true,
    },
    {
      id: "3",
      sender: "Ashabi Lane",
      content:
        "I need a makeup artist for a wedding event this weekend. Are you available?",
      time: "10:35 AM",
      isOwn: false,
    },
    {
      id: "4",
      sender: "You",
      content:
        "Yes, I'm available! I specialize in bridal makeup. Let me know the details 💄",
      time: "10:36 AM",
      isOwn: true,
    },
    {
      id: "5",
      sender: "Ashabi Lane",
      content:
        "Perfect! The venue is in downtown and the ceremony starts at 2 PM. What's your rate?",
      time: "10:40 AM",
      isOwn: false,
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("");
    }
  };

  return (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Page Starts*/}
        <div className="w-full flex">
          {/* Conversations List */}
          <div
            className={`${selectedConversation ? "hidden md:flex" : "flex"} border-l border-r border-gray-200 w-full md:w-1/3 flex-col  `}
          >
            {/* Header */}
            <div className="p-6 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Messages
                </h2>
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

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedConversation === conversation.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white/80 hover:bg-white text-gray-900 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-medium truncate ${selectedConversation === conversation.id ? "text-white" : "text-gray-900"}`}
                        >
                          {conversation.name}
                        </h3>
                        <span
                          className={`text-xs ${selectedConversation === conversation.id ? "text-white/80" : "text-gray-500"}`}
                        >
                          {conversation.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm truncate ${selectedConversation === conversation.id ? "text-white/90" : "text-gray-600"}`}
                        >
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <div className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] text-center">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={`${selectedConversation ? "flex" : "hidden md:flex"} w-full md:w-2/3 flex-col`}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r bg-gray-400 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                          <img
                            src={imgShape}
                            alt="Ashabi Lane"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-medium">Ashabi Lane</h3>
                        <p className="text-sm text-white/80">Active now</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-purple-50/30">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${message.isOwn ? "order-2" : "order-1"}`}
                      >
                        <div
                          className={`p-4 rounded-2xl shadow-sm ${
                            message.isOwn
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md"
                              : "bg-white text-gray-900 rounded-bl-md border border-gray-100"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                        <p
                          className={`text-xs mt-1 ${message.isOwn ? "text-right text-gray-500" : "text-left text-gray-500"}`}
                        >
                          {message.time}
                        </p>
                      </div>
                      {!message.isOwn && (
                        <div className="order-1 mr-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img
                              src={imgShape}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  <div className="flex justify-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={imgShape}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
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
                        placeholder="Type a cute message... 💕"
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
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
            ) : (
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
        </div>
      </div>
    </section>
  );
};

export function ModernMessaging({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Ashabi Lane",
      lastMessage: "Hi, I thought you could do..",
      time: "4m",
      unread: 2,
      avatar: imgShape,
      isOnline: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      lastMessage: "Perfect! When can we schedule?",
      time: "12m",
      unread: 0,
      avatar: imgShape,
      isOnline: true,
    },
    {
      id: "3",
      name: "Mike Chen",
      lastMessage: "Thanks for the excellent service!",
      time: "1h",
      unread: 1,
      avatar: imgShape,
      isOnline: false,
    },
    {
      id: "4",
      name: "Emma Williams",
      lastMessage: "Could you send me the quote?",
      time: "2h",
      unread: 0,
      avatar: imgShape,
      isOnline: true,
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      sender: "Ashabi Lane",
      content:
        "Hi! I saw your work on the platform and I'm really impressed. 💫",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      content: "Thank you so much! I'd love to help with your project. ✨",
      time: "10:32 AM",
      isOwn: true,
    },
    {
      id: "3",
      sender: "Ashabi Lane",
      content:
        "I need a makeup artist for a wedding event this weekend. Are you available?",
      time: "10:35 AM",
      isOwn: false,
    },
    {
      id: "4",
      sender: "You",
      content:
        "Yes, I'm available! I specialize in bridal makeup. Let me know the details 💄",
      time: "10:36 AM",
      isOwn: true,
    },
    {
      id: "5",
      sender: "Ashabi Lane",
      content:
        "Perfect! The venue is in downtown and the ceremony starts at 2 PM. What's your rate?",
      time: "10:40 AM",
      isOwn: false,
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Conversations List */}
        <div
          className={`${selectedConversation ? "hidden md:flex" : "flex"} w-full md:w-1/3 flex-col bg-gradient-to-br from-purple-50 to-pink-50 border-r border-purple-100`}
        >
          {/* Header */}
          <div className="p-6 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
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

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedConversation === conversation.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-white/80 hover:bg-white text-gray-900 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-medium truncate ${selectedConversation === conversation.id ? "text-white" : "text-gray-900"}`}
                      >
                        {conversation.name}
                      </h3>
                      <span
                        className={`text-xs ${selectedConversation === conversation.id ? "text-white/80" : "text-gray-500"}`}
                      >
                        {conversation.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm truncate ${selectedConversation === conversation.id ? "text-white/90" : "text-gray-600"}`}
                      >
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <div className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] text-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${selectedConversation ? "flex" : "hidden md:flex"} w-full md:w-2/3 flex-col`}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                        <img
                          src={imgShape}
                          alt="Ashabi Lane"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Ashabi Lane</h3>
                      <p className="text-sm text-white/80">Active now</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-purple-50/30">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] ${message.isOwn ? "order-2" : "order-1"}`}
                    >
                      <div
                        className={`p-4 rounded-2xl shadow-sm ${
                          message.isOwn
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md"
                            : "bg-white text-gray-900 rounded-bl-md border border-gray-100"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      <p
                        className={`text-xs mt-1 ${message.isOwn ? "text-right text-gray-500" : "text-left text-gray-500"}`}
                      >
                        {message.time}
                      </p>
                    </div>
                    {!message.isOwn && (
                      <div className="order-1 mr-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src={imgShape}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                <div className="flex justify-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={imgShape}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
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
                      placeholder="Type a cute message... 💕"
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
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
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
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
      </div>
    </div>
  );
}

export default Conversations;
