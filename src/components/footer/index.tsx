import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 text-center py-6 mt-16">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Arvices. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
