import { useEffect, useState } from "react";
import fortunes from "./JSFiles/Data";

export default function FortuneCookie() {
  const [fortune, setFortune] = useState("");

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("dailyFortune");

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        setFortune(parsed.text);
        return;
      }
    }

    const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortune(pick);

    localStorage.setItem(
      "dailyFortune",
      JSON.stringify({ date: today, text: pick }),
    );
  }, []);

  return (
    <div
      className="
    w-full h-full flex flex-col gap-3
    p-4
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
  "
    >
      {/* header */}
      <h3 className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
        Fortune
      </h3>

      {/* content */}
      <div className="min-h-[80px] flex items-center justify-center text-center px-2">
        <p
          className="
        text-[13px] italic leading-relaxed
        text-gray-700 dark:text-gray-300
        before:content-['“'] after:content-['”']
        before:text-gray-300 after:text-gray-300
        before:mr-1 after:ml-1
      "
        >
          {fortune || "Tap for a thought"}
        </p>
      </div>
    </div>
  );
}
