import React from 'react';

// Importing Components
import MidLineHeading from '../../components/MidLineHeading/MidLineHeading.jsx';
import YellowButton from '../../components/YellowButton.jsx';

// Importing Images
import logisticBanner from '../../assets/about_logistic_banner.webp';
import storyCard1 from '../../assets/story_card_1.webp';
import storyCard2 from '../../assets/story_card_2.webp';
import storyCard3 from '../../assets/story_card_3.webp';

// Importing CSS
import './About.css';

const About = () => {

    return (
        <>
        <main className='mx-auto flex flex-col justify-center items-center max-w-[1300px]'>
            <section className='brand-philosophy items-center text-center mb-[80px]'>
                <MidLineHeading>Moving our world forward by delivering what matters.</MidLineHeading>

                <div className='brand-philosophy-container relative'>
                    <img
                        src={logisticBanner}
                    />

                    {/* Block */}
                    <div className='brand-philosophy-block w-full h-full max-w-[480px] max-h-[360px] absolute z-[2] top-[50%] left-[10%] tranform -translate-y-[50%] flex flex-col justify-center items-start rounded-lg bg-white p-5'>
                        <h4 className='customer-first-heading relative block px-[40px] mb-5'>CUSTOMER FIRST</h4>

                        <h1 className='text-4xl block text-start font-bold mb-5'>5 things every business should know about returns</h1>

                        <p className='text-start block mb-5'>
                            Our Returns Landscape survey reveals info that can help you <strong>and</strong> your customers
                        </p>

                        <div className='font-bold'><YellowButton>Learn More</YellowButton></div>
                    </div>
                </div>
            </section>

            <section className='brand-stories-container w-full flex flex-col justify-center items-center mb-[80px]'>
                <div className='story-cards-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-center lg:content-between gap-10 mb-[40px]'>
                    <div className='story-card w-full h-full max-w-[400px] max-h-[650px] shadow-lg rounded-lg'>
                        <div className='story-image w-full h-full max-h-[280px]'>
                            <img
                                className='w-full h-full object-cover rounded-lt-lg rounded-tr-lg'
                                src={storyCard1}
                            />
                        </div>

                        <div className='story-content flex flex-col justify-center items-start gap-2 p-[30px]'>
                            <h4 className='customer-first-heading relative block text-left px-[40px] mb-5'>CUSTOMER FIRST</h4>

                            <h1 className='block text-2xl font-bold text-left mb-5'>
                                Beat the holiday rush: shop early, ship early with UPS
                            </h1>

                            <p className='block text-left'>Know shipping deadlines and take the pressure out of last-minute shopping</p>
                        </div>
                    </div>

                    <div className='story-card w-full h-full max-w-[400px] max-h-[650px] shadow-lg rounded-lg'>
                        <div className='story-image w-full h-full max-h-[280px]'>
                            <img
                                className='w-full h-full object-cover rounded-tl-lg rounded-tr-lg'
                                src={storyCard2}
                            />
                        </div>

                        <div className='story-content flex flex-col justify-center items-start gap-2 p-[30px]'>
                            <h4 className='customer-first-heading relative block text-left px-[40px] mb-5'>CUSTOMER FIRST</h4>

                            <h1 className='block text-2xl font-bold text-left mb-5'>
                                See how Coco Gauff, Emma Grede and UPS help deliver sweet success for this small business
                            </h1>

                            <p className='block text-left'>We're shipping Petrova Chocolates' treats nationwide - and Canada's up next</p>
                        </div>
                    </div>

                    <div className='story-card w-full h-full max-w-[400px] max-h-[650px] shadow-lg rounded-lg'>
                        <div className='story-image w-full h-full max-h-[280px]'>
                            <img
                                className='w-full h-full object-cover rounded-tl-lg rounded-tr-lg'
                                src={storyCard3}
                            />
                        </div>

                        <div className='story-content flex flex-col justify-center items-start gap-2 p-[30px]'>
                            <h4 className='customer-first-heading relative block text-left px-[40px] mb-5'>CUSTOMER FIRST</h4>

                            <h1 className='block text-2xl font-bold text-left mb-5'>
                                Small business, big growth: How UPS helps businesses succeed
                            </h1>

                            <p className='block text-left'>Did someone say add to cart?</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        </>
    );
};

export default About;