import { useState } from "react";
import { Button, Badge, Card } from "antd";
import { Heart, MessageCircle, Eye } from "feather-icons-react";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  likes: number;
  comments: number;
  views: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Wedding Makeup at Eko Hotel",
    category: "Bridal",
    image: "figma:asset/91f2fa3eaf322bf3bbf5df5c549886fa07621de0.png",
    likes: 342,
    comments: 28,
    views: "1.2k",
  },
  {
    id: 2,
    title: "Special Event Glam Look",
    category: "Events",
    image: "figma:asset/5b26e8c718b91bfea9bc988a5286b330d2b24646.png",
    likes: 189,
    comments: 15,
    views: "892",
  },
  {
    id: 3,
    title: "Natural Beauty Photoshoot",
    category: "Natural",
    image: "figma:asset/60099bcd289e8438115026c8b8d3875cf6325617.png",
    likes: 256,
    comments: 22,
    views: "1.5k",
  },
  {
    id: 4,
    title: "Bold Editorial Look",
    category: "Editorial",
    image: "figma:asset/11dbcb982f9ba115c7d5cc790cc48a457815fb67.png",
    likes: 423,
    comments: 35,
    views: "2.1k",
  },
  {
    id: 5,
    title: "Soft Glam for Date Night",
    category: "Glam",
    image: "figma:asset/91f2fa3eaf322bf3bbf5df5c549886fa07621de0.png",
    likes: 198,
    comments: 18,
    views: "934",
  },
  {
    id: 6,
    title: "Traditional Wedding Ceremony",
    category: "Bridal",
    image: "figma:asset/5b26e8c718b91bfea9bc988a5286b330d2b24646.png",
    likes: 387,
    comments: 41,
    views: "1.8k",
  },
];

const categories = ["All", "Bridal", "Events", "Natural", "Editorial", "Glam"];

export function PortfolioFilter() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredItems =
    activeFilter === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Portfolio
        </h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveFilter(category)}
              type={activeFilter === category ? "primary" : "default"}
              className={
                activeFilter === category
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 border-none"
                  : "border-purple-200 text-purple-700 hover:bg-purple-50"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              cover={
                <div
                  className="relative w-full h-0 overflow-hidden aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: `url('${item.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 z-10">
                    <Badge
                      count={item.category}
                      style={{
                        backgroundColor: "white",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    />
                  </div>
                </div>
              }
              className="overflow-hidden group hover:shadow-xl transition-all duration-300"
              bodyStyle={{ padding: "16px" }}
            >
              <h3 className="font-semibold text-base mb-2">{item.title}</h3>
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
