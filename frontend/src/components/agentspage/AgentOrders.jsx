import React from "react";
import { Package, MapPin, Clock } from "lucide-react";

export default function AgentOrders() {
  const orders = [
    {
      id: "#CX-0001",
      customer: "Nguyễn Văn A",
      from: "Hà Nội",
      to: "Hồ Chí Minh",
      status: "Đang giao",
      time: "10:30 AM",
    },
    {
      id: "#CX-0002",
      customer: "Trần Thị B",
      from: "Đà Nẵng",
      to: "Nha Trang",
      status: "Chờ lấy hàng",
      time: "11:15 AM",
    },
    {
      id: "#CX-0003",
      customer: "Lê Văn C",
      from: "Hải Phòng",
      to: "Quảng Ninh",
      status: "Hoàn tất",
      time: "09:00 AM",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang giao":
        return "bg-blue-100 text-blue-600";
      case "Chờ lấy hàng":
        return "bg-yellow-100 text-yellow-600";
      case "Hoàn tất":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">{order.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.customer}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>
                      {order.from} → {order.to}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {order.time}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
