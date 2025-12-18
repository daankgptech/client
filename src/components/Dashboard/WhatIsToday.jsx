import Today from "./JSFiles/Today";

export default function WhatIsToday() {
  const todayStr = new Date().toISOString().split("T")[0];

  const todayEvents = Today.filter(item => item.date === todayStr);

  if (todayEvents.length === 0) return null;

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
    w-full h-full flex flex-col items-start
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

  {/* Header */}
  <div className="relative z-10 w-full mb-4">
    <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400/80 font-bold">What is Today</h3>
  </div>

  {/* Events List */}
  <div className="relative z-10 w-full space-y-3">
    {todayEvents.length === 0 ? (
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">No events scheduled</p>
    ) : (
      todayEvents.map((event, idx) => (
        <div 
          key={idx} 
          className="
            rounded-3xl 
            bg-gray-400/40 dark:bg-slate-950/40 
            p-3 border border-white/20 dark:border-slate-800
            transition-transform duration-300 
          "
        >
          <p className="text-sm  text-gray-700 dark:text-rose-400/90">
            {event.name}
          </p>
          {event.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {event.description}
            </p>
          )}
        </div>
      ))
    )}
  </div>
</div>
  );
}
