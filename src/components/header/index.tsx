import React, { useState } from "react";
import arvicesLogo from "../../assets/logo.svg";
import Hamburger from "hamburger-react";
import Overlay from "../overlay";

let color = "#272727";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileOpen = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <header className="border-b border-gray-200 sticky top-0 z-[100] bg-white dark:bg-zinc-900">
      <div className="flex items-center h-16">
        {/**Logo Container */}
        <div className="w-max">
          <img
            src={arvicesLogo}
            className="w-6 h-6 inline-block mr-1"
            alt="Arvices Logo"
            title="Arvices Logo"
          />
          <h1 className="text-base inline relative top-0.5 text-gray-800 dark:text-white">
            Arvices
            <span className="sr-only"> - Your Everyday Help Platform</span>
          </h1>
        </div>

        <div className="flex-1"></div>
        <div className="w-max">
          <Hamburger
            toggled={mobileOpen}
            size={18}
            toggle={toggleMobileOpen}
            color={color}
          />
          <Overlay isOpen={mobileOpen} toggle={toggleMobileOpen}>
            <div>Overlay content</div>
          </Overlay>
        </div>
      </div>
    </header>
  );
};

export default Header;
