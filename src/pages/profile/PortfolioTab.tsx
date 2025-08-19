import { useState, useEffect } from "react";
import { Spin, Empty, Button, Pagination, message } from "antd";
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
  // ✅ if your API returns this, we’ll use it for booking
  serviceId?: number;
}

interface ProductItem {
  id: number;
  title: string;
  price: number;
  description: string;
}

interface ShowcaseItem {
  id: number;
  title: string;
  description: string;
  createdDate: string;
  likes: number;
  comments: number;
  views: number;
}

const sections = ["Portfolio", "Products", "Showcase"];

export function PortfolioFilter({ canManage = false }: { canManage?: boolean }) {
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]>("Portfolio");

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch Portfolio
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
        // 👇 try both shapes in case your API nests service
        serviceId: item.serviceId ?? item.service?.id ?? undefined,
      }));

      setPortfolioItems(mapped);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Failed to load portfolio", err);
      message.error("Failed to load portfolio");
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
        title: item.title || "",
        price: Number(item.price) || 0,
        description: item.description || "",
      }));

      setProductItems(mapped);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Failed to load products", err);
      message.error("Failed to load products");
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
      }));

      setShowcaseItems(mapped);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Failed to load showcase", err);
      message.error("Failed to load showcase");
    } finally {
      setLoading(false);
    }
  };

  // Load on mount + when section/page changes
  useEffect(() => {
    if (activeSection === "Portfolio") fetchPortfolio(page);
    if (activeSection === "Products") fetchProducts(page);
    if (activeSection === "Showcase") fetchShowcase(page);
  }, [activeSection, page]);

  // ---------- CREATE BOOKING from Portfolio ----------
  const handleCreateBooking = async (item: PortfolioItem) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        message.error("Please sign in to create a booking");
        return;
      }

      if (!item.serviceId) {
        message.error("This portfolio item isn't linked to any service.");
        return;
      }

      setLoading(true);

      await axios.post(
        "https://arvicesapi.denateonlineservice.com/bookings/createbookings",
        {
          totalCost: 0,
          totalDuration: 1,
          bookingDate: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
          bookingFromTime: "09:00",
          bookingToTime: "10:00",
          clientName: "Auto Client",
          clientEmail: "client@example.com",
          clientPhone: "00000000000",
          clientLocation: "N/A",
          clientNotes: `Booking from portfolio: ${item.title}`,
          depositAmount: 0,
          serviceId: [String(item.serviceId)], // ✅ MUST be a service id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Booking created. Check Bookings → In Progress.");
    } catch (err: any) {
      console.error("Booking failed:", err?.response?.data || err);
      message.error(err?.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

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
                    className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="p-4">
                      <p className="text-xs text-gray-500">{item.category}</p>
                      <h3 className="font-semibold tracking-tight text-lg mb-1">
                        {item.title}
                      </h3>
                      <div className="text-gray-800 text-sm mb-4">{item.description}</div>

                      {/* Stats + Book */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-700">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{item.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{item.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{item.views}</span>
                          </div>
                        </div>

                        {/* NEW: Book button */}
                        <Button
                          type="primary"
                          onClick={() => handleCreateBooking(item)}
                          disabled={!item.serviceId}
                          title={!item.serviceId ? "No linked service" : ""}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Products */}
              {activeSection === "Products" &&
                productItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold tracking-tight text-base mb-1">
                        {item.title}
                      </h3>
                      <div className="text-gray-800 text-sm mb-2">{item.description}</div>
                      <p className="text-sm font-medium">₦{item.price}</p>
                    </div>
                  </div>
                ))}

              {/* Showcase */}
              {activeSection === "Showcase" &&
                showcaseItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold tracking-tight text-base mb-2">
                        {item.title}
                      </h3>
                      <div className="text-gray-800 text-sm mb-4">{item.description}</div>
                      <p className="text-xs text-gray-500 mb-2">
                        {new Date(item.createdDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{item.likes}</span>
                        </div>
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
            <div className="mt-8 flex justify-center">
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
      </div>
    </section>
  );
}

export default PortfolioFilter;
