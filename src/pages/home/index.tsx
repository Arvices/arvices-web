import React from "react";
import Icon from "feather-icons-react";
import "./style.css";

import heroImg from "../../assets/images/services.svg";
import heroImg1 from "../../assets/images/services1.svg";
import heroImg2 from "../../assets/images/services2.svg";
import heroImg3 from "../../assets/images/services3.svg";
import heroImg4 from "../../assets/images/services4.svg";

// category icons imports
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
} from "../../components/cards/appcards";

const categoryData: CategoryDataItem[] = [
  {
    title: "Auto Mechanics",
    tagline: "Vehicle repairs & servicing",
    img: autoMechanics,
  },
  { title: "Catering", tagline: "Delicious event catering", img: catering },
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
  { title: "Logistics", tagline: "Swift delivery & transport", img: logistics },
  { title: "Makeup", tagline: "Beauty for all occasions", img: makeup },
  { title: "Photography", tagline: "Capture your moments", img: photography },
  { title: "Plumbing", tagline: "Pipes, taps, and repairs", img: plumbing },
  {
    title: "Tailoring",
    tagline: "Custom fashion & alterations",
    img: tailoring,
  },
];

const Home: React.FC = () => {
  return (
    <section className="min-h-screen text-royalblue-shade5 pt-10">
      {/* Hero Section */}
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
          <h1 className="tracking-tighter leading-[140%] text-center text-royalblue-main text-4xl md:text-5xl lg:text-6xl font-medium pb-4">
            Find Professional Service Providers in Your Area.
          </h1>
          <p className="leading-8 text-center">
            We connect you to the best rated service providers and product
            vendors in your locality. We Take care of the search for trustworthy
            and seasoned professional who guarantee a good Job.
          </p>
          <div className="flex max-w-[550px] text-[13px] mt-10 sm:gap-x-2 mx-auto">
            <div className="relative flex-1 border border-gray-200 pl-0 sm:pl-3 rounded-4xl h-auto">
              <select className=" w-[calc(100%-120px)] p-4 focus:border-0 hover:border-0 active:border-0">
                <option value={""}>Select category</option>
              </select>
              <div className="w-max absolute top-[15px] right-2">
                <button className="w-max font-medium cursor-pointer">
                  <span>Add Location </span>
                  <span>
                    <Icon className="inline" size={18} icon="map-pin" />
                  </span>
                </button>
              </div>
            </div>
            <div>
              <button className="p-4 rounded-4xl bg-royalblue-main  text-white dark:text-white cursor-pointer">
                <span className="hidden sm:inline">Search </span>
                <Icon className="inline" size={18} icon="search" />
              </button>
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
      {/* Categories Section */}
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
      {/* Professionals Section */}
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
          <div className="max-w-[400px] w-full">
            <ProviderCard />
          </div>
        </div>

        <div className="mt-5 md:hidden">
          <button className="w-full p-3 border border-gray-300 rounded-[8px]">
            View More
          </button>
        </div>
      </div>
      {/* Activities Section */}
      <div
        id="home-activities-section"
        className="pt-20 sm:pt-30 pb-14 px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto"
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
          <div className="max-w-[400px] w-full">
            <ActivityCard />
          </div>
        </div>
        <div className="mt-5 md:hidden">
          <button className="w-full p-3 border border-gray-300 rounded-[8px]">
            View More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
