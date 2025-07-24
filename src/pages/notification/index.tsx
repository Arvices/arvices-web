import React from "react";

import { useState } from "react";
import {
  Bell,
  Heart,
  MessageCircle,
  Star,
  Clock,
  Zap,
  Award,
  Calendar,
  UserPlus,
  Check,
  Search,
  X,
} from "feather-icons-react";

import imgShape from "../../assets/images/pro-sample-img.png";
import { Pagination } from "../../components/pagination";

interface Notification {
  id: string;
  type:
    | "offer"
    | "message"
    | "follow"
    | "like"
    | "booking"
    | "achievement"
    | "system";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar?: string;
  icon?: React.ReactNode;
  color?: string;
}

const Notification = (): React.ReactNode => {
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "offer",
      title: "New Service Offer! 💼",
      message:
        'An offer was made for your recent post "I need a plumber for bathroom renovation"',
      time: "2 hours ago",
      isRead: false,
      avatar: imgShape,
      icon: <Star className="w-4 h-4" />,
      color: "amber",
    },
    {
      id: "2",
      type: "message",
      title: "New Message from Sarah ✨",
      message:
        "Hey! I loved your makeup work. Could we schedule a consultation?",
      time: "4 hours ago",
      isRead: false,
      avatar: imgShape,
      icon: <MessageCircle className="w-4 h-4" />,
      color: "blue",
    },
    {
      id: "3",
      type: "follow",
      title: "New Follower! 🎉",
      message:
        "Mike Chen started following you. Check out his automotive services!",
      time: "6 hours ago",
      isRead: true,
      avatar: imgShape,
      icon: <UserPlus className="w-4 h-4" />,
      color: "green",
    },
    {
      id: "4",
      type: "like",
      title: "Your post is trending! 💕",
      message: "Your makeup transformation post got 50+ likes in the last hour",
      time: "8 hours ago",
      isRead: false,
      avatar: imgShape,
      icon: <Heart className="w-4 h-4" />,
      color: "pink",
    },
    {
      id: "5",
      type: "booking",
      title: "Booking Reminder 📅",
      message: "You have a bridal makeup appointment tomorrow at 2:00 PM",
      time: "12 hours ago",
      isRead: true,
      avatar: imgShape,
      icon: <Calendar className="w-4 h-4" />,
      color: "purple",
    },
    {
      id: "6",
      type: "achievement",
      title: "Milestone Unlocked! 🏆",
      message: "Congratulations! You've completed 50 successful bookings",
      time: "1 day ago",
      isRead: true,
      avatar: imgShape,
      icon: <Award className="w-4 h-4" />,
      color: "orange",
    },
    {
      id: "7",
      type: "system",
      title: "Profile Boost Available ⚡",
      message: "Boost your profile visibility with our premium features",
      time: "2 days ago",
      isRead: true,
      avatar: imgShape,
      icon: <Zap className="w-4 h-4" />,
      color: "indigo",
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notif.isRead) ||
      (filter === "important" && ["offer", "booking"].includes(notif.type));

    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationStyle = (notif: Notification) => {
    if (!notif.isRead) {
      return "bg-gray-50 border border-gray-200 hover:bg-gray-100";
    }

    return "bg-white border border-gray-100 hover:bg-gray-50";
  };

  const getIconStyle = (notif: Notification) => {
    const colorMap = {
      amber: "bg-amber-100 text-amber-600",
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      pink: "bg-pink-100 text-pink-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      indigo: "bg-indigo-100 text-indigo-600",
    };

    return (
      colorMap[notif.color as keyof typeof colorMap] ||
      "bg-gray-100 text-gray-600"
    );
  };

  return (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto mb-10">
        {/* Page Starts*/}
        <div className="w-full overflow-hidden flex flex-col">
          {/* Header */}
          <div className="mt-10 p-6 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="hidden sm:block p-2 bg-white/20 rounded-full">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Notifications</h2>
                  <p className="text-white/80 text-sm">
                    Stay updated with your latest activity
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search (Mobile Only) */}
              <div className="sm:hidden flex w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notifications..."
                    className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-full placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>

              {/* Search (Desktop Only) & Filters */}
              <div className="flex w-full items-center gap-4 justify-center">
                {/* Search (Desktop Only) */}
                <div className="hidden sm:block flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notifications..."
                    className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-full placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 text-xs sm:text-[16px]">
                  {(["all", "unread", "important"] as const).map(
                    (filterType) => (
                      <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          filter === filterType
                            ? "bg-white text-purple-600"
                            : "bg-white/20 hover:bg-white/30 text-white"
                        }`}
                      >
                        {filterType === "all" && "All"}
                        {filterType === "unread" && `Unread (${unreadCount})`}
                        {filterType === "important" && "Important"}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{filteredNotifications.length} notifications</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  {unreadCount} unread
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {notifications.length - unreadCount} read
                </span>
              </div>
            </div>
          </div>
          {/* Notifications List */}
          <div className="mt-0">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-600">
                  {filter === "unread"
                    ? "All caught up! You have no unread notifications."
                    : searchQuery
                      ? "Try adjusting your search terms."
                      : "Your notifications will appear here."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer group ${getNotificationStyle(notification)} ${!notification.isRead ? "shadow-sm" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar and Icon */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <img
                            src={notification.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${getIconStyle(notification)} shadow-sm`}
                        >
                          {notification.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.time}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-medium rounded-full transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Stats */}
        </div>
        <div className="mt-5 flex justify-center">
          <Pagination
            totalPages={10}
            currentPage={1}
            onPageChange={() => console.log("page changed")}
          />
        </div>
      </div>
    </section>
  );
};

export default Notification;
