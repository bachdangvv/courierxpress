// src/layouts/AgentDashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AgentSidebar from "./AgentSidebar";
import AgentHeader from "./AgentHeader";

export default function AgentDashboard() {
  return (
    // dùng min-h-screen và overflow-hidden để tránh trang bị tràn ngang
    <div className="flex min-h-screen bg-gray-50 font-sans overflow-hidden mt-[70px]">
      {/* Sidebar -> không cho phép co lại */}
      <AgentSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* min-w-0 là quan trọng: cho phép children flex item co/giãn đúng, ngăn tràn */}
        <AgentHeader />

        {/* Nội dung từng trang con: giới hạn chiều ngang, căn giữa */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
