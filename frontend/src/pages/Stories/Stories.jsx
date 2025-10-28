import React from 'react';

// Importing Data
import storiesData from '../../data/stories.json';

// Importing Components
import MidLineHeading from '../../components/MidLineHeading/MidLineHeading';

const Stories = () => {
    return (
        <>
            <main className='mx-auto flex flex-col justify-center items-center max-w-[1400px] mt-[100px]'>
                <div className='stories-heading w-full flex justify-center items-center text-center h-auto mb-[80px]'>
                    <MidLineHeading>All Stories</MidLineHeading>
                </div>

                <div className='stories-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-center justify-center items-center text-left gap-x-8 gap-y-10 w-full h-full p-2 mx-auto'>
                    {storiesData.map((element, index) => (
                            <div key={index} className='flex flex-col justify-start items-center text-left gap-2 w-full h-full max-h-full md:max-h-[620px] shadow-lg rounded-lg'>
                                <div className='story-image w-full h-full rounded-tl-lg rounded-tr-lg p-0'>
                                    <img
                                        src={element.image_src}
                                        className='block w-full h-full object-cover rounded-tl-lg rounded-tr-lg'
                                    />
                                </div>

                                <div className='story-content-container flex flex-col justify-start items-start text-left bg:white gap-3 w-full h-full px-5 py-12'>
                                    <h4 className='branding-heading relative block text-sm before:absolute before:left-0 before:top-1/2 tranform translate-y-[-50%] before:inline-block before:w-[30px] before:h-[4px] before:bg-amber-300 px-[40px]'>CUSTOMER FIRST</h4>

                                    <h1 className='text-2xl font-bold text-black'>{element.heading}</h1>

                                    <p className='text-black'>
                                        {element.content}
                                    </p>
                                </div>
                            </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Stories;