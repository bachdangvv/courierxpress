import React from 'react';
import cn from 'classnames';

const YellowButton = ({
    children,
    variant = 'primary'
}) => {
    const variantStyles = {
        primary: 'font-semibold w-full md:w-[145px] h-[45px] rounded-[25px] opacity-100 hover:border hover:border-amber-400 hover:bg-transparent transition-500 border border-amber-400 bg-amber-400 p-2 px-4',
        widthAuto: 'font-semibold w-full md:w-auto h-[45px] rounded-[25px] opacity-100 hover:border hover:border-amber-400 hover:bg-transparent transition-500 border border-amber-400 bg-amber-400 p-2 px-5'
    }

    return (
        <button
            className={cn(variantStyles[variant])}
        >
        {children}</button>
);
};

export default YellowButton;