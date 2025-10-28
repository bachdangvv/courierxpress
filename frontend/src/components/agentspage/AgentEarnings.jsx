import React from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

export default function AgentEarnings() {
  const earnings = [
    { month: "Tháng 1", amount: 2100, orders: 45 },
    { month: "Tháng 2", amount: 2400, orders: 52 },
    { month: "Tháng 3", amount: 2540, orders: 58 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Thu nhập của tôi</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Tổng thu nhập</p>
              <h3 className="text-3xl font-bold mt-2">$7,040</h3>
            </div>
            <DollarSign className="w-12 h-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tháng này</p>
              <h3 className="text-3xl font-bold mt-2">$2,540</h3>
            </div>
            <TrendingUp className="w-12 h-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Đơn hoàn tất</p>
              <h3 className="text-3xl font-bold mt-2">155</h3>
            </div>
            <Calendar className="w-12 h-12 opacity-20" />
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Lịch sử thu nhập</h3>
        <div className="space-y-4">
          {earnings.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{item.month}</h4>
                  <p className="text-sm text-gray-500">
                    {item.orders} đơn hàng
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ${item.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
