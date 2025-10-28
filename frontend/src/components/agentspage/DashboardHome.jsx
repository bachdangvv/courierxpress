import React from "react";

export default function DashboardHome() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tổng quan hoạt động</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Đơn hàng hôm nay</p>
          <h3 className="text-3xl font-bold mt-2">18</h3>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Đơn hoàn tất</p>
          <h3 className="text-3xl font-bold mt-2">142</h3>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Thu nhập tháng này</p>
          <h3 className="text-3xl font-bold mt-2">$2,540</h3>
        </div>
      </div>
    </div>
  );
}
