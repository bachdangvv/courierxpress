export default function HomeInput() {
    return (
        <>
            <div className='hero-input-container w-full h-full flex flex-col md:flex-row justify-center items-center text-center md:gap-4'>
                <input
                    className='hero-input w-full lg:h-[50px h-[50px] rounded px-[10px] mb-3 text-black'
                    placeholder='Tracking number'
                />

                <button
                    className="tracking-btn w-full md:w-[100px] h-[45px] rounded-[25px] opacity-100 bg-amber-400"
                >
                Track</button>

                <div className="help-container flex justify-center items-center text-center gap-3">
                    <i className="bi bi-question-circle text-white hidden lg:block"></i>
                    <span className="text-white underline cursor-pointer hidden lg:block">Help</span>
                </div>
            </div>

            <div className="delivery-changing-container flex justify-center items-center text-center gap-3 mt-2">
                <p className="text-white">
                    Need help changing your delivery?
                </p>
                <span className="text-white text-bold underline cursor-pointer">Get Help</span>
            </div>
        </>
    );
};