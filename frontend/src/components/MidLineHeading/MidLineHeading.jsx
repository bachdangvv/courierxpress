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
        big: 'md:text-5xl',
        medium: 'md:text-4xl',
        small: 'md:text-2xl'
    };

    const marginSize = {
        high: 'mb-[80px]',
        none: 'mb-0'
    };

    return (
        <h1 className={cn(
            baseStyle,
            variantStyles[variant],
            marginSize[marginBottom],
            'text-3xl',
            variantSize[size]
        )}>{children}</h1>
    );
};

export default MidLineHeading;