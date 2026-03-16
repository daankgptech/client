import { useEffect } from "react";
import Hero from "../components/Hero/Hero";
import EventsComp from "../components/Events/EventsComp";
import Council from "../components/Council/Council";
import CR from "../components/CR/CR";
import Banner from "../components/Banner/Banner";
import GridBackgroundOptimized from "../components/Hero/GridBackgroundOptimized";
import BannerTwo from "../components/Banner/CountBanner";
import { Helmet } from "react-helmet-async";

const Home = ({ scrollTo }) => {
  useEffect(() => {
    if (!scrollTo) return;

    const el = document.getElementById(scrollTo);
    if (!el) return;

    const yOffset = -100;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY + yOffset,
      behavior: "smooth",
    });
  }, [scrollTo]);

  return (
    <>
      <Helmet>
        {/* Standard metadata */}
        <title>DAAN KGP | DakshanA Alumni Network IIT Kharagpur</title>
        <meta name="description" content="DAAN KGP unites IIT Kharagpur Dakshana scholars, providing mentorship, career guidance, and service opportunities within a supportive, collaborative community." />
        <meta name="keywords" content="DAAN KGP, Dakshana Foundation, Dakshana Alumni Network, Dakshana IIT Kharagpur, Dakshana scholars IIT KGP, IIT Kharagpur alumni network, DAAN IIT Kharagpur, student mentorship IIT Kharagpur, career guidance Dakshana alumni, higher studies guidance IIT KGP, alumni mentorship programs IIT, student support Dakshana scholars, Dakshana community Kharagpur, alumni-student connect IIT KGP, networking for Dakshana alumni, IIT Kharagpur student-alumni network, collaboration among Dakshana scholars, social initiatives Dakshana alumni, outreach programs IIT KGP, volunteering at IIT Kharagpur, giving back to society IIT alumni, awareness campaigns by DAAN, how Dakshana alumni help IIT Kharagpur students, mentorship opportunities for Dakshana scholars, alumni guidance network at IIT Kharagpur, career counseling by Dakshana alumni, Dakshana student community at IIT KGP, daan kgp, daan-kgp, kgpian dakshanite, dakshanites at kgp, dakshanites at iit kgp, kgpian dakshanites, dakshana alumni network at Indian institute of technology Kharagpur, daan at iit kgp, daan at kgp, kgp dakshana, dakshana, iitkgp, kgp, kharagpur" />
        <link rel="canonical" href="https://daankgp.vercel.app/" />
        {/* Open Graph / Facebook / LinkedIn */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daankgp.vercel.app/" />
        <meta property="og:title" content="DAAN KGP | DakshanA Alumni Network at IIT Kharagpur" />
        <meta property="og:description" content="Empowering Dakshana alumnus at IIT Kharagpur through mentorship, guidance, and a culture of giving back." />
        <meta property="og:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif" /> {/* Add a real path to your logo/banner */}
        {/* The Thumbnail Image - This is what shows up in the WhatsApp chat bubble */}
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DAAN KGP | DakshanA Alumni Network at IIT Kharagpur" />
        <meta name="twitter:description" content="Connecting past and present Dakshana scholars at IIT Kharagpur for growth and service." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif" />
      </Helmet>
      <div data-aos="fade-in">
        <section className="h-[720px] relative bg-gray-400 dark:bg-gray-900 flex items-center overflow-hidden">
          <GridBackgroundOptimized />
          <div className="relative z-10 w-full">
            <Hero />
          </div>
        </section>
        <BannerTwo />
        <CR />
        <Council />
        <EventsComp />
        <Banner />
      </div>
    </>
  );
};

export default Home;
