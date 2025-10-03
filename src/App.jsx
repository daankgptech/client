import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Home from "./pages/Home";
import OurFam from "./pages/OurFam";
import OurBrightMinds from "./pages/OurBrightMinds";
import EventsDetails from "./pages/EventsDetails";
import NoPage from "./pages/NoPage";
import FlashPage from "./pages/FlashPage";
import Forms from "./pages/Forms";
import EventComp from "./components/Events/EventsComp";
import Toolkit from "./pages/Toolkit";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Election from "./components/Council/Election";
import DataUpdate from "./components/Forms/DataUpdate";
import PageUpBtn from "./utils/PageUpBtn";
import GlobalClickSpark from "./components/ClickEffect/GlobalClickSpark";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import CakeDesignCompetition from "./components/Forms/CakeDesignCompetition";

const scrollRoutes = ["flashing-notices", "cr", "council", "events"];

export default function App() {
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 900,
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("daanFlashShown")) setShowFlash(false);
    else sessionStorage.setItem("daanFlashShown", "true");
  }, []);

  if (showFlash) return <FlashPage onFinish={() => setShowFlash(false)} />;

  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-14 md:pt-20 pb-14 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-400 min-h-full">
        <Routes>
          <Route index element={<Home />} />
          {scrollRoutes.map((path) => ( <Route key={path} path={path} element={<Home scrollTo={path} />} /> ))}
          <Route path="council/election" element={<Election />} />
          <Route path="our-fam/:year" element={<OurFam />} />
          <Route path="our-fam" element={<Navigate to="/our-fam/25" replace />} />
          <Route path="events" element={<EventComp />} />
          <Route path="events/:slug" element={<EventsDetails />} />
          <Route path="toolkit/:tab" element={<Toolkit />} />
          <Route path="toolkit" element={<Navigate to="/toolkit/erp" replace />} />
          <Route path="our-bright-minds" element={<OurBrightMinds />} />
          <Route path="forms" element={<Forms />} />
          <Route path="forms/data-update" element={<DataUpdate />} />
          <Route path="forms/cake-design-competition" element={<CakeDesignCompetition />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </main>

      <PageUpBtn />
      <Analytics />
      <SpeedInsights />
      <Footer />
      <GlobalClickSpark />
    </BrowserRouter>
  );
}
