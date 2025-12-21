import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CouncilCard from "./CouncilCard";
import { CouncilData24, CouncilData25, demo } from "./CouncilData";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../Secure/ProtectedRoute";
import { button } from "framer-motion/client";

const councilYears = [
  {
    year: 25,
    data: CouncilData25,
    label: "2025-26",
    fullCouncil:
      "https://docs.google.com/spreadsheets/d/1cPQRMKplIaWI2JIi5d6z7a6ahofOq8UnZtNLRaMhGdQ/edit?usp=sharing",
  },
  {
    year: 24,
    data: CouncilData24,
    label: "2024-25",
    fullCouncil:
      "https://docs.google.com/spreadsheets/d/1BIJwqFV_7au6KPHp2FoAkSCFSiJT0DRD1aHl1t6pKiI/edit?usp=sharing",
  },
];

const Council = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentIndex > 0) {
      setDirection(1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex < councilYears.length - 1) {
      setDirection(-1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const currentCouncil = councilYears[currentIndex];

  return (
    <section
      id="council"
      className="scroll-mt-[100px] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-300 py-10"
    >
      <div className="container space-y-10" data-aos="fade-up">
        <h1 className="border-l-8 border-red-300 dark:border-gray-300 py-2 pl-3 text-3xl font-bold">
          Our DAAN Council Members
        </h1>
        {/* Dynamic Title */}
        <p className="text-base sm:text-lg md:text-xl font-semibold dark:text-gray-300 text-center tracking-wide select-none">
          {currentCouncil.label}
        </p>
        {/* Animated Council Cards */}
        <div className="relative overflow-hidden p-4">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentCouncil.year}
              custom={direction}
              initial={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-full"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentCouncil.data.map((member, i) => (
                  <CouncilCard key={i} {...member} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Spreadsheet Button */}
        <div className="text-center">
          <ProtectedRoute
            fallback={
              <button
                onClick={() => navigate("/signin")}
                className="inline-block p-2 rounded-lg border shadow-sm shadow-gray-600 text-red-600 dark:text-gray-400 
              bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 
              border-gray-300 dark:border-gray-600 transition-all duration-300 
              hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600 
              hover:border-gray-500 dark:hover:border-cyan-400"
              >
                View Full Council
              </button>
            }
          >
            <a
              href={currentCouncil.fullCouncil}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block p-2 rounded-lg border shadow-sm shadow-gray-600 text-red-600 dark:text-gray-400 
              bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 
              border-gray-300 dark:border-gray-600 transition-all duration-300 
              hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600 
              hover:border-gray-500 dark:hover:border-cyan-400"
            >
              View Full Council
            </a>
          </ProtectedRoute>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between px-4 items-center mt-6">
          <button
            onClick={handleNext}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 
              ${
                currentIndex === 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-red-500 dark:bg-red-800 hover:bg-red-600 dark:hover:bg-red-700 text-white"
              }`}
          >
            {"<-"}
          </button>
          <button
            onClick={handlePrev}
            disabled={currentIndex >= councilYears.length - 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 
              ${
                currentIndex >= councilYears.length - 1
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-red-500 dark:bg-red-800 hover:bg-red-600 dark:hover:bg-red-700 text-white"
              }`}
          >
            {"->"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Council;
