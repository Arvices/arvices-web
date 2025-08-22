import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  TrendingUp,
  UserPlus,
  Percent,
  Star,
  Award,
  Calendar,
  Tool,
  Clock,
  ArrowUpRight,
} from "feather-icons-react";
import { Heart, MessageCircle, Bookmark } from "feather-icons-react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import AttachmentCarousel from "./swipercarousel";

const API_BASE = "https://arvicesapi.denateonlineservice.com";
function getToken(): string | null {
  const candidates = [
    "token",
    "authToken",
    "accessToken",
    "arvices_token",
    "ARVICES_TOKEN",
    "access_token",
  ];
  for (const key of candidates) {
    const v = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (v) return v;
  }
  return null;
}

function getMyIdSafe(): number | null {
  const t = getToken();
  if (!t) return null;
  try {
    const payload = t.split(".")[1];
    if (!payload) return null;
    const norm = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(norm);
    const obj = JSON.parse(json);
    return typeof obj?.id === "number" ? obj.id : null;
  } catch {
    return null;
  }
}

function formatFollowerCount(count: number): string {
  if (count >= 1_000_000)
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (count >= 1_000)
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(count);
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 75%)`;
}
function renderAvatarClickable(
  user: any,
  sizeClass = "w-10 h-10",
  onClick?: (id: number) => void,
) {
  const displayName = user?.fullName || user?.username || "?";
  const letter = displayName[0].toUpperCase();
  const bgColor = stringToColor(displayName);
  const handleClick = () => {
    if (onClick && user?.id) onClick(user.id);
  };
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80`}
      style={{
        backgroundColor: bgColor,
      }}
      onClick={handleClick}
      title={`View ${displayName}'s profile`}
    >
      {letter}
    </div>
  );
}
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    accept: "*/*",
    ...(init?.headers || {}),
  };
  if (token) (headers as any)["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}
async function getAllShowcase(orderBy = "DESC", page = 1, limit = 10) {
  return api<{
    status: number;
    message: string;
    response: any[];
    total: number;
  }>(`/showcase/getallshowcase?orderBy=${orderBy}&page=${page}&limit=${limit}`);
}
async function getComments(showcaseId: number) {
  return api<{
    status: number;
    message: string;
    response: ShowcaseComment[];
  }>(`/showcase/getshowcasecommentbyshowcase/${showcaseId}`);
}
async function createComment(showcaseId: number, post: string) {
  const fd = new FormData();
  fd.append("post", post);
  fd.append("showcaseId", String(showcaseId));
  return api<{
    status: number;
    message: string;
    response: any;
  }>("/showcase/createshowcasecomment", {
    method: "POST",
    body: fd,
  });
}
async function likeComment(commentId: number) {
  return api<{
    status: number;
    message: string;
  }>(`/showcase/likeshowcasecomment/${commentId}`, {
    method: "POST",
  });
}
async function unlikeComment(commentId: number) {
  return api<{
    status: number;
    message: string;
  }>(`/showcase/unlikeshowcasecomment/${commentId}`, {
    method: "POST",
  });
}
async function saveShowcase(showcaseId: number) {
  return api<{
    status: number;
    message: string;
  }>(`/showcase/saveshowcase/${showcaseId}`, {
    method: "POST",
  });
}
async function unsaveShowcase(showcaseId: number) {
  return api<{
    status: number;
    message: string;
  }>(`/showcase/unsaveshowcase/${showcaseId}`, {
    method: "POST",
  });
}
async function createShowcase(post: string, location: string, files: File[]) {
  const fd = new FormData();
  fd.append("post", post);
  fd.append("location", location);
  for (const f of files) fd.append("attachment", f, f.name);
  return api<{
    status: number;
    message: string;
    response: any;
  }>("/showcase/createshowcase", {
    method: "POST",
    body: fd,
  });
}
async function likeShowcase(showcaseId: number) {
  return api<{
    status: number;
    message: string;
  }>(`/showcase/likeshowcase/${showcaseId}`, {
    method: "POST",
  });
}
async function unlikeShowcase(showcaseId: number) {
  return api<{
    status: number;
    message: string;
  }>(`/showcase/unlikeshowcase/${showcaseId}`, {
    method: "POST",
  });
}
async function getTopProfessionals() {
  return api<{
    status: number;
    message: string;
    response: any[];
  }>("/user/gettopprofessionals");
}
async function followUser(userId: number) {
  const token = getToken();
  console.log("Token being sent:", token);
  return api<{
    status: number;
    message: string;
  }>(`/user/followuser/${userId}`, {
    method: "POST",
  });
}
async function unfollowUser(userId: number) {
  const token = getToken();
  console.log("Token being sent:", token);
  return api<{
    status: number;
    message: string;
  }>(`/user/unfollowuser/${userId}`, {
    method: "POST",
  });
}

const updates = [
  {
    updateType: "Live Updates",
    title: "Beauty services trending up 25%",
    description: "Skincare and makeup bookings are rising this week",
  },
  {
    updateType: "New Provider",
    title: "New 5-star rated plumber available",
    description: "Highly rated professional just joined your area",
  },
  {
    updateType: "Promotion",
    title: "Flash sale: Cleaning services 30% off",
    description: "Limited time offer ending tonight",
  },
  {
    updateType: "Milestone",
    title: "Boluwatife Abubakar reached 2k follows",
    description: "Popular makeup artist hits milestone",
  },
  {
    updateType: "Achievement",
    title: "Best rated car mechanic this month",
    description: "AutoFix Pro wins monthly excellence award",
  },
  {
    updateType: "Booking Alert",
    title: "Weekend booking slots filling fast",
    description: "High demand for weekend appointments",
  },
  {
    updateType: "New Feature",
    title: "New service category: Pet Care",
    description: "Find grooming and pet sitting services",
  },
] as const;

export const updateIconMap: Record<
  string,
  {
    icon: React.JSX.Element;
    colorClass: string;
  }
> = {
  "Live Updates": {
    icon: <TrendingUp className="inline w-3 h-3 text-pink-600" />,
    colorClass: "text-pink-600",
  },
  "New Provider": {
    icon: <UserPlus className="inline w-3 h-3 text-blue-600" />,
    colorClass: "text-blue-600",
  },
  Promotion: {
    icon: <Percent className="inline w-3 h-3 text-green-600" />,
    colorClass: "text-green-600",
  },
  Milestone: {
    icon: <Star className="inline w-3 h-3 text-yellow-500" />,
    colorClass: "text-yellow-500",
  },
  Achievement: {
    icon: <Award className="inline w-3 h-3 text-indigo-600" />,
    colorClass: "text-indigo-600",
  },
  "Booking Alert": {
    icon: <Calendar className="inline w-3 h-3 text-red-500" />,
    colorClass: "text-red-500",
  },
  "New Feature": {
    icon: <Tool className="inline w-3 h-3 text-teal-600" />,
    colorClass: "text-teal-600",
  },
};

export type ShowcaseComment = {
  id: number;
  post: string;
  like: number;
  liked: number[];
  commentAttachments: {
    url?: string;
  }[];
  createdDate: string;
  user: {
    id: number;
    fullName?: string | null;
    username?: string | null;
    picture?: string | null;
  };
};
const Activities = (): React.ReactNode => {
  const [showcases, setShowcases] = useState<any[]>([]);
  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const [commentsMap, setCommentsMap] = useState<
    Record<number, ShowcaseComment[]>
  >({});
  const [likedByMeMap, setLikedByMeMap] = useState<Record<number, Set<number>>>(
    {},
  );
  const [showcaseLikedMap, setShowcaseLikedMap] = useState<
    Record<number, boolean>
  >({});
  const [showcaseLikeCount, setShowcaseLikeCount] = useState<
    Record<number, number>
  >({});
  const [commentTextMap, setCommentTextMap] = useState<Record<number, string>>(
    {},
  );
  const [creatingCommentMap, setCreatingCommentMap] = useState<
    Record<number, boolean>
  >({});
  const [visibleCommentsMap, setVisibleCommentsMap] = useState<
    Record<number, boolean>
  >({});
  const [visibleCountMap, setVisibleCountMap] = useState<
    Record<number, number>
  >({});
  const commentRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const myId = useMemo(() => getMyIdSafe(), []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostLocation, setNewPostLocation] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [creatingShowcase, setCreatingShowcase] = useState(false);
  const [topProviders, setTopProviders] = useState<any[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<number, boolean>>({});

  const [followLoadingMap, setFollowLoadingMap] = useState<
    Record<number, boolean>
  >({});
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const [loadingProvider, setLoadingProvider] = useState(false);

  console.log({ showCreateModal, creatingShowcase, setLoadingProvider });
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllShowcase("DESC", 1, 10);
        if (Array.isArray(data.response)) {
          setShowcases(data.response);
          const savedStatus: Record<number, boolean> = {};
          const likedMap: Record<number, Set<number>> = {};
          const showcaseLikeStatus: Record<number, boolean> = {};
          const showcaseLikes: Record<number, number> = {};
          data.response.forEach((sc) => {
            savedStatus[sc.id] =
              Array.isArray(sc.saved) &&
              sc.saved.some((s: any) => s.id === myId);
            likedMap[sc.id] = new Set<number>();
            showcaseLikeStatus[sc.id] =
              Array.isArray(sc.liked) &&
              sc.liked.some((u: any) => u.id === myId);
            showcaseLikes[sc.id] = sc.like || 0;
            refreshComments(sc.id);
          });
          setSavedMap(savedStatus);
          setLikedByMeMap(likedMap);
          setShowcaseLikedMap(showcaseLikeStatus);
          setShowcaseLikeCount(showcaseLikes);
        }
      } catch (err) {
        console.warn("Failed to load showcases", err);
      }
    })();
  }, [myId]);
  useEffect(() => {
    (async () => {
      try {
        const res = await getTopProfessionals();
        const providers = Array.isArray(res.response) ? res.response : [];
        const followingMapFromAPI: Record<number, boolean> = {};
        const seeded = providers.map((p: any) => {
          const isFollowing =
            Array.isArray(p.followers) && p.followers.includes(myId);
          followingMapFromAPI[p.id] = isFollowing;
          return {
            ...p,
            _followersCountLocal: Array.isArray(p.followers)
              ? p.followers.length
              : 0,
          };
        });
        setTopProviders(seeded);
        setFollowingMap(followingMapFromAPI);
      } catch (err) {
        console.warn("Failed to load top professionals / following", err);
      }
    })();
  }, [myId]);
  async function refreshComments(showcaseId: number) {
    try {
      const data = await getComments(showcaseId);
      setCommentsMap((prev) => ({
        ...prev,
        [showcaseId]: Array.isArray(data.response) ? data.response : [],
      }));
    } catch (err) {
      console.warn("Failed to load comments", err);
    }
  }
  function handleViewMore(showcaseId: number) {
    setVisibleCountMap((prev) => ({
      ...prev,
      [showcaseId]: (prev[showcaseId] || 5) + 5,
    }));
  }
  async function handleCreateComment(showcaseId: number) {
    const text = commentTextMap[showcaseId] || "";
    if (!text.trim()) return;
    setCreatingCommentMap((prev) => ({
      ...prev,
      [showcaseId]: true,
    }));
    try {
      await createComment(showcaseId, text.trim());
      setCommentTextMap((prev) => ({
        ...prev,
        [showcaseId]: "",
      }));
      await refreshComments(showcaseId);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to post comment");
    } finally {
      setCreatingCommentMap((prev) => ({
        ...prev,
        [showcaseId]: false,
      }));
    }
  }
  async function toggleLikeComment(
    showcaseId: number,
    comment: ShowcaseComment,
  ) {
    const setForShowcase = likedByMeMap[showcaseId] || new Set<number>();
    const already = setForShowcase.has(comment.id);
    const clone = new Set(setForShowcase);
    if (already) clone.delete(comment.id);
    else clone.add(comment.id);
    setLikedByMeMap((prev) => ({
      ...prev,
      [showcaseId]: clone,
    }));
    setCommentsMap((prev) => ({
      ...prev,
      [showcaseId]: prev[showcaseId].map((c) =>
        c.id === comment.id
          ? {
              ...c,
              like: Math.max(0, (c.like || 0) + (already ? -1 : 1)),
            }
          : c,
      ),
    }));
    try {
      if (already) await unlikeComment(comment.id);
      else await likeComment(comment.id);
    } catch {
      alert("Failed to update like");
    }
  }
  async function toggleLikeShowcase(showcaseId: number) {
    const already = !!showcaseLikedMap[showcaseId];
    setShowcaseLikedMap((p) => ({
      ...p,
      [showcaseId]: !already,
    }));
    setShowcaseLikeCount((p) => ({
      ...p,
      [showcaseId]: Math.max(0, (p[showcaseId] || 0) + (already ? -1 : 1)),
    }));
    try {
      if (already) await unlikeShowcase(showcaseId);
      else await likeShowcase(showcaseId);
    } catch {
      alert("Failed to update showcase like");
      setShowcaseLikedMap((p) => ({
        ...p,
        [showcaseId]: already,
      }));
      setShowcaseLikeCount((p) => ({
        ...p,
        [showcaseId]: Math.max(0, (p[showcaseId] || 0) + (already ? 1 : -1)),
      }));
    }
  }
  async function toggleSave(showcaseId: number) {
    try {
      if (savedMap[showcaseId]) {
        await unsaveShowcase(showcaseId);
        setSavedMap((prev) => ({
          ...prev,
          [showcaseId]: false,
        }));
      } else {
        await saveShowcase(showcaseId);
        setSavedMap((prev) => ({
          ...prev,
          [showcaseId]: true,
        }));
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to update save state");
    }
  }
  async function handleCreateShowcase() {
    if (!newPostText.trim()) return;
    setCreatingShowcase(true);
    try {
      const res = await createShowcase(newPostText, newPostLocation, newFiles);
      if (res?.response) {
        setShowcases((prev) => [res.response, ...prev]);
        setShowCreateModal(false);
        setNewPostText("");
        setNewPostLocation("");
        setNewFiles([]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create showcase");
    } finally {
      setCreatingShowcase(false);
    }
  }
  console.log({ handleCreateShowcase });

  async function handleViewProvider(userId: number) {
    navigate(`/user-profile/${userId}`);
  }
  async function handleToggleFollow(userId: number) {
    if (myId == null) {
      alert("Please sign in to follow providers.");
      return;
    }
    if (userId === myId) return;
    const currentlyFollowing = !!followingMap[userId];
    setFollowingMap((prev) => ({
      ...prev,
      [userId]: !currentlyFollowing,
    }));
    setTopProviders((prev) =>
      prev.map((p) => {
        if (p.id !== userId) return p;
        return {
          ...p,
          _followersCountLocal: Math.max(
            0,
            (p._followersCountLocal || 0) + (currentlyFollowing ? -1 : 1),
          ),
        };
      }),
    );
    setFollowLoadingMap((prev) => ({
      ...prev,
      [userId]: true,
    }));
    try {
      if (currentlyFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (err) {
      console.warn("Follow toggle failed", err);
      const msg = err instanceof Error ? err.message : "";
      setFollowingMap((prev) => ({
        ...prev,
        [userId]: currentlyFollowing,
      }));
      setTopProviders((prev) =>
        prev.map((p) => {
          if (p.id !== userId) return p;
          return {
            ...p,
            _followersCountLocal: Math.max(
              0,
              (p._followersCountLocal || 0) + (currentlyFollowing ? 1 : -1),
            ),
          };
        }),
      );
      alert(msg || "Could not update follow state.");
    } finally {
      setFollowLoadingMap((prev) => ({
        ...prev,
        [userId]: false,
      }));
    }
  }
  return (
    <section className="pt-13 bg-[#FBFBFB]">
      <div className="px-5 sm:px-8 md:px-15 lg:px-15 max-w-[1400px] mx-auto">
        <div className="flex justify-between w-full relative">
          {/* Sidebar 1 */}
          <div className="sidebar-1 fixed left-0 pt- border border-gray-200 h-screen overflow-y-auto w-64 lg:block hidden">
            {updates.map((u, index) => {
              const updateInfo = u.updateType
                ? updateIconMap[u.updateType]
                : null;

              return (
                <div
                  key={index}
                  className="p-3 my-3 border border-gray-100 rounded-lg"
                >
                  {/* Title and Description */}
                  <div className="">
                    <div
                      className={`flex items-center font-medium tracking-tight text-[15px] ${updateInfo?.colorClass}`}
                    >
                      <span className="pr-1 relative bottom-0.5">
                        {" "}
                        {updateInfo?.icon}
                      </span>
                      <span>{u.updateType}</span>
                    </div>
                    <p className="text-[13px] font-medium  text-gray-800">
                      {u.title}
                    </p>
                    <p className="text-xs text-gray-500">{u.description}</p>
                  </div>
                </div>
              );
            })}
            <div className="py-8" />
          </div>

          {/* Feed Content */}
          <div className="feed w-full md:w-[calc(100%-13rem)] lg:w-[calc(100%-26rem)] lg:mx-auto">
            <div className="feed-content w-full space-y-5">
              {/* Feed Header*/}

              <div className="border border-gray-200 mt-4 rounded-[8px] p-4 flex items-center justify-between">
                <div className="flex gap-x-3 items-center w-max mx-auto">
                  <div className="bg-amber-50 rounded border border-amber-300 p-2">
                    <p className="font-medium text-gray-700">All Updates</p>
                  </div>
                  <p className="font-medium text-gray-500 hidden">Following</p>
                </div>
              </div>
              {showcases.map((sc) => (
                <div
                  key={sc.id}
                  className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"
                  data-showcase-card-id={sc.id}
                >
                  {/* User Header */}
                  <div className="flex items-center gap-3 mb-4">
                    {sc.user?.picture ? (
                      <img
                        className="w-11 h-11 rounded-full object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
                        src={sc.user.picture}
                        alt={sc.user?.fullName || sc.user?.username || "Author"}
                        onClick={() =>
                          sc.user?.id && handleViewProvider(sc.user.id)
                        }
                      />
                    ) : (
                      renderAvatarClickable(
                        sc.user,
                        "w-11 h-11",
                        handleViewProvider,
                      )
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {sc.user?.fullName || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {sc.user?.type || ""}
                      </p>
                    </div>
                    <small className="text-gray-400 text-xs">
                      <Clock className="inline w-3 h-3 text-gray-400 mr-1" />
                      {new Date(sc.createdDate).toLocaleString()}
                    </small>
                  </div>

                  {/* Post Content */}

                  {sc.attachments?.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <AttachmentCarousel attachments={sc.attachments} />
                    </div>
                  )}
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {sc.post}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => toggleLikeShowcase(sc.id)}
                      className={`flex items-center gap-1.5 transition-colors duration-200 ${showcaseLikedMap[sc.id] ? "text-red-500" : "hover:text-red-500"}`}
                    >
                      <Heart
                        size={18}
                        className="transition-transform duration-200 group-hover:scale-110"
                        fill={
                          showcaseLikedMap[sc.id] ? "rgb(239 68 68)" : "none"
                        }
                      />
                      <span className="font-medium">
                        {showcaseLikeCount[sc.id] || 0}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setVisibleCommentsMap((prev) => {
                          const isSameCardOpen = prev[sc.id] === true;
                          const newMap = Object.fromEntries(
                            Object.keys(prev).map((k) => [Number(k), false]),
                          );
                          newMap[sc.id] = !isSameCardOpen;
                          if (!isSameCardOpen) {
                            setTimeout(() => {
                              const el = document.querySelector(
                                `[data-showcase-card-id="${sc.id}"]`,
                              );
                              if (el)
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              if (commentRefs.current[sc.id])
                                commentRefs.current[sc.id]?.focus();
                            }, 50);
                          }
                          return newMap;
                        });
                        setVisibleCountMap({
                          [sc.id]: 5,
                        });
                      }}
                      className="flex items-center gap-1.5 hover:text-gray-700 transition-colors duration-200"
                    >
                      <MessageCircle size={18} />
                      <span className="font-medium">
                        {commentsMap[sc.id]?.length || 0}
                      </span>
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => toggleSave(sc.id)}
                      className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors duration-200"
                    >
                      <Bookmark
                        size={18}
                        fill={savedMap[sc.id] ? "#34D399" : "none"}
                      />
                      <span className="font-medium">
                        {savedMap[sc.id] ? "Unsave" : "Save"}
                      </span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {visibleCommentsMap[sc.id] && (
                    <div className="mt-5 pt-3 border-t border-gray-100">
                      {(commentsMap[sc.id] || [])
                        .slice(0, visibleCountMap[sc.id] || 5)
                        .map((c) => (
                          <div key={c.id} className="flex gap-3 mb-4 last:mb-0">
                            {c.user?.picture ? (
                              <img
                                src={c.user.picture}
                                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                                alt={
                                  c.user?.fullName || c.user?.username || "User"
                                }
                                onClick={() =>
                                  c.user?.id && handleViewProvider(c.user.id)
                                }
                              />
                            ) : (
                              renderAvatarClickable(
                                c.user,
                                "w-8 h-8",
                                handleViewProvider,
                              )
                            )}
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg px-4 py-2">
                                <p className="text-sm font-semibold text-gray-800">
                                  {c.user?.fullName || c.user?.username}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 mb-1">
                                  {new Date(c.createdDate).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-700 leading-snug">
                                  {c.post}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleLikeComment(sc.id, c)}
                              className="self-start text-xs text-gray-500 flex items-center gap-1 mt-2.5 transition-colors duration-200 hover:text-red-500"
                            >
                              <Heart size={14} className="inline" />
                              <span>{c.like || 0}</span>
                            </button>
                          </div>
                        ))}
                      {(commentsMap[sc.id]?.length || 0) >
                        (visibleCountMap[sc.id] || 5) && (
                        <button
                          onClick={() => handleViewMore(sc.id)}
                          className="text-royalblue-main text-sm font-medium mt-2 hover:underline"
                        >
                          View more
                        </button>
                      )}

                      {/* Comment Input */}
                      <div className="mt-4 flex items-center gap-2">
                        <input
                          ref={(el) => {
                            commentRefs.current[sc.id] = el;
                          }}
                          type="text"
                          placeholder="Add a comment…"
                          value={commentTextMap[sc.id] || ""}
                          onChange={(e) =>
                            setCommentTextMap((prev) => ({
                              ...prev,
                              [sc.id]: e.target.value,
                            }))
                          }
                          className="flex-1 rounded-[8px] px-4 py-2 text-sm bg-gray-100 border border-transparent focus:bg-white focus:border-royalblue-main focus:ring-0 transition-all"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreateComment(sc.id);
                          }}
                        />
                        <button
                          onClick={() => handleCreateComment(sc.id)}
                          disabled={
                            creatingCommentMap[sc.id] ||
                            !commentTextMap[sc.id]?.trim()
                          }
                          className="bg-royalblue-main text-white rounded-[8px] p-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="py-10" />
            </div>
          </div>

          {/* Sidebar 2 */}
          <div className="sidebar-2 border border-gray-200 p-4 fixed right-0 pt-4 pr-4 overflow-y-auto h-screen w-64 md:block hidden">
            {topProviders.map((p) => {
              const isMe = myId != null && p.id === myId;
              const isFollowing = !!followingMap[p.id];
              const followerCount =
                typeof p._followersCountLocal === "number"
                  ? p._followersCountLocal
                  : Array.isArray(p.followers)
                    ? p.followers.length
                    : typeof p.followersCount === "number"
                      ? p.followersCount
                      : 0;
              return (
                <div
                  key={p.id}
                  className="mb-3 p-2 card-shadow-2 rounded-lg bg-white"
                >
                  <div className="flex items-center gap-2">
                    {p.picture ? (
                      <img
                        src={p.picture}
                        className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80"
                        alt={p.fullName || p.username}
                        onClick={() => handleViewProvider(p.id)}
                      />
                    ) : (
                      renderAvatarClickable(p, "w-12 h-12", handleViewProvider)
                    )}
                    <div>
                      <p className="font-semibold text-sm">
                        {p.fullName || p.username}
                      </p>
                      <p className="text-xs text-gray-500">{p.type || ""}</p>
                      <p className="text-xs text-gray-400">
                        {formatFollowerCount(followerCount)} followers
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleToggleFollow(p.id)}
                      disabled={isMe || !!followLoadingMap[p.id]}
                      className={`flex-1 text-xs px-3 py-1 rounded ${isFollowing ? "bg-gray-300 text-gray-700" : "bg-royalblue-main text-white"} ${isMe ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={isMe ? "You can't follow yourself" : ""}
                    >
                      {followLoadingMap[p.id]
                        ? isFollowing
                          ? "Unfollowing..."
                          : "Following..."
                        : isFollowing
                          ? "Following"
                          : "Follow"}
                    </button>
                    <button
                      onClick={() => handleViewProvider(p.id)}
                      className="flex-1 text-royalblue-main text-xs px-3 py-1 rounded border border-royalblue-main"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        title="Provider Details"
        open={!!selectedProvider}
        onCancel={() => setSelectedProvider(null)}
        footer={null}
      >
        {loadingProvider ? (
          <p>Loading...</p>
        ) : selectedProvider ? (
          <div className="space-y-3">
            <div className="flex justify-center">
              {selectedProvider.picture ? (
                <img
                  src={selectedProvider.picture}
                  alt={selectedProvider.fullName || "Profile"}
                  className="w-24 h-24 rounded-full object-cover border"
                />
              ) : (
                renderAvatarClickable(
                  selectedProvider,
                  "w-24 h-24",
                  handleViewProvider,
                )
              )}
            </div>
            <div className="space-y-2 text-center">
              <p className="text-lg font-semibold">
                {selectedProvider.fullName}
              </p>
              <p className="text-sm text-gray-500">
                @{selectedProvider.username}
              </p>
            </div>
            <div className="space-y-1">
              <p>
                <strong>Email:</strong> {selectedProvider.email}
              </p>
              <p>
                <strong>Address:</strong> {selectedProvider.address}
              </p>
              <p>
                <strong>Type:</strong> {selectedProvider.type}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
};
export default Activities;
