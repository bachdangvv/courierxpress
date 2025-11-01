import React from 'react';

const OvernightOption = () => {
    return (
        <div className='flex flex-col justify-start items-start text-left gap-5 w-full h-full p-5'>
            <h5 className='text-lg font-bold'>Next Day Shipping for Your Urgent Shipments</h5>

            <p>
                Do you have an urgent shipment that needs to arrive as quickly as possible? We have several next day air options, with guaranteed delivery times.
            </p>

            <p>Need same day delivery? Order a UPS Express Critical® shipment by calling <span className='text-blue-500'>1-800-714-8779</span> from the U.S. and Canada, or emailing us at <span className='text-blue-500'>UPSExpressCriticalInsideSales@ups.com</span>.</p>
        </div>
    );
};

export default OvernightOption;