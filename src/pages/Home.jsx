import { useEffect } from "react";
import Hero from "../components/Hero/Hero";
import EventsComp from "../components/Events/EventsComp";
import Council from "../components/Council/Council";
import CR from "../components/CR/CR";
import Banner from "../components/Banner/Banner";
import BannerTwo from "../components/Banner/CountBanner";
import SEO, { seoConfig } from "../utils/SEO";

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
      <SEO {...seoConfig.home} />
      <div data-aos="fade-in">
        <Hero />
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
