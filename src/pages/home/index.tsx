import React, { useEffect, useState } from "react";
import { MapPin, Search } from "feather-icons-react";
import "./style.css";
import heroImg from "../../assets/images/services.svg";
import heroImg1 from "../../assets/images/services1.svg";
import heroImg2 from "../../assets/images/services2.svg";
import heroImg3 from "../../assets/images/services3.svg";
import heroImg4 from "../../assets/images/services4.svg";
import autoMechanics from "../../assets/images/h-cat-auto-mechanics.svg";
import catering from "../../assets/images/h-cat-catering.svg";
import cleaning from "../../assets/images/h-cat-cleaning.svg";
import electrical from "../../assets/images/h-cat-electrical.svg";
import furnitures from "../../assets/images/h-cat-furnitures.svg";
import interiors from "../../assets/images/h-cat-interiors.svg";
import logistics from "../../assets/images/h-cat-logistics.svg";
import makeup from "../../assets/images/h-cat-makeup.svg";
import photography from "../../assets/images/h-cat-photography.svg";
import plumbing from "../../assets/images/h-cat-plumbing.svg";
import tailoring from "../../assets/images/h-cat-tailoring.svg";
import {
  ActivityCard,
  CatCard,
  CategoryDataItem,
  ProviderCard,
  Showcase,
} from "../../components/cards/appcards";
import { getTopProfessionals } from "../../api-services/auth-re";
import LocationInput from "../../components/map/LocationInput";
import { useCategory } from "../../contexts/CategoryContext";
import { Link, useNavigate } from "react-router-dom";
import { ContentHOC } from "../../components/nocontent";
import { parseHttpError } from "../../api-services/parseReqError";
import { getGeneralShowcaseTimeline } from "../../api-services/showcase.service";
import { useAuth } from "../../contexts/AuthContext";
import { useNotificationContext } from "../../contexts/NotificationContext";

export const categoryData: CategoryDataItem[] = [
  {
    title: "Auto Mechanics",
    tagline: "Vehicle repairs & servicing",
    img: autoMechanics,
  },
  {
    title: "Catering",
    tagline: "Delicious event catering",
    img: catering,
  },
  {
    title: "Cleaning",
    tagline: "Professional home & office cleaning",
    img: cleaning,
  },
  {
    title: "Electrical",
    tagline: "Wiring, repairs, and installations",
    img: electrical,
  },
  {
    title: "Furnitures",
    tagline: "Custom and ready-made furniture",
    img: furnitures,
  },
  {
    title: "Interiors",
    tagline: "Interior decoration & design",
    img: interiors,
  },
  {
    title: "Logistics",
    tagline: "Swift delivery & transport",
    img: logistics,
  },
  {
    title: "Makeup",
    tagline: "Beauty for all occasions",
    img: makeup,
  },
  {
    title: "Photography",
    tagline: "Capture your moments",
    img: photography,
  },
  {
    title: "Plumbing",
    tagline: "Pipes, taps, and repairs",
    img: plumbing,
  },
  {
    title: "Tailoring",
    tagline: "Custom fashion & alterations",
    img: tailoring,
  },
];

const Home: React.FC = () => {
  const auth = useAuth();
  const { openNotification } = useNotificationContext();
  const [topLoading, setTopLoading] = useState(true);
  const [topError, setTopError] = useState("");
  const [topProfessionals, setTopProfessionals] = useState<any[]>([]);
  const [showcaseLoading, setShowcaseLoading] = useState(true);
  const [showcaseError, setShowcaseError] = useState("");
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const showcaseToShow = showcases.filter(
    (x: any) => x?.attachments?.length > 0,
  );
  console.log({ showcases, showcaseToShow });

  const navigate = useNavigate();
  const category = useCategory();
  const [locationInput, setLocationInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const fetchTopProfessionals = async () => {
    try {
      setTopLoading(true);
      setTopError("");
      const res = await getTopProfessionals();
      setTopProfessionals(res?.data?.response || []);
    } catch (err) {
      let message = parseHttpError(err);
      setTopError(message);
    } finally {
      setTopLoading(false);
    }
  };
  const fetchShowcase = async () => {
    try {
      setShowcaseLoading(true);
      setShowcaseError("");
      const res = await getGeneralShowcaseTimeline();
      setShowcases(res?.data?.response || []);
    } catch (err) {
      let message = parseHttpError(err);
      setShowcaseError(message);
    } finally {
      setShowcaseLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProfessionals();
    fetchShowcase();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (selectedCategory) {
      queryParams.append("category", selectedCategory);
    }
    if (locationInput) {
      queryParams.append("location", locationInput);
    }
    const queryString = queryParams.toString();
    const path = `/service-providers${queryString ? "?" + queryString : ""}`;
    navigate(path);
  };

  const viewMoreUpdates = () => {
    if (auth.isAuthenticated) {
      navigate("/activities");
    } else {
      openNotification(
        "topRight",
        "To view more updates, you need to login. You wil be redirected to login now",
        "",
        "error",
      );
    }
  };

  return (
    <section className="min-h-screen text-royalblue-shade5 pt-10">
      {}
      <LocationInput
        open={showModal}
        onClose={() => setShowModal(false)}
        onApply={(locationData) => {
          console.log("Selected location:", locationData);
          setLocationInput(locationData.address);
          setShowModal(false);
        }}
      />
      <div
        id="hero-section"
        className="pt-14 pb-14 px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto gradient-soft"
      >
        <div id="hero-top-images" className="flex justify-around pb-5">
          <div>
            <img className="inline w-25 h-25 relative top-4" src={heroImg1} />
          </div>
          <div>
            <img
              className="inline w-25 h-25 relative bottom-6"
              src={heroImg2}
            />
          </div>
          <div>
            <img className="inline w-25 h-25 relative top-5" src={heroImg3} />
          </div>
        </div>
        <div>
          <h1 className="tracking-tighter leading-[140%] text-center text-gray-900 text-4xl md:text-5xl lg:text-6xl font-medium pb-4">
            Find Professional Service Providers in Your Area.
          </h1>
          <p className="leading-8 text-center">
            We connect you to the best rated service providers and product
            vendors in your locality. We Take care of the search for trustworthy
            and seasoned professional who guarantee a good Job.
          </p>
          <div className="text-[13px] mt-10 sm:gap-x-2 mx-auto bg-white rounded-2xl  p-5">
            <p className="text-sm text-gray-500 mb-2">
              Search by category and location. Enter your preferred search
              parameters.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-3">
              {}
              <div>
                <select
                  className="border-gray-200 px-2 rounded h-12 w-full bg-gray-50 border focus:outline-none focus:ring-0 text-sm font-medium"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {category.categories.map((cat, index) => {
                    return (
                      <option key={index} value={cat.id}>
                        {cat.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <input
                  name="location"
                  placeholder="Enter the nearest address"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="border-gray-200 px-2 rounded h-12 w-full bg-gray-50 border focus:outline-none focus:ring-0 text-sm font-medium"
                />
              </div>
              <div>
                <button
                  onClick={() => setShowModal((prev) => !prev)}
                  className="border-gray-200 px-2 rounded h-12 w-full bg-gray-50 border focus:outline-none focus:ring-0 text-sm font-medium"
                >
                  <MapPin className="inline-block mr-2 w-4 h-4" />
                  <span className="inline">Use GPS Location</span>
                </button>
              </div>
              <div>
                <button
                  onClick={handleSearch}
                  className="h-12 w-full cursor-pointer text-white rounded bg-gradient-to-r from-purple-400 to-pink-500 focus:outline-none focus:ring-0 text-sm font-medium"
                >
                  <Search className="inline-block mr-2 w-4 h-4" />
                  <span className="inline">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="hero-bottom-images" className="flex justify-around mt-10">
          <div>
            <img className="inline w-25 h-25" src={heroImg} />
          </div>
          <div>
            <img className="inline w-25 h-25" src={heroImg4} />
          </div>
        </div>
      </div>
      <div className="py-10" />
      {}
      <div
        id="home-category-section"
        className="pt-5 pb-14 px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto cat-bg-img"
      >
        <div>
          <h1 className="font-medium text-3xl md:text-4xl lg:text-5xl leading-[150%] tracking-tight">
            We Connect You to{" "}
            <span className="text-royalblue-main">Seasoned Professionals</span>{" "}
            In Different Services Categories.
          </h1>
        </div>
        <div className="flex flex-wrap gap-4 mt-10">
          {categoryData.map((category, index) => {
            return <CatCard key={index} {...category} />;
          })}
        </div>
      </div>
      <div
        id="home-professional-section"
        className="pt-30 pb-14 px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto border-b border-gray-100"
      >
        <div className="mb-10">
          <h1 className="font-medium text-3xl md:text-4xl lg:text-5xl leading-[150%] tracking-tight">
            Our Top Rated{" "}
            <span className="text-royalblue-main">Service Providers</span>
          </h1>
        </div>
        <div>
          <div className="flex flex-wrap gap-5">
            <ContentHOC
              loading={topLoading}
              error={!!topError}
              errMessage={topError || ""}
              actionFn={getTopProfessionals}
              noContent={topProfessionals.length === 0}
              minHScreen={false}
              UIComponent={topProfessionals.map((provider, index) => {
                return (
                  <div
                    key={index}
                    className="max-w-[400px] min-w-[300px] flex-1"
                  >
                    <ProviderCard provider={provider} />
                  </div>
                );
              })}
            />
          </div>
        </div>

        <div className="mt-5">
          <Link to={`/service-providers`}>
            <button className="cursor-pointer w-full p-3 border border-gray-300 rounded-[8px]">
              View More
            </button>
          </Link>
        </div>
      </div>
      {}
      <div
        id="home-activities-section"
        className="pt-10 sm:pt-10 pb-14 px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto"
      >
        <div className="mb-10">
          <h1 className="font-medium text-3xl md:text-4xl lg:text-5xl leading-[150%] tracking-tight">
            Activity Updates &{" "}
            <span className="text-royalblue-main">
              Showcase from our service providers
            </span>
          </h1>
        </div>

        <div>
          <div className="flex flex-wrap gap-5">
            <ContentHOC
              loading={showcaseLoading}
              error={!!showcaseError}
              errMessage={showcaseError || ""}
              actionFn={fetchShowcase}
              noContent={showcaseToShow.length === 0}
              minHScreen={false}
              UIComponent={showcaseToShow.map((showcase, index) => {
                return (
                  <div
                    key={index}
                    className="max-w-[400px] min-w-[300px] flex-1"
                  >
                    <ActivityCard showcase={showcase} />
                  </div>
                );
              })}
            />
          </div>
        </div>
        <div className="mt-5">
          <button
            onClick={viewMoreUpdates}
            className="cursor-pointer w-full p-3 border border-gray-300 rounded-[8px]"
          >
            View More
          </button>
        </div>
      </div>
    </section>
  );
};
export default Home;
