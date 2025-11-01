import React from 'react';
import cn from 'classnames';
import './MidLineHeading.css';

const MidLineHeading = ({
    children,
    variant = 'middle',
    size = 'big',
    marginBottom = 'high'
}) => {
    const baseStyle = 'relative font-bold';

    const variantStyles = {
        middle: 'middle-line-heading text-center',
        left: 'left-line-heading text-left'
    };

    const variantSize = {
        big: 'text-5xl',
        medium: 'text-4xl',
        small: 'text-2xl'
    };

    const marginSize = {
        high: 'mb-[80px]',
        none: 'mb-0'
    };

    return (
        <h1 className={cn(
            baseStyle,
            variantStyles[variant],
            variantSize[size],
            marginSize[marginBottom]
        )}>{children}</h1>
    );
};

export default MidLineHeading;