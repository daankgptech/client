import Today from "./JSFiles/Today";

export default function WhatIsToday() {
  const todayStr = new Date().toISOString().split("T")[0];

  const todayEvents = Today.filter((item) => item.date === todayStr);

  if (todayEvents.length === 0) return null;

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
      {/* header */}
      <h3 className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
        What is Today
      </h3>

      {/* content */}
      {todayEvents.length === 0 ? (
        <p className="text-xs text-gray-500 italic">No events scheduled</p>
      ) : (
        <div className="flex flex-col gap-2">
          {todayEvents.map((event, idx) => (
            <div
              key={idx}
              className="
            rounded-md
            bg-gray-100 dark:bg-gray-800
            px-3 py-2
            border border-gray-200 dark:border-gray-700
          "
            >
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {event.name}
              </p>

              {event.description && (
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
