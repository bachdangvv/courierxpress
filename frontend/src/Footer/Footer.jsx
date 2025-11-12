import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#172774] text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1 - Logo + brief */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-md bg-[#f3b11a] flex items-center justify-center font-bold text-black">
                CXP
              </div>
              <div>
                <h3 className="text-xl font-semibold">CourierXPress</h3>
                <p className="text-sm text-gray-300">
                  Reliable shipping and logistics solutions.
                </p>
              </div>
            </div>

            <ul className="text-sm space-y-2 mt-4">
              <li>
                Customer service:{" "}
                <a href="#" className="underline">
                  1800-xxx-xxx
                </a>
              </li>
              <li>
                Email:{" "}
                <a href="#" className="underline">
                  support@ups.com
                </a>
              </li>
              <li>Office hours: Mon–Fri 8:00–18:00</li>
            </ul>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h4 className="font-semibold mb-3">Shipping & Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Track a Shipment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Create a Shipment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Rate & Ship
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Customs & International
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Help & FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Claims
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Center
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Tools & Links */}
          <div>
            <h4 className="font-semibold mb-3">Tools & Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Locations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Shipping Tools
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Developer Resource
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Country / Language selector */}
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-md text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              <select className="bg-transparent outline-none text-sm">
                <option>Vietnam / English</option>
                <option>Vietnam / Tiếng Việt</option>
                <option>United States / English</option>
              </select>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.3c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H20l-1 3.9h-2v7A10 10 0 0022 12z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 5.9c-.6.3-1.2.6-1.9.7.7-.4 1.2-1 1.5-1.7-.6.4-1.3.6-2.1.8-.6-.6-1.4-1-2.3-1-1.7 0-3.1 1.4-3.1 3.2 0 .3 0 .7.1 1C8 8.8 5.1 7.4 3.3 5.1c-.4.6-.6 1.3-.6 2 0 1.2.6 2.2 1.5 2.8-.6 0-1.2-.2-1.7-.5v.1c0 1.8 1.2 3.4 2.8 3.8-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.7 2.3 3.2 2.3-1.2.9-2.6 1.4-4.1 1.4-.3 0-.6 0-.9-.1 1.5 1 3.2 1.6 5.1 1.6 6.1 0 9.4-5 9.4-9.4v-.4c.7-.5 1.3-1.2 1.8-2z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4v12h-4v-12zM8.5 8.5h3.6v1.6h.1c.5-.9 1.7-1.8 3.5-1.8 3.7 0 4.4 2.4 4.4 5.6v6.6h-4v-5.9c0-1.4-.1-3.2-2-3.2-2 0-2.3 1.6-2.3 3v6.1h-4v-12z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} United Parcel Service of America,
              Inc. All rights reserved.
            </p>
            <div className="mt-1">
              <a href="#" className="underline mr-3">
                Terms
              </a>
              <a href="#" className="underline mr-3">
                Privacy
              </a>
              <a href="#" className="underline">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
