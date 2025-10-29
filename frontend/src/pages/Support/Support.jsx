import React, { useState } from 'react';
import cn from 'classnames';

// Importing Components
import YellowButton from '../../components/YellowButton';
import MidLineHeading from '../../components/MidLineHeading/MidLineHeading';

import ShippingRender from './SupportComponents/Shipping.jsx';
import LostRender from './SupportComponents/Lost.jsx';
import BillingRender from './SupportComponents/Billing.jsx';
import AccountPasswordRender from './SupportComponents/AccountPassword.jsx';
import AdditionalContactsRender from './SupportComponents/AdditionalContacts.jsx';

// Importing Images
import warningIcon from '../../assets/warning_icon.png';
import mapIcon from '../../assets/map.avif';
import shippingBox from '../../assets/shipping_box.avif';
import myAccountIcon from '../../assets/my_account.webp';

// Importing CSS

const Support = () => {
    const forestImage = 'https://assets.ups.com/adobe/assets/urn:aaid:aem:ba676bcd-899d-4fd9-a2db-54602ec94bf3/as/va-fall-background.avif';

    const FAQTabs = [
    { id: 'shipping', label: 'Shipping and Tracking', component: <ShippingRender /> },
    { id: 'lost', label: 'Lost or Damaged Package', component: <LostRender /> },
    { id: 'billing', label: 'Billing', component: <BillingRender /> },
    { id: 'account', label: 'Account and Password', component: <AccountPasswordRender /> },
    { id: 'contact', label: 'Additinal Contact', component: <AdditionalContactsRender /> },
  ];

    const [activeFAQTab, setActiveFAQTab] = useState('shipping');

    const handleTabClick = (tabID) => {
        setActiveFAQTab(tabID);
    };

    const ActiveFAQComponent = FAQTabs.find((tab) => tab.id === activeFAQTab)?.component;

    return (
        <>
            <div className='flex flex-col justify-center items-center w-full bg-gray-200 px-6 py-10 mt-[70px]'>
                <div className='flex justify-start items-start text-left w-full mb-5 px-10'>
                    <h1 className="features-introduction-heading font-bold text-4xl mb-5">
                        Help and Support Center
                    </h1>
                </div>
                <img src={forestImage} />
            </div>

            <main className="mx-auto flex flex-col justify-center items-center max-w-[1600px] py-[50px]">
                <div className='flex justify-center items-center w-full h-auto mb-5'>
                    <img src={warningIcon} className='mr-3' />

                    <h1 className="features-introduction-heading font-bold text-4xl mb-5">
                        Changes to De Minimis May Impact Charges
                    </h1>
                </div>

                <div className='w-full px-4 mb-[80px]'>
                    <p>
                        Effective August 29th, de minimis will be eliminated for all shipments imported into the U.S. regardless of origin country or shipment value. All shipments will need to go through U.S. Customs Border Protection (CBP) and could be subject to duties, taxes and brokerage fees. Typically, these costs are the responsibility of the person receiving the shipment. We've outlined some key details to help you understand import fees as well as the latest tariff and de minimis updates.
                    </p>
                </div>

                <div className='nav-block-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-center gap-10 w-full h-auto p-5 mb-[80px]'>
                    <div className='nav-block flex flex-col justify-center items-center gap-10 w-full h-full max-h-[450px] shadow-lg rounded-lg p-[20px] m-0'>
                        <div className='block-heading flex justify-center items-center gap-4 w-full h-auto'>
                            <img src={mapIcon} className='w-full h-full max-w-[50px] max-h-[50px]'/>
                            <h2 className='text-2xl'>Tracking</h2>
                        </div>

                        <div className='flex flex-col justify-center items-center gap-5 w-full h-auto'>
                            <span className='text-blue-600'>Understanding Tracking Status</span>
                            <span className='text-blue-600'>Delivery Notice</span>
                            <span className='text-blue-600'>Missed Packages Delivery</span>
                        </div>

                        <div className='support-nav-btn flex justify-center items-end w-full h-full py-4'>
                            <YellowButton variant='widthAuto'>Get Tracking Help</YellowButton>
                        </div>
                    </div>

                    <div className='nav-block flex flex-col justify-center items-center gap-10 w-full h-full max-h-[450px] shadow-lg rounded-lg p-[20px] m-0'>
                        <div className='block-heading flex justify-center items-center gap-4 w-full h-auto'>
                            <img src={shippingBox} className='w-full h-full max-w-[50px] max-h-[50px]'/>
                            <h2 className='text-2xl'>Shipping</h2>
                        </div>

                        <div className='flex flex-col justify-center items-center gap-5 w-full h-auto'>
                            <span className='text-blue-600'>Shipping Cost Estimator</span>
                            <span className='text-blue-600'>International Shipping</span>
                            <span className='text-blue-600'>Domestic Shipping</span>
                            <span className='text-blue-600'>Freight Shipping</span>
                            <span className='text-blue-600'>Packaging and Shipping Supplies</span>
                        </div>

                        <div className='support-nav-btn flex justify-center items-end w-full h-full py-4'>
                            <YellowButton variant='widthAuto'>Get Shipping Help</YellowButton>
                        </div>
                    </div>

                    <div className='nav-block flex flex-col justify-center items-center gap-10 w-full h-full max-h-[450px] shadow-lg rounded-lg p-[20px] m-0'>
                        <div className='block-heading flex justify-center items-center gap-4 w-full h-auto'>
                            <img src={myAccountIcon} className='w-full h-full max-w-[50px] max-h-[50px]'/>
                            <h2 className='text-2xl'>My Account</h2>
                        </div>

                        <div className='flex flex-col justify-center items-center gap-5 w-full h-auto'>
                            <span className='text-blue-600'>Manage Billing and Invoice</span>
                            <span className='text-blue-600'>Manage your UPS Profile</span>
                            <span className='text-blue-600'>Sign up for My Choice</span>
                        </div>

                        <div className='support-nav-btn flex justify-center items-end w-full h-full py-4'>
                            <YellowButton variant='widthAuto'>Get Account Help</YellowButton>
                        </div>
                    </div>
                </div>

                <div className='support-faq-container flex flex-col justify-center items-center w-full h-auto mb-[80px]'>
                    <div className='support-faq-heading flex justify-center items-center w-full h-auto mb-[40px]'>
                        <MidLineHeading>FAQ</MidLineHeading>
                    </div>

                    {/* FAQ Section */}
                    <div className='faq-field-selector flex justify-center items-center text-left gap-8 w-full h-auto border-b border-slate-600 py-4 px-8 mb-[40px]'>
                        {FAQTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={cn(
                                    'outline-none bg-transparent text-black text-[12px] md:text-lg relative',
                                    { 'text-emerald-800 before:content-[""] before:block before:absolute before:bottom-[-16px] before:left-1/2 before:transform before:-translate-x-1/2 before:w-[80%] before:h-[4px] before:bg-emerald-800': activeFAQTab === tab.id }
                                )}
                            >
                            {tab.label}</button>
                        ))}
                    </div>

                    <div className='support-faq-container flex justify-center items-center w-full h-auto p-4'>
                        {ActiveFAQComponent}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Support;