import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"; // Assumes you are using react-router-dom
// Components
import Dictionary from "../components/Dashboard/Dictionary";
import Weather from "../components/Dashboard/Weather";
import Clock from "../components/Dashboard/Clock";
import Tasks from "../components/Dashboard/Tasks";
import MoonCalendar from "../components/Dashboard/MoonCalendar";
import FortuneCookie from "../components/Dashboard/FortuneCookie";
import Motivation from "../components/Dashboard/Motivation";
import WhatIsToday from "../components/Dashboard/WhatIsToday";
import MeetFamilyCard from "../components/Dashboard/MeetFamilyCard";
import FillForms from "../components/Dashboard/FillForms";
import CheckToolkit from "../components/Dashboard/CheckToolkit";
import UpdateYourself from "../components/Dashboard/UpdateYourself";
import AcademicallyRich from "../components/Dashboard/AcademicallyRich";

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
  //will be fetched from backend
  const [user, setUser] = useState({
    name: "Shani Maurya",
    photo: "https://i.pravatar.cc/150",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetch("/user.json")
      .then((res) => res.json())
      .then(setUser)
      .catch(() => console.log("Using default user profile"));

    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 p-4 md:p-8 lg:p-12 transition-colors duration-500">
      {/* --- HEADER SECTION --- */}
      <header className="max-w-[1600px] mx-auto mb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 items-start gap-6">
          {/* 1. Left Section: Greeting (25% / col-span-1) */}
          <div className="space-y-1 lg:col-span-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight whitespace-nowrap">
              {user ? `Hello, ${user.name}` : "Hello"}
              <span className="text-rose-500"></span>
            </h1>
            <p className="text-rose-400 font-medium tracking-wide uppercase text-[10px]">
              {getIndianGreeting()}
            </p>
          </div>

          {/* 2. Middle Section: Motivation (50% / col-span-2) */}
          <div className="hidden lg:block lg:col-span-2 h-full">
            <div className="max-w-2xl mx-auto h-full">
              <Motivation />
            </div>
          </div>

          {/* 3. Right Section: Profile (25% / col-span-1) */}
          <div className="lg:col-span-1 flex justify-end items-start">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative group block focus:outline-none transition-transform active:scale-95"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <img
                  src={user.photo}
                  alt="profile"
                  className="relative w-12 h-12 rounded-3xl border-2 border-white dark:border-slate-800 object-cover cursor-pointer"
                />
              </button>
              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-rose-100 dark:border-slate-800 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 flex flex-col">
                  <Link
                    to="/profile"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-200"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/reset-password"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-200"
                  >
                    Reset Password
                  </Link>
                  <Link
                    to="/signout"
                    className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors font-bold border-t dark:border-slate-800"
                  >
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- GRID SECTION --- */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 container">
        {/* ROW 1: Hero Section */}
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-3 xl:row-span-2">
          <Tasks />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <Clock />
        </div>

        {/* Grouped with Flex-wrap-reverse for dynamic layout */}
        <div className="md:col-span-1 lg:col-span-2 xl:col-span-1 flex flex-wrap-reverse gap-6">
          <FillForms />
        </div>

        {/* ROW 2: Daily Insights */}
        <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
          <MeetFamilyCard />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          {/* <Motivation /> */}
          <WhatIsToday />
        </div>

        {/* ROW 3: Organization & Fun */}
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 xl:row-span-2">
          <Weather location="Kharagpur" />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <CheckToolkit />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <Dictionary />
        </div>

        {/* ROW 4: Cosmic & Random */}
        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <MoonCalendar />
        </div>

        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <FortuneCookie />
        </div>
      </main>

      {/* --- NAVIGATION FOOTER BTNS --- */}
      <div className="mt-6 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 items-start justify-evenly gap-6 container">
        <UpdateYourself />
        <AcademicallyRich />
      </div>
    </div>
  );
}
