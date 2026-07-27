import React, { useState, memo } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import ResponsePercentage from "./ResponsePercentage";

const FormsCard = memo(({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`group relative flex flex-col overflow-hidden
        transition-all duration-300 ease-out will-change-transform p-5
        ${
          item.isExceeded
            ? "bg-black/50 border-white/5 opacity-80"
            : "bg-transparent border-white/10 hover:bg-white/5 hover:border-white/20 hover:-translate-y-1"
        }`}
    >
      <Link
        to={item.isExceeded ? "#" : item.to}
        className={`flex-grow ${item.isExceeded ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={item.img}
            alt={item.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 
              ${item.isExceeded ? "grayscale" : "grayscale group-hover:grayscale-0 group-hover:scale-[1.04]"}`}
          />

          {!item.isExceeded && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold text-white bg-primary/90 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Active
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <h2
            className={`text-lg font-bold leading-snug transition-colors
              ${
                item.isExceeded
                  ? "text-white/40"
                  : "text-white group-hover:text-primary"
              }`}
          >
            {item.title}
          </h2>

          <p className="text-xs md:text-sm text-white/60 line-clamp-2 leading-relaxed">
            {item.desc}
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] font-medium uppercase tracking-wide text-white/40">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Until{" "}
              {item.deadlineDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div
        className={`mt-auto border-t border-white/10 
        ${item.isExceeded ? "bg-white/5" : "bg-transparent"}`}
      >
        {item.isExceeded ? (
          <div className="p-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:bg-white/5 rounded-lg transition"
            >
              {isOpen ? "Hide Insights" : "View Insights"}
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Smooth expand */}
            <div
              className={`transition-all duration-300 ease-out overflow-hidden
                ${isOpen ? "max-h-[400px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
            >
              <div className="px-3 pb-3">
                <ResponsePercentage formData={item} />
              </div>
            </div>
          </div>
        ) : (
          <Link
            to={item.to}
            className="block w-full text-center py-3 text-sm font-medium text-primary hover:text-white transition-colors"
          >
            Fill Form →
          </Link>
        )}
      </div>
    </div>
  );
});

FormsCard.displayName = "FormsCard";
export default FormsCard;
