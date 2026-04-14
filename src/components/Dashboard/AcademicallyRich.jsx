import React from "react";
import { GraduationCap, Star, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AcademicallyRich() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/academic-stars")}
      className="
    w-full h-full flex flex-col justify-between gap-3
    p-4
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    cursor-pointer
    hover:border-rose-400
    hover:bg-gray-50 dark:hover:bg-gray-800
    transition-colors duration-150
  "
    >
      {/* top */}
      <div className="flex justify-between items-center">
        <div className="p-1.5 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-500">
          <GraduationCap size={16} />
        </div>

        {/* subtle stars */}
        <div className="flex gap-0.5 text-rose-400">
          <Star size={10} />
          <Star size={10} />
        </div>
      </div>

      {/* content */}
      <div>
        <h3 className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
          Excellence
        </h3>

        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Bright Minds
        </p>
      </div>

      {/* small indicator */}
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-4 bg-rose-500 rounded-sm" />
        <div className="w-1.5 h-4 bg-gray-300 dark:bg-gray-700 rounded-sm" />
        <div className="w-1.5 h-4 bg-gray-300 dark:bg-gray-700 rounded-sm" />
      </div>

      {/* footer */}
      <p className="text-[10px] text-gray-400">Academic highlights</p>
    </div>
  );
}
