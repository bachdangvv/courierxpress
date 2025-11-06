import React from "react";
import { Outlet } from "react-router-dom";
import AgentSidebar from "./AgentSidebar";
import AgentHeader from "./AgentHeader";

export default function AgentDashboard() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans mt-[70px]">
      {/* Sidebar */}
      <AgentSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <AgentHeader />

        {/* Nội dung từng trang con */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
