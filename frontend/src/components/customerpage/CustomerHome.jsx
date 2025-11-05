import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  PlusCircle,
  Search,
} from "lucide-react";

export default function CustomerHome() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">
        Chào mừng trở lại, Alice 👋
      </h1>
      <p className="text-gray-500 mb-8">
        Dưới đây là tổng quan nhanh về tài khoản và đơn hàng của bạn.
      </p>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-3">
            <Package className="text-blue-600" />
            <div>
              <p className="text-gray-500">Tổng đơn hàng</p>
              <h2 className="text-xl font-bold">24</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-3">
            <Truck className="text-yellow-500" />
            <div>
              <p className="text-gray-500">Đang giao</p>
              <h2 className="text-xl font-bold">3</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" />
            <div>
              <p className="text-gray-500">Hoàn thành</p>
              <h2 className="text-xl font-bold">18</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-600" />
            <div>
              <p className="text-gray-500">Đã hủy</p>
              <h2 className="text-xl font-bold">3</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Hành động nhanh */}
      <div className="flex flex-wrap gap-4 mb-10">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700">
          <PlusCircle size={18} /> Tạo đơn mới
        </button>
        <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200">
          <Search size={18} /> Theo dõi đơn hàng
        </button>
      </div>

      {/* Hoạt động gần đây */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
        <ul className="space-y-3">
          <li className="flex justify-between border-b pb-2">
            <span>#ORD-1256</span>
            <span className="text-yellow-600 font-medium">Đang giao</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>#ORD-1249</span>
            <span className="text-green-600 font-medium">Hoàn thành</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>#ORD-1245</span>
            <span className="text-red-600 font-medium">Đã hủy</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
