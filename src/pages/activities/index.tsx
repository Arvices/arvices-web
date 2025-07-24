import React, { useState } from "react";
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
  ArrowUpRight, // <- used as fallback for "New Feature"
} from "feather-icons-react";
import { Heart, MessageCircle, Bookmark, Eye } from "feather-icons-react";

import { Select } from "antd";
import { ChevronDown } from "feather-icons-react";
const { Option } = Select;
import pic from "../../assets/images/pro-sample-img.png";
const users = [
  { name: "Sarah Johnson", category: "Hair Stylist", followerCount: 3200 },
  { name: "Mike Chen", category: "Auto Mechanic", followerCount: 1800 },
  { name: "Emma Williams", category: "House Cleaner", followerCount: 2500 },
  { name: "Linda Okafor", category: "Fashion Designer", followerCount: 4100 },
  { name: "Tunde Bako", category: "Graphic Designer", followerCount: 2900 },
  { name: "Grace Bello", category: "Event Planner", followerCount: 3700 },
];
function formatFollowerCount(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return count.toString();
}
type ParsedCaption = {
  mainText: string;
  hashtags: string[];
};

function extractCaptionAndHashtags(text: string): ParsedCaption {
  const hashtagRegex = /#[\w]+/g;
  const hashtags = text.match(hashtagRegex) || [];

  // Remove hashtags from text
  const mainText = text.replace(hashtagRegex, "").trim().replace(/\s+/g, " ");

  return {
    mainText,
    hashtags,
  };
}

export const updateIconMap: Record<
  string,
  { icon: React.JSX.Element; colorClass: string }
> = {
  "Live Updates": {
    icon: <TrendingUp className="inline w-3 h-3 text-pink-600" />,
    colorClass: "text-pink-600",
  },
  "New Provider": {
    icon: <UserPlus className="inline w-3 h-3 text-blue-600" />,
    colorClass: "text-blue-600",
  },
  Promotion: {
    icon: <Percent className="inline w-3 h-3 text-green-600" />,
    colorClass: "text-green-600",
  },
  Milestone: {
    icon: <Star className="inline w-3 h-3 text-yellow-500" />,
    colorClass: "text-yellow-500",
  },
  Achievement: {
    icon: <Award className="inline w-3 h-3 text-indigo-600" />,
    colorClass: "text-indigo-600",
  },
  "Booking Alert": {
    icon: <Calendar className="inline w-3 h-3 text-red-500" />,
    colorClass: "text-red-500",
  },
  "New Feature": {
    icon: <Tool className="inline w-3 h-3 text-teal-600" />,
    colorClass: "text-teal-600",
  },
};
const updates = [
  {
    updateType: "Live Updates",
    title: "Beauty services trending up 25%",
    description: "Skincare and makeup bookings are rising this week",
  },
  {
    updateType: "New Provider",
    title: "New 5-star rated plumber available",
    description: "Highly rated professional just joined your area",
  },
  {
    updateType: "Promotion",
    title: "Flash sale: Cleaning services 30% off",
    description: "Limited time offer ending tonight",
  },
  {
    updateType: "Milestone",
    title: "Boluwatife Abubakar reached 2k follows",
    description: "Popular makeup artist hits milestone",
  },
  {
    updateType: "Achievement",
    title: "Best rated car mechanic this month",
    description: "AutoFix Pro wins monthly excellence award",
  },
  {
    updateType: "Booking Alert",
    title: "Weekend booking slots filling fast",
    description: "High demand for weekend appointments",
  },
  {
    updateType: "New Feature",
    title: "New service category: Pet Care",
    description: "Find grooming and pet sitting services",
  },
];
const Activities = (): React.ReactNode => {
  const categories = [
    "Cleaning",
    "Plumbing",
    "Makeup",
    "Pet Care",
    "Car Repair",
  ];
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  return (
    <section className="min-h-screen pt-13 bg-[#FBFBFB]">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Page Starts*/}
        <div></div>
        <div className="md:flex gap-x-3 mt-5">
          <div className="card-shadow basis-1/5 py-5 px-3 rounded">
            <p className="font-medium ">Live Updates</p>
            {updates.map((update, index) => {
              return (
                <div
                  key={index}
                  className="mt-3 p-2 w-full border rounded border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="w-max">
                      <div
                        className={`${updateIconMap[update.updateType].colorClass} text-[13px]`}
                      >
                        {updateIconMap[update.updateType].icon}{" "}
                        {update.updateType}
                      </div>
                    </div>
                    <div className="flex-1"></div>
                    <div className="w-max">
                      <small className="text-[12px] text-gray-500">
                        {" "}
                        <Clock className="inline w-2 h-2 text-gray-400" /> 2h
                        ago
                      </small>
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-800">{update.title}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-500">
                      {update.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="basis-3/5">
            <div className="card-shadow rounded p-4" id="updates-header">
              <div className="flex items-center">
                <div className="flex w-max gap-x-3 items-center">
                  <div className="bg-amber-50 rounded-[5px]  border border-amber-300 p-2 px-2">
                    <p className="font-medium text-[15px] text-gray-700 cursor-pointer">
                      All Updates{" "}
                      <span className="w-2 h-2 inline-block rounded-2xl bg-amber-400"></span>
                    </p>
                  </div>
                  <div className="mr-5">
                    <p className="font-medium text-[15px] text-gray-500 cursor-pointer">
                      Following
                    </p>
                  </div>
                </div>
                <div className="flex-1"></div>
                <div className="flex w-max gap-x-3 items-center">
                  <div className="">
                    <Select
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      placeholder="Category Filter"
                      suffixIcon={
                        <ChevronDown className="text-gray-500 w-4 h-4" />
                      }
                      allowClear
                    >
                      {categories.map((cat) => (
                        <Option key={cat} value={cat}>
                          {cat}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <button className="text-gray-600 text-[14px] cursor-pointer">
                      <MapPin className="inline w-4 h-4 relative bottom-[1px]" />{" "}
                      Location Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="card-shadow rounded p-4">
                <div className="flex items-center gap-3">
                  <div className="avatar-container w-max">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={pic}
                      alt="Avatar"
                    />
                  </div>
                  <div className="w-max">
                    <p className="font-medium leading-[0.8]">
                      Boluwatife Abubakar
                    </p>
                    <small className="text-sm text-gray-500 leading-1">
                      Make Up Artist
                    </small>
                  </div>
                  <div className="flex-1" />
                  <div className="w-max">
                    <small className="text-[12px] text-gray-500">
                      <Clock className="inline w-3 h-3 text-gray-400 mr-1" />
                      2h ago
                    </small>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="relative rounded-2xl w-full aspect-[5/3] overflow-hidden">
                    <img
                      src={pic}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <p>
                    My client is going for a meet up. Had to give her a special
                    look. ✨#beckystudios #brideglam #makeuptransformation
                  </p>
                </div>
                <div className="border-t my-3 border-gray-100"></div>
                <div className="flex items-center gap-4 px-2 py-1 text-sm text-gray-700">
                  {/* Likes */}
                  <div className="flex items-center gap-1 w-max hover:text-red-500 cursor-pointer transition-colors">
                    <Heart size={16} />
                    <span>2.5k</span>
                  </div>

                  {/* Comments */}
                  <div className="flex items-center gap-1 w-max hover:text-blue-500 cursor-pointer transition-colors">
                    <MessageCircle size={16} />
                    <span>3k</span>
                  </div>

                  {/* Views */}
                  <div className="flex items-center gap-1 w-max hover:text-purple-600 cursor-pointer transition-colors">
                    <Eye size={16} />
                    <span>8.2k</span>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Save */}
                  <div className="flex items-center gap-1 w-max hover:text-emerald-600 cursor-pointer transition-colors">
                    <Bookmark size={16} />
                    <span>Save</span>
                  </div>
                </div>

                <div className="border-t my-3 border-gray-100"></div>
                {/* Add Comment */}
                <div className="mt-2 px-2 relative">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full pr-10 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-royalblue-main text-white rounded-full p-1 cursor-pointer hover:scale-105 transition-transform">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="basis-1/5 py-5 px-3 rounded card-shadow">
            <p className="font-medium mb-3">🔥 Top Providers </p>
            {users.map((user, index) => {
              return (
                <div key={index} className="mb-3 p-2 border border-gray-200 rounded-lg shadow-sm bg-white">
                  {/* First Block: Avatar + Info */}
                  <div className="flex items-center gap-2">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={pic}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name / Category / Follower Count */}
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.category}</p>
                      <p className="text-xs text-gray-400">
                        {formatFollowerCount(user.followerCount)} followers
                      </p>
                    </div>
                  </div>

                  {/* Second Block: Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    <button className="cursor-pointer flex-1 text-white text-xs px-3 py-[5px] rounded border bg-royalblue-main border-royalblue-main">
                      Follow
                    </button>
                    <button className="cursor-pointer flex-1 text-royalblue-main text-xs px-3 py-[5px] rounded border border-royalblue-main bg-white">
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
