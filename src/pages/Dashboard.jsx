import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// api
import { api } from "../utils/Secure/api";

// Components
import Dictionary from "../components/Dashboard/Dictionary";
import Weather from "../components/Dashboard/Weather";
import Clock from "../components/Dashboard/Clock";
import Tasks from "../components/Dashboard/Tasks";
import FortuneCookie from "../components/Dashboard/FortuneCookie";
import Motivation from "../components/Dashboard/Motivation";
import WhatIsToday from "../components/Dashboard/WhatIsToday";
import MeetFamilyCard from "../components/Dashboard/MeetFamilyCard";
import FillForms from "../components/Dashboard/FillForms";
import CheckToolkit from "../components/Dashboard/CheckToolkit";
import UpdateYourself from "../components/Dashboard/UpdateYourself";
import AcademicallyRich from "../components/Dashboard/AcademicallyRich";
import ScoreAnalyzer from "../components/Dashboard/ScoreAnalyzer";

const getIndianGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 4) return "Good Night!";
  if (hour < 12) return "Good Morning!";
  if (hour < 13) return "Good Noon!";
  if (hour < 17) return "Good Afternoon!";
  if (hour < 22) return "Good Evening!";
  return "Good Night!";
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const pageTitle = "My Dashboard | DAAN KGP";
  const pageDescription = `Explore the DAAN KGP Dashboard with real-time tools and resources for IIT Kharagpur students.  
Access academic insights, task management, weather updates, motivational content, fortune cookie wisdom, daily guidance, member connections, forms, toolkit resources, self-improvement modules, and score analysis—all in one place to enhance campus life and productivity.`;

  useEffect(() => {
    api
      .get("/me")
      .then((res) => setUser(res.data))
      .catch(() => console.log("Failed to load user"));

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 p-4 md:p-8 lg:p-12 transition-colors duration-500 container">
      <Helmet>
              {/* Standard metadata */}
              <title>{pageTitle}</title>
              <meta name="description" content={pageDescription} />
              <meta name="keywords" content="DAAN KGP, Dakshana Foundation, Dakshana Alumni Network, Dakshana IIT Kharagpur, Dakshana scholars IIT KGP, IIT Kharagpur alumni network, DAAN IIT Kharagpur, student mentorship IIT Kharagpur, career guidance Dakshana alumni, higher studies guidance IIT KGP, alumni mentorship programs IIT, student support Dakshana scholars, Dakshana community Kharagpur, alumni-student connect IIT KGP, networking for Dakshana alumni, IIT Kharagpur student-alumni network, collaboration among Dakshana scholars, social initiatives Dakshana alumni, outreach programs IIT KGP, volunteering at IIT Kharagpur, giving back to society IIT alumni, awareness campaigns by DAAN, how Dakshana alumni help IIT Kharagpur students, mentorship opportunities for Dakshana scholars, alumni guidance network at IIT Kharagpur, career counseling by Dakshana alumni, Dakshana student community at IIT KGP, daan kgp, daan-kgp, kgpian dakshanite, dakshanites at kgp, dakshanites at iit kgp, kgpian dakshanites, dakshana alumni network at Indian institute of technology Kharagpur, daan at iit kgp, daan at kgp, kgp dakshana, dakshana, iitkgp, kgp, kharagpur" />
              <link rel="canonical" href="https://daan-kgp.vercel.app/dashboard" />
              {/* Open Graph / Facebook / LinkedIn */}
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://daan-kgp.vercel.app/dashboard" />
              <meta property="og:title" content={pageTitle} />
              <meta property="og:description" content={pageDescription} />
              <meta property="og:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif" /> {/* Add a real path to your logo/banner */}
            {/* The Thumbnail Image - This is what shows up in the WhatsApp chat bubble */}
              <meta property="og:image:type" content="image/png" />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              {/* Twitter */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content={pageTitle} />
              <meta name="twitter:description" content={pageDescription} />
              <meta name="twitter:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif" />
            </Helmet>
      {/* HEADER */}
      <header className="max-w-[1600px] mx-auto mb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 items-start gap-6">
          <div className="space-y-1 lg:col-span-1">
            <h1 className="text-lg md:text-xl font-bold tracking-tight whitespace-nowrap truncate">
              {user ? `Hello, ${user.name || user.username}` : "Hello"}
            </h1>
            <p className="text-rose-400 font-medium tracking-wide uppercase text-[10px]">
              {getIndianGreeting()}
            </p>
          </div>

          <div className="hidden lg:block lg:col-span-2 h-full">
            <div className="max-w-2xl mx-auto h-full">
              <Motivation />
            </div>
          </div>

          <div className="lg:col-span-1 flex justify-end items-start">
            <div className="relative" ref={menuRef}>
              <Link
                to="/profile"
                // onClick={() => setMenuOpen(!menuOpen)}
                className="relative group block focus:outline-none transition-transform active:scale-95"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <img
                  src={
                    user?.imgLink ||
                    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif"
                  }
                  alt="profile"
                  className="relative w-12 h-12 rounded-3xl border-2 border-white dark:border-slate-800 object-cover cursor-pointer"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* GRID */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 con">
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-3 xl:row-span-2">
          <Tasks />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <Clock />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-1 flex flex-wrap-reverse gap-6">
          <FillForms />
        </div>

        <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
          <MeetFamilyCard />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <WhatIsToday />
        </div>

        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 xl:row-span-2">
          <Weather location="Kharagpur" />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <CheckToolkit />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <Dictionary />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          {/* <MoonCalendar /> */}
          <ScoreAnalyzer />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <FortuneCookie />
        </div>
      </main>
      <div className="mt-6 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpdateYourself />
        <AcademicallyRich />
      </div>
    </div>
  );
}
