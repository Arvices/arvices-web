import { useState, useEffect } from "react";
import { Spin, Empty, Button, Pagination } from "antd";
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
}

interface ProductItem {
  id: number;
  title: string;
  description: string;
  price: number;
  createdDate: string;
}

const sections = ["Portfolio", "Products", "Services"];

export function PortfolioFilter({ canManage = false }: { canManage?: boolean }) {
  const [activeSection, setActiveSection] = useState("Portfolio");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
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

  // Watch section or page changes
  useEffect(() => {
    if (activeSection === "Portfolio") fetchPortfolio(page);
    if (activeSection === "Products") fetchProducts(page);
    // Services left out for now
  }, [activeSection, page]);

  // Which list to render
  const listToRender =
    activeSection === "Portfolio"
      ? portfolioItems
      : activeSection === "Products"
      ? productItems
      : [];

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
                      <div className="text-gray-800 text-sm mb-4">{item.description}</div>

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
                      <div className="text-gray-800 text-sm mb-2">
                        {item.description}
                      </div>
                      <p className="text-sm text-gray-800 font-medium">
                        ₦{item.price}
                      </p>
                    </div>
                  </div>
                ))}

              {/* Services (placeholder for now) */}
              {activeSection === "Services" && (
                <div className="col-span-full">
                  <Empty description="No services found" />
                </div>
              )}
            </div>

            {/* Pagination */}
            {activeSection !== "Services" && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={page}
                  pageSize={10}
                  total={total}
                  onChange={(p) => setPage(p)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
