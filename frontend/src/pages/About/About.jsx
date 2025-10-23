import React from 'react';

// Importing Components
import MidLineHeading from '../../components/MidLineHeading/MidLineHeading.jsx';
import YellowButton from '../../components/YellowButton.jsx';

// Importing CSS
import './About.css';

const About = () => {
    const customerFirst = '/content/dam/upsstories/images/our-stories/customer-first/5-things-every-business-should-know-about-returns-in-2025/HappyNRF-1023x960.jpg';

    return (
        <>
        <main className='mx-auto flex flex-col justify-center items-center max-w-[1600px]'>
            <section className='brand-philosophy'>
                <MidLineHeading>Moving our world forward by delivering what matters.</MidLineHeading>

                <div className='brand-philosophy-container'>
                    <div className='brand-philosophy-image'>
                        <img
                            src={customerFirst}
                        />
                    </div>

                    <div className='brand-philosophy-block'>

                    </div>
                </div>
            </section>
        </main>
        </>
    );
};

export default About;