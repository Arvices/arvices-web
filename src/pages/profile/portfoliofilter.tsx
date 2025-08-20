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
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import ShowcaseFeed from "./ShowcaseFeed"; // 👈 Showcase handled separately

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

const sections = ["Portfolio", "Products", "Showcase"];

export function PortfolioFilter({ canManage = false }: { canManage?: boolean }) {
  const [activeSection, setActiveSection] = useState("Portfolio");

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [portfolioPage, setPortfolioPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);

  const [portfolioTotal, setPortfolioTotal] = useState(0);
  const [productsTotal, setProductsTotal] = useState(0);

  const { token } = useAuth();
  const { userId } = useParams<{ userId: string }>();

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [form] = Form.useForm();

  // Order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [orderForm] = Form.useForm();

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
      setPortfolioTotal(res.data.total || res.data.meta?.total || 0);
    } catch (err) {
      console.error("❌ Failed to load portfolio", err);
      message.error("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  // -------- Fetch Products --------
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
      setProductsTotal(res.data.total || res.data.meta?.total || 0);
    } catch (err) {
      console.error("❌ Failed to load products", err);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "Portfolio") fetchPortfolio(portfolioPage);
    if (activeSection === "Products") fetchProducts(productsPage);
    // Showcase is handled by ShowcaseFeed
  }, [activeSection, portfolioPage, productsPage, userId]);

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
              onClick={() => setActiveSection(section)}
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
        ) : activeSection === "Portfolio" ? (
          portfolioItems.length === 0 ? (
            <Empty description="No portfolio items found" />
          ) : (
            <>
              {portfolioItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="text-xs font-medium text-gray-500 mb-1">{item.category}</div>
                  <h3 className="font-semibold tracking-tight text-base mb-2">{item.title}</h3>
                  <div className="text-gray-800 text-sm mb-4">{item.description}</div>
                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowBookingModal(true);
                    }}
                  >
                    Book
                  </Button>
                </div>
              ))}
              <Pagination
                current={portfolioPage}
                pageSize={10}
                total={portfolioTotal}
                onChange={(p) => setPortfolioPage(p)}
                showSizeChanger={false}
              />
            </>
          )
        ) : activeSection === "Products" ? (
          productItems.length === 0 ? (
            <Empty description="No products found" />
          ) : (
            <>
              {productItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold tracking-tight text-base mb-2">{item.title}</h3>
                  <div className="text-gray-800 text-sm mb-2">{item.description}</div>
                  <p className="text-sm text-gray-800 font-medium">₦{item.price}</p>
                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedProduct(item);
                      setShowOrderModal(true);
                    }}
                  >
                    Order
                  </Button>
                </div>
              ))}
              <Pagination
                current={productsPage}
                pageSize={10}
                total={productsTotal}
                onChange={(p) => setProductsPage(p)}
                showSizeChanger={false}
              />
            </>
          )
        ) : (
          <ShowcaseFeed /> // 👈 Showcase fully handled in ShowcaseFeed
        )}

        {/* Booking Modal */}
        <Modal
          title={`Book Service${selectedItem ? `: ${selectedItem.title}` : ""}`}
          open={showBookingModal}
          onCancel={() => setShowBookingModal(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={(values) => {}}>
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
            <Form.Item name="bookingFromTime" label="From Time" rules={[{ required: true }]}>
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
            <Form.Item name="bookingToTime" label="To Time" rules={[{ required: true }]}>
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
            <Form.Item name="totalCost" label="Total Cost" rules={[{ required: true }]}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item name="depositAmount" label="Deposit Amount" rules={[{ required: true }]}>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item name="totalDuration" label="Duration (hours)" rules={[{ required: true }]}>
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
          <Form form={orderForm} layout="vertical" onFinish={(values) => {}}>
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
