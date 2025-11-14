// src/pages/CreateShipment/Confirmation.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Heading from "../../components/MidLineHeading/MidLineHeading";
import YellowButton from "../../components/YellowButton";
import cn from "classnames";
import api from "../../api";
import { geocodeAddress } from "../../geocode";

const steps = ["Shipment Details", "Additional Details", "Payment", "Confirmation"];

const Confirmation = () => {
  const { shipmentID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [draft, setDraft] = useState(null);
  const [currentStep] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // Load draft from state or localStorage
  useEffect(() => {
    if (location.state?.formData) {
      setDraft(location.state.formData);
      return;
    }
    const raw = localStorage.getItem(`shipment_${shipmentID}`);
    if (!raw) {
      navigate("/shipping-services/shipment-info", { replace: true });
      return;
    }
    setDraft(JSON.parse(raw));
  }, [shipmentID, navigate, location.state]);

  // Prepare payload to match your (extended) CustomerController@placeOrder
  const payload = useMemo(() => {
    if (!draft) return null;

    // be liberal: send what we have; backend will validate/ignore extras safely
    return {
      // Basic
      type: draft?.type || "Parcel",
      // prefer packageData.weight; fall back to plain weight if present
      weight:
        draft?.packageData?.weight != null
          ? Number(draft.packageData.weight)
          : draft?.weight != null
          ? Number(draft.weight)
          : undefined,
      size: draft?.size || undefined,

      // Calculated
      distance: draft?.distance != null ? Number(draft.distance) : undefined,
      charge: draft?.charge != null ? Number(draft.charge) : undefined,

      // FROM (sender)
      from_full_name: draft?.from?.fullName || "",
      from_email: draft?.from?.email || "",
      from_phone: draft?.from?.phone || "",
      from_country: draft?.from?.country || "",
      from_address: draft?.from?.address || "",
      from_city: draft?.from?.city || "",
      from_state: draft?.from?.state || "",
      from_zip: draft?.from?.zip || "",
      // coords if you kept them in earlier steps
      sender_lat: draft?.from?.lat ? Number(draft.from.lat) : undefined,
      sender_lng: draft?.from?.lng ? Number(draft.from.lng) : undefined,

      // TO (receiver)
      to_full_name: draft?.to?.fullName || "",
      to_email: draft?.to?.email || "",
      to_phone: draft?.to?.phone || "",
      to_country: draft?.to?.country || "",
      to_address: draft?.to?.address || "",
      to_city: draft?.to?.city || "",
      to_state: draft?.to?.state || "",
      to_zip: draft?.to?.zip || "",
      to_lat: draft?.to?.lat ? Number(draft.to.lat) : undefined,
      to_lng: draft?.to?.lng ? Number(draft.to.lng) : undefined,

      // PACKAGE
      length_cm:
        draft?.packageData?.length != null ? Number(draft.packageData.length) : undefined,
      width_cm:
        draft?.packageData?.width != null ? Number(draft.packageData.width) : undefined,
      height_cm:
        draft?.packageData?.height != null ? Number(draft.packageData.height) : undefined,
      content_description: draft?.packageDescription || "",

      // PAYMENT
      payment_method: draft?.paymentMethod || undefined,
      // payment_status defaults server-side (Unpaid)
    };
  }, [draft]);

  const extractTrackingCode = (resData) => {
    // Support multiple server shapes
    return (
      resData?.tracking_code ||
      resData?.courier?.tracking_code ||
      resData?.data?.tracking_code ||
      ""
    );
  };

  const handleConfirm = async () => {
    if (!payload || submitting) return;
    setSubmitting(true);
    setErr("");

    try {

      // --- Geocode người gửi ---
    let senderCoords =
      payload.sender_lat && payload.sender_lng
        ? { lat: payload.sender_lat, lng: payload.sender_lng }
        : null;

    if (!senderCoords && draft.from?.address) {
      const fullSenderAddress = [
        draft.from.address,
        draft.from.city,
        draft.from.state,
        draft.from.country,
      ]
        .filter(Boolean)
        .join(", ");

      senderCoords = await geocodeAddress(fullSenderAddress);
      console.log("📍 Sender geocoded:", fullSenderAddress, "→", senderCoords);
    }

    // --- Geocode người nhận ---
    let receiverCoords =
      payload.to_lat && payload.to_lng
        ? { lat: payload.to_lat, lng: payload.to_lng }
        : null;

    if (!receiverCoords && draft.to?.address) {
      const fullReceiverAddress = [
        draft.to.address,
        draft.to.city,
        draft.to.state,
        draft.to.country,
      ]
        .filter(Boolean)
        .join(", ");

      receiverCoords = await geocodeAddress(fullReceiverAddress);
      console.log("📍 Receiver geocoded:", fullReceiverAddress, "→", receiverCoords);
    }

    // --- Payload hoàn chỉnh gửi lên backend ---
    const updatedPayload = {
      ...payload,
      sender_lat: senderCoords?.lat,
      sender_lng: senderCoords?.lng,
      to_lat: receiverCoords?.lat,
      to_lng: receiverCoords?.lng,
    };

    console.log("🚀 Sending to backend:", JSON.stringify(updatedPayload, null, 2));

      // POST the order
      // Lấy file ảnh từ global hoặc session
const shipmentImg = window.selectedShipmentImage || null;

// Dùng FormData thay cho JSON
const formData = new FormData();
Object.entries(updatedPayload).forEach(([key, val]) => {
  if (val !== undefined && val !== null) formData.append(key, val);
});
if (shipmentImg) formData.append("image", shipmentImg);

console.log("🚀 Sending multipart to backend:", [...formData.entries()]);

const { data } = await api.post("/api/customer/order", formData, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});

      // Clear draft
      localStorage.removeItem(`shipment_${shipmentID}`);

      // Go to tracking if possible
      const tracking = extractTrackingCode(data);
      if (tracking) {
        navigate(`/shipping-services/tracking/${tracking}`, { replace: true });
      } else {
        // Fallback: go to dashboard
        navigate("/customer/dashboard", { replace: true });
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Failed to create courier. Please try again.";
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!draft) return null;

  return (
    <>
      <main className="flex flex-col justify-center items-center w-full max-w-[1600px] p-5 pt-10 mx-auto mt-[70px]">
        <div className="shipping-info-heading flex flex-col justify-center items-start w-full h-auto mb-[40px]">
          <Heading variant="left">Confirmation</Heading>
          <span className="text-lg text-left">Please review and confirm your shipment</span>
        </div>

        <section className="shipping-info-section grid grid-cols-1 lg:grid-cols-[1fr_3fr_2fr] place-content-center gap-10 lg:gap-5 w-full h-auto p-5 pb-[40px]">
          {/* Step Progress */}
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
                  {i < currentStep && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>

                <span
                  className={cn(
                    "ml-4 text-sm font-medium",
                    i <= currentStep ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Main Confirmation Panel */}
          <div className="flex flex-col gap-6 w-full h-auto">
            <div className="rounded-lg shadow-lg bg-white p-5">
              <Heading variant="left" size="small" marginBottom="none">
                Review Shipment
              </Heading>

              {/* From / To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="border-b-2 border-gray-300 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Shipper</h3>
                  </div>
                  <p>{draft.from?.fullName}</p>
                  <p>{draft.from?.email}</p>
                  <p>{draft.from?.phone}</p>
                  <p>{draft.from?.address}</p>
                  <p>{draft.from?.city}</p>
                  <p>{draft.from?.state}</p>
                  <p>{draft.from?.zip}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="border-b-2 border-gray-300 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Receiver</h3>
                  </div>
                  <p>{draft.to?.fullName}</p>
                  <p>{draft.to?.email}</p>
                  <p>{draft.to?.phone}</p>
                  <p>{draft.to?.address}</p>
                  <p>{draft.to?.city}</p>
                  <p>{draft.to?.state}</p>
                  <p>{draft.to?.zip}</p>
                </div>
              </div>

              {/* Package */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mt-5">
                <div className="border-b-2 border-gray-300 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Package</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-sm text-gray-500">Weight</span>
                    <div>{draft?.packageData?.weight || "-"} kg</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Length</span>
                    <div>{draft?.packageData?.length || "-"} cm</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Width</span>
                    <div>{draft?.packageData?.width || "-"} cm</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Height</span>
                    <div>{draft?.packageData?.height || "-"} cm</div>
                  </div>
                </div>
                {draft?.packageDescription ? (
                  <div className="mt-3">
                    <span className="text-sm text-gray-500">Contents</span>
                    <div>{draft.packageDescription}</div>
                  </div>
                ) : null}
              </div>

              {/* Payment + Quote */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mt-5">
                <div className="border-b-2 border-gray-300 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Payment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-sm text-gray-500">Method</span>
                    <div className="capitalize">{draft?.paymentMethod || "-"}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Estimated Charge</span>
                    <div>
                      {draft?.charge != null ? Number(draft.charge).toFixed(2) : "-"}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Estimated Distance</span>
                    <div>{draft?.distance != null ? `${Number(draft.distance).toFixed(2)} km` : "-"}</div>
                  </div>
                </div>
              </div>

              {err && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  {err}
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <YellowButton
                  type="button"
                  variant="widthAuto"
                  onClick={() => navigate(`/shipping-services/payment/${shipmentID}`)}
                >
                  Back
                </YellowButton>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Confirm & Create Courier"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="shipping-summary w-full h-full">
            <div className="w-full border-b-2 border-b-gray-300 text-left py-2 mb-5">
              <h1 className="text-2xl font-semibold">Shipping Summary</h1>
            </div>

            <div className="mb-3 flex flex-col justify-start items-start gap-2 bg-white rounded-lg shadow-lg w-full h-auto p-5">
              <div className="w-full border-b-2 border-gray-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Shipper</h3>
              </div>
              <p>{draft.from?.fullName}</p>
              <p>{draft.from?.email}</p>
              <p>{draft.from?.phone}</p>
              <p>{draft.from?.address}</p>
              <p>{draft.from?.city}</p>
              <p>{draft.from?.state}</p>
              <p>{draft.from?.zip}</p>
            </div>

            <div className="mb-3 flex flex-col justify-start items-start gap-2 bg-white rounded-lg shadow-lg w-full h-auto p-5">
              <div className="w-full border-b-2 border-gray-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Receiver</h3>
              </div>
              <p>{draft.to?.fullName}</p>
              <p>{draft.to?.email}</p>
              <p>{draft.to?.phone}</p>
              <p>{draft.to?.address}</p>
              <p>{draft.to?.city}</p>
              <p>{draft.to?.state}</p>
              <p>{draft.to?.zip}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Confirmation;
