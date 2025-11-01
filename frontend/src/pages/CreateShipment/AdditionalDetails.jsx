import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Heading from '../../components/MidLineHeading/MidLineHeading';
import YellowButton from '../../components/YellowButton';
import cn from 'classnames';

const AdditionalDetails = () => {
    // Hook
    const { shipmentID } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const steps = ["Shipment Details", "Additional Details", "Payment", "Confirmation"];
    const [shipmentInfo, setShipmentInfo] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);

    // Package Data
    const [packageData, setPackageData] = useState({
        weight: "",
        length: "",
        width: "",
        height: ""
    });

    useEffect(() => {
        if (location.state?.formData) {
            setShipmentInfo(location.state.formData);
        }

        const stored = localStorage.getItem(`shipment_${shipmentID}`);

        if (stored) {
            const shipment = JSON.parse(stored);
            if (shipment.packageData) setPackageData(shipment.packageData);
            if (!location.state?.formData) setShipmentInfo(shipment);
        } else {
            navigate('/shipping-services/shipment-info');
        }

    }, [shipmentID, navigate, location.state]);

    const handleChange = (field, value) => {
        setPackageData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const shipment = JSON.parse(localStorage.getItem(`shipment_${shipmentID}`)) || {};

        const updatedShipment = {
            ...shipment,
            step: 2,
            packageData,
            updateAt: new Date().toISOString(),
        };

        setCurrentStep(2)

        localStorage.setItem(`shipment_${shipmentID}`, JSON.stringify(updatedShipment));
        
        navigate(`/shipping-services/payment/${shipmentID}`);
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
                            <Heading variant='left' size='small' marginBottom='none'>Package Details</Heading>
                            <div className='flex flex-col justify-start items-start gap-4'>
                                <span>Specific description of shipment contents for label:</span>
                                <textarea className='resize-none border border-gray-500 rounded w-full p-2' placeholder='Package Content' rows={2} cols={50}></textarea>
                            </div>

                            <div className='flex flex-col justify-start itemsstart gap-4'>
                                <span>Enter package weight:</span>
                                <input
                                type="number"
                                placeholder="kg"
                                value={packageData.weight}
                                onChange={(e) => handleChange('weight', e.target.value)}
                                required
                                className="border border-gray-300 rounded p-3 w-full mb-2 bg-transparent"
                                />
                            </div>

                            <div className='flex flex-col justify-start items-start gap-4'>
                                <span>Enter package length</span>
                                <input
                                type="number"
                                placeholder="cm"
                                value={packageData.length}
                                onChange={(e) => handleChange('length', e.target.value)}
                                required
                                className="border p-2 rounded bg-transparent"
                                />
                            </div>

                            <div className='flex flex-col justify-start items-start gap-4'>
                                <span>Enter package width:</span>
                                <input
                                type="number"
                                placeholder="cm"
                                value={packageData.width}
                                onChange={(e) => handleChange('width', e.target.value)}
                                required
                                className="border p-2 rounded bg-transparent"
                                />
                            </div>

                            <div className='flex flex-col justify-start items-start gap-4'>
                                <span>Enter package height:</span>
                                <input
                                type="number"
                                placeholder="Height (cm)"
                                value={packageData.height}
                                onChange={(e) => handleChange('height', e.target.value)}
                                required
                                className="border p-2 rounded bg-transparent"
                                />
                            </div>

                            <YellowButton type="submit" variant="widthAuto">
                            Choose Payment Method
                            </YellowButton>
                        </form>

                        {shipmentInfo && (
                            <div className="shipping-summary w-full h-full">
                            {/* <h2 className="text-xl font-semibold mb-4">Shipping Summary</h2> */}
                            <div className='w-full border-b-2 border-b-gray-300 text-left py-2 mb-5'><h1 className='text-2xl font-semibold'>Shipping Summary</h1></div>

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

export default AdditionalDetails;