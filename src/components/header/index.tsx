import React, { useState } from "react";
import arvicesLogo from "../../assets/logo.svg";
import Hamburger from "hamburger-react";
import Overlay from "../overlay";
import { Link } from "react-router-dom";
import "./style.css";

let color = "#272727";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileOpen = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <header className="border-b border-gray-200 sticky top-0 z-[100] bg-white dark:bg-zinc-900">
      <div className="flex items-center h-14">
        {/**Logo Container */}
        <div className="w-max">
          <Link to={"/"}>
            <img
              src={arvicesLogo}
              className="w-8 h-8 inline-block mr-1"
              alt="Arvices Logo"
              title="Arvices Logo"
            />
            <h1 className="inline relative top-0.5 text-[20px] font-medium text-gray-800 dark:text-white">
              Arvices
              <span className="sr-only"> - Your Everyday Help Platform</span>
            </h1>
          </Link>
        </div>

        <div className="flex-1"></div>
        <div className="hidden md:block w-max">
          <ul>
            <li className="inline-block px-3">
              <Link to={"/home"}>Home</Link>{" "}
            </li>
            <li className="inline-block px-3">
              <Link to={"/home"}>Activities</Link>{" "}
            </li>
            <li className="inline-block px-3">
              <Link to={"/home"}>Providers / Requests</Link>{" "}
            </li>
            <li className="inline-block px-3">
              <Link to={"/home"}>Help Center</Link>{" "}
            </li>
          </ul>
        </div>
        <div className="lg:flex-1" />
        <div className="hidden md:block w-max">
          <div className="flex items-center gap-x-3">
            <div>
              <button>Login</button>
            </div>
            <div>
              <button className="py-2 px-5 rounded-4xl bg-blue-700 text-white">
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div className="w-max md:hidden">
          <Hamburger
            toggled={mobileOpen}
            size={18}
            toggle={toggleMobileOpen}
            color={color}
          />
          <Overlay isOpen={mobileOpen} toggle={toggleMobileOpen}>
            <div className="py-12"></div>
            <div className="p-4">
              <ul>
                <li className="mb-8 text-gray-700">
                  <Link onClick={toggleMobileOpen} to={"/"}>
                    Home
                  </Link>
                </li>
                <li className="mb-8 text-gray-700">
                  <Link onClick={toggleMobileOpen} to={"/"}>
                    Activities
                  </Link>
                </li>
                <li className="mb-8 text-gray-700">
                  <Link onClick={toggleMobileOpen} to={"/"}>
                    Provider / Requests
                  </Link>
                </li>
                <li className="mb-8 text-gray-700">
                  <Link onClick={toggleMobileOpen} to={"/"}>
                    Help Center
                  </Link>
                </li>
              </ul>
              <div className="py-4"></div>
              <div className="mb-4 p-[1px] rounded bg-gradient-to-r from-[#0026BD] to-[#FF4489]">
                <button className="bg-white login-btn block w-full p-3 rounded font-medium">
                  <span className="primary-gradient-text">Login</span>
                </button>
              </div>

              <div>
                <button className=" block border w-full p-3 rounded primary-gradient-bg text-white font-medium">
                  Sign Up
                </button>
              </div>
            </div>
          </Overlay>
        </div>
      </div>
    </header>
  );
};

export default Header;
