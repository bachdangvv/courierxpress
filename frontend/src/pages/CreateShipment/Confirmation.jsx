import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Heading from '../../components/MidLineHeading/MidLineHeading';
import YellowButton from '../../components/YellowButton';
import cn from 'classnames';

const Confirmation = () => {
    const { shipmentID } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const steps = ["Shipment Details", "Additional Details", "Payment", "Confirmation"];

    const [shipmentData, setShipmentData] = useState(null);
    const [currentStep, setCurrentStep] = useState(3);

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        if(location.state?.formData) {
            setShipmentData(location.state.formData);
        } else {
            const stored = localStorage.getItem(`shipment_${shipmentID}`);
            if(stored) {
                setShipmentData(JSON.parse(stored));
            } else {
                navigate('/shipping-services/shipment-info');
            }
        }
    }, [shipmentID, navigate, location.state]);

    const {
        shipper,
        receiver,
        weight,
        height,
        width,
        length,
        cardNumber,
        cardName,
    } = shipmentData;

    const handleFinish = (e) => {
        e.preventDefault();

        localStorage.removeItem(`shipment_${shipmentID}`);
    };

    if(!shipmentData) return null;

    return (
        <>
            <main className='flex flex-col justify-center items-center w-full max-w-[1600px] p-5 pt-10 mx-auto mt-[70px]'>
                <div className='shipping-info-heading flex flex-col justify-center items-start w-full h-auto mb-[40px]'>
                    <Heading variant='left'>Confirmation</Heading>
                    <span className='text-lg text-left'>Indicates required field</span>
                </div>

                <section className='shipping-info-section grid grid-cols-1 lg:grid-cols-[200px_1fr] place-content-center gap-5 w-full h-auto p-5 pb-[40px]'>
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
                        onSubmit={handleFinish}
                        className="flex flex-col gap-10 w-full h-auto rounded-lg shadow-lg bg-white p-5"
                        >
                            <Heading variant='left' size='small' marginBottom='none'>Payment Method</Heading>

                            <div className='flex flex-col justify-start items-start gap-4'>
                                <h1 className='text-3xl font-semibold'>Proof of Delivery</h1>

                                <h2>Dear, {location.state?.from?.fullname || shipmentData?.from?.fullname || "Customer"}</h2>

                                <div className='grid grid-cols-1 md:grid-cols-[2fr_1fr] place-content-center gap-5 w-full py-3'>
                                    <div className='flex flex-col justify-start items-start gap-3 w-full'>
                                        <h4 className='text-xl font-semibold'>Tracking Number</h4>
                                        <span className='text-xl'>none</span>

                                        <h4 className='text-xl font-semibold'>Service</h4>
                                        <span className='text-lg'>CourierXpress</span>

                                        <h4 className='text-xl font-semibold'>Delivery On</h4>
                                        <span className='text-lg'>{formattedDelivery}</span>
                                    </div>

                                    <div className='flex flex-col justify-start items-start gap-3'>
                                        <div className='flex justify-center items-center gap-10'>
                                            <h4 className='text-xl font-semibold'>Weight</h4>
                                            <span className='text-lg'>{weight}</span>

                                            <h4 className='text-xl font-semibold'>Length</h4>
                                            <span className='text-lg'>{length}</span>
                                        </div>

                                        <div className='flex justify-center items-center gap-10'>
                                            <h4 className='text-xl font-semibold'>Width</h4>
                                            <span className='text-lg'>{width}</span>

                                            <h4 className='text-xl font-semibold'>Height</h4>
                                            <span className='text-lg'>{height}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <YellowButton type="submit" variant="widthAuto">
                                Confirm
                            </YellowButton>
                        </form>
                </section>
            </main>
        </>
    );
};

export default Confirmation;