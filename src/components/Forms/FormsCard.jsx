import React, { useState, memo } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import ResponsePercentage from "./ResponsePercentage";

const FormsCard = memo(({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border overflow-hidden
        transition-all duration-300 ease-out will-change-transform
        ${
          item.isExceeded
            ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-90"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:-translate-y-1 hover:shadow-md hover:shadow-rose-200/40 dark:hover:shadow-rose-900/20 hover:border-rose-200 dark:hover:border-rose-900/30"
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
              ${item.isExceeded ? "grayscale" : "group-hover:scale-[1.04]"}`}
          />

          {!item.isExceeded && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold text-white bg-rose-500/90 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Active
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <h2
            className={`text-lg font-semibold leading-snug transition-colors
              ${
                item.isExceeded
                  ? "text-gray-500"
                  : "text-gray-900 dark:text-white group-hover:text-rose-500"
              }`}
          >
            {item.title}
          </h2>

          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {item.desc}
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
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
        className={`mt-auto border-t border-gray-100 dark:border-gray-800 
        ${item.isExceeded ? "bg-gray-100/40 dark:bg-gray-800/30" : "bg-white dark:bg-gray-900"}`}
      >
        {item.isExceeded ? (
          <div className="p-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition"
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
            className="block w-full text-center py-3 text-sm font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 transition-colors"
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
