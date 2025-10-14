import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Hero from "../components/Hero/Hero";
import EventsComp from "../components/Events/EventsComp";
import Council from "../components/Council/Council";
import CR from "../components/CR/CR";
import Banner from "../components/Banner/Banner";
import GridBackgroundOptimized from "../components/Hero/GridBackgroundOptimized";
import BannerTwo from "../components/Banner/CountBanner";

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
        <title>DAAN KGP</title>
        <meta name="description" content="Welcome to the homepage of DAAN KGP..." />
      </Helmet>

      <div data-aos="fade-in">
        <section className="h-[720px] relative bg-gray-400 dark:bg-gray-900 flex items-center overflow-hidden">
          <GridBackgroundOptimized />
          <div className="relative z-10 w-full">
            <Hero />
          </div>
        </section>
        <BannerTwo/>

        <CR />
        <Council />
        <EventsComp />
        <Banner />
      </div>
    </>
  );
};

export default Home;