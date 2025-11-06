import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";

import NotFound from "../../pages/NotFound/NotFound.jsx";
import MidLineHeading from "../../components/MidLineHeading/MidLineHeading.jsx";
import YellowButton from "../../components/YellowButton";
import api from "../../api";
import "./TrackingDetail.css";

// Icon marker
const markerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const TrackingDetail = () => {
  const { trackingCode } = useParams();
  const navigate = useNavigate();

  const [courier, setCourier] = useState(null);
  const [locations, setLocations] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  // ✅ Fetch Location Updates (try/catch thực sự)
  const fetchLocations = useCallback(async (courierId) => {
  setLoadingLocation(true);
  try {
    const { data } = await api.get(`/api/customer/couriers/${courierId}/locations`, {
      withCredentials: true,
    });
    setLocations(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error("❌ Lỗi khi tải Location Updates:", e);
  } finally {
    setLoadingLocation(false);
  }
}, []);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setErr("");

      try {
        // 🟢 1️⃣ Gọi API /api/customer/track/{code}
        const { data: courierData } = await api.get(
          `/api/customer/track/${encodeURIComponent(trackingCode)}`,
          { withCredentials: true }
        );
        if (!mounted) return;
        setCourier(courierData);

        // 🟢 2️⃣ Gọi API /api/customer/trackdetail/{id} (lấy vị trí)
        try {
          const { data: locData } = await api.get(
            `/api/customer/trackdetail/${encodeURIComponent(courierData.tracking_code)}`,
            { withCredentials: true }
          );
          if (!mounted) return;
          setLocations(Array.isArray(locData) ? locData : []);
        } catch (e) {
          console.warn("⚠️ No detailed locations:", e);
        }

        // 🟢 2️⃣ Gọi lấy vị trí đầu tiên
        await fetchLocations(courierData.id);

        // 🟢 3️⃣ Gọi API /api/customer/trackhistory/{id} (lấy lịch sử trạng thái)
        try {
          const { data: statusData } = await api.get(
            `/api/customer/trackhistory/${courierData.id}`,
            { withCredentials: true }
          );
          if (!mounted) return;
          setStatusHistory(Array.isArray(statusData) ? statusData : []);
        } catch (e) {
          console.warn("⚠️ No status history:", e);
        }
      } catch (e) {
        if (!mounted) return;

        

        if (e?.response?.status === 401) {
          const redirect = encodeURIComponent(
            window.location.pathname + window.location.search + window.location.hash
          );
          navigate(`/customer/login?redirect=${redirect}`, { replace: true });
          return;
        }

        setErr(e?.response?.data?.message || "Tracking not found");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [trackingCode, navigate, fetchLocations]);

  if (loading)
    return (
      <main className="max-w-[1500px] mx-auto mt-[70px] p-6">
        <MidLineHeading>Tracking Detail</MidLineHeading>
        <p className="mt-4">Loading...</p>
      </main>
    );

  if (err)
    return (
      <main className="max-w-[1500px] mx-auto mt-[70px] p-6">
        <MidLineHeading>Tracking Detail</MidLineHeading>
        <p className="mt-4 text-red-600">{err}</p>
        <div className="mt-4">
          <YellowButton onClick={() => navigate("/shipping-services/tracking")}>
            Back to Search
          </YellowButton>
        </div>
      </main>
    );

  if (!courier) return <NotFound />;

  // 🗺️ Chuẩn bị dữ liệu vị trí
  const points =
    locations.length > 0
      ? locations.map((l) => [l.latitude, l.longitude])
      : courier.sender_lat && courier.sender_lng
      ? [[courier.sender_lat, courier.sender_lng]]
      : [];

  const last = points[points.length - 1];

  return (
    <main className="flex flex-col justify-center items-center max-w-[1500px] mx-auto mt-[70px]">
      <MidLineHeading>Tracking Detail</MidLineHeading>

      <section className="tracking-detail-section grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 w-full h-auto p-3">
        {/* Left: Main info */}
        <div>
          <div className="tracking-detail-container flex flex-col gap-5 w-full shadow-lg rounded-lg border border-amber-400 p-5">
            <p>Tracking Code: {courier.tracking_code}</p>
            <h1 className="text-4xl font-bold">{courier.status}</h1>

            {/* 🗺️ Bản đồ vị trí */}
            {points.length > 0 ? (
              <div className="w-full h-[400px] rounded-lg overflow-hidden border shadow">
                <MapContainer center={last} zoom={14} className="h-full w-full">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />

                  {points.map((pos, i) => (
                    <Marker key={i} position={pos} icon={markerIcon}>
                      <Popup>
                        Lat: {pos[0]}, Lng: {pos[1]}
                        <br />
                        {locations[i]?.recorded_at
                          ? new Date(locations[i].recorded_at).toLocaleString()
                          : courier.last_located_at
                          ? new Date(courier.last_located_at).toLocaleString()
                          : ""}
                      </Popup>
                    </Marker>
                  ))}

                  {points.length > 1 && (
                    <Polyline positions={points} color="blue" weight={4} />
                  )}
                </MapContainer>
              </div>
            ) : (
              <p className="text-gray-500">No location data yet.</p>
            )}

            {/* Sender / Receiver */}
            <div className="flex flex-col md:flex-row justify-between gap-5 w-full mt-4">
              <div className="shadow-md rounded-lg p-4 w-full">
                <h3 className="text-2xl font-bold">Sender:</h3>
                <p>{courier.from_full_name}</p>
                <p>{courier.from_phone}</p>
                <p>
                  {courier.from_address}, {courier.from_city}
                </p>
              </div>

              <div className="shadow-md rounded-lg p-4 w-full">
                <h3 className="text-2xl font-bold">Receiver:</h3>
                <p>{courier.to_full_name}</p>
                <p>{courier.to_phone}</p>
                <p>
                  {courier.to_address}, {courier.to_city}
                </p>
              </div>
            </div>

            <YellowButton
              variant="widthAuto"
              onClick={() => navigate("/shipping-services/tracking")}
            >
              Back to Tracking
            </YellowButton>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="tracking-history-container flex flex-col gap-4 shadow-lg rounded-lg bg-amber-400 border border-black w-full p-5">
          {/* 🕓 Status History */}
          <h3 className="text-lg font-bold text-black mb-2">📜 Status History</h3>
          {statusHistory.length > 0 ? (
            statusHistory.map((item, idx) => (
              <div
                key={idx}
                className="tracking-history-element border border-black bg-white rounded-lg p-4 w-full"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg">{item.status}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(item.changed_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center text-black">
              No status history yet.
            </div>
          )}

         {/* 📍 Location Updates */}
<div className="flex items-center justify-between mt-6 mb-2">
  <h3 className="text-lg font-bold text-black">📍 Location Updates</h3>
  <button
    onClick={() => fetchLocations(courier.id)}
    disabled={loadingLocation}
    className="text-sm px-3 py-1 bg-white rounded border border-black hover:bg-gray-100 disabled:opacity-50"
  >
    {loadingLocation ? "Refreshing..." : "Refresh"}
  </button>
</div>

{locations.length > 0 ? (
  locations.map((row, index) => (
    <div
      key={index}
      className="tracking-history-element border border-black bg-white rounded-lg p-4 w-full"
    >
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-lg">
          {row.latitude}, {row.longitude}
        </h4>
        <span className="text-sm text-gray-500">
          {row.recorded_at
            ? new Date(row.recorded_at).toLocaleString()
            : "-"}
        </span>
      </div>
    </div>
  ))
) : (
  <div className="w-full text-center text-black">
    No tracking history yet.
  </div>
)}
        </div>
      </section>
    </main>
  );
};

export default TrackingDetail;
