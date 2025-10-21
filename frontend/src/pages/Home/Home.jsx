import './Home.css';

// Importing components
import HomeInput from './HomeInput';

export default function Home() {
    const heroPerson = 'https://assets.ups.com/adobe/assets/urn:aaid:aem:2701ad76-d7ab-4a97-b70c-bc237d98fae8/as/app-teaser-hp-bc1246470.avif?assetname=app-teaser-hp-bc1246470.png';

    return (
        <>
        <section className='home-hero-container flex justify-center items-center w-screen h-[300px] md:h-[450px] gap-5'>
            <div className='hero-content h-full w-full max-w-[1400px] lg:grid lg:grid-cols-[4fr_1fr] md:grid md:grid-cols-[1fr] items-center text-center gap-3 lg:px-0 px-5 mx-auto'>
                <div className='left-hero-container w-full flex flex-col justify-center items-start gap-2'>
                    <div className='hero-nav-links flex justify-center items-center text-center gap-x-5 mb-4'>
                        <div className='hero-nav-link cursor-pointer relative overflow-hidden text-white text-4xl'>Track</div>
                        <div className='hero-nav-link cursor-pointer relative overflow-hidden text-white text-4xl'>Quote</div>
                        <div className='hero-nav-link cursor-pointer relative overflow-hidden text-white text-4xl'>Ship</div>
                    </div>

                    <HomeInput />
                </div>

                <div className='right-hero-container flex justify-center items-end w-full h-full'>
                    <img
                        className='hero-person-img w-0 h-0 lg:w-full lg:h-full max-w-[400px] max-h-[400px]'
                        src={heroPerson}
                    />
                </div>
            </div>
        </section>
        </>
    );
};