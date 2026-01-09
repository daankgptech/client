import React from "react";
import { GraduationCap, Star, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AcademicallyRich() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/academic-stars")}
      className="
        group relative overflow-hidden
        rounded-3xl
        bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        border border-rose-50
        dark:border-slate-700/50
        p-6
        transition-all duration-500
        hover:border-rose-400/40
        dark:hover:border-rose-500/50
        hover:shadow-lg hover:shadow-rose-900/20 
        w-full h-full flex flex-col justify-between items-start
        cursor-pointer
      "
    >
      {/* ambient glow */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-br from-rose-100/10 via-transparent to-rose-500/10
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
        "
      />

      {/* Top Header */}
      <div className="relative z-10 w-full flex justify-between items-start">
        <div className="p-2 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-500">
          <GraduationCap size={20} />
        </div>
        <div className="flex gap-1 text-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity">
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" className="animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold mb-1">
          Excellence
        </h3>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
          Bright Minds
        </p>
      </div>

      {/* Visual Badge / Info */}
      <div className="relative z-10 mt-2 flex items-center gap-2">
        <div className="flex -space-x-1">
          <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
          <div className="w-1.5 h-6 bg-rose-400 rounded-full opacity-60" />
          <div className="w-1.5 h-6 bg-rose-300 rounded-full opacity-30" />
        </div>
        <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tighter">
          Top Scholars from DAAN KGP
        </p>
      </div>

      {/* Bottom Text */}
      <p className="relative z-10 text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
        Meet our academic stars
      </p>
    </div>
  );
}