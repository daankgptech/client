import React, { memo } from "react";

const BrightMindsCard = memo(({
  imgLink,
  name,
  dept,
  Year,
  cg,
  position,
}) => {
  return (
    <div
      className="
        group relative flex flex-col items-center
        p-4 rounded-2xl w-full max-w-[280px]
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
        hover:border-rose-300 dark:hover:border-rose-900/50
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
        will-change-transform hover:-translate-y-1
      "
    >
      {/* Rank Badge - Minimalist */}
      {position && (
        <div className="absolute top-3 right-3 z-10">
          <span className="
            flex items-center justify-center
            px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold
            bg-rose-50 dark:bg-rose-950/30 
            text-rose-600 dark:text-rose-400
            border border-rose-100 dark:border-rose-900/50
          ">
            Rank {position}
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 mt-4 mb-5">
        <div className="
          absolute inset-0 rounded-full border-2 border-dashed border-rose-200 dark:border-rose-900/30 
          scale-110 group-hover:rotate-45 transition-transform duration-700
        " />
        <img
          src={imgLink}
          alt={name}
          loading="eager"
          decoding="async"
          className="
            relative w-full h-full rounded-full object-cover
            grayscale-[0.5] group-hover:grayscale-0
            transition-all duration-500 shadow-sm
            border-2 border-white dark:border-gray-900
          "
        />
      </div>

      {/* Text Content */}
      <div className="text-center w-full space-y-1">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {name}
        </h3>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-tight">
          {dept}
        </p>
      </div>

      {/* Footer Info - High Contrast Minimalist */}
      <div className="
        mt-6 w-full pt-4 border-t border-gray-100 dark:border-gray-900
        flex justify-between items-center text-xs md:text-sm
      ">
        <span className="text-gray-400 dark:text-gray-500 font-medium">Batch {Year}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-bold text-gray-900 dark:text-gray-100">{cg} CGPA</span>
        </div>
      </div>
    </div>
  );
});

BrightMindsCard.displayName = "BrightMindsCard";

export default BrightMindsCard;