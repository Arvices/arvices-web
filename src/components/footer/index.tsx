import React from "react";
import { Link } from "react-router-dom";
import mobileApp from "../../assets/images/arvices-mobile-apps.png";

const Footer: React.FC = () => {
const serviceCategories = [
  "Beauty & Glamour",
  "Cleaning Services",
  "Electrical & Engineering",
  "Plumbing Services",
  "Carpentry & Woodwork",
  "Painting & Decoration",
  "Home Appliance Repair",
  "Interior Design",
  "Event Planning & Management",
  "Catering Services",
  "Photography & Videography",
  "Fitness & Personal Training",
  "Tutoring & Education",
  "Auto Repair & Maintenance",
  "IT & Technical Support",
  "Web & Graphic Design",
  "Real Estate Services",
  "Legal & Documentation",
  "Fashion & Tailoring",
  "Landscaping & Gardening",
  "Pest Control Services",
  "Laundry & Dry Cleaning",
  "Logistics & Delivery Services",
  "Security Services",
  "Welding & Metal Fabrication"
];
let topCategories = serviceCategories.splice(0,6)
  return (
    <footer className="w-full pt-6 text-center sm:text-left mt-16">
      <div className="bg-blue-50 flex-wrap sm:flex pt-15 gap-x-7">
        <div className="pb-10 flex-1/3 md:flex-auto">
          <h5 className="font-medium mb-3">Explore</h5>
          <ul>
            <li className="mb-4">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="mb-4">
              <Link to={"/service-providers"}>Service Providers</Link>
            </li>
            <li className="mb-4">
              <Link to={"/job-posting"}>Job Postings</Link>
            </li>
            <li className="mb-4">
              <Link to={"/activities"}>Activities & Showcase</Link>
            </li>
            <li className="mb-4">
              <Link to={"/help-center"}>Help Center</Link>
            </li>
            <li className="mb-4">Get Recommendations</li>
          </ul>
        </div>
        <div className="pb-10 flex-1/3 md:flex-auto">
          <h5 className="font-medium mb-3">Customer Service</h5>
          <ul>
            <li className="mb-4">
              <Link to={"tel:+2348136243796"}>
                Help Line 1: +234 0859 4895 48
              </Link>
            </li>
            <li className="mb-4">
              <Link to={"tel:+2348136243796"}>
                Help Line 2: +234 0859 4895 48
              </Link>
            </li>
            <li className="mb-4">
              <Link to={"mailto:support@arvices.com"}>
                Email: support@arvices.com
              </Link>
            </li>
          </ul>
        </div>
        <div className="pb-10  flex-1/3 md:flex-auto">
          <h5 className="font-medium mb-3">Top Services Category</h5>
          <ul>
            {topCategories.map((x, index) => {
              return (
                <li key={index} className="mb-4">
                  <Link to={`/service-providers?category=${x}`}>{x}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex-1" />
        <div className="pb-10">
          <img
            src={mobileApp}
            className="w-full max-w-80 border rounded-2xl border-gray-200"
            alt="Arvices Mobile App (Coming Soon)"
          />
          <p className="max-w-80 text-center pt-3">
            Our Mobile app would be available on playstore and apple store very
            soon.
          </p>
        </div>
      </div>
      <div className=" bg-gray-100 text-center py-6">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Arvices. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
