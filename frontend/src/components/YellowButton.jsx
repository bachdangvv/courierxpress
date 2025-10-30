import React from 'react';
import cn from 'classnames';

const YellowButton = ({
    children,
    variant = 'primary'
}) => {
    const variantStyles = {
        primary: 'font-semibold w-full sm:w-[145px] h-auto rounded-[25px] opacity-100 hover:border hover:opacity-[0.85] transition-500 border border-amber-400 bg-amber-400 p-2 px-4',
        widthAuto: 'font-semibold w-full md:w-auto h-auto rounded-[25px] opacity-100 hover:border hover:opacity-[0.85] transition-500 border border-amber-400 bg-amber-400 p-2 px-5'
    }

    return (
        <button
            className={cn(variantStyles[variant])}
        >
        {children}</button>
);
};

export default YellowButton;