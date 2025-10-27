import React from 'react';
import {Link} from 'react-router-dom';

// Importing Components
import MidLineHeading from '../../components/MidLineHeading/MidLineHeading.jsx';
import YellowButton from '../../components/YellowButton.jsx';
import BlueButton from '../../components/BlueButton.jsx';

// Importing Images
import logisticBanner from '../../assets/about_logistic_banner.webp';
import storyCard1 from '../../assets/story_card_1.webp';
import storyCard2 from '../../assets/story_card_2.webp';
import storyCard3 from '../../assets/story_card_3.webp';
import busImage from '../../assets/bus_image.webp';
import deliveringMatter from '../../assets/delivering_matters_left.webp';

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
                        className='object-cover w-full h-[400px] md:h-full'
                        src={logisticBanner}
                    />

                    {/* Block */}
                    <div className='brand-philosophy-block w-full h-full max-w-[480px] max-h-[360px] absolute z-[2] top-[50%] left-1/2 md:left-[10%] tranform -translate-y-[50%] md:translate-x-0 translate-x-[-50%] flex flex-col justify-center items-start rounded-lg bg-white p-5'>
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

                <div className='view-all-stories-container w-full flex justify-center items-center'>
                    <Link to='/stories'>
                        <BlueButton
                            className='view-all-stories-btn w-full md:w-[220px] h-[50px] rounded-full border-2 border-blue-500 text-lg text-blue-500 items-center text-center bg-transparent hover:border-blue-700 hover:text-blue-700 cursor-pointer transition duration-200 px-2 py-3'
                        >
                        View All Stories</BlueButton>
                    </Link>
                </div>
            </section>

            <section className='about-us-section flex flex-col justify-center items-center h-auto w-full mb-[80px]'>
                <div className='about-heading-container flex flex-col justify-center items-center text-center gap-2 w-full px-3 mb-[40px]'>
                    <MidLineHeading>Customer First, People Led, Innovation Driven</MidLineHeading>

                    <BlueButton>Get to Know Us</BlueButton>
                </div>

                <div className='achievements-block relative w-auto h-auto'>
                    <img
                        className='object-cover w-auto lg:w-full h-[650px] lg:h-auto'
                        src={busImage}
                    />

                    {/* Block */}
                    <div className='achievements-container w-auto h-auto md:w-full md:h-full max-w-[300px] max-h-[630px] absolute z-[2] top-[50%] right-1/2 lg:right-[10%] tranform -translate-y-[50%] lg:translate-x-0 translate-x-[50%] flex flex-col justify-between items-start rounded-lg bg-white p-[20px]'>
                        <div className='achievement flex flex-col justify-center items-center text-center border-b-2 border-gray-300 w-full h-auto gap-4 p-2 pb-7'>
                            <h1 className='text-4xl text-black font-bold'>~490k</h1>

                            <span className='text-gray-500'>Employees</span>
                        </div>

                        <div className='achievement flex flex-col justify-center items-center text-center border-b-2 border-gray-300 w-full h-auto gap-4 p-2 pb-7'>
                            <h1 className='text-4xl text-black font-bold'>200+</h1>

                            <span className='text-gray-500'>Countries and territories</span>
                        </div>

                        <div className='achievement flex flex-col justify-center items-center text-center border-b-2 border-gray-300 w-full h-auto gap-4 p-2 pb-7'>
                            <h1 className='text-4xl text-black font-bold'>22.4M</h1>

                            <span className='text-gray-500'>Packages delivered per day</span>
                        </div>

                        <div className='achievement flex flex-col justify-center items-center text-center border-b-2 border-gray-300 w-full h-auto gap-4 p-2 pb-7'>
                            <h1 className='text-4xl text-black font-bold'>$91.1B</h1>

                            <span className='text-gray-500'>Total revenue for 2024</span>
                        </div>

                        <button
                            className="order-btn w-full h-[45px] rounded-[25px] opacity-100 font-bold bg-amber-400"
                        >
                        View All Fact Sheets</button>
                    </div>
                </div>
            </section>

            <section className='brand-impact-block flex flex-col md:flex-row justify-center items-center text-left rounded-lg shadow-xl w-full h-full mb-[100px]'>
                <div className='brand-impact-image w-full h-full'>
                    <img
                        className='w-full h-full rounded-tl-lg rounded-bl-lg object-cover'
                        src={deliveringMatter}
                    />
                </div>

                <div className='brand-impact-detail flex flex-col justify-center items-start text-left gap-10 w-full p-10'>
                    <h4 className='customer-first-heading relative block px-[40px] mb-5'>OUR IMPACT</h4>

                    <h1 className='text-5xl font-bold'>
                        Every day, around the globe, we are delivering what matters.
                    </h1>

                    <p>
                        At UPS, we're focused on making credible, purposeful changes to adapt and achieve our sustainability goals to help build stronger communities and a healthier environment.. It's about ...
                    </p>

                    <BlueButton>See Our Impact</BlueButton>
                </div>
            </section>
        </main>

        <footer className='about-us-subfooter flex justify-center items-center text-center gap-10 w-full border-b-2 border-gray-300 h-[95px] bg-[#361C14]'>
            <button
            className='view-all-stories-btn w-full md:w-[220px] h-[50px] rounded-full border-2 border-stone-300 text-lg text-stone-300 items-center text-center bg-transparent hover:border-white hover:text-white cursor-pointer transition duration-200 px-2 py-3'
        >
        Newsroom</button>

        <button
            className='view-all-stories-btn w-full md:w-[220px] h-[50px] rounded-full border-2 border-stone-300 text-lg text-stone-300 items-center text-center bg-transparent hover:border-white hover:text-white cursor-pointer transition duration-200 px-2 py-3'
        >
        Careers</button>
        </footer>
        </>
    );
};

export default About;