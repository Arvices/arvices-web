import { useEffect, useState } from "react";
import { Button, Input, Modal, Spin, Empty, Popconfirm, message, Pagination } from "antd";
import { Plus, Edit, Trash } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"; // adjust path if needed

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
}

export default function PortfolioTab() {
  const { token } = useAuth();

  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch all portfolio items with pagination
  const fetchPortfolio = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://arvicesapi.denateonlineservice.com/portfolio/getallportfolio?page=${pageNum}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // backend may return { response: [], total: number }
      const items: PortfolioItem[] = res.data?.response || [];
      const totalCount: number = res.data?.total ?? items.length;

      setPortfolios(items);
      setTotal(totalCount);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
      setError("Failed to load portfolio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio(1);
  }, []);

  // Save new or update portfolio
  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingPortfolio) {
        await axios.put(
          `https://arvicesapi.denateonlineservice.com/portfolio/updateportfolio/${editingPortfolio.id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        message.success("Portfolio updated successfully");
      } else {
        await axios.post(
          "https://arvicesapi.denateonlineservice.com/portfolio/createportfolio",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        message.success("Portfolio created successfully");
      }
      setIsModalOpen(false);
      setForm({ title: "", category: "", description: "" });
      setEditingPortfolio(null);
      fetchPortfolio(page); // refresh current page
    } catch (err) {
      console.error(err);
      message.error("Something went wrong while saving portfolio");
    } finally {
      setLoading(false);
    }
  };

  // Delete portfolio
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(
        `https://arvicesapi.denateonlineservice.com/portfolio/deleteportfolio/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Portfolio deleted successfully");
      fetchPortfolio(page);
    } catch (err) {
      console.error(err);
      message.error("Failed to delete portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Portfolio</h2>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => {
            setIsModalOpen(true);
            setEditingPortfolio(null);
            setForm({ title: "", category: "", description: "" });
          }}
        >
          Add Portfolio
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : portfolios.length === 0 ? (
        <Empty description="No portfolio yet" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {portfolios.map((item) => (
              <div key={item.id} className="border rounded-md p-3 shadow">
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="mt-2">{item.description}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="small"
                    icon={<Edit size={14} />}
                    onClick={() => {
                      setEditingPortfolio(item);
                      setForm({
                        title: item.title,
                        category: item.category,
                        description: item.description,
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete this portfolio?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button size="small" danger icon={<Trash size={14} />}>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            <Pagination
              current={page}
              pageSize={10}
              total={total}
              onChange={(p) => fetchPortfolio(p)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      {/* Modal */}
      <Modal
        title={editingPortfolio ? "Edit Portfolio" : "Add Portfolio"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingPortfolio(null);
          setForm({ title: "", category: "", description: "" });
        }}
        onOk={handleSave}
        okText="Save"
        confirmLoading={loading}
      >
        <Input
          placeholder="Title"
          className="mb-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          placeholder="Category"
          className="mb-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <Input.TextArea
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </Modal>
    </div>
  );
}
