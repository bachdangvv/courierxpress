import React from 'react';
import YellowButton from '../../../components/YellowButton';
import BlueButton from '../../../components/BlueButton';

const InternationalOption = () => {
    return (
        <div className='flex flex-col justify-start items-start text-left gap-5 w-full h-full p-5'>
            <h5 className='text-lg font-bold'>International Shipping Options</h5>

            <p>We've outlined all of our international shipping services, along with a how-to and all relevant info you need to reach your destinations all around the globe.</p>

            <div className='flex justify-start items-center gap-8 w-full h-auto'>
                <YellowButton variant='widthAuto'>International Shipping Services</YellowButton>
                <BlueButton>International Shipping Basics</BlueButton>
            </div>
        </div>
    );
};

export default InternationalOption;