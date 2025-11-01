import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import trackingData from '../../data/tracking.json';
import YellowButton from "../../components/YellowButton";

export default function HomeInput() {
    const [trackingCode, setTrackingCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const trackOrder = (e) => {
        e.preventDefault();
        const found = trackingData.find(
            (item) => item.trackingCode.toLowerCase() === trackingCode.trim().toLowerCase()
        );

        if(found) {
            navigate(`shipping-services/tracking/${trackingCode}`);
        } else {
            setError('Invalid Tracking Code');
        }
    };

    return (
        <>
            <form onSubmit={trackOrder} className="w-full">
                <div className='hero-input-container w-full h-full flex flex-col md:flex-row justify-center items-center text-center md:gap-4'>
                    <div className="flex flex-col md:flex-row w-full justify-start items-center gap-4">
                        <div className="flex flex-col w-full justify-center items-start max-h-[] text-left">
                            <input
                                className='hero-input w-full lg:h-[50px h-[50px] rounded px-[10px] text-black'
                                value={trackingCode}
                                onChange={(e) => {
                                    setTrackingCode(e.target.value);
                                    setError("");
                                }}
                                placeholder='Tracking Number'
                                required
                            />
                        </div>

                        <YellowButton type="submit" variant="widthAuto">Track</YellowButton>

                        <div className="help-container flex justify-center items-center text-center gap-3">
                            <i className="bi bi-question-circle text-white hidden lg:block"></i>
                            <Link to='/support' className="text-white underline cursor-pointer hidden lg:block">Help</Link>
                        </div>
                    </div>

                </div>

                <div className="delivery-changing-container flex flex-col justify-center items-start text-left gap-3 mt-2">
                    {error && (
                        <p className='text-red-500 text-left mt-[10px]'>{error}</p>
                    )}
                    
                    <div className="flex justify-start items-center gap-3">
                        <p className="text-white">
                            Need help changing your delivery?
                        </p>
                        <span className="text-white text-bold underline cursor-pointer">Get Help</span>
                    </div>
                </div>
            </form>
        </>
    );
};