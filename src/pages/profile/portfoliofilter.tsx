import { useState } from "react";
import { Button, Badge, Card } from "antd";
import { Heart, MessageCircle, Eye } from "feather-icons-react";
import image from "../../assets/images/pro-sample-img.png";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  likes: number;
  comments: number;
  description: string;
  views: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Wedding Makeup at Eko Hotel",
    category: "Bridal",
    image,
    likes: 342,
    comments: 28,
    views: "1.2k",
    description:
      "A radiant bridal look created for an elegant wedding at Eko Hotel. Soft tones and flawless skin for a timeless finish.",
  },
  {
    id: 2,
    title: "Special Event Glam Look",
    category: "Events",
    image,
    likes: 189,
    comments: 15,
    views: "892",
    description:
      "Glamorous makeup for a special night out. Bold eyes, glossy lips, and a luminous glow that steals the spotlight.",
  },
  {
    id: 3,
    title: "Natural Beauty Photoshoot",
    category: "Natural",
    image,
    likes: 256,
    comments: 22,
    views: "1.5k",
    description:
      "Minimalist, fresh, and clean. This natural makeup shoot highlights real beauty with subtle enhancements.",
  },
  {
    id: 4,
    title: "Bold Editorial Look",
    category: "Editorial",
    image,
    likes: 423,
    comments: 35,
    views: "2.1k",
    description:
      "A high-fashion editorial piece featuring dramatic eyes and sculpted features. Perfect for print and runway.",
  },
  {
    id: 5,
    title: "Soft Glam for Date Night",
    category: "Glam",
    image,
    likes: 198,
    comments: 18,
    views: "934",
    description:
      "Romantic and sultry—this soft glam look is ideal for an unforgettable evening out. Blended tones with a touch of shimmer.",
  },
  {
    id: 6,
    title: "Traditional Wedding Ceremony",
    category: "Bridal",
    image,
    likes: 387,
    comments: 41,
    views: "1.8k",
    description:
      "A rich, cultural bridal look celebrating tradition and elegance. Accentuated with bold colors and classic detailing.",
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group"
            >
              {/* Image Cover */}
              <div className="relative aspect-[4/3] bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                {/* Badge */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="bg-white text-gray-800 text-xs font-medium px-2 py-1 rounded shadow">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-base mb-2 group-hover:text-royalblue-main-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <div className="text-gray-800 text-sm mb-4 cursor-auto">
                  {item.description}
                </div>

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
      </div>
    </section>
  );
}
