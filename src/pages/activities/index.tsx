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
  MapPin,
  ArrowUpRight,
  Plus,
  ChevronDown,
} from "feather-icons-react";
import { Heart, MessageCircle, Bookmark } from "feather-icons-react";
import { Select, Modal, Input } from "antd";
const { Option } = Select;

const API_BASE = "https://arvicesapi.denateonlineservice.com";

/* ------------ utils ------------ */
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
    // support base64url
    const norm = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(norm);
    const obj = JSON.parse(json);
    return typeof obj?.id === "number" ? obj.id : null;
  } catch {
    return null;
  }
}
function formatFollowerCount(count: number): string {
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(count);
}

/* ------------ pastel avatar helpers ------------ */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 75%)`; // pastel tone
}

function renderAvatarClickable(user: any, sizeClass = "w-10 h-10", onClick?: (id: number) => void) {
  const displayName = user?.fullName || user?.username || "?";
  const letter = displayName[0].toUpperCase();
  const bgColor = stringToColor(displayName);
  const handleClick = () => {
    if (onClick && user?.id) onClick(user.id);
  };
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80`}
      style={{ backgroundColor: bgColor }}
      onClick={handleClick}
      title={`View ${displayName}'s profile`}
    >
      {letter}
    </div>
  );
}

/* ------------ types ------------ */
export type ShowcaseComment = {
  id: number;
  post: string;
  like: number;
  liked: number[];
  commentAttachments: { url?: string }[];
  createdDate: string;
  user: {
    id: number;
    fullName?: string | null;
    username?: string | null;
    picture?: string | null; // added so we can check for picture
  };
};

/* ------------ api ------------ */
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = { accept: "*/*", ...(init?.headers || {}) };
  if (token) (headers as any)["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

async function getAllShowcase(orderBy = "DESC", page = 1, limit = 10) {
  return api<{ status: number; message: string; response: any[]; total: number }>(
    `/showcase/getallshowcase?orderBy=${orderBy}&page=${page}&limit=${limit}`
  );
}
async function getComments(showcaseId: number) {
  return api<{ status: number; message: string; response: ShowcaseComment[] }>(
    `/showcase/getshowcasecommentbyshowcase/${showcaseId}`
  );
}
async function createComment(showcaseId: number, post: string) {
  const fd = new FormData();
  fd.append("post", post);
  fd.append("showcaseId", String(showcaseId));
  return api<{ status: number; message: string; response: any }>(
    "/showcase/createshowcasecomment",
    { method: "POST", body: fd }
  );
}
async function likeComment(commentId: number) {
  return api<{ status: number; message: string }>(
    `/showcase/likeshowcasecomment/${commentId}`,
    { method: "POST" }
  );
}
async function unlikeComment(commentId: number) {
  return api<{ status: number; message: string }>(
    `/showcase/unlikeshowcasecomment/${commentId}`,
    { method: "POST" }
  );
}
async function saveShowcase(showcaseId: number) {
  return api<{ status: number; message: string }>(
    `/showcase/saveshowcase/${showcaseId}`,
    { method: "POST" }
  );
}
async function unsaveShowcase(showcaseId: number) {
  return api<{ status: number; message: string }>(
    `/showcase/unsaveshowcase/${showcaseId}`,
    { method: "POST" }
  );
}
async function createShowcase(post: string, location: string, files: File[]) {
  const fd = new FormData();
  fd.append("post", post);
  fd.append("location", location);
  for (const f of files) fd.append("attachment", f, f.name);
  return api<{ status: number; message: string; response: any }>(
    "/showcase/createshowcase",
    { method: "POST", body: fd }
  );
}
async function likeShowcase(showcaseId: number) {
  return api<{ status: number; message: string }>(
    `/showcase/likeshowcase/${showcaseId}`,
    { method: "POST" }
  );
}
async function unlikeShowcase(showcaseId: number) {
  return api<{ status: number; message: string }>(
    `/showcase/unlikeshowcase/${showcaseId}`,
    { method: "POST" }
  );
}

/* top professionals */
async function getTopProfessionals() {
  return api<{ status: number; message: string; response: any[] }>(
    "/user/gettopprofessionals"
  );
}
// --- Follow API ---
async function followUser(userId: number) {
  const token = getToken();
  console.log("Token being sent:", token); // DEBUG
  return api<{ status: number; message: string }>(
    `/user/followuser/${userId}`,
    { method: "POST" }
  );
}

async function unfollowUser(userId: number) {
  const token = getToken();
  console.log("Token being sent:", token); // DEBUG
  return api<{ status: number; message: string }>(
    `/user/unfollowuser/${userId}`,
    { method: "POST" }
  );
}

async function getAccountById(userId: number) {
  return api<{ status: number; message: string; response: any }>(
    `/user/getaccountbyid?id=${userId}`
  );
}

/* ------------ static data ------------ */
const updates = [
  { updateType: "Live Updates", title: "Beauty services trending up 25%", description: "Skincare and makeup bookings are rising this week" },
  { updateType: "New Provider", title: "New 5-star rated plumber available", description: "Highly rated professional just joined your area" },
  { updateType: "Promotion", title: "Flash sale: Cleaning services 30% off", description: "Limited time offer ending tonight" },
  { updateType: "Milestone", title: "Boluwatife Abubakar reached 2k follows", description: "Popular makeup artist hits milestone" },
  { updateType: "Achievement", title: "Best rated car mechanic this month", description: "AutoFix Pro wins monthly excellence award" },
  { updateType: "Booking Alert", title: "Weekend booking slots filling fast", description: "High demand for weekend appointments" },
  { updateType: "New Feature", title: "New service category: Pet Care", description: "Find grooming and pet sitting services" },
] as const;

export const updateIconMap: Record<string, { icon: React.JSX.Element; colorClass: string }> = {
  "Live Updates": { icon: <TrendingUp className="inline w-3 h-3 text-pink-600" />, colorClass: "text-pink-600" },
  "New Provider": { icon: <UserPlus className="inline w-3 h-3 text-blue-600" />, colorClass: "text-blue-600" },
  Promotion: { icon: <Percent className="inline w-3 h-3 text-green-600" />, colorClass: "text-green-600" },
  Milestone: { icon: <Star className="inline w-3 h-3 text-yellow-500" />, colorClass: "text-yellow-500" },
  Achievement: { icon: <Award className="inline w-3 h-3 text-indigo-600" />, colorClass: "text-indigo-600" },
  "Booking Alert": { icon: <Calendar className="inline w-3 h-3 text-red-500" />, colorClass: "text-red-500" },
  "New Feature": { icon: <Tool className="inline w-3 h-3 text-teal-600" />, colorClass: "text-teal-600" },
};

/* ------------ component ------------ */
const Activities = (): React.ReactNode => {
  const categories = ["Cleaning", "Plumbing", "Makeup", "Pet Care", "Car Repair"];
  const [selectedCategory, setSelectedCategory] = useState<string>();

  const [showcases, setShowcases] = useState<any[]>([]);
  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, ShowcaseComment[]>>({});
  const [likedByMeMap, setLikedByMeMap] = useState<Record<number, Set<number>>>({});
  const [showcaseLikedMap, setShowcaseLikedMap] = useState<Record<number, boolean>>({});
  const [showcaseLikeCount, setShowcaseLikeCount] = useState<Record<number, number>>({});
  const [commentTextMap, setCommentTextMap] = useState<Record<number, string>>({});
  const [creatingCommentMap, setCreatingCommentMap] = useState<Record<number, boolean>>({});
  const [visibleCommentsMap, setVisibleCommentsMap] = useState<Record<number, boolean>>({});
  const [visibleCountMap, setVisibleCountMap] = useState<Record<number, number>>({});
  const commentRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // token -> myId (safe)
  const myId = useMemo(() => getMyIdSafe(), []);

  // create showcase
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostLocation, setNewPostLocation] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [creatingShowcase, setCreatingShowcase] = useState(false);

  // top providers
  const [topProviders, setTopProviders] = useState<any[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<number, boolean>>({});
  const [followLoadingMap, setFollowLoadingMap] = useState<Record<number, boolean>>({});

  // provider modal (View)
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [loadingProvider, setLoadingProvider] = useState(false);

  /* initial showcases */
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
            savedStatus[sc.id] = Array.isArray(sc.saved) && sc.saved.some((s: any) => s.id === myId);
            likedMap[sc.id] = new Set<number>();
            showcaseLikeStatus[sc.id] = Array.isArray(sc.liked) && sc.liked.some((u: any) => u.id === myId);
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

  /* top providers & following state */
  useEffect(() => {
    (async () => {
      try {
        const res = await getTopProfessionals();
        const providers = Array.isArray(res.response) ? res.response : [];
        // seed a local followersCount for consistent UI
        const seeded = providers.map((p: any) => ({
          ...p,
          _followersCountLocal:
            (Array.isArray(p.followers) ? p.followers.length : (typeof p.followersCount === "number" ? p.followersCount : 0)),
        }));
        setTopProviders(seeded);

        // Build following set from *current user's* account — reliable!
        if (myId != null) {
          const me = await getAccountById(myId);
          const followingIds = new Set<number>((me.response?.following || []).map((u: any) => u.id));
          const map: Record<number, boolean> = {};
          seeded.forEach((p: any) => { map[p.id] = followingIds.has(p.id); });
          setFollowingMap(map);
        } else {
          // not logged in — nothing followed
          setFollowingMap({ });
        }
      } catch (err) {
        console.warn("Failed to load top professionals / following", err);
      }
    })();
  }, [myId]);

  /* helpers */
  async function refreshComments(showcaseId: number) {
    try {
      const data = await getComments(showcaseId);
      setCommentsMap((prev) => ({ ...prev, [showcaseId]: Array.isArray(data.response) ? data.response : [] }));
    } catch (err) {
      console.warn("Failed to load comments", err);
    }
  }

  function handleViewMore(showcaseId: number) {
    setVisibleCountMap((prev) => ({ ...prev, [showcaseId]: (prev[showcaseId] || 5) + 5 }));
  }

  async function handleCreateComment(showcaseId: number) {
    const text = commentTextMap[showcaseId] || "";
    if (!text.trim()) return;
    setCreatingCommentMap((prev) => ({ ...prev, [showcaseId]: true }));
    try {
      await createComment(showcaseId, text.trim());
      setCommentTextMap((prev) => ({ ...prev, [showcaseId]: "" }));
      await refreshComments(showcaseId);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to post comment");
    } finally {
      setCreatingCommentMap((prev) => ({ ...prev, [showcaseId]: false }));
    }
  }

  async function toggleLikeComment(showcaseId: number, comment: ShowcaseComment) {
    const setForShowcase = likedByMeMap[showcaseId] || new Set<number>();
    const already = setForShowcase.has(comment.id);

    // optimistic UI
    const clone = new Set(setForShowcase);
    if (already) clone.delete(comment.id);
    else clone.add(comment.id);
    setLikedByMeMap((prev) => ({ ...prev, [showcaseId]: clone }));
    setCommentsMap((prev) => ({
      ...prev,
      [showcaseId]: prev[showcaseId].map((c) =>
        c.id === comment.id ? { ...c, like: Math.max(0, (c.like || 0) + (already ? -1 : 1)) } : c
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
    // optimistic
    setShowcaseLikedMap((p) => ({ ...p, [showcaseId]: !already }));
    setShowcaseLikeCount((p) => ({ ...p, [showcaseId]: Math.max(0, (p[showcaseId] || 0) + (already ? -1 : 1)) }));
    try {
      if (already) await unlikeShowcase(showcaseId);
      else await likeShowcase(showcaseId);
    } catch {
      alert("Failed to update showcase like");
      // revert
      setShowcaseLikedMap((p) => ({ ...p, [showcaseId]: already }));
      setShowcaseLikeCount((p) => ({ ...p, [showcaseId]: Math.max(0, (p[showcaseId] || 0) + (already ? 1 : -1)) }));
    }
  }

  async function toggleSave(showcaseId: number) {
    try {
      if (savedMap[showcaseId]) {
        await unsaveShowcase(showcaseId);
        setSavedMap((prev) => ({ ...prev, [showcaseId]: false }));
      } else {
        await saveShowcase(showcaseId);
        setSavedMap((prev) => ({ ...prev, [showcaseId]: true }));
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

  /* View (provider modal) */
  async function handleViewProvider(userId: number) {
    try {
      setLoadingProvider(true);
      const res = await getAccountById(userId);
      setSelectedProvider(res.response);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load provider details");
    } finally {
      setLoadingProvider(false);
    }
  }

  /* Follow / Unfollow — FIXED */
  async function handleToggleFollow(userId: number) {
    if (myId == null) {
      alert("Please sign in to follow providers.");
      return;
    }
    if (userId === myId) return; // no self-follow

    const currentlyFollowing = !!followingMap[userId];

    // ✅ Optimistic UI update
    setFollowingMap((prev) => ({ ...prev, [userId]: !currentlyFollowing }));
    setTopProviders((prev) =>
      prev.map((p) => {
        if (p.id !== userId) return p;
        const base =
          typeof p._followersCountLocal === "number"
            ? p._followersCountLocal
            : Array.isArray(p.followers)
            ? p.followers.length
            : typeof p.followersCount === "number"
            ? p.followersCount
            : 0;
        return {
          ...p,
          _followersCountLocal: Math.max(
            0,
            base + (currentlyFollowing ? -1 : 1)
          ),
        };
      })
    );

    setFollowLoadingMap((prev) => ({ ...prev, [userId]: true }));

    try {
      // ✅ Only call the correct API
      if (currentlyFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (err) {
      console.warn("Follow toggle failed", err);
      const msg = err instanceof Error ? err.message : "";

      // Roll back UI on error
      setFollowingMap((prev) => ({ ...prev, [userId]: currentlyFollowing }));
      setTopProviders((prev) =>
        prev.map((p) => {
          if (p.id !== userId) return p;
          const base =
            typeof p._followersCountLocal === "number"
              ? p._followersCountLocal
              : Array.isArray(p.followers)
              ? p.followers.length
              : typeof p.followersCount === "number"
              ? p.followersCount
              : 0;
          return {
            ...p,
            _followersCountLocal: Math.max(
              0,
              base + (currentlyFollowing ? 1 : -1) // revert change
            ),
          };
        })
      );

      alert(msg || "Could not update follow state.");
    } finally {
      setFollowLoadingMap((prev) => ({ ...prev, [userId]: false }));
    }
  }

  return (
    <section className="min-h-screen pt-13 bg-[#FBFBFB]">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        <div className="md:flex gap-x-3 mt-5">
          {/* Left */}
          <div className="card-shadow basis-1/5 py-5 px-3 rounded">
            <p className="font-medium ">Live Updates</p>
            {updates.map((u, i) => (
              <div key={i} className="mt-3 p-2 border rounded border-gray-100">
                <div className="flex items-center">
                  <div className="text-pink-600">
                    {u.updateType && (({
                      "Live Updates": <TrendingUp className="inline w-3 h-3 text-pink-600" />,
                      "New Provider": <UserPlus className="inline w-3 h-3 text-blue-600" />,
                      "Promotion": <Percent className="inline w-3 h-3 text-green-600" />,
                      "Milestone": <Star className="inline w-3 h-3 text-yellow-500" />,
                      "Achievement": <Award className="inline w-3 h-3 text-indigo-600" />,
                      "Booking Alert": <Calendar className="inline w-3 h-3 text-red-500" />,
                      "New Feature": <Tool className="inline w-3 h-3 text-teal-600" />,
                    } as any)[u.updateType])} {u.updateType}
                  </div>
                  <div className="flex-1" />
                  <small className="text-[12px] text-gray-500">
                    <Clock className="inline w-2 h-2 text-gray-400" /> 2h ago
                  </small>
                </div>
                <p className="text-[13px]">{u.title}</p>
                <p className="text-[12px] text-gray-500">{u.description}</p>
              </div>
            ))}
          </div>

          {/* Middle */}
          <div className="basis-3/5">
            {/* Header */}
            <div className="card-shadow rounded p-4 flex items-center justify-between">
              <div className="flex gap-x-3">
                <div className="bg-amber-50 rounded border border-amber-300 p-2">
                  <p className="font-medium text-gray-700">All Updates</p>
                </div>
                <p className="font-medium text-gray-500">Following</p>
              </div>
              <div className="flex gap-x-3">
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Category Filter"
                  suffixIcon={<ChevronDown className="text-gray-500 w-4 h-4" />}
                  allowClear
                >
                  {categories.map((cat) => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
                <button className="text-gray-600 text-[14px]">
                  <MapPin className="inline w-4 h-4" /> Location Filter
                </button>
              </div>
            </div>

            {/* Showcases */}
            <div className="mt-2 space-y-4">
              {showcases.map((sc) => (
                <div key={sc.id} className="card-shadow rounded p-4" data-showcase-card-id={sc.id}>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {sc.user?.picture ? (
                      <img
                        className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80"
                        src={sc.user.picture}
                        alt={sc.user?.fullName || sc.user?.username || "Author"}
                        onClick={() => sc.user?.id && handleViewProvider(sc.user.id)}
                      />
                    ) : (
                      renderAvatarClickable(sc.user, "w-10 h-10", handleViewProvider)
                    )}
                    <div>
                      <p className="font-medium">{sc.user?.fullName || "Unknown"}</p>
                      <small className="text-gray-500">{sc.user?.type || ""}</small>
                    </div>
                    <div className="flex-1" />
                    <small className="text-gray-500">
                      <Clock className="inline w-3 h-3 text-gray-400 mr-1" />
                      {new Date(sc.createdDate).toLocaleString()}
                    </small>
                  </div>

                  {/* Showcase Image */}
                  {sc.attachments?.length > 0 && sc.attachments[0]?.url && (
                    <div className="mt-5 relative rounded-2xl aspect-[5/3] overflow-hidden">
                      <img
                        src={sc.attachments[0].url}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Showcase"
                      />
                    </div>
                  )}

                  {/* Caption */}
                  <div className="mt-5">{sc.post}</div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <button
                      onClick={() => toggleLikeShowcase(sc.id)}
                      className={`flex items-center gap-1 ${showcaseLikedMap[sc.id] ? "text-red-500" : ""}`}
                    >
                      <Heart size={16} fill={showcaseLikedMap[sc.id] ? "red" : "none"} />
                      <span>{showcaseLikeCount[sc.id] || 0}</span>
                    </button>
                    <button
                      onClick={() => {
                        setVisibleCommentsMap(prev => {
                          const isSameCardOpen = prev[sc.id] === true;
                          const newMap: Record<number, boolean> = {};
                          Object.keys(prev).forEach(k => (newMap[Number(k)] = false));
                          newMap[sc.id] = !isSameCardOpen;
                          if (!isSameCardOpen) {
                            setTimeout(() => {
                              const el = document.querySelector(`[data-showcase-card-id="${sc.id}"]`);
                              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                              if (commentRefs.current[sc.id]) commentRefs.current[sc.id]?.focus();
                            }, 50);
                          }
                          return newMap;
                        });
                        setVisibleCountMap({ [sc.id]: 5 });
                      }}
                      className="flex items-center gap-1"
                    >
                      <MessageCircle size={16} />
                      <span>{commentsMap[sc.id]?.length || 0}</span>
                    </button>
                    <div className="flex-1" />
                    <button onClick={() => toggleSave(sc.id)} className="flex items-center gap-1 hover:text-emerald-600">
                      <Bookmark size={16} />
                      <span>{savedMap[sc.id] ? "Unsave" : "Save"}</span>
                    </button>
                  </div>

                  {/* Comments */}
                  {visibleCommentsMap[sc.id] && (
                    <>
                      <div className="border-t my-3" />
                      {(commentsMap[sc.id] || []).slice(0, (visibleCountMap[sc.id] || 5)).map((c) => (
                        <div key={c.id} className="p-2 mb-2">
                          <div className="flex items-center gap-2">
                            {c.user?.picture ? (
                              <img
                                src={c.user.picture}
                                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80"
                                alt={c.user?.fullName || c.user?.username || "User"}
                                onClick={() => c.user?.id && handleViewProvider(c.user.id)}
                              />
                            ) : (
                              renderAvatarClickable(c.user, "w-8 h-8", handleViewProvider)
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{c.user?.fullName || c.user?.username}</p>
                              <p className="text-xs text-gray-500">{new Date(c.createdDate).toLocaleString()}</p>
                            </div>
                            <button onClick={() => toggleLikeComment(sc.id, c)} className="text-xs px-2 py-1 rounded-full">
                              <Heart size={12} className="inline mr-1" /> {c.like || 0}
                            </button>
                          </div>
                          <div className="mt-2 text-sm">{c.post}</div>
                        </div>
                      ))}
                      {(commentsMap[sc.id]?.length || 0) > (visibleCountMap[sc.id] || 5) && (
                        <button onClick={() => handleViewMore(sc.id)} className="text-blue-500 text-sm mt-1">
                          View more
                        </button>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          ref={(el) => { commentRefs.current[sc.id] = el; }}
                          type="text"
                          placeholder="Add a comment…"
                          value={commentTextMap[sc.id] || ""}
                          onChange={(e) => setCommentTextMap((prev) => ({ ...prev, [sc.id]: e.target.value }))}
                          className="flex-1 rounded-full px-4 py-1 border-none outline-none focus:outline-none focus:ring-0"
                        />
                        <button
                          onClick={() => handleCreateComment(sc.id)}
                          disabled={creatingCommentMap[sc.id]}
                          className="bg-royalblue-main text-white rounded-full p-2"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Plus Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-royalblue-main text-white"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Create Showcase Modal */}
            <Modal
              title="Create New Showcase"
              open={showCreateModal}
              onCancel={() => setShowCreateModal(false)}
              onOk={handleCreateShowcase}
              confirmLoading={creatingShowcase}
            >
              <Input.TextArea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="What's your showcase about?"
                rows={3}
              />
              <Input
                className="mt-2"
                value={newPostLocation}
                onChange={(e) => setNewPostLocation(e.target.value)}
                placeholder="Location"
              />
              <input
                type="file"
                multiple
                className="mt-2"
                onChange={(e) => setNewFiles(e.target.files ? Array.from(e.target.files) : [])}
              />
            </Modal>
          </div>

          {/* Right: Top Providers */}
          <div className="basis-1/5 py-5 px-3 rounded card-shadow">
            <p className="font-medium mb-3">🔥 Top Providers</p>
            {topProviders.map((p) => {
              const isMe = myId != null && p.id === myId;
              const isFollowing = !!followingMap[p.id];
              const followerCount =
                typeof p._followersCountLocal === "number"
                  ? p._followersCountLocal
                  : (Array.isArray(p.followers) ? p.followers.length : (typeof p.followersCount === "number" ? p.followersCount : 0));

              return (
                <div key={p.id} className="mb-3 p-2 border rounded-lg bg-white">
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
                      <p className="font-semibold text-sm">{p.fullName || p.username}</p>
                      <p className="text-xs text-gray-500">{p.type || ""}</p>
                      <p className="text-xs text-gray-400">{formatFollowerCount(followerCount)} followers</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleToggleFollow(p.id)}
                      disabled={isMe || !!followLoadingMap[p.id]}
                      className={`flex-1 text-xs px-3 py-1 rounded ${
                        isFollowing ? "bg-gray-300 text-gray-700" : "bg-royalblue-main text-white"
                      } ${isMe ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={isMe ? "You can't follow yourself" : ""}
                    >
                      {followLoadingMap[p.id] ? (isFollowing ? "Unfollowing..." : "Following...") : (isFollowing ? "Following" : "Follow")}
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

      {/* Provider Details Modal */}
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
                renderAvatarClickable(selectedProvider, "w-24 h-24", handleViewProvider)
              )}
            </div>
            <div className="space-y-2 text-center">
              <p className="text-lg font-semibold">{selectedProvider.fullName}</p>
              <p className="text-sm text-gray-500">@{selectedProvider.username}</p>
            </div>
            <div className="space-y-1">
              <p><strong>Email:</strong> {selectedProvider.email}</p>
              <p><strong>Address:</strong> {selectedProvider.address}</p>
              <p><strong>Type:</strong> {selectedProvider.type}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
};

export default Activities;
