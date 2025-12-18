import React from "react";
import { Wrench, ArrowRight, ShieldCheck, Zap, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CheckToolkit() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/toolkit")}
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
        w-full h-full flex flex-col justify-between
        cursor-pointer
        md:col-span-2
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

      {/* Header Row */}
      <div className="relative z-10 w-full flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-500">
            <Wrench size={22} />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold">
              Resources
            </h3>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Need a help? Toolkit
            </p>
          </div>
        </div>
        <div className="bg-rose-500 text-white p-2 rounded-xl shadow-lg shadow-rose-500/30 group-hover:translate-x-1 transition-transform">
          <ArrowRight size={18} />
        </div>
      </div>

      {/* Feature Pills - Specific for 1x2 Layout */}
      <div className="relative z-10 flex flex-wrap gap-2 mt-4">
        {[
          { icon: <Zap size={12} />, label: "Quick Guides" },
          { icon: <ShieldCheck size={12} />, label: "Safety" },
          { icon: <HelpCircle size={12} />, label: "FAQ" }
        ].map((item, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-950/40 border border-white/20 dark:border-slate-800 text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-tighter"
          >
            <span className="text-rose-500">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 mt-4 pt-4 border-t border-gray-400/10 dark:border-slate-800 w-full">
        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Explore the official DAAN KGPian Support System
        </p>
      </div>
    </div>
  );
}