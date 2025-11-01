import React from 'react';
import boxGold from '../../assets/box_gold.svg';
import YellowButton from '../../components/YellowButton';
import { Link } from 'react-router-dom';

const HomeShipment = () => {
    return (
        <>
            <div className='grid grid-cols-1 sm:grid-cols-[125px_1fr] place-content-center gap-5 w-full h-auto'>
                <div className='flex justify-center items-start w-full h-full'>
                    <img src={boxGold} className='object-cover w-[125px] h-[125px]'/>
                </div>

                <div className='flex flex-col justify-start items-start gap-5 w-full h-auto'>
                    <h2 className='text-4xl text-white font-semibold text-left'>Complete Your Shipment</h2>
                    <p className='text-lg text-white text-left'>Ready to send that package you've been thinking about? In just a few clicks you'll be back on track.</p>
	                <Link to='/shipping-services-shipment-info' className='w-full sm:w-auto'><YellowButton variant='widthAuto'>Let's Do it</YellowButton></Link>
                </div>
            </div>
        </>
    );
};

export default HomeShipment;
