import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import NotFound from '../../pages/NotFound/NotFound.jsx';
import MidLineHeading from '../../components/MidLineHeading/MidLineHeading.jsx';
import YellowButton from '../../components/YellowButton';

// API
import api from '../../api';

// CSS
import './TrackingDetail.css';

const TrackingDetail = () => {
  const { trackingCode } = useParams();
  const navigate = useNavigate();

  const [courier, setCourier] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setErr("");

      try {
        // 1) Fetch courier by tracking code (customer-owned)
        const { data } = await api.get(`/api/customer/track/${encodeURIComponent(trackingCode)}`, {
          withCredentials: true,
        });
        if (!mounted) return;
        setCourier(data);

        // 2) Fetch timeline (optional)
        try {
          const locRes = await api.get(`/api/customer/couriers/${data.id}/locations`, {
            withCredentials: true,
          });
          if (!mounted) return;
          setLocations(Array.isArray(locRes.data) ? locRes.data : []);
        } catch (_) {
          // timeline not critical; ignore if not available
        }
      } catch (e) {
        if (!mounted) return;

        if (e?.response?.status === 401) {
          // Not logged in → redirect to customer login with redirect back
          const redirect = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
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
  }, [trackingCode, navigate]);

  if (loading) {
    return (
      <main className="max-w-[1500px] mx-auto mt-[70px] p-6">
        <MidLineHeading>Tracking Detail</MidLineHeading>
        <p className="mt-4">Loading...</p>
      </main>
    );
  }

  if (err) {
    return (
      <main className="max-w-[1500px] mx-auto mt-[70px] p-6">
        <MidLineHeading>Tracking Detail</MidLineHeading>
        <p className="mt-4 text-red-600">{err}</p>
        <div className="mt-4">
          <YellowButton onClick={() => navigate('/shipping-services/tracking')}>Back to Search</YellowButton>
        </div>
      </main>
    );
  }

  if (!courier) {
    return <NotFound />;
  }

  return (
    <>
      <main className="flex flex-col justify-center items-center max-w-[1500px] mx-auto mt-[70px]">
        <MidLineHeading>Tracking Detail</MidLineHeading>

        <section className="tracking-detail-section grid grid-cols-1 lg:grid-cols-[2fr_1fr] place-content-center gap-5 w-full h-auto p-3">
          {/* Left: Main panel */}
          <div>
            <div className="tracking-detail-container flex flex-col justify-start items-start text-left gap-5 w-full h-auto shadow-lg rounded-lg border border-amber-400 p-5">
              <p>Tracking Code: {courier.tracking_code}</p>

              <h1 className="text-4xl text-black font-bold">{courier.status}</h1>

              {/* Sender & Receiver Info */}
              <div className="sender-receiver-container flex flex-col md:flex-row justify-between items-center gap-5 w-full">
                {/* Sender */}
                <div className="sender-info-container flex flex-col justify-center items-start gap-3 w-full shadow-md rounded-lg p-4">
                  <h3 className="text-2xl text-black text-left font-bold">Sender:</h3>
                  <h4 className="text-xl text-black text-left">{courier.from_full_name || '-'}</h4>
                  <p>{courier.from_phone || '-'}</p>
                  <h4 className="text-xl text-black text-left">
                    From: <strong>{[courier.from_address, courier.from_city, courier.from_state, courier.from_zip].filter(Boolean).join(', ') || '-'}</strong>
                  </h4>
                </div>

                {/* Receiver */}
                <div className="sender-info-container flex flex-col justify-center items-start gap-3 w-full shadow-md rounded-lg p-4">
                  <h4 className="text-2xl text-black text-left font-bold">Receiver:</h4>
                  <h3 className="text-xl text-black text-left">{courier.to_full_name || '-'}</h3>
                  <p>{courier.to_phone || '-'}</p>
                  <h4 className="text-xl text-black text-left">
                    To: <strong>{[courier.to_address, courier.to_city, courier.to_state, courier.to_zip].filter(Boolean).join(', ') || '-'}</strong>
                  </h4>
                </div>
              </div>

              {/* Schedule & Estimated (optional placeholders) */}
              <div className="sender-receiver-container flex flex-col md:flex-row justify-between items-center gap-5 w-full">
                <div className="sender-info-container flex flex-col justify-center items-start gap-3 w-full shadow-md rounded-lg p-4">
                  <h3 className="text-2xl text-black text-left">
                    Scheduled: <strong>{new Date(courier.created_at).toLocaleString()}</strong>
                  </h3>
                </div>

                <div className="sender-info-container flex flex-col justify-center items-start gap-3 w-full shadow-md rounded-lg p-4">
                  <h4 className="text-2xl text-black text-left">
                    Estimated: <strong>-</strong>
                  </h4>
                </div>
              </div>

              <YellowButton variant="widthAuto" onClick={() => navigate('/shipping-services/tracking')}>
                Delivery Option
              </YellowButton>
            </div>
          </div>

          {/* Right: Timeline / History */}
          <div className="tracking-history-container flex flex-col justify-start items-center text-left gap-4 shadow-lg rounded-lg bg-amber-400 border border-black w-full h-auto p-5">
            {locations.length > 0 ? (
              locations.map((row, index) => (
                <div
                  key={index}
                  className="tracking-history-element relative before:absolute before:top-1/2 before:left-1/2 before:transform before:translate-x-[-50%] before:translate-y-[-50%] before:bg-slate-800 before:w-[90%] before:h-[2px] before:rounded w-full flex flex-col justify-start items-center gap-2 border border-black bg-white rounded-lg p-4"
                >
                  <div className="flex justify-between items-center gap-4 w-full">
                    <h4 className="font-bold text-lg">
                      {row.recorded_at ? new Date(row.recorded_at).toLocaleString() : '-'}
                    </h4>
                    <h4 className="font-bold text-lg">
                      {row.status || 'Location update'}
                    </h4>
                  </div>
                  <h3 className="text-left w-full">
                    {row.latitude}, {row.longitude} {row.place ? `— ${row.place}` : ''}
                  </h3>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-black">No tracking history yet.</div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default TrackingDetail;
