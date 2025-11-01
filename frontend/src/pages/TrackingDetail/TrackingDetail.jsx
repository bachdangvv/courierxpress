import React from 'react';
import {useParams, Link} from 'react-router-dom';

// Importing Components
import NotFound from '../../pages/NotFound/NotFound.jsx';
import MidLineHeading from '../../components/MidLineHeading/MidLineHeading.jsx';
import YellowButton from '../../components/YellowButton';

// Importing Data
import trackingData from '../../data/tracking.json';

// Importing CSS
import './TrackingDetail.css';

const TrackingDetail = () => {
    const {trackingCode} = useParams();

    const order = trackingData.find(
        (item) => item.trackingCode.toLowerCase() === trackingCode.toLowerCase()
    );

    if(!order) {
        return (
            <NotFound />
        )
    }

    return (
        <>
           <main className='flex flex-col justify-center items-center max-w-[1500px] mx-auto mt-[70px]'>
                <MidLineHeading>Tracking Detail</MidLineHeading>

                <section className='tracking-detail-section grid grid-cols-1 lg:grid-cols-[2fr_1fr] place-content-center gap-5 w-full h-auto p-3'>
                    <div>
                        <div className='tracking-detail-container flex flex-col justify-start items-start text-left gap-5 w-full h-auto shadow-lg rounded-lg border border-amber-400 p-5'>
                            <p>Tracking Code: {order.trackingCode}</p>

                            <h1 className='text-4xl text-black font-bold'>{order.status}</h1>

                            {/* Sender & Receiver Info */}
                            <div className='sender-receiver-container flex flex-col md:flex-row justify-between items-center gap-5 w-full'>
                                {/* Sender */}
                                <div className='sender-info-container flex flex-col justify-center items-start gap-3 w-full shadow-md rounded-lg p-4'>
                                    <h3 className='text-2xl text-black text-left font-bold'>Sender:</h3>
                                    <h4 className='text-xl text-black text-left'>{order.sender.name}</h4>
                                    <p>{order.sender.phone}</p>
                                    <h4 className='text-xl text-black text-left'>From:<strong> {order.sender.address}</strong></h4>
                                </div>

                                {/* Receiver */}
                                <div className='sender-info-container flex flex-col justify-center items-start gap-3 w-full shadow-md rounded-lg p-4'>
                                    <h4 className='text-2xl text-black text-left font-bold'>Receiver:</h4>
                                    <h3 className='text-xl text-black text-left'>{order.receiver.name}</h3>
                                    <p>{order.receiver.phone}</p>
                                    <h4 className='text-xl text-black text-left'>To:<strong> {order.receiver.address}</strong></h4>
                                </div>
                            </div>

                            {/* Schedule & Estimated */}
                            <div className='sender-receiver-container flex flex-col md:flex-row justify-between items-center gap-5 w-full'>
                                {/* Scheduled */}
                                <div className='sender-info-container flex flex-col justify-center items-start gap-3 w-full shadow-md rounded-lg p-4'>
                                    <h3 className='text-2xl text-black text-left'>Scheduled:<strong> {order.history[0].date}</strong></h3>
                                </div>

                                {/* Estimated */}
                                <div className='sender-info-container flex flex-col justify-center items-start gap-3 w-full shadow-md rounded-lg p-4'>
                                    <h4 className='text-2xl text-black text-left'>Estimated:<strong> {order.estimatedDelivery}</strong></h4>
                                </div>
                            </div>

                            <YellowButton variant='widthAuto'>Delivery Option</YellowButton>
                        </div>
                    </div>

                    <div className='tracking-history-container flex flex-col justify-start items-center text-left gap-4 shadow-lg rounded-lg bg-amber-400 border border-black w-full h-auto p-5'>
                        {order.history.map((data, index) => (
                            <div key={index} className='tracking-history-element relative before:absolute before:top-1/2 before:left-1/2 before:transform before:translate-x-[-50%] before:translate-y-[-50%] before:bg-slate-800 before:w-[90%] before:h-[2px] before:rounded w-full flex flex-col justify-start items-center gap-2 border border-black bg-white rounded-lg p-4'>
                                <div className='flex justify-between items-center gap-4 w-full'>
                                    <h4 className='font-bold text-lg'>{data.date}</h4>
                                    <h4 className='font-bold text-lg'>{data.status}</h4>
                                </div>

                                <h3 className='text-left w-full'>{data.location}</h3>
                            </div>
                        ))}
                    </div>
                </section>
           </main>
        </>
    );
};

export default TrackingDetail;