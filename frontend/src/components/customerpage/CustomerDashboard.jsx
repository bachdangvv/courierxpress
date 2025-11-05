import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Search,
  List,
  HelpCircle,
  User,
  Bell,
} from "lucide-react";

export default function CustomerDashboard({ children }) {
  const location = useLocation();
  const navItems = [
    { path: "/customer/dashboard", label: "Home", icon: <Home size={20} /> },
    {
      path: "/customer/create-order",
      label: "Create Order",
      icon: <PlusCircle size={20} />,
    },
    {
      path: "/customer/track-order",
      label: "Track Order",
      icon: <Search size={20} />,
    },
    {
      path: "/customer/my-orders",
      label: "My Orders",
      icon: <List size={20} />,
    },
    {
      path: "/customer/support",
      label: "Support",
      icon: <HelpCircle size={20} />,
    },
    {
      path: "/customer/profile",
      label: "Profile",
      icon: <User size={20} />,
    },
  ];

  // Get customer info from localStorage
  const customerUser = JSON.parse(localStorage.getItem("customerUser") || "{}");
  const avatar = customerUser?.name
    ? customerUser.name.charAt(0).toUpperCase()
    : "C";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mt-[70px]">
      {/* Sidebar menu */}
      <div className="flex flex-1">
        <nav className="w-64 bg-white shadow-lg p-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition hover:bg-blue-50 text-gray-700 ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : ""
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        {/* Main content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
