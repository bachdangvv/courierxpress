import React from 'react';

const BlueButton = ({ children }) => {
    return (
        <button
            className='view-all-stories-btn w-full md:w-auto h-[45px] rounded-full border-2 border-blue-500 text-lg text-blue-500 items-center text-center bg-transparent hover:border-blue-700 hover:text-blue-700 cursor-pointer transition duration-200 px-8 py-0'
        >
        {children}</button>
    );
};

export default BlueButton;