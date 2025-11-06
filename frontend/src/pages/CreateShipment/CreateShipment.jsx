// src/pages/CreateShipment/CreateShipment.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { v4 as uuidv4 } from "uuid";
import Heading from "../../components/MidLineHeading/MidLineHeading";
import YellowButton from "../../components/YellowButton";

// --- Helpers ---
const haversineKm = (a, b) => {
  if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) return 0;
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const x =
    sinDLat * sinDLat + Math.cos(la1) * Math.cos(la2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return +(R * c).toFixed(2);
};

const estimateCharge = ({ distanceKm, weightKg }) => {
  const base = 3.5;              // base fee (USD)
  const perKm = 0.6;             // per km
  const weightSurcharge = Math.max(0, (weightKg || 0) - 1) * 0.4; // after 1kg
  return +(base + perKm * (distanceKm || 0) + weightSurcharge).toFixed(2);
};

// Nominatim search
async function searchPlaces(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&addressdetails=1&limit=5`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "CourierXpress Demo (localhost)",
      Referer: window.location.origin,
    },
  });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

const CreateShipment = () => {
  const navigate = useNavigate();

  const steps = ["Shipment Details", "Additional Details", "Payment", "Confirmation"];
  const [currentStep] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  

  const [formData, setFormData] = useState({
    from: {
      country: "",
      fullName: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      lat: "",
      lng: "",
    },
    to: {
      country: "",
      fullName: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      lat: "",
      lng: "",
    },
    packageData: {
      weight: "", // kg for estimate
    },
  });

  // Search UI state (search-only)
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromResults, setFromResults] = useState([]);
  const [toResults, setToResults] = useState([]);
  const [searchingFrom, setSearchingFrom] = useState(false);
  const [searchingTo, setSearchingTo] = useState(false);

  const distanceKm = useMemo(
    () =>
      haversineKm(
        { lat: +formData.from.lat || 0, lng: +formData.from.lng || 0 },
        { lat: +formData.to.lat || 0, lng: +formData.to.lng || 0 }
      ),
    [formData.from.lat, formData.from.lng, formData.to.lat, formData.to.lng]
  );

  const charge = useMemo(
    () =>
      estimateCharge({
        distanceKm,
        weightKg: +formData.packageData.weight || 0,
      }),
    [distanceKm, formData.packageData.weight]
  );

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handlePackageChange = (field, value) => {
    setFormData((prev) => ({ ...prev, packageData: { ...prev.packageData, [field]: value } }));
  };

  const runFromSearch = async () => {
    if (!fromQuery.trim()) return;
    setSearchingFrom(true);
    setErrMsg("");
    try {
      const data = await searchPlaces(fromQuery.trim());
      setFromResults(data);
    } catch {
      setErrMsg("Failed to search pickup location.");
    } finally {
      setSearchingFrom(false);
    }
  };

  const runToSearch = async () => {
    if (!toQuery.trim()) return;
    setSearchingTo(true);
    setErrMsg("");
    try {
      const data = await searchPlaces(toQuery.trim());
      setToResults(data);
    } catch {
      setErrMsg("Failed to search destination.");
    } finally {
      setSearchingTo(false);
    }
  };

  const chooseFromResult = (r) => {
    const addr = r?.display_name || "";
    const lat = r?.lat || "";
    const lng = r?.lon || "";
    setFormData((prev) => ({
      ...prev,
      from: {
        ...prev.from,
        address: addr,
        city: r?.address?.city || r?.address?.town || r?.address?.village || prev.from.city,
        state: r?.address?.state || prev.from.state,
        country: r?.address?.country || prev.from.country,
        lat,
        lng,
      },
    }));
    setFromQuery(addr);
    setFromResults([]);
  };

  const chooseToResult = (r) => {
    const addr = r?.display_name || "";
    const lat = r?.lat || "";
    const lng = r?.lon || "";
    setFormData((prev) => ({
      ...prev,
      to: {
        ...prev.to,
        address: addr,
        city: r?.address?.city || r?.address?.town || r?.address?.village || prev.to.city,
        state: r?.address?.state || prev.to.state,
        country: r?.address?.country || prev.to.country,
        lat,
        lng,
      },
    }));
    setToQuery(addr);
    setToResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrMsg("");

    // Must choose suggested locations (we require lat/lng)
    if (!formData.from.lat || !formData.from.lng || !formData.to.lat || !formData.to.lng) {
      setErrMsg("Please search and pick both pickup and destination from the suggestions.");
      return;
    }

    // Minimal required text fields
    const requiredFrom = ["fullName", "phone", "address"];
    const requiredTo = ["fullName", "phone", "address"];
    const allFilledFrom = requiredFrom.every((k) => String(formData.from[k] || "").trim() !== "");
    const allFilledTo = requiredTo.every((k) => String(formData.to[k] || "").trim() !== "");

    if (!allFilledFrom || !allFilledTo) {
      setErrMsg("Please fill required sender/receiver fields.");
      return;
    }

    const shipmentID = uuidv4();
    localStorage.setItem(
      `shipment_${shipmentID}`,
      JSON.stringify({
        step: 1,
        ...formData,
        distance: distanceKm,
        charge,
      })
    );

    navigate(`/shipping-services/additional-details/${shipmentID}`);
  };

  return (
    <>
      <main className="flex flex-col justify-center items-center w-full max-w-[1600px] pt-10 mx-auto mt-[70px]">
        <div className="shipping-info-heading flex flex-col justify-center items-start w-full h-auto mb-[40px]">
          <Heading variant="left">Create a Shipment</Heading>
          <span className="text-lg text-left">Indicates required field</span>
        </div>

        <section className="shipping-info-section grid grid-cols-1 md:grid-cols-[1fr_3fr_2fr] place-content-center gap-5 w-full h-auto pb-[40px]">
          {/* Stepper */}
          <div className="step-progress relative flex flex-col justify-start items-start gap-5 w-full max-h-[215px]">
            <div className="absolute left-[7px] top-2 bottom-2 w-[3px] bg-emerald-700 z-0"></div>
            {steps.map((step, i) => (
              <div key={i} className="flex items-center mb-6 relative z-10">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    {
                      "border-emerald-700 bg-emerald-700": i < currentStep,
                      "w-[18px] h-[18px] border-[4px] border-emerald-700 bg-white": i === currentStep,
                      "bg-white border-gray-300": i > currentStep,
                    }
                  )}
                >
                  {i < currentStep && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>

                <span className={cn("ml-4 text-sm font-medium", i <= currentStep ? "text-gray-900" : "text-gray-400")}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-12 w-full">
            {/* Ship From */}
            <fieldset className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
              <Heading variant="left" size="small">Ship From</Heading>

              {/* Search box */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Search for pickup location"
                  className="border border-gray-300 rounded p-3 w-full"
                  value={fromQuery}
                  onChange={(e) => setFromQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), runFromSearch())}
                />
                 <button
  type="button"
  onClick={runFromSearch}
  disabled={searchingFrom}
  className="font-semibold w-full md:w-auto h-auto rounded-[25px] opacity-100 hover:border hover:opacity-[0.85] transition-500 border border-amber-400 bg-amber-400 p-2 px-50"
>
  {submitting ? "Searching..." : "Search"}
</button>
              </div>

              {fromResults.length > 0 && (
                <div className="border rounded p-2 max-h-56 overflow-auto mb-4">
                  {fromResults.map((r) => (
                    <button
                      type="button"
                      key={`${r.place_id}`}
                      onClick={() => chooseFromResult(r)}
                      className="block text-left w-full py-2 px-2 hover:bg-gray-100 rounded"
                    >
                      {r.display_name}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["fullName", "email", "phone"].map((key) => (
                  <input
                    key={`from-${key}`}
                    type="text"
                    placeholder={key === "fullName" ? "Full Name *" : key[0].toUpperCase() + key.slice(1)}
                    className="border border-gray-300 rounded p-3 w-full"
                    value={formData.from[key]}
                    onChange={(e) => handleChange("from", key, e.target.value)}
                  />
                ))}

                <input
                  type="text"
                  placeholder="Address * (select above to auto-fill)"
                  className="border border-gray-300 rounded p-3 w-full md:col-span-2"
                  value={formData.from.address}
                  onChange={(e) => handleChange("from", "address", e.target.value)}
                />

                {["city", "state", "zip", "country"].map((key) => (
                  <input
                    key={`from-${key}`}
                    type="text"
                    placeholder={key[0].toUpperCase() + key.slice(1)}
                    className="border border-gray-300 rounded p-3 w-full"
                    value={formData.from[key]}
                    onChange={(e) => handleChange("from", key, e.target.value)}
                  />
                ))}
              </div>
            </fieldset>

            {/* Ship To */}
            <fieldset className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
              <Heading variant="left" size="small">Ship To</Heading>

              {/* Search */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Search for destination address"
                  className="border border-gray-300 rounded p-3 w-full"
                  value={toQuery}
                  onChange={(e) => setToQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), runToSearch())}
                />
                
                <button
  type="button"
  onClick={runToSearch}
  disabled={searchingTo}
  className="font-semibold w-full md:w-auto h-auto rounded-[25px] opacity-100 hover:border hover:opacity-[0.85] transition-500 border border-amber-400 bg-amber-400 p-2 px-50"
>
  {submitting ? "Searching..." : "Search"}
</button>
              </div>

              {toResults.length > 0 && (
                <div className="border rounded p-2 max-h-56 overflow-auto mb-4">
                  {toResults.map((r) => (
                    <button
                      type="button"
                      key={`${r.place_id}`}
                      onClick={() => chooseToResult(r)}
                      className="block text-left w-full py-2 px-2 hover:bg-gray-100 rounded"
                    >
                      {r.display_name}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["fullName", "email", "phone"].map((key) => (
                  <input
                    key={`to-${key}`}
                    type="text"
                    placeholder={key === "fullName" ? "Full Name *" : key[0].toUpperCase() + key.slice(1)}
                    className="border border-gray-300 rounded p-3 w-full"
                    value={formData.to[key]}
                    onChange={(e) => handleChange("to", key, e.target.value)}
                  />
                ))}

                <input
                  type="text"
                  placeholder="Address * (select above to auto-fill)"
                  className="border border-gray-300 rounded p-3 w-full md:col-span-2"
                  value={formData.to.address}
                  onChange={(e) => handleChange("to", "address", e.target.value)}
                />

                {["city", "state", "zip", "country"].map((key) => (
                  <input
                    key={`to-${key}`}
                    type="text"
                    placeholder={key[0].toUpperCase() + key.slice(1)}
                    className="border border-gray-300 rounded p-3 w-full"
                    value={formData.to[key]}
                    onChange={(e) => handleChange("to", key, e.target.value)}
                  />
                ))}
              </div>
            </fieldset>

            {/* Quick package weight for fare estimate */}
            <fieldset className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
              <Heading variant="left" size="small">Package (for estimate)</Heading>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Weight (kg)"
                  className="border border-gray-300 rounded p-3 w-full"
                  value={formData.packageData.weight}
                  onChange={(e) => handlePackageChange("weight", e.target.value)}
                />
                <div className="border border-gray-100 rounded p-3 bg-gray-50">
                  Distance: <strong>{distanceKm} km</strong>
                </div>
                <div className="border border-gray-100 rounded p-3 bg-gray-50">
                  Estimated Charge: <strong>${Number.isFinite(charge) ? charge.toFixed(2) : "-"}</strong>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                * Final charge may vary based on actual package characteristics.
              </p>
            </fieldset>

            {errMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3">
                {errMsg}
              </div>
            )}

            <YellowButton variant="widthAuto" type="submit">
              Continue
            </YellowButton>
          </form>

          {/* Right Summary */}
          <div className="shipping-summary flex flex-col justify-start items-center w-full h-auto gap-5 rounded-lg shadow-lg bg-white p-5">
            <div className="w-full border-b border-b-gray-300 text-left py-3">
              <h1 className="text-2xl font-semibold">Shipping Summary</h1>
            </div>

            <div className="flex flex-col justify-start items-start gap-2 w-full h-auto">
              <h1 className="text-lg font-semibold">Shipper Details</h1>
              <span className="text-md">{formData.from.fullName || "-"}</span>
              <span className="text-md">{formData.from.email || "-"}</span>
              <span className="text-md">{formData.from.phone || "-"}</span>
              <span className="text-md">{formData.from.address || "-"}</span>
            </div>

            <div className="flex flex-col justify-start items-start gap-2 w-full h-auto">
              <h1 className="text-lg font-semibold">Receiver Details</h1>
              <span className="text-md">{formData.to.fullName || "-"}</span>
              <span className="text-md">{formData.to.email || "-"}</span>
              <span className="text-md">{formData.to.phone || "-"}</span>
              <span className="text-md">{formData.to.address || "-"}</span>
            </div>

            <div className="flex flex-col justify-start items-start gap-2 w-full h-auto">
              <h1 className="text-lg font-semibold">Estimate</h1>
              <span>Distance: {distanceKm} km</span>
              <span>Charge: ${Number.isFinite(charge) ? charge.toFixed(2) : "-"}</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CreateShipment;
