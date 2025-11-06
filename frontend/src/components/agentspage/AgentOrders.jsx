import React, { useEffect, useState } from "react";
import api from "../../api";
import { format } from "date-fns";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/MidLineHeading/MidLineHeading";

const AgentHistory = () => {
  const [rows, setRows] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/api/agent/couriers/history", {
          withCredentials: true,
        });
        setRows(data.data || data); // Support paginate or plain list
      } catch (e) {
        console.error(e);
        setErr(e.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="flex flex-col items-center w-full max-w-6xl mx-auto p-6 mt-[80px]">
      <div className="w-full mb-8">
        <Heading variant="left">Courier History</Heading>
        <p className="text-gray-500">All completed or canceled deliveries.</p>
      </div>

      {loading && <p>Loading...</p>}
      {err && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
          {err}
        </div>
      )}

      {!loading && !err && (
        <div className="overflow-x-auto w-full bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Tracking</th>
                <th className="px-6 py-3">Sender</th>
                <th className="px-6 py-3">Receiver</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Updated</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No completed or canceled couriers.
                  </td>
                </tr>
              )}

              {rows.map((c) => {
                const expanded = expandedId === c.id;
                return (
                  <React.Fragment key={c.id}>
                    <tr
                      className="border-b hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => toggleExpand(c.id)}
                    >
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {c.id}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {c.tracking_code || "-"}
                      </td>
                      <td className="px-6 py-3">{c.from_full_name}</td>
                      <td className="px-6 py-3">{c.to_full_name}</td>
                      <td className="px-6 py-3">
                        {c.status === "Done" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-4 h-4" /> Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                            <XCircle className="w-4 h-4" /> Canceled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {format(new Date(c.updated_at), "dd/MM/yyyy HH:mm")}
                      </td>
                      <td className="px-6 py-3 text-right">
                        {expanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </td>
                    </tr>

                    {expanded && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan="7" className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sender Info */}
                            <div>
                              <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                                Sender
                              </h3>
                              <p>{c.from_full_name}</p>
                              <p>{c.from_email}</p>
                              <p>{c.from_phone}</p>
                              <p>{c.from_address}</p>
                              <p>{c.from_city}</p>
                            </div>

                            {/* Receiver Info */}
                            <div>
                              <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                                Receiver
                              </h3>
                              <p>{c.to_full_name}</p>
                              <p>{c.to_email}</p>
                              <p>{c.to_phone}</p>
                              <p>{c.to_address}</p>
                              <p>{c.to_city}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            <div>
                              <h4 className="font-semibold text-gray-700">
                                Charge
                              </h4>
                              <p>{c.charge ? `$${Number(c.charge).toFixed(2)}` : "-"}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-700">
                                Weight
                              </h4>
                              <p>{c.weight ? `${Number(c.weight)} kg` : "-"}</p>
                            </div>
                          </div>
                          {/* 📸 Images Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {c.sender_image && (
    <div>
      <h4 className="font-semibold text-gray-700 mb-2">Sender Image</h4>
      <img
        src={`${import.meta.env.VITE_API_URL}/storage/${c.sender_image}`}
        alt="Sender Image"
        className="w-full max-w-md rounded-lg border object-cover"
      />
    </div>
  )}
  {c.agent_image && (
    <div>
      <h4 className="font-semibold text-gray-700 mb-2">Agent Image</h4>
      <img
        src={`${import.meta.env.VITE_API_URL}/storage/${c.agent_image}`}
        alt="Agent Proof"
        className="w-full max-w-md rounded-lg border object-cover"
      />
    </div>
  )}
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

    </main>
  );
};

export default AgentHistory;
