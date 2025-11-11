import React from 'react';
import { Link } from 'react-router-dom';

// Importing Components
import Heading from '../../components/MidLineHeading/MidLineHeading';
import YellowButton from '../../components/YellowButton';
import BlueButton from '../../components/BlueButton';

// Importing Images
import warningIcon from '../../assets/warning_icon.png';
import customerServices from '../../assets/customer_services.avif';
import technicalSupport from '../../assets/technical_support.png';
import girlCoffee from '../../assets/girl_coffee.webp';
import additionalResource from '../../assets/additional_resources.avif';

const Contact = () => {
    const forestImage = 'https://assets.ups.com/adobe/assets/urn:aaid:aem:ba676bcd-899d-4fd9-a2db-54602ec94bf3/as/va-fall-background.avif';

    return (
        <main className='flex flex-col justify-center items-center w-full max-w-[1600px] p-5 pt-10 mx-auto mt-[70px]'>
            <Heading variant='left'>Contact Us</Heading>
            <img src={forestImage} alt='Forest image' className='object-cover w-[80%] h-full' />

            <section className='impact-changes-section flex flex-col justify-start items-center gap-5 w-full h-auto pt-8 mb-[80px]'>
                <div className='impact-section-heading flex justify-center items-start gap-10 w-full h-auto'>
                    <img src={warningIcon} alt='Warning' className='hidden md:block'/>
                    <Heading variant='left'>Changes to De Minimis May Impact Charges</Heading>
                </div>

                <div className='w-full h-auto'>
                    <p>
                        Effective August 29th, de-minimis will be eliminated for all shipments importing into the United States (US) regardless of origin or value. All shipments will require entry to Customs Border Protection (CBP) and may result in duty, tax and brokerage fees owing. Get the latest tariff and de minimis updates.
                    </p>
                </div>
            </section>

            <section className='support-resource-section flex flex-col justify-start items-center gap-5 w-full h-auto mb-[80px]'>
                <div className='support-resource-heading flex flex-col justify-start items-center w-full h-auto gap-5'>
                    <Heading>CourierXpress Online Support</Heading>
                    <span className='text-xl text-gray-800'>You've got questions, we've got answers.</span>
                </div>

                <div className='support-resource-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-center gap-5 w-full h-auto max-w-[1200px]'>
                    <div className="flex flex-col justify-between items-center shadow-xl rounded-lg cursor-pointer p-[20px]">
                        <div>
                            <h1 className="text-2xl mb-5">Where's My UPS Package?</h1>

                            <p className="mb-10">
                                Visit our tracking support page to answer any questions you have about your shipment's whereabouts or changing a delivery.
                            </p>
                        </div>

                        <h3 className="flex justify-start items-end text-blue-500 cursor-pointer w-full">
                            Visit Tracking Solutions
                        </h3>
                    </div>

                    <div className="flex flex-col justify-between items-center shadow-xl rounded-lg cursor-pointer p-[20px]">
                        <div>
                            <h1 className="text-2xl mb-5">Helpful Shipping Tools</h1>

                            <p className="mb-10">
                                From deciding which shipping service to use for your shipment to creating and printing a label, find out everything you'll need on our shipping solutions page.
                            </p>
                        </div>

                        <h3 className="flex justify-start items-end text-blue-500 cursor-pointer w-full">
                            Explore Shipping Solutions
                        </h3>
                    </div>

                    <div className="flex flex-col justify-between items-center shadow-xl rounded-lg cursor-pointer p-[20px]">
                        <div>
                            <h1 className="text-2xl mb-5">Have a Problem with UPS Delivery?</h1>

                            <p className="mb-10">
                                We can help out when you file a claim for your UPS package. Send us the details of your issue and we'll do the rest to find the best solution to make things right as quickly as possible.
                            </p>
                        </div>

                        <h3 className="flex justify-start items-end text-blue-500 cursor-pointer w-full">
                            File a Claim
                        </h3>
                    </div>
                </div>
            </section>

            <section className="w-full h-full flex-col flex md:flex-row justify-between items-center bg-teal-700 py-[25px] px-[30px] mb-[80px]">
                <div className="mb-[30px] md:mb-0">
                    <h1 className="text-4xl text-white mb-[12px]">
                        Stay Safe — Avoid Fraud and Scams
                    </h1>

                    <p className="text-white mb-[12px]">
                        Received a text, call or email that seems suspicious? Don't respond to it.
                    </p>
                </div>

                <div className="w-full md:w-auto">
                    <Link to='/shipping-services'>
                    <YellowButton variant='widthAuto'>Tips To Avoid Fraud</YellowButton>
                    </Link>
                </div>
            </section>

            <section className='delivery-time-section flex flex-col justify-start items-center gap-5 w-full h-full mb-[80px]'>
                <Heading>When Will My UPS Package Arrive?</Heading>
                <div className='flex flex-col md:flex-row justify-center items-center gap-10 w-full h-auto'>
                    <div className='flex justify-center items-center gap-5 w-full h-auto'>
                        <img src={girlCoffee} className='object-cover rounded' />
                    </div>
                    
                    <div className='flex flex-col justify-start items-center gap-8 w-full h-auto'>
                        <div className='grid grid-cols-1 sm:grid-cols-[30px_1fr] place-content-center gap-5 w-full h-auto'>
                            <i className="bi bi-check2-circle text-[25px] text-teal-800"></i>

                            <div className='flex flex-col justify-start items-start gap-4 w-full h-auto'>
                                <h4 className='text-lg font-semibold'>What Does “Out for Delivery” Mean?</h4>
                                <p>
                                    If the status says “out for delivery,” our drivers can deliver as late as 9 p.m. During the holiday season, it may be even later.
                                </p>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-[30px_1fr] place-content-center gap-5 w-full h-auto'>
                            <i className="bi bi-check2-circle text-[25px] text-teal-800"></i>

                            <div className='flex flex-col justify-start items-start gap-4 w-full h-auto'>
                                <h4 className='text-lg font-semibold'>Can My Driver Give an ETA?</h4>
                                <p>
                                    Although we can't contact our drivers to provide an estimated delivery time, we can generally provide a 4-hour delivery window within minutes of signing up for UPS My Choice® notifications.
                                </p>
                            </div>
                        </div>

                        <div className='flex flex-col md:flex-row justify-start items-center gap-5 md:gap-10 w-full h-auto'>
                            <YellowButton variant='widthAuto'>Sign Up</YellowButton>
                            <Link className='w-full md:w-auto' to='/shipping-services/tracking'><BlueButton>Track a Package</BlueButton></Link>
                        </div>

                        <div className='flex justify-start items-center w-full h-auto'>
                            <p>Need more help? Visit our tracking support page.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='support-when-you-need flex flex-col justify-start items-center gap-5 w-full h-full mb-[150px]'>
                <Heading>Support When You Need It</Heading>
                <p className='text-lg text-gray-800 h-auto mb-[100px] md:mb-0'>
                    Use the phone numbers below to access the UPS help centre that best fits your need.
                </p>

                <div className='flex flex-col md:flex-row justify-center items-start gap-5 w-full max-w-[700px] h-[320px] pt-[20px]'>
                    <div className='flex flex-col justify-start items-center gap-5 w-full h-full'>
                        <img src={customerServices} className='w-[70px] h-[70px]'/>
                        <h3 className='text-xl font-semibold'>Customer Service</h3>
                        <p className='text-gray-700'>Mon-Fri 7:30 a.m. to 8 p.m. EST</p>
                        <p className='text-gray-700'>Saturday 10 a.m. - 4 p.m. EST</p>
                        <div className='flex justify-center items-end w-full h-full'>
                            <BlueButton>Call 1-800-742-5877</BlueButton>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start items-center gap-5 w-full h-full'>
                        <img src={technicalSupport} className='w-[70px] h-[70px]'/>
                        <h3 className='text-xl font-semibold'>Technical Support</h3>
                        <p className='text-gray-700'>Mon-Fri 7:30 a.m. to 8 p.m. EST</p>
                        <div className='flex justify-center items-end w-full h-full'>
                            <BlueButton>Call 1-888-877-8324</BlueButton>
                        </div>
                    </div>
                </div>
            </section>

            <section className='additional-resources flex flex-col justify-start items-center gap-5 w-full h-auto mb-[80px]'>
                <Heading>Additional Resources</Heading>
                <div className='flex flex-col md:flex-row justify-center items-start gap-5 w-full'>
                    <div className='w-full h-full'>
                        <img src={additionalResource} className='object-cover rounded-lg w-full h-auto'/>
                    </div>

                    <div className='flex flex-col justify-start items-start gap-8 w-full h-auto'>
                        <div className='grid grid-cols-1 sm:grid-cols-[30px_1fr] place-content-center gap-5 w-full h-auto'>
                            <i className="bi bi-check2-circle text-[25px] text-teal-800"></i>

                            <div className='flex flex-col justify-start items-start gap-4 w-full h-auto'>
                                <h4 className='text-lg font-semibold'>UPS Billing Centre Support</h4>
                                <p>
                                    Billing Enquiries: 1-888-592-6188
                                </p>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-[30px_1fr] place-content-center gap-5 w-full h-auto'>
                            <i className="bi bi-check2-circle text-[25px] text-teal-800"></i>

                            <div className='flex flex-col justify-start items-start gap-4 w-full h-auto'>
                                <h4 className='text-lg font-semibold'>Freight Support</h4>
                                <p>
                                    Air Freight - Import and Export Shipments Over 330 lb/150 kgNorth American Air Freight and International Air FreightOcean Freight - Import and Export Shipments Over 330 lb/150 kg
                                </p>
                            </div>
                        </div>

                        <BlueButton>Find a CourierXpress Location</BlueButton>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;