import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  User,
  LogOut,
} from "lucide-react";

export default function AgentSidebar() {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      link: "/agent/dashboard",
    },
    { name: "Orders", icon: <Package size={18} />, link: "/agent/orders" },
    {
      name: "Earnings",
      icon: <DollarSign size={18} />,
      link: "/agent/earnings",
    },
    { name: "Profile", icon: <User size={18} />, link: "/agent/profile" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col p-4">
      <h2 className="text-xl font-bold text-center mb-8">CourierXpress</h2>

      <ul className="space-y-2 flex-1">
        {menu.map((item, idx) => (
          <li key={idx}>
            <Link
              to={item.link}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                location.pathname === item.link
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <button
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-600 transition-all"
        onClick={() => {
          localStorage.removeItem("agentToken");
          localStorage.removeItem("agentUser");
          window.location.href = "/agent/login";
        }}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
