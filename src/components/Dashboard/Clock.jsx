import { useEffect, useState } from "react";
import "./dashboard.css";
const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
};

const getWeekOfYear = (date) => {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDay) / 86400000);
  return Math.ceil((days + firstDay.getDay() + 1) / 7);
};

const formatDate = (date) =>
  date.toLocaleDateString("en-IN", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayOfYear = getDayOfYear(now);
  const weekOfYear = getWeekOfYear(now);
  const daysLeft = (now.getFullYear() % 4 === 0 ? 366 : 365) - dayOfYear;
  const totalDays = now.getFullYear() % 4 === 0 ? 366 : 365;
  const progress = Number(((dayOfYear / totalDays) * 100).toFixed(2));

  return (
    <div
      className="
    w-full h-full flex flex-col gap-4
    p-4
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
  "
    >
      {/* date */}
      <p className="text-[12px] text-gray-600 dark:text-gray-400">
        {formatDate(now)}
      </p>

      {/* time */}
      <p className="text-xl font-semibold text-rose-500 tabular-nums">
        {now.toLocaleTimeString()}
      </p>

      {/* meta */}
      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
          <p className="text-gray-800 dark:text-gray-100">{dayOfYear}</p>
          <p className="text-gray-400">Day</p>
        </div>

        <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
          <p className="text-gray-800 dark:text-gray-100">{weekOfYear}</p>
          <p className="text-gray-400">Week</p>
        </div>

        <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
          <p className="text-gray-800 dark:text-gray-100">{daysLeft}</p>
          <p className="text-gray-400">Left</p>
        </div>
      </div>

      {/* progress */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-gray-400">
          <span>Year</span>
          <span className="text-rose-500">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
