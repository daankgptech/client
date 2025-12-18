import React, { useEffect, useState } from "react";

export default function Motivation() {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const cached = localStorage.getItem("dailyMotivation");

    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.date === today) {
        setQuote(parsed.data);
        return;
      }
    }

    const fetchQuote = async () => {
      try {
        const res = await fetch("https://quotes-api-self.vercel.app/quote");
        if (!res.ok) throw new Error("Quote fetch failed");
        const data = await res.json();

        setQuote(data);
        localStorage.setItem(
          "dailyMotivation",
          JSON.stringify({ date: today, data })
        );
      } catch (err) {
        setError("Unable to load motivation");
      }
    };

    fetchQuote();
  }, []);

  // Shared Wrapper for consistent design across Loading/Error/Success states
  const CardWrapper = ({ children }) => (
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
      
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );

  if (error) {
    return (
      <CardWrapper>
        <p className="text-sm text-red-500 dark:text-red-400 italic font-medium">
          {error}
        </p>
      </CardWrapper>
    );
  }

  if (!quote) {
    return (
      <CardWrapper>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <p className="text-sm text-gray-400 animate-pulse">Gathering wisdom...</p>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <div className="relative">
        {/* Large Decorative Quote Mark */}
        <span className="absolute -top-6 -left-2 text-6xl text-rose-500/10 dark:text-rose-500/20 font-serif select-none">
          “
        </span>
        
        <p className="relative z-10 text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-100 leading-snug italic">
          {quote.quote}
        </p>

        {quote.author && (
          <div className="mt-5 flex items-center gap-2">
            <div className="h-[1px] w-5 bg-rose-400/60" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-rose-400/90 font-black">
              {quote.author}
            </p>
          </div>
        )}
      </div>
    </CardWrapper>
  );
}