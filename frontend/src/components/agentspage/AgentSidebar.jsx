// src/layouts/AgentSidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, LogOut } from "lucide-react";
import { useAuth } from "../../auth";

export default function AgentSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      link: "/agent/dashboard",
    },
    { name: "History", icon: <Package size={18} />, link: "/agent/history" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
      if (onClose) onClose();
    }
  };

  return (
    <>
      {/* Overlay – click ra ngoài để đóng */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40"
          onClick={onClose}
        />
      )}

      {/* Sidebar drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30
          w-64 bg-gray-800 text-gray-100 flex flex-col p-4
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <h2 className="text-xl font-bold text-center mb-8">CourierXpress</h2>

        <ul className="space-y-2 flex-1">
          {menu.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.link}
                onClick={onClose}  // click menu auto đóng drawer
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
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
