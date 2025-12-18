import React from "react";
import { UserCog, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpdateYourself() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/profile")}
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
          <UserCog size={20} />
        </div>
        <div className="text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <Sparkles size={16} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold mb-1">
          Personal
        </h3>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
          Update Yourself
        </p>
      </div>

      {/* Bottom Text/Visual */}
      <div className="relative z-10 w-full mt-2">
         <div className="h-1 w-full bg-gray-400/20 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-rose-500 rounded-full group-hover:w-full transition-all duration-700 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
         </div>
         <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter mt-2">
            Profile Completion
         </p>
      </div>
    </div>
  );
}