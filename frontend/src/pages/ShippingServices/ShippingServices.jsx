import React, { Component, useState } from 'react';
import cn from 'classnames';

// Importing Components
import YellowButton from '../../components/YellowButton';
import BlueButton from '../../components/BlueButton';
import Heading from '../../components/MidLineHeading/MidLineHeading';
import OvernightOption from './components/OvernightOption';
import DomesticOption from './components/DomesticOption';
import InternationalOption from './components/InternationalOption';

// Importing Images
import shippingServicesImage from '../../assets/shipping_services.webp';

const ShippingServices = () => {
    
    const optionTabs = [
        {id: 'overnight', label: 'Overnight Shipping', component: <OvernightOption />},
        {id: 'domestic', label: 'Domestic Shipping', component: <DomesticOption />},
        {id: 'international', label: 'International Shipping', component: <InternationalOption />},
    ];

    const [activeOptionTab, setActiveOptionTab] = useState('overnight');

    const handleOptionTabClick = (tabID) => {
        setActiveOptionTab(tabID);
    };

    const activeOptionComponent = optionTabs.find((tab) => tab.id === activeOptionTab)?.component;

    return (
        <>
            <div className='services-overview-section relative flex flex-col lg:flex-row lg:items-start justify-center items-center text-left gap-15 w-full h-[700px] overflow-hidden bg-gray-300 px-10 py-5 mt-[70px]'>
                <div className='services-content z-30 flex flex-col justify-center items-start text-left gap-5 w-full h-full p-5'>
                    <Heading size='medium' variant='left' marginBottom='none'>CourierXpress Shipping Services</Heading>

                    <p className='text-lg mt-[20px]'>
                        We have several shipping options to help you find the right balance of shipping speed and cost.
                    </p>

                    <div className='services-buttons flex flex-col md:flex-row justify-start items-center gap-5 w-full h-auto max-w-full md:max-w-[580px]'>
                        <YellowButton>Ship Now</YellowButton>
                        <BlueButton>Get a Quote</BlueButton>
                    </div>
                </div>    

                <div className='services-image flex justify-center items-center relative w-full h-full p-2'>
                    <img
                        src={shippingServicesImage}
                        className='object-cover z-30 rounded-lg'
                    />
                </div>

                {/* <div class="absolute top-[-40px] left-[-40px] z-20 w-full h-[120px] bg-white rounded-[100%]"></div> */}
                <div class="absolute bottom-[-100px] right-0 z-20 w-screen h-[200px] bg-[#F2F2F2] rounded-[95%]"></div>
            </div>

            <main className='relative flex flex-col justify-center items-center max-w-[1600px] p-5 pt-[100px] mx-auto'>
                <Heading variant='middle' size='big' marginBottom='high'>Reliable Shipping Options for Any Needs</Heading>

                <section className='shipping-options-section grid grid-cols-1 md:grid-cols-[1fr_4fr] place-content-center gap-10 w-full mb-[80px]'>
                    <div className='shipping-option-container flex flex-col justify-center items-center w-full p-5 '>
                        {optionTabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={cn(
                                    'relative flex justify-start items-center px-4 py-7 w-full border-b-2 border-b-gray-300 border-r border-r-gray-300',

                                    'before:absolute before:bottom-[-1px] before:left-1/2 before:transform before:bg-emerald-800 before:w-[50%] before:h-[4px] before:scale-x-0 before:origin-left hover:before:scale-x-100 before:transition before:duration-500 before:ease-in-out',

                                    'after:absolute after:bottom-[-1px] after:right-1/2 after:transform after:bg-emerald-800 after:w-[50%] after:h-[4px] after:scale-x-0 after:origin-right hover:after:scale-x-100 after:transition after:duration-500 after:ease-in-out',

                                    {'text-emerald-700 rounded-lg before:absolute before:bottom-[-1px] before:left-0 before:bg-emerald-800 before:w-[50%] before:h-[4px] before:scale-x-100 after:absolute after:bottom-[-1px] after:right-1/2 after:w-[50%] after:h-[4px] after:scale-x-100': activeOptionTab === tab.id}
                                )}
                                onClick={() => handleOptionTabClick(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className='option-tab flex justify-center items-start w-full h-auto'>
                        {activeOptionComponent}
                    </div>
                </section>

                <section className='solution-section w-full h-full flex-col flex lg:flex-row justify-between items-center bg-sky-700 py-[25px] px-[30px] mb-[80px]'>
                    <div className="mb-[30px] md:mb-0">
                        <h1 className="text-4xl text-white mb-[12px]">
                            Explore Logistics Solutions by Industry
                        </h1>

                        <p className="text-white mb-[12px]">
                            UPS offers an extensive portfolio of resources to ensure we meet the unique needs of your business.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto">
                        <YellowButton variant='widthAuto'>See Solution</YellowButton>
                    </div>
                </section>

                <Heading>Find the Best Price for Your Business</Heading>
                <section className='business-solution-section w-full h-full grid grid-col-1 md:grid-cols-2 place-content-center gap-10 max-w-[1000px] mb-[80px]'>
                    <div className="shadow-xl rounded-lg cursor-pointer p-[30px]">
                        <h1 className="text-2xl mb-5">Get a Shipping Quote</h1>

                        <p className="mb-10">
                            Use our shipping cost calculator to get estimates about shipping pricing and time-in-transit.
                        </p>

                        <button className="text-blue-500 cursor-pointer">
                            Estimate Shipping Cost
                        </button>
                        </div>

                        <div className="shadow-xl rounded-lg cursor-pointer p-[30px]">
                        <h1 className="text-2xl mb-5">Freight Pricing Without the Pallet</h1>

                        <p className="mb-10">
                            Talk to one of our experts for big savings on multi-piece shipments over 151 pounds.
                        </p>

                        <button className="text-blue-500 cursor-pointer">
                            Talk to an Expert
                        </button>
                    </div>
                </section>

                <Heading>Protect Our Planet</Heading>
            </main>

            <footer className='relative flex justify-center items-center text-left gap-10 w-full h-auto bg-yellow-800 overflow-hidden py-10 mx-auto'>
            <div class="absolute top-[-50px] left-0 z-20 w-screen h-[100px] bg-[#F2F2F2] rounded-[100%]"></div>
            
                <div className='flex flex-col md:flex-row justify-center md:justify-between items-center text-left gap-10 w-full max-w-[1500px] h-auto px-5 py-10 mx-auto'>
                    <div className='text-white'>
                        <span>PROTECT OUR PLANET</span>
                        <h2>Your donation will help The UPS Foundation build a cleaner, greener, more sustainable world.</h2>
                    </div>

                    <div className='w-full md:w-auto'>
                        <YellowButton variant='widthAuto'>Act Now</YellowButton>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default ShippingServices;