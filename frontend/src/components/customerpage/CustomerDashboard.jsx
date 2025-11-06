import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Search,
  List,
  HelpCircle,
  User,
  Bell,
  Package,
  CheckCircle2,
  ChevronDown,
  ChevronUp,  
} from "lucide-react";
import { format } from "date-fns";
import api from "../../api";

export default function CustomerDashboard({ children }) {
  const location = useLocation();
  const navItems = [
    { path: "/customer/dashboard", label: "Home", icon: <Home size={20} /> },
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

  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get("/api/customer/couriers", {
          withCredentials: true,
        });
        setOrders(data.data || data);
      } catch (e) {
        console.error(e);
        setErr(e.response?.data?.message || "Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

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
          <div className="w-full">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">My Orders</h1>
      <p className="text-gray-500 mb-6">
        Here are all your shipment orders and their current statuses.
      </p>

      {loading && <p>Loading...</p>}
      {err && <div className="text-red-600 mb-4">{err}</div>}

      {!loading && !err && (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Tracking Code</th>
                <th className="px-6 py-3">Receiver</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Updated</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No orders found.
                  </td>
                </tr>
              )}

              {orders.map((c) => {
                const expanded = expandedId === c.id;
                return (
                  <React.Fragment key={c.id}>
                    <tr
                      onClick={() => toggleExpand(c.id)}
                      className="border-b hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-3 font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          {c.id}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {c.tracking_code || "-"}
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {c.to_full_name}
                      </td>
                      <td className="px-6 py-3">
                        {c.status === "Done" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-4 h-4" /> Done
                          </span>
                        ) : c.status === "Canceled" ? (
                          <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                            <XCircle className="w-4 h-4" /> Canceled
                          </span>
                        ) : (
                          <span className="text-blue-600 font-semibold">
                            {c.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {format(new Date(c.updated_at), "dd/MM/yyyy HH:mm")}
                      </td>
                      <td className="px-6 py-3 text-right">
                        {expanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 inline" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 inline" />
                        )}
                      </td>
                    </tr>

                    {expanded && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan="6" className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sender Info */}
                            <div>
                              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                                Sender Info
                              </h3>
                              <p>{c.from_full_name}</p>
                              <p>{c.from_email}</p>
                              <p>{c.from_phone}</p>
                              <p>{c.from_address}</p>
                              <p>{c.from_city}</p>

                              
                                <div className="mt-3">
                                  <h4 className="font-semibold text-gray-700 mb-1">
                                    Sender Image
                                  </h4>
                                  <img
                                    src={`${import.meta.env.VITE_API_URL}/storage/${c.sender_image}`}
                                    alt="Sender proof"
                                    className="w-40 h-40 object-cover rounded-md border"
                                  />
                                </div>
                              
                            </div>

                            {/* Receiver Info */}
                            <div>
                              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                                Receiver Info
                              </h3>
                              <p>{c.to_full_name}</p>
                              <p>{c.to_email}</p>
                              <p>{c.to_phone}</p>
                              <p>{c.to_address}</p>
                              <p>{c.to_city}</p>
                            </div>
                          </div>

                          {/* Agent Proof Image */}
                          
                            <div className="mt-6">
                              <h4 className="font-semibold text-gray-700 mb-1">
                                Delivery Proof (Agent)
                              </h4>
                              <img
                                src={`${import.meta.env.VITE_API_URL}/storage/${c.sender_image}`}
                                alt="Agent proof"
                                className="w-48 h-48 object-cover rounded-md border"
                              />
                            </div>
                          

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            <div>
                              <h4 className="font-semibold text-gray-700">
                                Charge
                              </h4>
                              <p>
                                {c.charge
                                  ? `$${Number(c.charge).toFixed(2)}`
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-700">
                                Weight
                              </h4>
                              <p>{c.weight ? `${c.weight} kg` : "-"}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-700">
                                Size
                              </h4>
                              <p>{c.size || "-"}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
        </main>
      </div>
    </div>
  );
}
