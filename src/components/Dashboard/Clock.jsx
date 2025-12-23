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
  const progress = Math.round((dayOfYear / totalDays) * 100);

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
    w-full h-full flex flex-col justify-evenly items-start
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
      {/* <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold">Clock</h3> */}
      {/* Date */}
      <p className="relative z-10 mt-2 text-gray-800 dark:text-gray-300 text-sm">
        {formatDate(now)}
      </p>

      {/* Time */}
      <p
        className="
      relative z-10 mt-1
      text-4xl sm:text-5xl
      font-semibold
      text-rose-400
      dark:text-rose-500
      tabular-nums
      tracking-tight
    "
      >
        {now.toLocaleTimeString()}
      </p>

      {/* Meta info */}
      <div
        className="
      relative z-10 mt-5
      grid grid-cols-3 gap-3
      text-xs text-gray-400 w-full justify-between items-stretch
    "
      >
        {/* Box 1 */}
        <div className="rounded-3xl bg-gray-400/60 dark:bg-slate-950/40 p-2 text-center border dark:border-slate-800">
          <p className="text-gray-900 dark:text-gray-100 font-medium">
            {dayOfYear}
          </p>
          <p className="mt-0.5 text-gray-700 dark:text-gray-500">Day</p>
        </div>

        {/* Box 2 */}
        <div className="rounded-3xl bg-gray-400/60 dark:bg-slate-950/40 p-2 text-center border dark:border-slate-800">
          <p className="text-gray-900 dark:text-gray-100 font-medium">
            {weekOfYear}
          </p>
          <p className="mt-0.5 text-gray-700 dark:text-gray-500">Week</p>
        </div>

        {/* Box 3 */}
        <div className="rounded-3xl bg-gray-400/60 dark:bg-slate-950/40 p-2 text-center border dark:border-slate-800">
          <p className="text-gray-900 dark:text-gray-100 font-medium">
            {daysLeft}
          </p>
          <p className="mt-0.5 text-gray-700 dark:text-gray-500">Left</p>
        </div>
      </div>
      {/* Progress  */}
      <div className="relative z-10 space-y-1 w-full mt-4">
        <progress
          max={100}
          value={progress}
          className="w-full h-2.5
            appearance-none
            rounded-full overflow-hidden
            [&::-webkit-progress-bar]:bg-gray-400
            dark:[&::-webkit-progress-bar]:bg-gray-700

            [&::-webkit-progress-value]:bg-gradient-to-r
            [&::-webkit-progress-value]:from-rose-500
            [&::-webkit-progress-value]:to-red-500
            [&::-webkit-progress-value]:transition-all
            [&::-webkit-progress-value]:duration-700
            [&::-webkit-progress-value]:ease-out

            [&::-moz-progress-bar]:bg-gradient-to-r
            [&::-moz-progress-bar]:from-rose-500
            [&::-moz-progress-bar]:to-red-500"
        />
        <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400">
          <span>Year progress</span>
          <span className="text-rose-500 font-medium">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
