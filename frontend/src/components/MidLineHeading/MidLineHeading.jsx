import React from 'react';
import './MidLineHeading.css';

const MidLineHeading = ({ children }) => {
    return (
        <h1 className='middle-line-heading font-bold text-5xl mb-[50px]'>{children}</h1>
    );
};

export default MidLineHeading;