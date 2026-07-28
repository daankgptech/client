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
        group relative flex flex-col items-center justify-between
        p-5 w-full max-w-[280px]
        bg-transparent
        border-white/10 border-[0.5px]
        hover:bg-white/5 hover:border-white/20
        will-change-transform hover:-translate-y-1
        transition-all duration-300 ease-out
      "
    >
      {/* Rank Badge - Matching Toolkit Category Badge */}
      {position && (
        <div className="absolute top-3 right-3 z-10">
          <span className="
            flex items-center justify-center
            px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold
            text-primary bg-primary/10 border border-primary/20
          ">
            Rank {position}
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-32 h-32 md:w-36 md:h-36 mt-4 mb-4">
        <div className="
          absolute inset-0 rounded-full border-2 border-dashed border-primary/30 
          scale-110 group-hover:rotate-45 transition-transform duration-700
        " />
        <img
          src={
            imgLink ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name || "User"
            )}&background=fee2e2&color=991b1b`
          }
          alt={name}
          loading="eager"
          decoding="async"
          className="
            relative w-full h-full rounded-full object-cover
            grayscale-[0.3] group-hover:grayscale-0
            transition-all duration-500 shadow-sm
            border-2 border-white/10
          "
        />
      </div>

      {/* Text Content */}
      <div className="text-center w-full space-y-1">
        <h3 className="text-base md:text-lg font-bold font-space-grotesk text-white group-hover:text-primary transition-colors leading-tight truncate">
          {name}
        </h3>
        <p className="text-xs text-white/60 font-medium uppercase tracking-wider truncate">
          {dept}
        </p>
      </div>

      {/* Footer Info */}
      <div className="
        mt-5 w-full pt-3 border-t border-white/10
        flex justify-between items-center text-xs
      ">
        <span className="text-white/60 font-medium">Batch {Year}</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-bold font-space-grotesk text-white">{cg} CGPA</span>
        </div>
      </div>
    </div>
  );
});

BrightMindsCard.displayName = "BrightMindsCard";

export default BrightMindsCard;