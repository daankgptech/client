import React from "react";
import { FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FillForms() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/forms")}
      className="
    w-full h-full flex flex-col justify-between gap-3
    p-4
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    cursor-pointer
    hover:border-rose-400
    transition-colors duration-150
  "
    >
      {/* top */}
      <div className="flex justify-between items-center">
        <div className="p-1.5 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-500">
          <FileText size={16} />
        </div>

        <ChevronRight
          size={14}
          className="text-gray-400 group-hover:text-rose-500"
        />
      </div>

      {/* content */}
      <div>
        <h3 className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
          Awareness
        </h3>

        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Fill out Forms
        </p>
      </div>

      {/* minimal indicators */}
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-sm bg-rose-500" />
        <div className="w-2 h-2 rounded-sm bg-gray-300 dark:bg-gray-700" />
        <div className="w-2 h-2 rounded-sm bg-gray-300 dark:bg-gray-700" />
      </div>

      {/* footer */}
      <p className="text-[10px] text-gray-400">Quick submission</p>
    </div>
  );
}
