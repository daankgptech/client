import React from "react";
import { UserCog, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpdateYourself() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/profile")}
      className="
    w-full h-full flex flex-col justify-between gap-3
    p-4
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    cursor-pointer
    hover:border-rose-400
    hover:bg-gray-50 dark:hover:bg-gray-800
    transition-colors duration-150
  "
    >
      {/* top */}
      <div className="flex justify-between items-center">
        <div className="p-1.5 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-500">
          <UserCog size={16} />
        </div>

        {/* subtle sparkle */}
        <div className="text-rose-400">
          <Sparkles size={12} />
        </div>
      </div>

      {/* content */}
      <div>
        <h3 className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
          Personal
        </h3>

        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Update Yourself
        </p>
      </div>

      {/* progress indicator (minimal) */}
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-4 bg-rose-500 rounded-sm" />
        <div className="w-1.5 h-4 bg-gray-300 dark:bg-gray-700 rounded-sm" />
        <div className="w-1.5 h-4 bg-gray-300 dark:bg-gray-700 rounded-sm" />
      </div>

      {/* footer */}
      <p className="text-[10px] text-gray-400">Profile completion</p>
    </div>
  );
}
