// Importing CSS
import "./Home.css";

// Importing Images
import customerFirst from "../../assets/customer_first.webp";
import chipMap from "../../assets/chip.webp";

// Importing components
import HomeInput from "./HomeInput";
import FAQ from "./FAQ";

export default function Home() {
  const brandRepresentative =
    "https://assets.ups.com/adobe/assets/urn:aaid:aem:2701ad76-d7ab-4a97-b70c-bc237d98fae8/as/app-teaser-hp-bc1246470.avif?assetname=app-teaser-hp-bc1246470.png";
  const featureProduct =
    "https://assets.ups.com/adobe/assets/urn:aaid:aem:9dc04be7-dd04-4616-9321-d56d4442b85d/as/holiday-shipping-box-us-2025.avif?assetname=holiday-shipping-box-us-2025.png";
  const downloadImage =
    "https://assets.ups.com/adobe/assets/urn:aaid:aem:ab49a4ac-cf2a-458c-b2b2-deef9bf347ac/as/delivery-day-mobile-image.avif?assetname=delivery-day-mobile-image.png";

  return (
    <>
      <div className="sup-header"></div>

      <section className="home-hero-container flex flex-col justify-center items-center w-screen h-[400px] md:h-[500px] pb-8 gap-5">
        <div className="hero-content h-full w-full max-w-[1400px] lg:grid lg:grid-cols-[4fr_1fr] md:grid md:grid-cols-[1fr] items-center text-center gap-3 lg:px-0 px-5 mx-auto">
          <div className="left-hero-container w-full flex flex-col justify-center items-center md:items-start pt-5 md:pt-0 gap-2">
            <div className="hero-nav-links flex justify-center items-center text-center gap-x-5 mb-4">
              <div className="hero-nav-link cursor-pointer relative overflow-hidden text-white text-4xl">
                Track
              </div>
              <div className="hero-nav-link cursor-pointer relative overflow-hidden text-white text-4xl">
                Quote
              </div>
              <div className="hero-nav-link cursor-pointer relative overflow-hidden text-white text-4xl">
                Ship
              </div>
            </div>

            {/* Home input component */}
            <HomeInput />
          </div>

          <div className="right-hero-container flex justify-center items-end w-full h-full">
            <img
              className="hero-person-img w-0 h-0 lg:w-full lg:h-full max-w-[400px] max-h-[400px]"
              src={brandRepresentative}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto flex flex-col justify-center items-center max-w-[1600px]">
        <section className="features-section w-full h-full flex flex-col justify-center items-center container gap-20 mb-[80px] px-4">
          <div className="features-introduction-container w-full max-w-[800px]">
            <h1 className="features-introduction-heading font-bold text-4xl mb-5">
              Regulations Change. UPS Can Help You Keep Moving.
            </h1>

            <p className="mt-5">
              From shifting tariffs to evolving compliance rules, UPS stays
              ahead so you don't fall behind. Our digital solutions and global
              logistics expertise turn complexity into clarity, so you can focus
              on delivering for your customers.
            </p>
          </div>

          <div className="features-card-container w-full h-full grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 place-content-center gap-10">
            <div className="feature-card rounded cursor-pointer p-[30px]">
              <h1 className="text-2xl mb-5">Tariff Impacts</h1>

              <p className="mb-10">
                Get the latest tariff updates as well as resources to help you
                navigate these changes and strealine global shipping.
              </p>

              <h3 className="text-blue-500 cursor-pointer">
                Tariff Rousouce Guide
              </h3>
            </div>

            <div className="feature-card rounded cursor-pointer p-[30px]">
              <h1 className="text-2xl mb-5">Tariff Impacts</h1>

              <p className="mb-10">
                Get the latest tariff updates as well as resources to help you
                navigate these changes and strealine global shipping.
              </p>

              <h3 className="text-blue-500 cursor-pointer">
                Tariff Rousouce Guide
              </h3>
            </div>

            <div className="feature-card rounded cursor-pointer p-[30px]">
              <h1 className="text-2xl mb-5">Tariff Impacts</h1>

              <p className="mb-10">
                Get the latest tariff updates as well as resources to help you
                navigate these changes and strealine global shipping.
              </p>

              <h3 className="text-blue-500 cursor-pointer">
                Tariff Rousouce Guide
              </h3>
            </div>
          </div>
        </section>

        <section className="feature-product-section w-full flex flex-col md:flex-row justify-center items-center mb-[80px] gap-10">
          <div>
            <img
              className="object-cover w-full h-full max-w-[850px] max-h-[450px]"
              src={featureProduct}
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-[40px]">
              Stock Up for the Holiday Rush
            </h1>

            <p className="text-xl text-gray-500 mb-[25px]">
              Go into this holiday season stress-free and order your shipping
              supplies early.
            </p>

            <button className="order-btn w-full md:w-[145px] h-[45px] rounded-[25px] opacity-100 bg-amber-400">
              Order Now
            </button>
          </div>
        </section>

        <section className="discount-section w-full h-full flex-col flex md:flex-row justify-between items-center bg-sky-700 py-[25px] px-[30px] mb-[80px]">
          <div className="mb-[30px] md:mb-0">
            <h1 className="text-4xl text-white mb-[12px]">
              Save up to 65% When You Ship International
            </h1>

            <p className="text-white mb-[12px]">
              Use code *GOINTL2025* to save on worldwide services all season
              long.
            </p>

            <p className="text-white underline cursor-pointer">
              *Term and Condition aplly.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <button className="ship-and-save-btn w-full md:w-[170px] h-[45px] rounded-[25px] opacity-100 bg-amber-400">
              Ship and Save
            </button>
          </div>
        </section>

        <section className="download-section w-full h-full flex flex-col-reverse md:flex-row justify-between items-center mb-[80px]">
          <div>
            <h1 className="download-heading font-bold text-4xl mb-[40px]">
              Download & Play to Save
            </h1>

            <p className="mb-[20px]">
              Save $5 on a UPS My Choice Premium membership*when you play
              Delivery Day in the UPS App.
            </p>

            <button className="ship-and-save-btn w-full md:w-[150px] h-[45px] rounded-[25px] opacity-100 bg-amber-400 mb-[20px]">
              Play and Save
            </button>

            <p className="underline">*Term and Condition aplly.</p>
          </div>

          <div>
            <img
              className="w-full object-cover md:mb-0 mb-[20px]"
              src={downloadImage}
            />
          </div>
        </section>

        <section className="branding-section flex flex-col justify-center items-center mb-[80px]">
          <div className="items-center text-center mb-[40px]">
            <h1 className="branding-heading font-bold text-5xl mb-[50px]">
              World-Class Services You Can Count On
            </h1>

            <p>Customer first, people led, innovation driven.</p>
          </div>

          <div className="w-full max-w-[1100px] flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="branding-card max-w-[550px] cursor-pointer overflow-hidden rounded">
              <div className="overflow-hidden max-h-[300px]">
                <img
                  className="branding-image w-full object-cover overflow-hidden mb-[20px]"
                  src={customerFirst}
                />
              </div>

              <div className="p-5">
                <h2 className="mb-[20px]">
                  How UPS Can Help You Navigate Tariffs
                </h2>

                <p className="mb-[20px]">
                  UPS has multiple tools to help small businesses compete in an
                  evolving trade environment.
                </p>

                <h3 className="text-blue-500 cursor-pointer">
                  Tariff Rousouce Guide
                </h3>
              </div>
            </div>

            <div className="branding-card max-w-[550px] cursor-pointer overflow-hidden rounded">
              <div className="overflow-hidden max-h-[300px]">
                <img
                  className="branding-image w-full object-cover overflow-hidden mb-[20px]"
                  src={chipMap}
                />
              </div>

              <div className="p-5">
                <h2 className="mb-[20px]">
                  Say Goodbye to Surprise Tariff Expenses
                </h2>

                <p className="mb-[20px]">
                  UPS Global Checkout helps businesses build trust with
                  customers and reduce returns by eliminating surprise costs
                </p>

                <h3 className="text-blue-500 cursor-pointer">How It Works</h3>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section flex flex-col justify-center items-center mb-[80px]">
          <h1 className="important-update-heading font-bold text-5xl mb-[50px]">
            Important Updates
          </h1>

          {/* FAQ Component */}
          <FAQ />
        </section>
      </main>
    </>
  );
}
