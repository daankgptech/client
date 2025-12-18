import React from "react";
import { FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FillForms() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/forms")}
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
          <FileText size={20} />
        </div>
        <div className="text-gray-400 group-hover:text-rose-500 transition-transform group-hover:translate-x-1 duration-300">
          <ChevronRight size={18} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold mb-1">
          Contribution
        </h3>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
          Fill out Forms
        </p>
      </div>

      {/* Visual Checklist Representation */}
      <div className="relative z-10 w-full space-y-1.5 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
             <div className="w-1.5 h-1.5 rounded-sm bg-rose-500" />
          </div>
          <div className="h-1.5 w-16 bg-gray-400/30 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-gray-400/20 border border-gray-400/40" />
          <div className="h-1.5 w-20 bg-gray-400/30 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-gray-400/20 border border-gray-400/40" />
          <div className="h-1.5 w-12 bg-gray-400/30 dark:bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Bottom Text */}
      <p className="relative z-10 text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
        Quick submission portal
      </p>
    </div>
  );
}