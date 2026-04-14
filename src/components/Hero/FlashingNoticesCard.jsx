import { useState, useEffect } from "react";
import {
  Sparkles,
  Palmtree,
  Calendar,
  AlertCircle,FileText,
  GraduationCap,
  BellRing,
} from "lucide-react";

const notices = [
  // {
  //   text: "Farewell 2026",
  //   date: "Apr 11, 2026",
  //   icon: GraduationCap,
  //   tag: "Event",
  // },
  {
    text: "EndSem Exams",
    date: "Apr 18-30, 2026",
    icon: Calendar,
    tag: "Academic",
  },
  {
    text: "Switch Over to Dual Degree, Last Date",
    date: "Apr 30, 2026",
    icon: Calendar,
    tag: "Academic",
  },
  {
    text: "Summer Break",
    date: "Apr 30 - Jul 15, 2026",
    icon: Palmtree,
    tag: "Holiday",
  },
  { text: "Registration for Summer Quarter classes and Supplementary Exams", date: "May 09 - May 12, 2026", icon: FileText, tag: "Deadline" },
  // { text: "EndSem Exams", date: "Apr 22-30, 2026", icon: Calendar, tag: "Academic" },
];

export default function FlashingNoticesCard() {
  const [currentNotice, setCurrentNotice] = useState(0);

  // Cycle through notices with subtle animation
  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const notice = notices[currentNotice];
  const IconComponent = notice.icon;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 relative z-10">
      {/* Main Notice Card */}
      <div className="relative group">
        {/* Animated border glow */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-orange-400 via-rose-500 to-red-500 opacity-60 group-hover:opacity-100 blur-sm group-hover:blur-md transition-all duration-500 animate-gradient-rotate" />

        {/* Card content */}
        <div className="relative backdrop-blur-xl rounded-2xl border border-gray-300/50 dark:border-white/10 bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/5 bg-gradient-to-r from-orange-100 via-rose-50 to-gray-100 dark:bg-gradient-to-r dark:from-orange-500/10 dark:via-rose-500/5 dark:to-gray-500/10">
            <div className="flex items-center gap-2">
              <div className="relative">
                <BellRing className="w-4 h-4 text-orange-600 dark:text-orange-400 animate-shake" />
                {/* <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" /> */}
              </div>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 tracking-wide uppercase">
                Notice Board
              </span>
            </div>
          </div>

          {/* Carousel Notice */}
          <div className="relative p-5 min-h-[120px] flex items-center">
            {/* Navigation dots */}
            <div className="absolute top-3 right-4 flex gap-1.5">
              {notices.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentNotice(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === currentNotice
                      ? "bg-orange-500 dark:bg-orange-400 w-4"
                      : "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500"
                  }`}
                  aria-label={`Go to notice ${i + 1}`}
                />
              ))}
            </div>

            {/* Notice Content */}
            <div className="flex items-start gap-4 w-full">
              {/* Icon */}
              <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-500/20 dark:to-rose-500/20 border border-orange-200 dark:border-orange-500/20">
                <IconComponent className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gradient-to-r from-orange-100 to-rose-100 dark:from-orange-500/20 dark:to-rose-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30">
                    {notice.tag}
                  </span>
                </div>
                <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-800 dark:text-white mb-1">
                  {notice.text}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {notice.date}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-[2px] bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <div
              key={currentNotice}
              className="h-full bg-gradient-to-r from-orange-400 via-rose-500 to-red-500 animate-progress"
            />
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes gradient-rotate {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-rotate {
          background-size: 200% 200%;
          animation: gradient-rotate 4s ease infinite;
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
        .animate-shake {
          animation: shake 2s ease-in-out infinite;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 4s linear;
        }
      `}</style>
    </div>
  );
}
