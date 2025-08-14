import React, { useEffect, useRef, useState } from "react";
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
  Plus
} from "feather-icons-react";
import { Heart, MessageCircle, Bookmark } from "feather-icons-react";
import { Select, Modal, Input } from "antd";
import { ChevronDown } from "feather-icons-react";
const { Option } = Select;

import pic from "../../assets/images/pro-sample-img.png";

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

function formatFollowerCount(count: number): string {
  if (count >= 1_000_000)
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (count >= 1_000)
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return count.toString();
}

export type ShowcaseComment = {
  id: number;
  post: string;
  like: number;
  liked: number[];
  commentAttachments: { url?: string }[];
  createdDate: string;
  user: { id: number; fullName?: string | null; username?: string | null };
};

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
async function createComment(showcaseId: number, post: string, files: File[]) {
  const fd = new FormData();
  fd.append("post", post);
  fd.append("showcaseId", String(showcaseId));
  for (const f of files) {
    fd.append("attachment", f, f.name);
  }
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

// NEW showcase like/unlike functions
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

const updates = [
  { updateType: "Live Updates", title: "Beauty services trending up 25%", description: "Skincare and makeup bookings are rising this week" },
  { updateType: "New Provider", title: "New 5-star rated plumber available", description: "Highly rated professional just joined your area" },
  { updateType: "Promotion", title: "Flash sale: Cleaning services 30% off", description: "Limited time offer ending tonight" },
  { updateType: "Milestone", title: "Boluwatife Abubakar reached 2k follows", description: "Popular makeup artist hits milestone" },
  { updateType: "Achievement", title: "Best rated car mechanic this month", description: "AutoFix Pro wins monthly excellence award" },
  { updateType: "Booking Alert", title: "Weekend booking slots filling fast", description: "High demand for weekend appointments" },
  { updateType: "New Feature", title: "New service category: Pet Care", description: "Find grooming and pet sitting services" },
];

export const updateIconMap: Record<string, { icon: React.JSX.Element; colorClass: string }> = {
  "Live Updates": { icon: <TrendingUp className="inline w-3 h-3 text-pink-600" />, colorClass: "text-pink-600" },
  "New Provider": { icon: <UserPlus className="inline w-3 h-3 text-blue-600" />, colorClass: "text-blue-600" },
  Promotion: { icon: <Percent className="inline w-3 h-3 text-green-600" />, colorClass: "text-green-600" },
  Milestone: { icon: <Star className="inline w-3 h-3 text-yellow-500" />, colorClass: "text-yellow-500" },
  Achievement: { icon: <Award className="inline w-3 h-3 text-indigo-600" />, colorClass: "text-indigo-600" },
  "Booking Alert": { icon: <Calendar className="inline w-3 h-3 text-red-500" />, colorClass: "text-red-500" },
  "New Feature": { icon: <Tool className="inline w-3 h-3 text-teal-600" />, colorClass: "text-teal-600" },
};

const users = [
  { name: "Sarah Johnson", category: "Hair Stylist", followerCount: 3200 },
  { name: "Mike Chen", category: "Auto Mechanic", followerCount: 1800 },
  { name: "Emma Williams", category: "House Cleaner", followerCount: 2500 },
  { name: "Linda Okafor", category: "Fashion Designer", followerCount: 4100 },
  { name: "Tunde Bako", category: "Graphic Designer", followerCount: 2900 },
  { name: "Grace Bello", category: "Event Planner", followerCount: 3700 },
];

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
  const [filesMap, setFilesMap] = useState<Record<number, File[]>>({});
  const [creatingCommentMap, setCreatingCommentMap] = useState<Record<number, boolean>>({});
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostLocation, setNewPostLocation] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [creatingShowcase, setCreatingShowcase] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllShowcase("DESC", 1, 10);
        if (Array.isArray(data.response)) {
          setShowcases(data.response);
          const myId = JSON.parse(atob(getToken()?.split(".")[1] || ""))?.id;
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
  }, []);

  async function refreshComments(showcaseId: number) {
    try {
      const data = await getComments(showcaseId);
      setCommentsMap((prev) => ({ ...prev, [showcaseId]: Array.isArray(data.response) ? data.response : [] }));
    } catch (err: any) {
      console.warn("Failed to load comments", err);
    }
  }

  async function handleCreateComment(showcaseId: number) {
    const text = commentTextMap[showcaseId] || "";
    const files = filesMap[showcaseId] || [];
    if (!text.trim() && files.length === 0) return;
    setCreatingCommentMap((prev) => ({ ...prev, [showcaseId]: true }));
    try {
      await createComment(showcaseId, text.trim(), files);
      setCommentTextMap((prev) => ({ ...prev, [showcaseId]: "" }));
      setFilesMap((prev) => ({ ...prev, [showcaseId]: [] }));
      if (fileInputRefs.current[showcaseId]) fileInputRefs.current[showcaseId]!.value = "";
      await refreshComments(showcaseId);
    } catch (e: any) {
      alert(e?.message || "Failed to post comment");
    } finally {
      setCreatingCommentMap((prev) => ({ ...prev, [showcaseId]: false }));
    }
  }

  async function toggleLikeComment(showcaseId: number, comment: ShowcaseComment) {
    const already = likedByMeMap[showcaseId]?.has(comment.id);
    if (already) {
      likedByMeMap[showcaseId].delete(comment.id);
      setCommentsMap((prev) => ({
        ...prev,
        [showcaseId]: prev[showcaseId].map((c) =>
          c.id === comment.id ? { ...c, like: Math.max(0, (c.like || 0) - 1) } : c
        ),
      }));
    } else {
      likedByMeMap[showcaseId].add(comment.id);
      setCommentsMap((prev) => ({
        ...prev,
        [showcaseId]: prev[showcaseId].map((c) =>
          c.id === comment.id ? { ...c, like: (c.like || 0) + 1 } : c
        ),
      }));
    }
    try {
      if (already) await unlikeComment(comment.id);
      else await likeComment(comment.id);
    } catch {
      alert("Failed to update like");
    }
  }

  async function toggleLikeShowcase(showcaseId: number) {
    const already = showcaseLikedMap[showcaseId];
    try {
      if (already) {
        await unlikeShowcase(showcaseId);
        setShowcaseLikedMap((prev) => ({ ...prev, [showcaseId]: false }));
        setShowcaseLikeCount((prev) => ({ ...prev, [showcaseId]: Math.max(0, (prev[showcaseId] || 1) - 1) }));
      } else {
        await likeShowcase(showcaseId);
        setShowcaseLikedMap((prev) => ({ ...prev, [showcaseId]: true }));
        setShowcaseLikeCount((prev) => ({ ...prev, [showcaseId]: (prev[showcaseId] || 0) + 1 }));
      }
    } catch (err) {
      alert("Failed to update showcase like");
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
    } catch (e: any) {
      alert(e?.message || "Failed to update save state");
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
    } catch (err: any) {
      alert(err?.message || "Failed to create showcase");
    } finally {
      setCreatingShowcase(false);
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
                  <div className={updateIconMap[u.updateType].colorClass}>
                    {updateIconMap[u.updateType].icon} {u.updateType}
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
                <div key={sc.id} className="card-shadow rounded p-4">
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img className="w-10 h-10 rounded-full object-cover" src={sc.attachments?.[0]?.url || sc.user?.picture || pic} />
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

                  {/* Image */}
                  <div className="mt-5 relative rounded-2xl aspect-[5/3] overflow-hidden">
                    <img src={sc.attachments?.[0]?.url || sc.user?.picture || pic} className="absolute inset-0 w-full h-full object-cover" />
                  </div>

                  {/* Caption */}
                  <div className="mt-5">{sc.post}</div>

                  {/* Actions */}
                  <div className="border-t my-3" />
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <button
                      onClick={() => toggleLikeShowcase(sc.id)}
                      className={`flex items-center gap-1 ${showcaseLikedMap[sc.id] ? "text-red-500" : ""}`}
                    >
                      <Heart size={16} fill={showcaseLikedMap[sc.id] ? "red" : "none"} />
                      <span>{showcaseLikeCount[sc.id] || 0}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      <span>{commentsMap[sc.id]?.length || 0}</span>
                    </div>
                    <div className="flex-1" />
                    <button onClick={() => toggleSave(sc.id)} className="flex items-center gap-1 hover:text-emerald-600">
                      <Bookmark size={16} />
                      <span>{savedMap[sc.id] ? "Unsave" : "Save"}</span>
                    </button>
                  </div>

                  {/* Comments */}
                  <div className="border-t my-3" />
                  <div>
                    {commentsMap[sc.id]?.map((c) => (
                      <div key={c.id} className="border p-2 rounded mb-2">
                        <div className="flex items-center gap-2">
                          <img src={pic} className="w-8 h-8 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{c.user?.fullName || c.user?.username}</p>
                            <p className="text-xs text-gray-500">{new Date(c.createdDate).toLocaleString()}</p>
                          </div>
                          <button onClick={() => toggleLikeComment(sc.id, c)} className="text-xs px-2 py-1 rounded-full border">
                            <Heart size={12} className="inline mr-1" /> {c.like || 0}
                          </button>
                        </div>
                        <div className="mt-2 text-sm">{c.post}</div>
                      </div>
                    ))}
                  </div>

                  {/* Add comment */}
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment…"
                      value={commentTextMap[sc.id] || ""}
                      onChange={(e) => setCommentTextMap((prev) => ({ ...prev, [sc.id]: e.target.value }))}
                      className="flex-1 border rounded-full px-4 py-1"
                    />
                    <input
                      ref={(el) => { fileInputRefs.current[sc.id] = el; }}
                      type="file"
                      multiple
                    />
                    <button
                      onClick={() => handleCreateComment(sc.id)}
                      disabled={creatingCommentMap[sc.id]}
                      className="bg-royalblue-main text-white rounded-full p-2"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Plus Button */}
            <div className="flex justify-center mt-4">
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

          {/* Right */}
          <div className="basis-1/5 py-5 px-3 rounded card-shadow">
            <p className="font-medium mb-3">🔥 Top Providers </p>
            {users.map((u, i) => (
              <div key={i} className="mb-3 p-2 border rounded-lg bg-white">
                <div className="flex items-center gap-2">
                  <img src={pic} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.category}</p>
                    <p className="text-xs text-gray-400">{formatFollowerCount(u.followerCount)} followers</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 text-white text-xs px-3 py-1 rounded bg-royalblue-main">Follow</button>
                  <button className="flex-1 text-royalblue-main text-xs px-3 py-1 rounded border border-royalblue-main">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
