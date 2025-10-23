import React, { useState } from 'react';
import cn from 'classnames';

// Importing Data
import FAQData from '../../data/faq.json';

export default function FAQ() {
    const [activeQuestion, setActiveQuestion] = useState(null);

    const toggleFAQ = (index) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };

    return (
        <>
        <div className='w-full h-full max-w-[1000px] flex flex-col justify-center items-center'>
            {FAQData.map((data) => {
                const isActive = activeQuestion === data.id;
                
                return (
                    <div 
                        key={data.id}
                        className='mb-4 last:mb-0 w-full h-full'
                    >
                        <button
                            className={cn('w-full h-full text-black text-left text-xl focus:outline-none p-4 bg-whitewhite rounded-lg hover:shadow:xl flex justify-between items-center', {
                                'shadow-lg': !isActive,
                                'shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.1)]': isActive
                            })}
                            onClick={() => toggleFAQ(data.id)}
                        >
                        {data.question}

                        {/* Arrow icon logic */}
                        {isActive ? (
                            <i className="bi bi-arrow-up-circle"></i>
                        ) : (
                            <i className="bi bi-arrow-down-circle"></i>
                        )}
                        </button>

                        {/* Anwser */}
                        <div
                            className={cn('overflow-hidden shadow-lg rounded-lg', {
                                'max-h-0': !isActive,
                                'max-h-auto p-4 pt-0': isActive
                            })}
                        >
                            <div className='text-black h-auto'>
                                {data.answer.map((line, index) => (
                                    <p key={index} className='pt-2 mb-2 last:mb-0'>{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        </>
    )
};