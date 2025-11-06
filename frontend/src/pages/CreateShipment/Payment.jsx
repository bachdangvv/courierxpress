import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Heading from '../../components/MidLineHeading/MidLineHeading';
import YellowButton from '../../components/YellowButton';
import cn from 'classnames';

const Payment = () => {
  const { shipmentID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const steps = ["Shipment Details", "Additional Details", "Payment", "Confirmation"];

  const [shipmentInfo, setShipmentInfo] = useState(null); // contains { from, to, packageData, ... }
  const [packageData, setPackageData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [charge, setCharge] = useState(""); // optional price
  const [currentStep, setCurrentStep] = useState(2);

  useEffect(() => {
    // If came via navigate state
    if (location.state?.formData) {
      const formData = location.state.formData;
      setShipmentInfo(formData);
      setPackageData(formData.packageData || null);
      setPaymentMethod(formData.paymentMethod || "");
      setCharge(formData.charge ?? "");
      return;
    }

    // Otherwise load draft from localStorage
    const raw = localStorage.getItem(`shipment_${shipmentID}`);
    if (raw) {
      const draft = JSON.parse(raw);
      setShipmentInfo(draft);
      setPackageData(draft.packageData || null);
      setPaymentMethod(draft.paymentMethod || "");
      setCharge(draft.charge ?? "");
    } else {
      navigate('/shipping-services/shipment-info', { replace: true });
    }
  }, [shipmentID, navigate, location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Please choose a payment method");
      return;
    }
    // (Optional basic card checks – you can remove if using a real gateway)
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      alert("Please complete your card details");
      return;
    }

    setCurrentStep(3);

    const prev = JSON.parse(localStorage.getItem(`shipment_${shipmentID}`)) || {};
    const updated = {
      ...prev,
      step: 3,
      paymentMethod,                // FE key
      charge: charge ? Number(charge) : undefined, // optional price
      updatedAt: new Date().toISOString(),
      // keep existing from/to/packageData already stored in previous steps
    };

    localStorage.setItem(`shipment_${shipmentID}`, JSON.stringify(updated));

    navigate(`/shipping-services/confirmation/${shipmentID}`, {
      state: { formData: updated },
      replace: true,
    });
  };

  return (
    <>
      <main className='flex flex-col justify-center items-center w-full max-w-[1600px] p-5 pt-10 mx-auto mt-[70px]'>
        <div className='shipping-info-heading flex flex-col justify-center items-start w-full h-auto mb-[40px]'>
          <Heading variant='left'>Payment</Heading>
          <span className='text-lg text-left'>Indicates required field</span>
        </div>

        <section className='shipping-info-section grid grid-cols-1 lg:grid-cols-[1fr_3fr_2fr] place-content-center gap-10 lg:gap-5 w-full h-auto p-5 pb-[40px]'>
          {/* Steps */}
          <div className='step-progress relative flex flex-col justify-start items-start gap-5 w-full max-h-[215px]'>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-full h-auto rounded-lg shadow-lg bg-white p-5">
            <Heading variant='left' size='small' marginBottom='none'>Payment Method</Heading>

                            <div className='flex flex-col justify-start items-start gap-4'>
                                <span className='font-semibold'>Card Information:</span>
                                <select onChange={(e) => setPaymentMethod(e.target.value)} id="card-type" name="card-type" className='border border-gray-300 rounded p-3 w-full mb-2 bg-transparent' required>
                                    <option value="">Card Type</option>
                                    <option value="visa">Visa</option>
                                    <option value="mastercard">Mastercard</option>
                                    <option value="amex">American Express</option>
                                </select>

              <div className='grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] place-content-center gap-5 w-full h-auto'>
                <div className='w-full'>
                  <input
                    type='tel'
                    inputMode='numeric'
                    maxLength={19}
                    placeholder='1234 5678 9012 3456'
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className='border border-gray-300 rounded p-3 w-full mb-2 bg-transparent'
                  />
                </div>

                <div className='w-full'>
                  <input
                    type="text"
                    id="cardExpireDate"
                    placeholder="MM-YY"
                    pattern="\d{2}-\d{2}"
                    title="Enter a date in the format MM-YY (e.g., 12-29)"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    className='border border-gray-300 rounded p-3 w-full mb-2 bg-transparent'
                  />
                </div>

                <div className='w-full'>
                  <input
                    type='text'
                    id='cardCVV'
                    placeholder='CVV*'
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    required
                    className='border border-gray-300 rounded p-3 w-full mb-2 bg-transparent'
                  />
                </div>
              </div>

              <input
                type="text"
                placeholder='Cardholder Name'
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                className='border border-gray-300 rounded p-3 w-full mb-2 bg-transparent'
              />

              {/* Optional price input (or compute server-side) */}
              <div className='grid grid-cols-[auto_1fr] gap-3 items-center w-full'>
                <label className='text-sm text-gray-600'>Charge (USD): {charge}</label>
              </div>
            </div>

            {/* Terms */}
            <div className='flex flex-col justify-start items-start gap-4'>
              <h2>Terms and Conditions</h2>
              <div className='grid grid-cols-[30px_1fr] gap-1 w-full h-auto'>
                <div className='w-auto h-auto flex justify-start items-start'>
                  <input type='checkbox' required className='w-[24px] h-[24px]'/>
                </div>
                <div className='flex flex-col justify-start items-start gap-5 w-full h-auto'>
                  <p>By creating this shipment, I agree to the terms…</p>
                  <p>Quoted price may change based on actual package characteristics…</p>
                </div>
              </div>
            </div>

            <YellowButton type="submit" variant="widthAuto">
              Confirm Shipment
            </YellowButton>
          </form>

          {/* Summary */}
          {shipmentInfo && (
            <div className="shipping-summary w-full h-full">
              <div className='w-full border-b-2 border-b-gray-300 text-left py-2 mb-5'>
                <h1 className='text-2xl font-semibold'>Shipping Summary</h1>
              </div>

              <div className='mb-3 flex flex-col justify-start items-start gap-2 bg-white rounded-lg shadow-lg w-full h-auto p-5'>
                <div className='w-full border-b-2 border-gray-300'>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Packaging</h3>
                </div>
                {packageData ? (
                  <>
                    <p>Weight: {packageData.weight}kg</p>
                    <p>Length: {packageData.length}cm</p>
                    <p>Width: {packageData.width}cm</p>
                    <p>Height: {packageData.height}cm</p>
                  </>
                ) : (
                  <p>No package data found.</p>
                )}
              </div>

              <div className='mb-3 flex flex-col justify-start items-start gap-2 bg-white rounded-lg shadow-lg w-full h-auto p-5'>
                <div className='w-full border-b-2 border-gray-300'>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Shipper:</h3>
                </div>
                <p>{shipmentInfo.from.fullName}</p>
                <p>{shipmentInfo.from.email}</p>
                <p>{shipmentInfo.from.phone}</p>
                <p>{shipmentInfo.from.address}</p>
                <p>{shipmentInfo.from.city}</p>
                <p>{shipmentInfo.from.state}</p>
                <p>{shipmentInfo.from.zip}</p>
              </div>

              <div className='mb-3 flex flex-col justify-start items-start gap-2 bg-white rounded-lg shadow-lg w-full h-auto p-5'>
                <div className='w-full border-b-2 border-gray-300'>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Receiver:</h3>
                </div>
                <p>{shipmentInfo.to.fullName}</p>
                <p>{shipmentInfo.to.email}</p>
                <p>{shipmentInfo.to.phone}</p>
                <p>{shipmentInfo.to.address}</p>
                <p>{shipmentInfo.to.city}</p>
                <p>{shipmentInfo.to.state}</p>
                <p>{shipmentInfo.to.zip}</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Payment;
