import { useEffect, useState } from "react";
import fortunes from "./JSFiles/Data";

export default function FortuneCookie() {
  const [fortune, setFortune] = useState("");

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("dailyFortune");

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        setFortune(parsed.text);
        return;
      }
    }

    const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortune(pick);

    localStorage.setItem(
      "dailyFortune",
      JSON.stringify({ date: today, text: pick })
    );
  }, []);

  return (
    <div
  className="
    group relative overflow-hidden
    rounded-3xl
    bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
    border border-rose-50
    dark:border-slate-700/50
    p-6
    transition-all duration-300
    hover:border-gray-500/40
    dark:hover:border-rose-500/50
    hover:shadow-lg hover:shadow-rose-900/20 
    w-full h-full flex flex-col justify-between items-start
  "
>
  {/* ambient glow */}
  <div
    className="
      pointer-events-none absolute inset-0
      bg-gradient-to-br from-rose-100/5 via-transparent to-red-500/5
      dark:from-rose-500/10 dark:to-red-900/10
      opacity-0 group-hover:opacity-100
      transition-opacity duration-500
    "
  />

  {/* Header */}
  <div className="relative z-10 w-full">
    <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold">Fortune Cookie</h3>
  </div>

  {/* Fortune Text Display */}
  <div className="relative z-10 w-full my-4">
    <div 
      className="
        relative rounded-2xl 
        bg-white/40 dark:bg-slate-950/40 
        p-5 border border-white/20 dark:border-slate-800
        min-h-[100px] flex items-center justify-center text-center
      "
    >
      {/* Decorative Quote Marks */}
      <span className="absolute top-2 left-3 text-3xl text-rose-300/30 font-serif">“</span>
      
      <p className="text-sm sm:text-base italic font-medium text-gray-800 dark:text-gray-200 leading-relaxed px-4">
        {fortune || "Click for a daily dose of wisdom..."}
      </p>

      <span className="absolute bottom-2 right-3 text-3xl text-rose-300/30 font-serif">”</span>
    </div>
  </div>

  {/* Optional Action Button (if you have a refresh function) */}
  {/* <button 
    onClick={getNewFortune} // Replace with your refresh function name
    className="
      relative z-10 w-full
      bg-rose-400 hover:bg-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500
      text-white py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest
      transition-all duration-200 shadow-md active:scale-[0.98]
    "
  >
    Get New Fortune
  </button> */}
</div>
  );
}
