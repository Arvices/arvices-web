import React, { useState, useRef, useEffect } from "react";

const DropdownMenu: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex justify-center items-center px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Hire Talent
        <svg
          className="ml-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-56 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {/* Arrow */}
          <div className="absolute -top-2 left-6 w-3 h-3 bg-white rotate-45 shadow-md"></div>

          <div className="py-1">
            <a
              href="/post-job"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Post a Job
            </a>
            <a
              href="/browse"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Browse Categories
            </a>
            <a
              href="/how-it-works"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              How it Works
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
