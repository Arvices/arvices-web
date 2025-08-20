import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Empty,
  Button,
  message,
  Input,
  Avatar,
  Modal,
  Form,
  Upload,
  Skeleton,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  BookOutlined,
  BookFilled,
  UploadOutlined,
} from "@ant-design/icons";
import api from "../../util/api";
import { useAuth } from "../../contexts/AuthContext";
import { FolderGit } from "lucide-react";

const { TextArea } = Input;

interface ShowcaseItem {
  id: number;
  post: string;
  location: string;
  like: number;
  liked?: { user: { id: number } }[];
  saved?: { user: { id: number } }[];
  attachments?: { id: number; url: string }[];
  comments?: {
    id: number;
    post: string;
    user?: { id: number; fullName: string };
    createdDate: string;
  }[];
  user: { id: number; fullName: string; picture?: string };
}

export default function ShowcaseFeed() {
  const { userId } = useParams<{ userId: string }>();
  const { token, isProvider, isClient, user } = useAuth();

  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  const currentUserId = user?.id;

  // -------- Fetch Showcase --------
  const fetchShowcase = async (pageNum: number, append = false) => {
    try {
      setLoading(true);

      let endpoint = "/showcase/getgeneralshowcasetimeline";
      if (isProvider) {
        endpoint = "/showcase/getmyshowcase";
      } else if (isClient && userId) {
        endpoint = `/showcase/getallshowcase?userId=${userId}`;
      }

      const res = await api.get(endpoint, {
        params: { orderBy: "DESC", page: pageNum, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped: ShowcaseItem[] = (res.data.response || []).map((item: any) => ({
        id: item.id,
        post: item.post,
        location: item.location,
        like: item.like,
        liked: item.liked || [],
        saved: item.saved || [],
        attachments: item.attachments || [],
        comments: item.comments || [],
        user: {
          id: item.user?.id,
          fullName: item.user?.fullName,
          picture: item.user?.picture,
        },
      }));

      setShowcaseItems((prev) => (append ? [...prev, ...mapped] : mapped));
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Failed to load showcase", err);
      message.error("Failed to load showcase items");
    } finally {
      setLoading(false);
    }
  };

  // -------- Create Showcase --------
  const handleSubmitShowcase = async (values: any) => {
    if (!token) return message.error("Not authenticated");
    try {
      const formData = new FormData();
      formData.append("post", values.post);
      formData.append("location", values.location);
      (values.attachments || []).forEach((f: any) => {
        formData.append("attachment[]", f.originFileObj);
      });

      await api.post("/showcase/createshowcase", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Showcase created!");
      setShowModal(false);
      form.resetFields();
      setPage(1);
      fetchShowcase(1, false);
    } catch (err: any) {
      console.error("❌ Showcase create failed", err.response?.data || err);
      message.error(err.response?.data?.message || "Failed to create showcase");
    }
  };

  // -------- Like / Save / Comment / Delete --------
  const handleToggleLike = async (item: ShowcaseItem) => {
    if (!token) return message.error("Not authenticated");
    const alreadyLiked = item.liked?.some((l) => l.user?.id === currentUserId);

    try {
      const url = alreadyLiked
        ? `/showcase/unlikeshowcase/${item.id}`
        : `/showcase/likeshowcase/${item.id}`;

      await api.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      setShowcaseItems((prev) =>
        prev.map((s) =>
          s.id === item.id
            ? {
                ...s,
                liked: alreadyLiked
                  ? s.liked?.filter((l) => l.user?.id !== currentUserId)
                  : [...(s.liked || []), { user: { id: currentUserId! } }],
                like: alreadyLiked ? s.like - 1 : s.like + 1,
              }
            : s
        )
      );
    } catch {
      message.error("Failed to update like");
    }
  };

  const handleToggleSave = async (item: ShowcaseItem) => {
    if (!token) return message.error("Not authenticated");
    const alreadySaved = item.saved?.some((s) => s.user?.id === currentUserId);

    try {
      const url = alreadySaved
        ? `/showcase/unsaveshowcase/${item.id}`
        : `/showcase/saveshowcase/${item.id}`;
      await api.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      setShowcaseItems((prev) =>
        prev.map((s) =>
          s.id === item.id
            ? {
                ...s,
                saved: alreadySaved
                  ? s.saved?.filter((sv) => sv.user?.id !== currentUserId)
                  : [...(s.saved || []), { user: { id: currentUserId! } }],
              }
            : s
        )
      );
    } catch {
      message.error("Failed to update save");
    }
  };

  const handleAddComment = async (item: ShowcaseItem) => {
    if (!token) return message.error("Not authenticated");
    const text = commentInputs[item.id];
    if (!text) return;

    try {
      const res = await api.post(
        `/showcase/commentshowcase/${item.id}`,
        { post: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowcaseItems((prev) =>
        prev.map((s) =>
          s.id === item.id ? { ...s, comments: [...(s.comments || []), res.data.response] } : s
        )
      );
      setCommentInputs((prev) => ({ ...prev, [item.id]: "" }));
    } catch {
      message.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (itemId: number, commentId: number) => {
    if (!token) return message.error("Not authenticated");
    try {
      await api.delete(`/showcase/deletecomment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowcaseItems((prev) =>
        prev.map((s) =>
          s.id === itemId
            ? { ...s, comments: s.comments?.filter((c) => c.id !== commentId) }
            : s
        )
      );
    } catch {
      message.error("Failed to delete comment");
    }
  };

  const handleDeleteShowcase = async (id: number) => {
    try {
      await api.delete(`/showcase/deleteshowcase/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Showcase deleted");
      setPage(1);
      fetchShowcase(1, false);
    } catch {
      message.error("Failed to delete showcase");
    }
  };

  useEffect(() => {
    setPage(1);
    fetchShowcase(1, false);
  }, [userId]);

  return (
    <div className="flex flex-col gap-6">
      {/* Provider Create Button */}
      {isProvider && (
        <div className="flex justify-center mb-4">
          <Button type="dashed" onClick={() => setShowModal(true)}>
            + Create Showcase
          </Button>
        </div>
      )}

      {/* Create Showcase Modal */}
      <Modal
        title="Create Showcase"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitShowcase}>
          <Form.Item name="post" label="Post" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="attachments"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload name="file" listType="picture" beforeUpload={() => false} multiple>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create
          </Button>
        </Form>
      </Modal>

      {/* Feed */}
      {loading && page === 1 ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} active avatar paragraph={{ rows: 3 }} />
          ))}
        </div>
      ) : showcaseItems.length === 0 ? (
        <Empty description="No showcase items found" />
      ) : (
        showcaseItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Avatar src={item.user?.picture} />
                <span className="font-medium">{item.user?.fullName}</span>
              </div>
              {isProvider && (
                <Button danger size="small" onClick={() => handleDeleteShowcase(item.id)}>
                  Delete
                </Button>
              )}
            </div>

            {/* Post */}
            <p className="text-sm text-gray-800 line-clamp-3">{item.post}</p>
            {item.location && <div className="text-xs text-gray-500">📍 {item.location}</div>}
            {item.attachments?.map((a) => (
              <img
                key={a.id}
                src={a.url}
                alt=""
                loading="lazy"
                className="w-full max-h-64 object-contain rounded-md mt-2 bg-gray-100"
              />
            ))}

            {/* Actions */}
            <div className="flex gap-4 text-lg mt-2">
              <span onClick={() => handleToggleLike(item)} className="cursor-pointer">
                {item.liked?.some((l) => l.user?.id === currentUserId) ? (
                  <HeartFilled style={{ color: "red" }} />
                ) : (
                  <HeartOutlined />
                )}
              </span>
              <span onClick={() => handleToggleSave(item)} className="cursor-pointer">
                {item.saved?.some((s) => s.user?.id === currentUserId) ? (
                  <BookFilled />
                ) : (
                  <BookOutlined />
                )}
              </span>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-700 mt-1">
              <p>{item.like} likes</p>
              <p>{item.comments?.length} comments</p>
            </div>

            {/* Comments */}
            <div className="mt-2">
              {item.comments?.slice(-3).map((c) => (
                <div key={c.id} className="flex justify-between items-center py-1">
                  <span>
                    <strong>{c.user?.fullName || "Anon"}:</strong> {c.post}
                  </span>
                  {c.user?.id === currentUserId && (
                    <Button size="small" danger onClick={() => handleDeleteComment(item.id, c.id)}>
                      Delete
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="border-t pt-2 mt-2">
              <TextArea
                rows={1}
                placeholder="Add a comment..."
                value={commentInputs[item.id] || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
              />
              <Button type="link" onClick={() => handleAddComment(item)} disabled={!commentInputs[item.id]}>
                Post
              </Button>
            </div>
          </div>
        ))
      )}

      {/* View More */}
      {!loading && showcaseItems.length < total && (
        <div className="flex justify-center mt-6">
          <Button type="primary" onClick={() => { setPage((p) => p + 1); fetchShowcase(page + 1, true); }}>
            View More
          </Button>
        </div>
      )}
    </div>
  );
}
