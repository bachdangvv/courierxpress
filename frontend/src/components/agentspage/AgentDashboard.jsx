// src/layouts/AgentDashboard.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AgentSidebar from "./AgentSidebar";

export default function AgentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans">
      {/* Sidebar drawer */}
      <AgentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Top bar với hamburger luôn hiện */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b">
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="inline-flex items-center justify-center p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500/40"
        >
          <Menu size={20} />
        </button>
        <span className="font-semibold text-gray-800">Agent Dashboard</span>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
