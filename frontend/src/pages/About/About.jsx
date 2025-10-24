import React from 'react';

// Importing Components
import MidLineHeading from '../../components/MidLineHeading/MidLineHeading.jsx';
import YellowButton from '../../components/YellowButton.jsx';

// Importing Images
import aboutLogisticBanner from '../../assets/about_logistic_banner.jpg'

// Importing CSS
import './About.css';

const About = () => {
    

    return (
        <>
        <main className='mx-auto flex flex-col justify-center items-center max-w-[1600px]'>
            <section className='brand-philosophy'>
                <MidLineHeading>Moving our world forward by delivering what matters.</MidLineHeading>

                <div className='brand-philosophy-container'>
                    <div className='brand-philosophy-image'>
                        <img
                            className='w-full h-full relative'
                            src={aboutLogisticBanner}
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