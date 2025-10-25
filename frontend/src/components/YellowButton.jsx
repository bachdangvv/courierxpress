import React from 'react';

const YellowButton = ({children}) => {
    return (
        <button
            className="order-btn w-full md:w-[145px] h-[45px] rounded-[25px] opacity-100 bg-amber-400 p-2 px-4"
        >
        {children}</button>
);
};

export default YellowButton;