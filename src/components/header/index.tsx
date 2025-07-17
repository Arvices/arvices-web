import React, { useState } from "react";
import arvicesLogo from "../../assets/logo.svg";
import Hamburger from "hamburger-react";
import Overlay from "../overlay";
import { Link } from "react-router-dom";
import "./style.css";
import { useAuth } from "../../contexts/AuthContext";

let color = "#272727";

const Header: React.FC = () => {
  const auth = useAuth();
  console.log({ auth });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileOpen = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <header className="border-b border-gray-200 w-full fixed top-0 z-[100] bg-white dark:bg-zinc-900 px-5 sm:px-8 md:px-16 lg:px-30 max-w-[1280px] mx-auto">
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
              <Link to={"/"}>Home</Link>{" "}
            </li>
            <li className="inline-block px-3">
              <Link to={"/activities"}>Activities</Link>{" "}
            </li>
            {auth.isClient ||
              (!auth.isClient && !auth.isProvider && (
                <li className="inline-block px-3">
                  <Link to={"/service-providers"}>View Providers</Link>{" "}
                </li>
              ))}
            {auth.isProvider && (
              <li className="inline-block px-3">
                <Link to={"/job-posting"}>Available Job Posts</Link>{" "}
              </li>
            )}
            <li className="inline-block px-3">
              <Link to={"/help-center"}>Help Center</Link>{" "}
            </li>
          </ul>
        </div>
        <div className="lg:flex-1" />
        <div className="hidden md:block w-max">
          <div className="flex items-center gap-x-3">
            <div>
              <Link to={"/login"}>
                <button className="cursor-pointer">Login</button>
              </Link>
            </div>
            <div>
              <Link to={"/signup"}>
                <button className="py-2 px-5 rounded-4xl bg-royalblue-main text-white cursor-pointer">
                  Get Started
                </button>
              </Link>
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
                  <Link onClick={toggleMobileOpen} to={"/activities"}>
                    Activities
                  </Link>
                </li>
                {auth.isClient ||
                  (!auth.isClient && !auth.isProvider && (
                    <li className="mb-8 text-gray-700">
                      <Link
                        onClick={toggleMobileOpen}
                        to={"/service-providers"}
                      >
                        View Providers
                      </Link>{" "}
                    </li>
                  ))}
                {auth.isProvider && (
                  <li className="mb-8 text-gray-700">
                    <Link onClick={toggleMobileOpen} to={"/job-posting"}>
                      Available Job Posts
                    </Link>{" "}
                  </li>
                )}
                <li className="mb-8 text-gray-700">
                  <Link onClick={toggleMobileOpen} to={"/help-center"}>
                    Help Center
                  </Link>
                </li>
              </ul>
              <div className="py-4"></div>
              <div className="mb-4 p-[1px] rounded bg-gradient-to-r from-[#0026BD] to-[#FF4489]">
                <Link to={"/login"} onClick={toggleMobileOpen}>
                  <button className="bg-white login-btn block w-full p-3 rounded font-medium">
                    <span className="primary-gradient-text">Login</span>
                  </button>
                </Link>
              </div>

              <div>
                <Link onClick={toggleMobileOpen} to={"/signup"}>
                  <button className=" block border w-full p-3 rounded primary-gradient-bg text-white font-medium">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </Overlay>
        </div>
      </div>
    </header>
  );
};

export default Header;
