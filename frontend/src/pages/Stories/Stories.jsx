import React from 'react';

// Importing Data
import storiesData from '../../data/stories.json';

// Importing Components
import MidLineHeading from '../../components/MidLineHeading/MidLineHeading';

// Importing CSS
import './Stories.css';

const Stories = () => {
    return (
        <>
            <main className='mx-auto flex flex-col justify-center items-center max-w-[1400px]'>
                <div className='stories-heading w-full flex justify-center items-center text-center h-auto mb-[80px]'>
                    <MidLineHeading>All Stories</MidLineHeading>
                </div>

                <section className='stories-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-between text-left gap-5 w-full h-auto'>
                    {storiesData.map((element, index) => (
                            <div key={index} className='flex flex-col justify-start items-center text-left gap-2 w-full full max-w-[400px] max-h-[580px] shadow-lg rounded-lg'>
                                <div className='story-image w-full h-full rounded-tl-lg rounded-tr-lg'>
                                    <img
                                        src={element.image_src}
                                        className='w-full-h-full rounded-tl-lg rounded-tr-lg'
                                    />
                                </div>

                                <div className='story-content-container flex flex-col justify-start items-center text-left bg:white gap-3 w-full h-full p-5'>
                                    
                                </div>
                            </div>
                    ))}
                </section>
            </main>
        </>
    );
};

export default Stories;