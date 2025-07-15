import React from "react";
import { Link } from "react-router-dom";
import mobileApp from "../../assets/images/arvices-mobile-apps.png"
const mobileAppUrl = ""

const Footer: React.FC = () => {
  return (
    <footer className="w-full pt-6 text-center md:text-left mt-16">
      <div className="bg-blue-50 md:flex pt-15 gap-x-7">
        <div className="pb-10">
          <h5 className="font-medium mb-3">Explore</h5>
          <ul>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
          </ul>
        </div>
        <div className="pb-10">
          <h5 className="font-medium mb-3">Customer Service</h5>
          <ul>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
          </ul>
        </div>
        <div className="pb-10">
          <h5 className="font-medium mb-3">Top Category</h5>
          <ul>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
            <li className="mb-4"><Link to={'/'}>Home</Link></li>
          </ul>
        </div>
        <div className="flex-1" />
        <div className="pb-10">
          <img src={mobileApp} className="w-full max-w-80 border rounded-2xl border-gray-200" alt="Arvices Mobile App (Coming Soon)" />
          <p className="max-w-80 text-center pt-3">Our Mobile app would be available on playstore and apple store very soon.</p>
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
