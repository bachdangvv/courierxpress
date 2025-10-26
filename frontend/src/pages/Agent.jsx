// src/pages/Agent.jsx
import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth";
import { useEcho } from "../realtime";

export default function Agent() {
  const { user } = useAuth();
  const echo = useEcho();
  const [placed, setPlaced] = useState([]);
  const [noti, setNoti] = useState([]);
  const [courierId, setCourierId] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [list, setList] = useState("");
  const [id, setId] = useState("");

  const load = async () => {
  try {
    const [n, p] = await Promise.all([
      api.get("/agent/notifications"),
    ]);

    // paginator objects -> arrays live at .data.data
    setNoti(Array.isArray(n.data?.data) ? n.data.data : []);
  } catch (e) {
    console.error("load() failed:", e?.response?.data || e);
    setNoti([]);   // fail-safe so UI still renders
  }
};
  useEffect(() => {
    load();
  }, []);

  // realtime refresh (safe to no-op if Echo/Pusher isn’t configured)
  useEffect(() => {
    if (!echo || !user?.agent?.id) return;
    const ch = echo.private(`agent.${user.agent.id}`)
      .listen(".status.updated", load)
      .listen(".courier.location", load);
    return () => {
      try { ch.stopListening(".status.updated").stopListening(".courier.location"); } catch { }
    };
  }, [echo, user]);

  const geoUpdate = async (courierId) => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      await api.post(`/agent/couriers/${courierId}/location`, { latitude, longitude });
    }, console.error, { enableHighAccuracy: true, timeout: 15000 });
  };

  const updateCourierDone = async (courierId) => {
    try {
      const status = "Done";
      await api.post(`/agent/couriers/${courierId}/status`, { status });
      setMsg(`Courier #${courierId} marked as Done.`);
      load();
    } catch (e) {
      console.error(e?.response?.data || e);
      setMsg(e?.response?.data?.message || `Failed to mark Done.`);
    }
  };

  const updateCourierCanceled = async (courierId) => {
    try {
      const status = "Canceled";
      await api.post(`/agent/couriers/${courierId}/status`, { status });
      setMsg(`Courier #${courierId} marked as Canceled.`);
      load();
    } catch (e) {
      console.error(e?.response?.data || e);
      setMsg(e?.response?.data?.message || `Failed to mark Canceled.`);
    }
  };

  const updateAvailability = async (status) => {
    try {
      setBusy(true);
      const res = await api.post("/agent/availability", { status });
      const agent = res.data.agent;
      setMsg(`Availability updated: Agent is now ${agent.status}.`);
    } catch (e) {
      console.error(e?.response?.data || e);
      setMsg(e?.response?.data?.message || "Failed to update availability.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Agent Console</h2>
        <div className="text-sm text-gray-500">
          Signed in as <b>{user?.name}</b> {user?.agent?.id ? `(Agent #${user.agent.id})` : ""}
        </div>
      </header>

      <section className="space-y-3">
        <h3 className="font-medium">Quick Actions</h3>
        <div className="flex gap-2">
          <input placeholder="Courier ID" value={id} onChange={e => setId(e.target.value)} />
      <button onClick={() => geoUpdate(id)}>Send GPS</button>
          {/* <button className="px-3 py-2 rounded border disabled:opacity-50"
            onClick={() => sendGPS(courierId)} disabled={busy}>
            Send GPS
          </button> */}
          <button
            className="px-3 py-2 rounded border disabled:opacity-50"
            onClick={() => updateCourierDone(id)}
            disabled={busy}
          >
            Mark Delivered
          </button>
          <button
            className="px-3 py-2 rounded border disabled:opacity-50"
            onClick={() => updateCourierCanceled(id)}
            disabled={busy}
          >
            Mark Canceled
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            className="px-3 py-2 rounded border disabled:opacity-50"
            onClick={() => updateAvailability("Available")}
            disabled={busy}
          >
            Set Available
          </button>
          <button
            className="px-3 py-2 rounded border disabled:opacity-50"
            onClick={() => updateAvailability("Not Available")}
            disabled={busy}
          >
            Set Not Available
          </button>
        </div>
        {msg && <div className="text-sm text-blue-600">{msg}</div>}
      </section>

      <section className="space-y-2">
        <h3 className="font-medium">Notifications</h3>
        <div className="space-y-2">
          {noti.map((n) => (
            <div key={n.id}>
              [{new Date(n.sent_at).toLocaleString()}] {n.message}
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  function AgentQuickActions({ onGeo }) {
    const [id, setId] = useState("");
    return <div className="row">
      <input placeholder="Courier ID" value={id} onChange={e => setId(e.target.value)} />
      <button onClick={() => onGeo(id)}>Send GPS</button>
    </div>;
  }
}
