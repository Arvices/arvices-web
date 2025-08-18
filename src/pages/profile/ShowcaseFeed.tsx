import { useState, useEffect } from "react";
import { Spin, Empty, Pagination, Button, message } from "antd";
import api from "../../util/api"; 

interface ShowcaseItem {
  id: number;
  title: string;
  description: string;
  createdDate: string;
}

export default function ShowcaseFeed() {
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch Showcase
  const fetchShowcase = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await api.get("/showcase/getallshowcase", {
        params: { orderBy: "DESC", page: pageNum, limit: 10 },
      });

      const mapped: ShowcaseItem[] = (res.data.response || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        createdDate: item.createdDate,
      }));

      setShowcaseItems(mapped);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Failed to load showcase", err);
      message.error("Failed to load showcase items");
    } finally {
      setLoading(false);
    }
  };

  // Delete showcase comment
  const handleDeleteComment = async (id: number) => {
    try {
      await api.delete(`/showcase/deleteshowcasecomment/${id}`);
      message.success("Showcase comment deleted");
      // Refresh list after deletion
      fetchShowcase(page);
    } catch (err) {
      console.error("❌ Failed to delete comment", err);
      message.error("Failed to delete comment");
    }
  };

  useEffect(() => {
    fetchShowcase(page);
  }, [page]);

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : showcaseItems.length === 0 ? (
        <Empty description="No showcase items found" />
      ) : (
        showcaseItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 className="font-semibold tracking-tight text-base mb-2">
                  {item.title}
                </h3>
                <div className="text-gray-800 text-sm mb-2">{item.description}</div>
              </div>
              <Button
                type="primary"
                danger
                size="small"
                onClick={() => handleDeleteComment(item.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          current={page}
          pageSize={10}
          total={total}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
