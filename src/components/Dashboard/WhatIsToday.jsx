import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cake, Calendar } from "lucide-react";
import Today from "./JSFiles/Today";
import { api } from "../../utils/Secure/api";
import { getCachedNotices, setCachedNotices } from "../../utils/noticeCache";

export default function WhatIsToday() {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayEvents = Today.filter((item) => item.date === todayStr);

  const [birthdays, setBirthdays] = useState(() => {
    const cached = getCachedNotices();
    if (cached?.data) {
      return cached.data.filter((item) => item.isBirthday);
    }
    return [];
  });

  useEffect(() => {
    let isMounted = true;
    const fetchBirthdayNotices = async () => {
      try {
        const res = await api.get("/notices");
        if (res.data?.success && Array.isArray(res.data.notices) && isMounted) {
          setCachedNotices(res.data.notices);
          const bdays = res.data.notices.filter((n) => n.isBirthday);
          setBirthdays(bdays);
        }
      } catch (err) {
        console.warn("Failed to fetch birthday notices for WhatIsToday:", err);
      }
    };

    fetchBirthdayNotices();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalItems = todayEvents.length + birthdays.length;
  if (totalItems === 0) return null;

  return (
    <div
      className="
        w-full h-full flex flex-col gap-3
        p-4
        rounded-xl
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-800
        transition-colors duration-150
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-rose-500" />
          What is Today
        </h3>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5">
        {/* Today's Birthdays */}
        {birthdays.map((bday, idx) => {
          const content = (
            <div
              className="
                rounded-lg
                bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent
                dark:bg-amber-950/30
                p-3
                border border-amber-400/40 dark:border-amber-500/30
                hover:border-amber-400 transition-all duration-200
                group cursor-pointer
              "
            >
              <div className="flex items-center gap-2 mb-1">
                <Cake className="w-4 h-4 text-amber-500 animate-bounce" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 dark:text-amber-400">
                  Today's Birthday 🎉
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-500 transition-colors">
                {bday.text}
              </p>
            </div>
          );

          if (bday.link) {
            return (
              <Link key={bday._id || `bday-${idx}`} to={bday.link}>
                {content}
              </Link>
            );
          }
          return <div key={bday._id || `bday-${idx}`}>{content}</div>;
        })}

        {/* Regular Scheduled Events */}
        {todayEvents.map((event, idx) => (
          <div
            key={idx}
            className="
              rounded-lg
              bg-gray-100 dark:bg-gray-800/80
              p-3
              border border-gray-200 dark:border-gray-700
            "
          >
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {event.name}
            </p>
            {event.description && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                {event.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
