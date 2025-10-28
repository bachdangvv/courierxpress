import React, { useState } from "react";

// Single-file Admin Dashboard for CourierXpress
// - Uses Tailwind CSS classes
// - Self-contained mock data and components for quick copy-paste
// - Replace data and hook up APIs as needed

export default function XpressAdminDashboard({ bgImage, dashboardName }) {
  const [active, setActive] = useState("dashboard");
  const [query, setQuery] = useState("");

  // Mock data (replace with API calls)
  const stats = {
    ordersToday: 128,
    revenueToday: 6540,
    activeDrivers: 42,
    pendingOrders: 18,
  };

  const orders = [
    {
      id: "XP-1001",
      customer: "Nguyen Van A",
      driver: "Tran B.",
      status: "Pending",
      amount: 12.5,
      createdAt: "2025-10-27 09:12",
    },
    {
      id: "XP-1002",
      customer: "Le Thi C",
      driver: "Pham D.",
      status: "In Transit",
      amount: 8.9,
      createdAt: "2025-10-27 08:20",
    },
    {
      id: "XP-1003",
      customer: "Hoang E",
      driver: "Unassigned",
      status: "Pending",
      amount: 15.0,
      createdAt: "2025-10-26 18:45",
    },
  ];

  const customers = [
    {
      id: 1,
      name: "Nguyen Van A",
      email: "a@example.com",
      orders: 12,
      lifetime: 420,
    },
    {
      id: 2,
      name: "Le Thi C",
      email: "c@example.com",
      orders: 4,
      lifetime: 120,
    },
  ];

  const drivers = [
    {
      id: 1,
      name: "Tran B.",
      phone: "+84 912 345 678",
      status: "Online",
      deliveries: 8,
    },
    {
      id: 2,
      name: "Pham D.",
      phone: "+84 934 567 890",
      status: "Offline",
      deliveries: 3,
    },
  ];

  // Simple navigation tabs
  const nav = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "orders", label: "Orders", icon: "📦" },
    { key: "customers", label: "Customers", icon: "👥" },
    { key: "drivers", label: "Drivers", icon: "🚚" },
    { key: "reports", label: "Reports", icon: "📈" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div
      className="min-h-screen text-gray-800 flex"
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: "#f9fafb" }
      }
    >
      <Sidebar
        active={active}
        setActive={setActive}
        nav={nav}
        dashboardName={dashboardName}
      />

      <div className="flex-1 flex flex-col">
        <Topbar query={query} setQuery={setQuery} />

        <main className="p-6">
          {active === "dashboard" && (
            <DashboardView stats={stats} orders={orders} drivers={drivers} />
          )}

          {active === "orders" && <OrdersView orders={orders} />}

          {active === "customers" && <CustomersView customers={customers} />}

          {active === "drivers" && <DriversView drivers={drivers} />}

          {active === "reports" && <ReportsView />}

          {active === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, nav, dashboardName }) {
  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen p-6 fixed left-0 top-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {dashboardName || "Xpress Admin"}
        </h1>
        <p className="text-sm text-slate-300 mt-1">Courier management</p>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((n) => (
          <button
            key={n.key}
            onClick={() => setActive(n.key)}
            className={`text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-slate-800 transition-all ${
              active === n.key
                ? "bg-amber-400 text-slate-900"
                : "text-slate-200"
            }`}
          >
            <span className="text-lg">{n.icon}</span>
            <span className="font-medium">{n.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 text-sm text-slate-400">
        <p>Version 1.0</p>
        <p className="mt-3">© {new Date().getFullYear()} Xpress</p>
      </div>
    </aside>
  );
}

function Topbar({ query, setQuery }) {
  return (
    <div className="ml-72 bg-white border-b border-slate-200 p-4 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 rounded bg-slate-100">☰</button>

          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 rounded-md border border-slate-200 w-72"
              placeholder="Search orders, customers, drivers..."
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-slate-100">
              Search
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative">
            🔔
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full text-xs px-1">
              3
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-slate-500">admin@xpress.com</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center">
              A
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ stats, orders, drivers }) {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Orders Today" value={stats.ordersToday} />
        <StatCard title="Revenue Today" value={`$${stats.revenueToday}`} />
        <StatCard title="Active Drivers" value={stats.activeDrivers} />
        <StatCard title="Pending Orders" value={stats.pendingOrders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Recent Orders</h3>
          <OrdersTable rows={orders} compact />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Top Drivers</h3>
          <ul className="space-y-3">
            {drivers.map((d) => (
              <li key={d.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-sm text-slate-500">{d.phone}</div>
                </div>
                <div className="text-sm text-slate-700">{d.status}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}

function OrdersView({ orders }) {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>

      <div className="bg-white rounded shadow p-4">
        <OrdersTable rows={orders} />
      </div>
    </div>
  );
}

function OrdersTable({ rows = [], compact = false }) {
  return (
    <div className={compact ? "overflow-x-auto" : "overflow-x-auto"}>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Order ID</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Driver</th>
            <th className="py-2">Status</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Created At</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b hover:bg-slate-50">
              <td className="py-3">{r.id}</td>
              <td className="py-3">{r.customer}</td>
              <td className="py-3">{r.driver}</td>
              <td className="py-3">
                <StatusPill status={r.status} />
              </td>
              <td className="py-3">${r.amount}</td>
              <td className="py-3">{r.createdAt}</td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button className="px-2 py-1 rounded bg-slate-100 text-sm">
                    View
                  </button>
                  <button className="px-2 py-1 rounded bg-amber-400 text-sm">
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Transit": "bg-sky-100 text-sky-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-rose-100 text-rose-800",
    Unassigned: "bg-slate-100 text-slate-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded text-sm ${map[status] || "bg-slate-100"}`}
    >
      {status}
    </span>
  );
}

function CustomersView({ customers }) {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Orders</th>
              <th className="py-2">Lifetime</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{c.name}</td>
                <td className="py-3">{c.email}</td>
                <td className="py-3">{c.orders}</td>
                <td className="py-3">${c.lifetime}</td>
                <td className="py-3">
                  <button className="px-3 py-1 rounded bg-slate-100">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DriversView({ drivers }) {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Drivers</h2>

      <div className="bg-white rounded shadow p-4">
        <ul className="space-y-3">
          {drivers.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between border-b py-3"
            >
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-sm text-slate-500">{d.phone}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">Deliveries: {d.deliveries}</div>
                <div
                  className={`px-2 py-1 rounded ${
                    d.status === "Online"
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {d.status}
                </div>
                <button className="px-3 py-1 rounded bg-amber-400">
                  Assign
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ReportsView() {
  // Simple inline chart (no deps). Replace with Recharts / Chart.js for production.
  const sample = [20, 40, 60, 80, 65, 90, 120];
  const max = Math.max(...sample);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Orders last 7 days</h3>
        <div className="w-full h-36 flex items-end gap-2">
          {sample.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                style={{ height: `${(v / max) * 100}%` }}
                className="w-full rounded-t-md bg-amber-400"
              ></div>
              <div className="text-xs text-slate-500 mt-1">D{i + 1}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            Revenue by region (placeholder)
          </div>
          <div className="p-4 border rounded">
            Driver performance (placeholder)
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-medium mb-2">System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Default Currency
            </label>
            <select className="w-full rounded border px-3 py-2">
              <option>USD</option>
              <option>VND</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Timezone
            </label>
            <select className="w-full rounded border px-3 py-2">
              <option>Asia/Bangkok</option>
              <option>UTC</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button className="px-4 py-2 rounded bg-amber-400">Save</button>
        </div>
      </div>
    </div>
  );
}
