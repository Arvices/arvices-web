import { useState, useEffect } from "react";
import {
  Spin,
  Empty,
  Button,
  Pagination,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
} from "antd";
import { Heart, MessageCircle, Eye } from "feather-icons-react";
import axios from "axios";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  likes: number;
  comments: number;
  description: string;
  views: string;
  serviceId?: number;
}

interface ProductItem {
  id: number;
  title: string;
  description: string;
  price: number;
  createdDate: string;
}

interface ShowcaseItem {
  id: number;
  title: string;
  description: string;
  createdDate: string;
  likes: number;
  comments: number;
  views: number;
  liked?: boolean;
}

const sections = ["Portfolio", "Products", "Showcase"];

export function PortfolioFilter({ canManage = false }: { canManage?: boolean }) {
  const [activeSection, setActiveSection] = useState("Portfolio");

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [liking, setLiking] = useState<number | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [form] = Form.useForm();

  // Order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [orderForm] = Form.useForm();

  // -------- Create Booking --------
  const handleOpenBooking = (item: PortfolioItem) => {
    setSelectedItem(item);
    setShowBookingModal(true);
  };

  const handleSubmitBooking = async (values: any) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        message.error("Not authenticated");
        return;
      }

      const payload = {
        totalCost: values.totalCost,
        totalDuration: values.totalDuration,
        bookingDate: values.bookingDate.format("YYYY-MM-DD"),
        bookingFromTime: values.bookingFromTime.format("HH:mm"),
        bookingToTime: values.bookingToTime.format("HH:mm"),
        clientName: values.clientName,
        clientEmail: values.clientEmail,
        clientPhone: values.clientPhone,
        clientLocation: values.clientLocation,
        clientNotes: values.clientNotes,
        depositAmount: values.depositAmount,
        serviceId: [selectedItem?.serviceId || selectedItem?.id || 0],
      };

      const res = await axios.post(
        "https://arvicesapi.denateonlineservice.com/bookings/createbookings",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Booking created successfully!");
      setShowBookingModal(false);
      form.resetFields();
    } catch (err: any) {
      console.error("❌ Booking failed:", err.response?.data || err);
      message.error(err.response?.data?.message || "Failed to create booking");
    }
  };

  // -------- Create Order --------
  const handleOpenOrder = (item: ProductItem) => {
    setSelectedProduct(item);
    setShowOrderModal(true);
  };

  const handleSubmitOrder = async (values: any) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        message.error("Not authenticated");
        return;
      }

      const payload = {
        quantity: values.quantity,
        productId: selectedProduct?.id,
      };

      const res = await axios.post(
        "https://arvicesapi.denateonlineservice.com/order/createorder",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Order created successfully!");
      setShowOrderModal(false);
      orderForm.resetFields();
    } catch (err: any) {
      console.error("❌ Order failed:", err.response?.data || err);
      message.error(err.response?.data?.message || "Failed to create order");
    }
  };

  // -------- Toggle Like --------
  const handleToggleLike = async (item: ShowcaseItem) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      message.error("Not authenticated");
      return;
    }

    setLiking(item.id);

    try {
      // Call the API (assuming it toggles like automatically)
      const res = await axios.post(
        `https://arvicesapi.denateonlineservice.com/showcase/likeshowcase/${item.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // assume API responds with updated "liked" and "likes"
      const { liked, likes } = res.data.response;

      setShowcaseItems((prev) =>
        prev.map((s) =>
          s.id === item.id ? { ...s, liked, likes } : s
        )
      );
    } catch (err: any) {
      console.error("❌ Toggle failed:", err.response?.data || err);
      message.error(err.response?.data?.message || "Failed to toggle like");
    } finally {
      setLiking(null);
    }
  };

  // -------- Fetch Portfolio --------
  const fetchPortfolio = async (pageNum: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await axios.get(
        "https://arvicesapi.denateonlineservice.com/portfolio/getallportfolio",
        {
          params: { orderBy: "DESC", page: pageNum, limit: 10 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const mapped: PortfolioItem[] = (res.data.response || []).map((item: any) => ({
        id: item.id,
        title: item.title || "",
        category: item.category || "",
        likes: item.likes ?? 0,
        comments: item.comments ?? 0,
        description: item.description || "",
        views: item.views ? String(item.views) : "0",
        serviceId: item.serviceId,
      }));

      setPortfolioItems(mapped);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Failed to load portfolio", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Products
  const fetchProducts = async (pageNum: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await axios.get(
        "https://arvicesapi.denateonlineservice.com/product/getallproduct",
        {
          params: { orderBy: "DESC", page: pageNum, limit: 10 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const mapped: ProductItem[] = (res.data.response || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        createdDate: item.createdDate,
      }));

      setProductItems(mapped);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Showcase
  const fetchShowcase = async (pageNum: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await axios.get(
        "https://arvicesapi.denateonlineservice.com/showcase/getgeneralshowcasetimeline",
        {
          params: { orderBy: "DESC", page: pageNum, limit: 10 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const mapped: ShowcaseItem[] = (res.data.response || []).map((item: any) => ({
        id: item.id,
        title: item.title || "",
        description: item.description || "",
        createdDate: item.createdDate,
        likes: item.likes ?? 0,
        comments: item.comments ?? 0,
        views: item.views ?? 0,
        liked: item.liked ?? false,
      }));

      setShowcaseItems(mapped);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Failed to load showcase", err);
    } finally {
      setLoading(false);
    }
  };

  // Watch section or page changes
  useEffect(() => {
    if (activeSection === "Portfolio") fetchPortfolio(page);
    if (activeSection === "Products") fetchProducts(page);
    if (activeSection === "Showcase") fetchShowcase(page);
  }, [activeSection, page]);

  const listToRender =
    activeSection === "Portfolio"
      ? portfolioItems
      : activeSection === "Products"
      ? productItems
      : showcaseItems;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-8">
          {activeSection}
        </h2>

        {/* Section Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {sections.map((section) => (
            <Button
              key={section}
              onClick={() => {
                setActiveSection(section);
                setPage(1);
              }}
              type={activeSection === section ? "primary" : "default"}
            >
              {section}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Spin size="large" />
          </div>
        ) : listToRender.length === 0 ? (
          <Empty description={`No ${activeSection.toLowerCase()} items found`} />
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {/* Portfolio */}
              {activeSection === "Portfolio" &&
                portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="p-4">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        {item.category}
                      </div>
                      <h3 className="font-semibold tracking-tight text-base mb-2">
                        {item.title}
                      </h3>
                      <div className="text-gray-800 text-sm mb-4">
                        {item.description}
                      </div>
                      <Button type="primary" onClick={() => handleOpenBooking(item)}>
                        Book
                      </Button>
                    </div>
                  </div>
                ))}

              {/* Products */}
              {activeSection === "Products" &&
                productItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold tracking-tight text-base mb-2">
                        {item.title}
                      </h3>
                      <div className="text-gray-800 text-sm mb-2">{item.description}</div>
                      <p className="text-sm text-gray-800 font-medium">₦{item.price}</p>
                      <Button type="primary" onClick={() => handleOpenOrder(item)}>
                        Order
                      </Button>
                    </div>
                  </div>
                ))}

              {/* Showcase */}
              {activeSection === "Showcase" &&
                showcaseItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold tracking-tight text-base mb-2">
                        {item.title}
                      </h3>
                      <div className="text-gray-800 text-sm mb-4">
                        {item.description}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        {new Date(item.createdDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-700">
                        {/* ❤️ Like button */}
                        <button
                          className="flex items-center space-x-1 focus:outline-none disabled:opacity-50"
                          onClick={() => handleToggleLike(item)}
                          disabled={liking === item.id}
                        >
                          <Heart
                            className={`w-4 h-4 cursor-pointer ${
                              item.liked ? "text-red-500" : ""
                            }`}
                            fill={item.liked ? "red" : "none"}
                          />
                          <span>{item.likes}</span>
                        </button>

                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{item.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

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
          </>
        )}

        {/* Booking Modal */}
        <Modal
          title={`Book Service${selectedItem ? `: ${selectedItem.title}` : ""}`}
          open={showBookingModal}
          onCancel={() => setShowBookingModal(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmitBooking}>
            <Form.Item name="clientName" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="clientEmail"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="clientPhone" label="Phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="clientLocation" label="Location" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="clientNotes" label="Notes">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="bookingDate" label="Booking Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="bookingFromTime"
              label="From Time"
              rules={[{ required: true }]}
            >
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
            <Form.Item name="bookingToTime" label="To Time" rules={[{ required: true }]}>
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
            <Form.Item name="totalCost" label="Total Cost" rules={[{ required: true }]}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item
              name="depositAmount"
              label="Deposit Amount"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item
              name="totalDuration"
              label="Duration (hours)"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-full" min={1} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Confirm Booking
            </Button>
          </Form>
        </Modal>

        {/* Order Modal */}
        <Modal
          title={`Order Product${selectedProduct ? `: ${selectedProduct.title}` : ""}`}
          open={showOrderModal}
          onCancel={() => setShowOrderModal(false)}
          footer={null}
        >
          <Form form={orderForm} layout="vertical" onFinish={handleSubmitOrder}>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: "Please enter quantity" }]}
            >
              <InputNumber className="w-full" min={1} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Confirm Order
            </Button>
          </Form>
        </Modal>
      </div>
    </section>
  );
}
