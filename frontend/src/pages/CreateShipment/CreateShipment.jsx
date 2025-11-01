import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { v4 as uuidv4 } from "uuid";

// Importing Components
import Heading from '../../components/MidLineHeading/MidLineHeading';
import YellowButton from '../../components/YellowButton';

const CreateShipment = () => {
    const navigate = useNavigate();

    const steps = ["Shipment Details", "Additional Details", "Payment", "Confirmation"];
    const [currentStep, setCurrentStep] = useState(0);
    const [submittedData, setSubmittedData] = useState(null);
    const [formData, setFormData] = useState({
        from: {
        country: '',
        fullName: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        },
        
        to: {
        country: '',
        fullName: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        },
    });

    const handleChange = (section, field, value) => {
        setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const allFilled =
            Object.values(formData.from).every((v) => v.trim() !== "") &&
            Object.values(formData.to).every((v) => v.trim() !== "");

        if (!allFilled) {
            navigate('/shipping-services/shipment-info');

            console.error("Shipment not found:", shipmentID);

            return;
        }

        const shipmentID = uuidv4();
        localStorage.setItem(`shipment_${shipmentID}`, JSON.stringify({ step: 1, ...formData }));
        
        setSubmittedData(formData);
        setCurrentStep(1);

        navigate(`/shipping-services/additional-details/${shipmentID}`);
    };

    return (
        <>
            <main className='flex flex-col justify-center items-center w-full max-w-[1600px] pt-10 mx-auto mt-[70px]'>
                <div className='shipping-info-heading flex flex-col justify-center items-start w-full h-auto mb-[40px]'>
                    <Heading variant='left'>Create a Shipment</Heading>
                    <span className='text-lg text-left'>Indicates required field</span>
                </div>

                <section className='shipping-info-section grid grid-cols-1 md:grid-cols-[1fr_3fr_2fr] place-content-center gap-5 w-full h-auto pb-[40px]'>
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

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-12 w-full"
                        >
                        {/* Ship From */}
                        <fieldset className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
                            <Heading variant='left' size='small'>Ship From</Heading>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.keys(formData.from).map((key) => (
                                    <input
                                    key={key}
                                    type="text"
                                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                    className="border border-gray-300 rounded p-3 w-full mb-2"
                                    value={formData.from[key]}
                                    onChange={(e) => handleChange("from", key, e.target.value)}
                                    />
                                ))}
                            </div>
                        </fieldset>

                        {/* Ship To */}
                        <fieldset className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
                            <Heading variant='left' size='small'>Ship To</Heading>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.keys(formData.to).map((key) => (
                                    <input
                                    key={key}
                                    type="text"
                                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                    className="border border-gray-300 rounded p-3 w-full mb-2"
                                    value={formData.to[key]}
                                    onChange={(e) => handleChange("to", key, e.target.value)}
                                    />
                                ))}
                            </div>
                        </fieldset>

                        <YellowButton variant='widthAuto' type="submit">Additional Details</YellowButton>
                        </form>

                        <div className='shipping-summary flex flex-col justify-start items-center w-full h-auto gap-5 rounded-lg shadow-lg bg-white p-5'>
                            <div className='w-full border-b border-b-gray-300 text-left py-3'><h1 className='text-2xl font-semibold'>Shipping Summary</h1></div>
                            
                            {currentStep >= 1 && submittedData && (
                            // Shipping Summary
                            <div className='shipping-receiver-details flex flex-col justify-start items-center gap-5 w-full h-auto'>
                                {/* Shipper Details */}
                                <div className='flex flex-col justify-start items-start gap-5 w-full h-auto'>
                                    <h1 className='text-lg font-semibold'>Shipper Details</h1>
                                    <span className='text-md'>{submittedData.from.fullName}</span>
                                    <span className='text-md'>{submittedData.from.email}</span>
                                    <span className='text-md'>{submittedData.from.phone}</span>
                                    <span className='text-md'>{submittedData.from.address}</span>
                                </div>

                                {/* Receiver Details */}
                                <div className='flex flex-col justify-start items-start gap-5 w-full h-auto'>
                                    <h1 className='text-lg font-semibold'>Receiver Details</h1>
                                    <span className='text-md'>{submittedData.to.fullName}</span>
                                    <span className='text-md'>{submittedData.to.email}</span>
                                    <span className='text-md'>{submittedData.to.phone}</span>
                                    <span className='text-md'>{submittedData.to.address}</span>
                                </div>
                            </div>
                            )}
                        </div>
                </section>
            </main>
        </>
    );
};

export default CreateShipment;