import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

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
  const pageTitle = "Personal Dashboard | DAAN KGP";
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
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
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
