import React, { useState } from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  const [isBeating, setIsBeating] = useState(true);

  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center px-4 py-2 text-gray-100 bg-gray-900 text-center md:text-left">
      <p className="mb-2 md:mb-0">
        Made with Love
        <span
          className={`ml-1 inline-block transition-transform duration-300 ease-in-out transform hover:scale-110 ${isBeating ? "beating" : ""}`}
          onMouseEnter={() => setIsBeating(true)}
          // onMouseLeave={() => setIsBeating(false)}
        >
          ❤
        </span>
      </p>
      <p>All Rights Reserved &copy; {currentYear} RCCIIT</p>
    </div>
  );
}

export default Footer;
