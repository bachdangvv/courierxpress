import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Phone, MapPin, Package, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import { useAuth } from "../../auth";
import { useEcho } from "../../realtime";
import api from "../../api";

function badgeColor(status) {
  switch (status) {
    case "Assigned":
      return "bg-blue-100 text-blue-700";
    case "Delivering":
      return "bg-amber-100 text-amber-700";
    case "Done":
      return "bg-emerald-100 text-emerald-700";
    case "Canceled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function DashboardHome() {
  const { user } = useAuth();
  const echo = useEcho();

  // list of active couriers assigned to this agent
  const [active, setActive] = useState([]);         // array of couriers
  const [openRow, setOpenRow] = useState(null);     // which row is expanded
  const [loading, setLoading] = useState(true);
  const [agentStatus, setAgentStatus] = useState(user?.agent?.status || "Not Available");
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Toggle handler
const toggleAvailability = async () => {
  const goingAvailable = agentStatus === "Not Available";
  setLoadingStatus(true);

  try {
    if (goingAvailable) {
      // ✅ Luôn yêu cầu vị trí mới khi bật Available
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          try {
            const res = await api.post("/api/agent/availability", { 
              status: "Available", 
              lat, 
              lng 
            });
            const newStatus = res.data.agent.status;
            setAgentStatus(newStatus);
            user.agent.status = newStatus;
          } catch (e) {
            console.error("Failed to set available", e);
            alert("Failed to update availability");
          } finally {
            setLoadingStatus(false);
          }
        },
        (err) => {
          alert("Unable to get your location. Please allow location access.");
          setLoadingStatus(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      // ✅ Khi tắt Available
      const res = await api.post("/api/agent/availability", { status: "Not Available" });
      const newStatus = res.data.agent.status;
      setAgentStatus(newStatus);
      user.agent.status = newStatus;
      setLoadingStatus(false);
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to update agent status");
    setLoadingStatus(false);
  }
};

  // Load active couriers (try /agent/active first, fallback to /agent/placed)
  const loadActive = useCallback(async () => {
    setLoading(true);
    try {
      // Preferred endpoint: return only couriers assigned to this agent with status = Assigned/Delivering
      const res = await api.get("/api/agent/couriers/active");
      setActive(res.data?.data ?? res.data ?? []);
    } catch {
      // Fallback: if your existing endpoint is /agent/placed or /agent/assigned, adjust here
      try {
        const res2 = await api.get("/api/agent/placed");
        setActive(res2.data?.data ?? res2.data ?? []);
      } catch (e2) {
        console.error("Failed to load active couriers", e2);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadActive(); }, [loadActive]);

  // Realtime: listen to agent channel for new assignments & status updates
  useEffect(() => {
    if (!echo || !user?.agent?.id) return;

    const ch = echo.private(`agent.${user.agent.id}`)
      // New courier assigned to this agent
      .listen(".courier.assigned", (e) => {
        // payload expected: { courier: {...} }
        if (e?.courier) {
          setActive((prev) => {
            const exists = prev.some((c) => c.id === e.courier.id);
            return exists ? prev.map(c => c.id === e.courier.id ? e.courier : c) : [e.courier, ...prev];
          });
        } else {
          // If payload unknown, fallback reload
          loadActive();
        }
      })
      // Any status change (from another action)
      .listen(".courier.status.updated", (e) => {
        // payload expected: { courier: {...} }
        if (e?.courier) {
          setActive((prev) => {
            const idx = prev.findIndex((c) => c.id === e.courier.id);
            if (idx === -1) return prev; // not in current list
            // If it is Done/Canceled, remove from active
            if (["Done", "Canceled"].includes(e.courier.status)) {
              const cp = prev.slice();
              cp.splice(idx, 1);
              return cp;
            }
            // Otherwise update the row
            return prev.map((c) => (c.id === e.courier.id ? e.courier : c));
          });
        } else {
          loadActive();
        }
      });

    return () => {
      try {
        ch.stopListening(".courier.assigned").stopListening(".courier.status.updated").unsubscribe();
      } catch {}
    };
  }, [echo, user, loadActive]);

  // Quick Actions
  const updateStatus = async (courierId, status) => {
  try {
    let imageFile = null;

    // Nếu bấm Done → yêu cầu chọn ảnh xác nhận
    if (status === "Done") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      // User chọn ảnh (chạy trực tiếp trong user gesture nên không lỗi)
      fileInput.click();
      const picked = await new Promise((resolve) => {
        fileInput.onchange = () => resolve(fileInput.files[0] || null);
      });

      if (!picked) {
        alert("Please upload a proof photo before marking Done.");
        return;
      }

      imageFile = picked;
    }

    // Nếu bấm Go Deliver → lấy vị trí và gửi lên server
    if (status === "Delivering") {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        });

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        await api.post(`/api/agent/couriers/${courierId}/location`, {
          latitude: lat,
          longitude: lng,
        });
      } catch (geoErr) {
        console.error("📍 Location error:", geoErr);
        alert("Unable to get your location. Please allow access and try again.");
        return;
      }
    }

    // Gửi dữ liệu (dùng FormData nếu có ảnh)
    let res;
    if (imageFile) {
      const formData = new FormData();
      formData.append("status", status);
      formData.append("image", imageFile);

      res = await api.post(`/api/agent/couriers/${courierId}/status`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      res = await api.post(`/api/agent/couriers/${courierId}/status`, { status });
    }

    // Cập nhật UI (Optimistic)
    if (status === "Done" || status === "Canceled") {
      setActive((prev) => prev.filter((c) => c.id !== courierId));
    } else if (status === "Delivering") {
      setActive((prev) =>
        prev.map((c) => (c.id === courierId ? { ...c, status: "Delivering" } : c))
      );
    }

    console.log("✅ Status updated:", res.data);
  } catch (e) {
    console.error("Failed to update status", e);
    alert(e.response?.data?.message || "Failed to update status");
  }
};




  // Render helpers (safe fields)
  const safe = (v) => (v == null ? "" : String(v));
  const rows = useMemo(() => active, [active]);

  return (
  <div className="space-y-6">
    {/* Header + Toggle */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-xl shadow p-5 gap-4">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Home</h2>
        <p className="text-gray-500 mt-1">
          Current status:{" "}
          <span className="font-semibold">
            {agentStatus === "Delivering OK"
              ? "Delivering OK"
              : agentStatus === "Delivering Full"
              ? "Full"
              : agentStatus}
          </span>
        </p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <span className="text-sm text-gray-600">Not Available</span>
        <div className="relative">
          <input
            type="checkbox"
            checked={agentStatus !== "Not Available"}
            onChange={toggleAvailability}
            disabled={loadingStatus}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-emerald-500 transition-all" />
          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all peer-checked:translate-x-6" />
        </div>
        <span className="text-sm text-gray-600">Available</span>
      </label>
    </div>

    {/* Container chính: relative + overflow-hidden để overlay và tránh tràn */}
    <div
      className={`relative transition-all duration-300 ${agentStatus === "Not Available" ? "pointer-events-none opacity-60 blur-sm" : ""} overflow-hidden min-w-0`}
    >
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5 text-center sm:text-left">
          <p className="text-gray-500">Active Couriers</p>
          <h3 className="text-3xl font-bold mt-2">{rows.length}</h3>
        </div>
        <div className="bg-white rounded-xl shadow p-5 text-center sm:text-left">
          <p className="text-gray-500">My Status</p>
          <h3 className="text-3xl font-bold mt-2">{safe(user?.agent?.status)}</h3>
        </div>
        <div className="bg-white rounded-xl shadow p-5 text-center sm:text-left">
          <p className="text-gray-500">Realtime</p>
          <h3 className="text-3xl font-bold mt-2">{echo ? "Connected" : "Offline"}</h3>
        </div>
      </div>

      {/* Active courier table: bọc overflow-x-auto */}
      <div className="bg-white rounded-xl shadow overflow-hidden mt-6">
        <div className="px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-lg font-semibold">My Active Couriers</h3>
          <button
            onClick={loadActive}
            className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 w-full sm:w-auto"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-gray-500">No active couriers.</div>
        ) : (
          <>
            {/* scroll container để tránh tràn */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">Courier ID</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Contact</th>
                    <th className="px-6 py-3 text-left">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rows.map((c) => {
                    const expanded = openRow === c.id;
                    return (
                      <React.Fragment key={c.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <button onClick={() => setOpenRow(expanded ? null : c.id)}>
                              {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>
                          </td>
                          <td className="px-6 py-4 font-medium whitespace-nowrap">
                            #{c.id} <span className="text-xs text-gray-400">{c.tracking_code}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${badgeColor(c.status)}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 max-w-[420px] break-words min-w-0">
                            <div className="text-gray-700">
                              {safe(c.from_full_name)} → {safe(c.to_full_name)}
                            </div>
                            <div className="text-gray-500 text-xs truncate">
                              {safe(c.from_address)} → {safe(c.to_address)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => updateStatus(c.id, "Delivering")}
                                disabled={c.status !== "Assigned"}
                                className="px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs disabled:opacity-50"
                              >
                                Go Deliver
                              </button>
                              <button onClick={() => updateStatus(c.id, "Done")} className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                                Done
                              </button>
                              <button onClick={() => updateStatus(c.id, "Canceled")} className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs">
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expanded && (
                          <tr className="bg-gray-50">
                            <td colSpan={5} className="px-6 py-4">
                              {/* Expanded details: giữ min-w-0 & break-words */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg border p-4 min-w-0 break-words">
                                  <div className="border-b pb-2 mb-3 font-semibold">Courier Contact</div>
                                  <div className="text-sm">
                                    <div className="font-medium">Shipper</div>
                                    <div>Phone: {safe(c.from_phone)}</div>
                                    <div className="flex items-start gap-2">
                                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                      <div className="break-words">{safe(c.from_address)}</div>
                                    </div>
                                    <div className="font-medium mt-3">Receiver</div>
                                    <div>Phone: {safe(c.to_phone)}</div>
                                    <div className="flex items-start gap-2">
                                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                      <div className="break-words">{safe(c.to_address)}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white rounded-lg border p-4 min-w-0">
  <div className="border-b pb-2 mb-3 font-semibold">Meta</div>
  <div className="grid grid-cols-2 gap-3 text-sm">
    <div className="text-gray-500">Weight</div>
    <div>{c.weight ?? "-"}</div>
    <div className="text-gray-500">Size</div>
    <div>{c.size ?? "-"}</div>
    <div className="text-gray-500">Charge</div>
    <div>{c.charge ?? "-"}</div>
    <div className="text-gray-500">Updated</div>
    <div className="inline-flex items-center gap-1 text-gray-600">
      <Clock className="w-4 h-4" />
      {c.updated_at ? new Date(c.updated_at).toLocaleString() : "-"}
    </div>
  </div>

  {/* 📸 Sender Image hiển thị ở Dashboard Home */}
  
    <div className="mt-4">
      <p className="font-semibold text-gray-700 mb-2">Sender Image</p>
      <img
        src={`${import.meta.env.VITE_API_URL}/storage/${c.sender_image}`}
        alt="Sender package"
        className="w-full max-w-sm rounded-lg border object-cover"
      />
    </div>
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

            {/* Mobile cards (kept) */}
            <div className="md:hidden divide-y">
              {rows.map((c) => (
                <div key={c.id} className="p-4 min-w-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">#{c.id} – {c.status}</div>
                      <div className="text-gray-500 text-sm truncate">{c.from_full_name} → {c.to_full_name}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${badgeColor(c.status)}`}>{c.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 break-words">{c.from_address} → {c.to_address}</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={() => updateStatus(c.id, "Delivering")} disabled={c.status !== "Assigned"} className="flex-1 px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs disabled:opacity-50">Go Deliver</button>
                    <button onClick={() => updateStatus(c.id, "Done")} className="flex-1 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs">Done</button>
                    <button onClick={() => updateStatus(c.id, "Canceled")} className="flex-1 px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Overlay for Not Available (within relative + overflow-hidden container) */}
      {agentStatus === "Not Available" && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white/90 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow">
            You are currently Not Available
          </div>
        </div>
      )}
    </div>
  </div>
);
}
