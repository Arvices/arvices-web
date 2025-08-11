import React from "react";

import { useState } from "react";
import { Bell, Star, Clock, Check, Search } from "feather-icons-react";

import imgShape from "../../assets/images/pro-sample-img.png";
import { Pagination } from "../../components/pagination";
import { useNotificationRealtime } from "../../contexts/Realtime_Notification";
import {
  ArviceNotification,
  ArviceNotificationRequestPayload,
} from "../../store/notificationSlice";
import { useAuth } from "../../contexts/AuthContext";
import { ContentHOC } from "../../components/nocontent";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import moment from "moment";

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
  let auth = useAuth();
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = useSelector(
    (state: RootState) => state.notification.notifications,
  );
  console.log({ notifications });

  const notificationRealtime = useNotificationRealtime();

  const markAsRead = (id: string) => {
    console.log({ id });
  };

  const markAllAsRead = () => {};

  const filteredNotifications = notifications?.filter((notif) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notif.read) ||
      (filter === "important" &&
        ["offer", "booking"].includes(notif.meta_type));

    const matchesSearch =
      notif?.header?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif?.message?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationStyle = (notif: ArviceNotification) => {
    if (!notif.read) {
      return "bg-gray-50 border border-gray-200 hover:bg-gray-100";
    }

    return "bg-white border border-gray-100 hover:bg-gray-50";
  };

  const getIconStyle = (color: string) => {
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
      colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-600"
    );
  };

  return (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto mb-10">
        {/* Page Starts*/}

        <button
          onClick={() => {
            let payload: ArviceNotificationRequestPayload = {
              header: "Title",
              message: "Body",
              userId: auth?.user?.id || -1,
            };
            notificationRealtime.sendNotification(payload);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
        >
          <Check className="w-4 h-4" />
          Trigger Notification
        </button>

        <button
          onClick={() => {
            notificationRealtime.getNotifications();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
        >
          <Check className="w-4 h-4" />
          Trigger getNotifications
        </button>

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

          <ContentHOC
            loading={notificationRealtime.notificationLoading}
            error={!!notificationRealtime.notificationError}
            errMessage={notificationRealtime.notificationError || ""}
            actionFn={notificationRealtime.getNotifications}
            noContent={false}
            minHScreen={false}
            UIComponent={
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
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer group ${getNotificationStyle(notification)} ${!notification.read ? "shadow-sm" : ""}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar and Icon */}
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                              <img
                                src={imgShape}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${getIconStyle("amber")} shadow-sm`}
                            >
                              {<Star className="w-4 h-4" />}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                                {notification.header}
                              </h3>
                              <div className="flex items-center gap-2 ml-4">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {moment(notification.createdAt).fromNow()}
                                </span>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-2">
                              {notification.message}
                            </p>
                            {!notification.read && (
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
            }
          />

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
