import { useEffect, useState } from "react";
import api from "../api";
import { useEcho } from "../realtime";


export default function Admin() {
  const [page, setPage] = useState(1);
  const [placed, setPlaced] = useState([]);
  const [agents, setAgents] = useState([]);
  const [notifications, setNoti] = useState({ data: [], meta: {} });
  const [error, setError] = useState("");
  const [loadingAgents, setLoadingAgents] = useState(false);
  const echo = useEcho();

  const load = async () => {
    try {
      setError("");
      const [p, a, n] = await Promise.all([
        api.get(`/admin/placed?page=${page}`),
        api.get(`/admin/agents/assignable?page=${page}`),
        api.get(`/admin/notifications?page=1`)
      ]);
      setPlaced(p.data.data || []);
      setAgents(a.data || []);
      setNoti(n.data || { data: [], meta: {} });
    } catch (err) {
      console.error("Admin load error:", err?.response?.data || err);
      setError(
        err?.response?.data?.message ||
          "Failed to load admin data. Please check backend logs."
      );
    }
  };

  useEffect(() => {
    load();
    loadAssignableAgents();
  }, [page]);

  useEffect(() => {
    if (!echo) return;
    const ch = echo.channel("couriers").listen(".status.updated", () => {
      load();
    });
    return () => ch.stopListening(".status.updated");
  }, [echo]);

  const loadAssignableAgents = async () => {
  try {
    setLoadingAgents(true);
    const res = await api.get("/admin/agents?assignable=1");

    // Convert ANY structure into a clean array
    let data = res.data;
    if (!Array.isArray(data)) {
      if (Array.isArray(data?.data)) data = data.data;
      else if (Array.isArray(data?.agents)) data = data.agents;
      else data = Object.values(data || {}); // fallback
    }

    console.log("✅ Assignable agents normalized:", data);
    setAgents(data);
  } catch (e) {
    console.error("❌ Failed to load agents:", e?.response?.data || e);
    setAgents([]); // ensure state is array
  } finally {
    setLoadingAgents(false);
  }
};

  const assign = async (id, agent_id) => {
    try {
      await api.post(`/admin/couriers/${id}/assign/${agent_id}`);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to assign courier");
    }
  };

  const cancel = async (id) => {
    try {
      await api.post(`/admin/couriers/${id}/cancel`);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to cancel courier");
    }
  };

  return (
    <div className="grid">
      <section>
        <h3>Assign Courier</h3>
        {error && <div className="text-red-600">{error}</div>} {/* ✅ new */}
        {placed.map((c) => (
          <div key={c.id} className="row">
            <span>
              #{c.id} {c.type} – {c.status}
            </span>

             {loadingAgents ? (
    <p>Loading agents...</p>
  ) : (
    <select
      className="border rounded px-3 py-2"
      onChange={(e) => assign(c.id, e.target.value)}
    >
      <option value="">-- Select Available Agent --</option>
      {agents.map((a) => (
        <option key={a.id} value={a.id}>
          Agent {a.name} #{a.id} ({a.status})
        </option>
      ))}
    </select>
  )}


            <button onClick={() => cancel(c.id)}>Cancel</button>
          </div>
        ))}
      </section>

      <section>
        <h3>Notifications</h3>
        {notifications.data?.map((n) => (
          <div key={n.id}>
            [{new Date(n.sent_at).toLocaleString()}] {n.message}
          </div>
        ))}
      </section>
    </div>
  );
}
