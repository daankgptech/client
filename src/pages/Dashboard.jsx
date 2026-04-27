import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import SEO, { seoConfig } from "../utils/SEO";

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-slate-900 dark:text-slate-200 p-4 md:p-8 lg:p-12 transition-colors duration-500 px-4 md:container">
      <SEO {...seoConfig.dashboard} />
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
              {/* <Motivation /> */}
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
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User",
                    )}&background=fee2e2&color=991b1b`
                  }
                  alt="profile"
                  className="relative w-12 h-12 rounded-3xl border-2 border-white dark:border-slate-800 object-cover cursor-pointer"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="w-full  py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 auto-rows-min">
          {/* 🔷 TOP BAR (Global Context) */}
          <div className="xl:col-span-6">
            <div className="bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 md:p-3 lg:p-4">
              <Clock />
            </div>
          </div>

          <div className="xl:col-span-6">
            <div className="bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 md:p-3 lg:p-4">
              <WhatIsToday />
            </div>
          </div>

          {/* 🔥 LEFT: PRIMARY FOCUS */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="bg-white/60 dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex-grow min-h-[400px]">
              <Tasks />
            </div>

            {/* Insights */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4">
              <div className="bg-white/40 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-1 md:p-2 lg:p-3">
                <FortuneCookie />
              </div>
              <div className="bg-white/40 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-1 md:p-2 lg:p-3">
                <AcademicallyRich />
              </div>
            </div>
          </div>

          {/* ⚡ CENTER: DYNAMIC + ANALYTICS */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 md:p-3 lg:p-4">
                <Weather location="Kharagpur" />
              </div>

              <div className="bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 md:p-3 lg:p-4">
                <UpdateYourself />
              </div>
            </div>

            <div className="bg-white/60 dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-2 md:p-3 lg:p-4">
              <ScoreAnalyzer />
            </div>
          </div>

          {/* 🧩 RIGHT: UTILITIES + SOCIAL */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            <div className="bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 md:p-3 lg:p-4">
              <MeetFamilyCard />
            </div>

            <div className="bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 md:p-3 lg:p-4">
              <FillForms />
            </div>

            <div className="bg-white/40 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-2 md:p-3 lg:p-4">
              <Dictionary />
            </div>

            <div className="bg-white/40 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-2 md:p-3 lg:p-4">
              <CheckToolkit />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
