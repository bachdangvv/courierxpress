import React from 'react';
import YellowButton from '../../../components/YellowButton';

const DomesticOption = () => {
    return (
        <div className='flex flex-col justify-start items-start text-left gap-5 w-full h-full p-5'>
            <h5 className='text-lg font-bold'>Nationwide Shipping with CourierXpress</h5>
            <p>
                We have numerous domestic shipping services, from UPS Ground to UPS Next Day Air Early, and everything in-between.
            </p>
            <YellowButton variant='widthAuto'>Domestic Shiping Service</YellowButton>
        </div>
    );
};

export default DomesticOption;