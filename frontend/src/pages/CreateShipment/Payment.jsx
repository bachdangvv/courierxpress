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

    const [shipmentInfo, setShipmentInfo] = useState(null);
    const [packageData, setPackageData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [currentStep, setCurrentStep] = useState(2);

    // Check local storage and continue the form if exist data. Otherwise, navigate to the first step
    useEffect(() => {
        if(location.state?.formData) {
            const formData = location.state.formData;
            setShipmentInfo(formData);
            setPackageData(formData.packageData || null);
            return;
        }

        const stored = localStorage.getItem(`shipment_${shipmentID}`);
        if(stored) {
            const shipment = JSON.parse(stored);
            setShipmentInfo(shipment);
            setPackageData(shipment.packageData || null);
        } else {
            navigate('/shipping-services/shipment-info');
        }

    }, [shipmentID, navigate, location.state]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!paymentMethod) {
            alert("Please enter your payment details");
            return;
        }

        setCurrentStep(3)

        const shipment = JSON.parse(localStorage.getItem(`shipment_${shipmentID}`)) || {};

        const updatedShipment = {
            ...shipment,
            steps: 3,
            paymentMethod,
            updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(`shipment_${shipmentID}`, JSON.stringify(updatedShipment));

        navigate(`/shipping-services/confirmation/${shipmentID}`, {
            state: {formData: updatedShipment},
        });
    };

    return (
        <>
            <main className='flex flex-col justify-center items-center w-full max-w-[1600px] p-5 pt-10 mx-auto mt-[70px]'>
                <div className='shipping-info-heading flex flex-col justify-center items-start w-full h-auto mb-[40px]'>
                    <Heading variant='left'>Additional Details</Heading>
                    <span className='text-lg text-left'>Indicates required field</span>
                </div>

                <section className='shipping-info-section grid grid-cols-1 lg:grid-cols-[1fr_3fr_2fr] place-content-center gap-10 lg:gap-5 w-full h-auto p-5 pb-[40px]'>
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
                                {i < currentStep && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
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
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-10 w-full h-auto rounded-lg shadow-lg bg-white p-5"
                        >
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
                                            title="Enter a date in the format YYYY-MM (e.g., 2025-11)"
                                            maxlength="7"
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
                                            required
                                            className='border border-gray-300 rounded p-3 w-full mb-2 bg-transparent'
                                        /> 
                                    </div>
                                </div>

                                <input
                                    type="text" 
                                    placeholder='Cardholder Name'
                                    required
                                    className='border border-gray-300 rounded p-3 w-full mb-2 bg-transparent'
                                /> 
                            </div>

                            <div className='flex flex-col justify-start items-start gap-4'>
                                <h2>Terms and Conditions</h2>
                                <div className='grid grid-cols-[30px_1fr] gap-1 w-full h-auto'>
                                    <div className='w-auto h-auto flex justify-start items-start'>
                                        <input type='checkbox' required className='w-[24px] h-[24px]'/>
                                    </div>

                                    <div className='flex flex-col justify-start items-start gap-5 w-full h-auto'>
                                        <p>
                                            By creating this shipment, I am agreeing to the UPS Tariff / Terms and Conditions of Service. UPS Tariff/Terms and Conditions of Service Open the link in a new window
                                        </p>

                                        <p>
                                            Please Note: The quoted price is subject to change based on actual package characteristics including weight and size, as determined by UPS upon receipt. For more details, please review the invoice adjustment provisions of the UPS Tariff/Terms and Conditions of Service Open the link in a new window
                                        </p>

                                        <p>
                                            I will not attempt to ship any items prohibited by UPS, or any UPS-regulated items, without an express written contract with UPS. List of Prohibited Articles for Shipping Open the link in a new window
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <YellowButton type="submit" variant="widthAuto">
                                Confirm Shipment
                            </YellowButton>
                        </form>

                        {shipmentInfo && (
                            <div className="shipping-summary w-full h-full">
                                <div className='w-full border-b-2 border-b-gray-300 text-left py-2 mb-5'><h1 className='text-2xl font-semibold'>Shipping Summary</h1></div>

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

                                <div className="mb-3 flex flex-col justify-start items-start gap-2 bg-white rounded-lg shadow-lg w-full h-auto p-5">
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