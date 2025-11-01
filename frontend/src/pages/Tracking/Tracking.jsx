import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importing Components
import YellowButton from '../../components/YellowButton.jsx';
import BlueButton from '../../components/BlueButton.jsx';

// Importing CSS
import './Tracking.css';

const Tracking = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const trackOrder = (e) => {
    e.preventDefault();
    const code = trackingCode.trim();
    if (!code) {
      setError("Please enter a tracking code.");
      return;
    }
    // Go straight to detail page; it will fetch from API
    navigate(`/shipping-services/tracking/${encodeURIComponent(code)}`);
  };

  return (
    <>
      <main className="flex flex-col justify-center items-center max-w-[1300px] mx-auto mt-[100px]">
        <form
          onSubmit={trackOrder}
          className="tracking-section grid grid-cols-1 lg:grid-cols-[2fr_1fr] place-content-center gap-5 w-full mb-[80px]"
        >
          <div className="tracking-container flex flex-col justify-center items-start shadow-md w-full gap-2 bg-white p-5">
            <div className="tracking-icon-container flex justify-start items-center gap-2 w-full">
              <i className="bi bi-box-seam text-lg"></i>
              <h2>Track</h2>
            </div>

            <div className="tracking-input-container flex justify-center items-center gap-2 w-full mb-[20px]">
              <div className="tracking-label-container flex justify-between items-center w-full mb-1">
                <h5>Enter tracking number</h5>

                <div className="help-container flex justify-center items-center gap-2">
                  <h5 className="text-blue-500">Help</h5>
                  <i className="bi bi-box-arrow-up-right"></i>
                </div>
              </div>
            </div>

            <div className="tracking-input w-full h-auto mb-[10px]">
              <input
                className="outline-none border border-gray-800 w-full h-[40px] p-3"
                value={trackingCode}
                onChange={(e) => {
                  setTrackingCode(e.target.value);
                  setError("");
                }}
                placeholder="Track"
                required
              />

              {error && <p className="text-red-500 text-left mt-[10px]">{error}</p>}
            </div>

            <div className="other-tracking-options flex flex-col justify-center items-start gap-4 w-full mb-2">
              <span>Need to Change a Delivery?</span>
              <span>
                You can access available by tracking the package and then selecting "Change My Delivery"
              </span>
            </div>

            <div className="track-button-container flex justify-start items-center w-full h-auto">
              <YellowButton type="submit">Track</YellowButton>
            </div>
          </div>

          <div className="tracking-tips-container flex flex-col justify-start items-center gap-3 w-full">
            <div className="tips-link-container flex flex-col justify-center items-start gap-2 p-5 w-full h-auto shadow-md bg-white">
              <span className="text-blue-600 underline cursor-pointer">Track by Reference Number</span>
              <span className="text-blue-600 underline cursor-pointer">Import Tracking Numbers</span>
              <span className="text-blue-600 underline cursor-pointer">Other Tracking Services</span>
            </div>

            <div className="stay-safe-container grid grid-cols-[1fr_5fr] place-content-center gap-1 p-5 w-full shadow-md bg-white">
              <div className="lock-icon-container flex justify-center items-start w-auto h-full">
                <i className="bi bi-lock text-black text-5xl font-bold"></i>
              </div>

              <div className="safe-tips-container flex flex-col justify-center items-start gap-4 w-full">
                <h1>Stay Safe - Avoid Fraud and Scams</h1>
                <p>Received a text, call, or email that seems suspicious? Don't respond to it.</p>
                <BlueButton>Tips to Avoid Fraud</BlueButton>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default Tracking;
