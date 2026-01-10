import { useEffect, useState } from "react";
import { api } from "../../utils/Secure/api";
import { FiSave } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());
  const [color, setColor] = useState("sky"); // default Tailwind color
  const [expandedIds, setExpandedIds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(7);

  // Tailwind color map
  const COLOR_STYLES = {
    sky: {
      bg: "bg-sky-100 dark:bg-sky-900/20 hover:border border-sky-200 dark:border-sky-800",
      text: "text-sky-700 dark:text-sky-400",
      date: "text-sky-600 dark:text-sky-500",
    },
    rose: {
      bg: "bg-rose-100 dark:bg-rose-900/20 hover:border border-rose-200 dark:border-rose-800",
      text: "text-rose-700 dark:text-rose-400",
      date: "text-rose-600 dark:text-rose-500",
    },
    yellow: {
      bg: "bg-yellow-100 dark:bg-yellow-900/20 hover:border border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-700 dark:text-yellow-400",
      date: "text-yellow-500 dark:text-yellow-500",
    },
    green: {
      bg: "bg-green-100 hover:border border-green-200 dark:border-green-800 dark:bg-green-900/20",
      text: "text-green-700 dark:text-green-400",
      date: "text-green-500 dark:text-green-500",
    },
    violet: {
      bg: "bg-violet-100 dark:bg-violet-900/20 hover:border border-violet-200 dark:border-violet-800",
      text: "text-violet-700 dark:text-violet-400",
      date: "text-violet-500 dark:text-violet-500",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/20 hover:border border-purple-200 dark:border-purple-800",
      text: "text-purple-700 dark:text-purple-400",
      date: "text-purple-500 dark:text-purple-500",
    },
    pink: {
      bg: "bg-pink-100 dark:bg-pink-900/20 hover:border border-pink-200 dark:border-pink-800",
      text: "text-pink-700 dark:text-pink-400",
      date: "text-pink-500 dark:text-pink-500",
    },
    indigo: {
      bg: "bg-indigo-100 dark:bg-indigo-900/20 hover:border border-indigo-200 dark:border-indigo-800",
      text: "text-indigo-700 dark:text-indigo-400",
      date: "text-indigo-500 dark:text-indigo-500",
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/20 hover:border border-orange-200 dark:border-orange-800",
      text: "text-orange-700 dark:text-orange-400",
      date: "text-orange-500 dark:text-orange-500",
    },
  };

  // available colors for dropdown
  const colors = Object.keys(COLOR_STYLES);

  // style for currently selected color (editor)
  const currentStyle = COLOR_STYLES[color] || COLOR_STYLES.sky;

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const visibleEntries = entries.slice(0, visibleCount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formatDay = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const fetchEntries = async () => {
    try {
      const res = await api.get("/diary");
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getLineClamp = (expanded) =>
    expanded ? "" : "line-clamp-3 md:line-clamp-4 lg:line-clamp-5";
  const getPaperTexture = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const size = 12 + (hash % 6);
    return `${size}px ${size}px`;
  };
  const addEntry = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      await api.post("/diary", { text, color });
      setText("");
      setColor("sky"); // reset correctly
      fetchEntries();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-900 transition-colors container">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          My Diary
        </h1>

        {/* Left: color picker + time */}
        <div className={`${currentStyle.bg} rounded-3xl p-3 mb-4`}>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="ml-4 pl-2 pr-4 py-1 rounded-full border border-gray-300 dark:border-neutral-700 bg-transparent text-xs focus:outline-none"
          >
            {colors.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <div className="pl-4 flex justify-between items-start mb-4 ">
            <span className="text-sm mt-3 font-mono text-gray-600 dark:text-gray-400 transition-all duration-500">
              {formatTime(now)}
            </span>

            {/* Right: date */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatDay(now)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(now)}
              </p>
            </div>
          </div>
          {/* Write box – diary paper style */}
          <div
            className={`relative rounded-3xl mb-8 transition-all bg-transparent`}
          >
            <div
              className="absolute left-7 md:left-9 top-0 h-full w-px opacity-20"
              style={{ backgroundColor: "currentColor" }}
            />
            <div className="relative p-5 pl-10 transition-all duration-300 group">
              <textarea
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write what’s on your mind…"
                className={`w-full bg-transparent resize-none outline-none leading-[31px]
  ${currentStyle.text}
  placeholder-gray-400 text-xs md:text-sm -translate-y-[11px]
  transition-all duration-300
  group-hover:blur-[0.2px]
  group-hover:opacity-[0.96]`}
              />
              <span
                className={`absolute left-8 md:left-10 top-[22px] w-[2px] h-5 ${currentStyle.text}
  animate-pulse opacity-0 group-focus-within:opacity-70 pointer-events-none`}
                style={{
                  transform: "translateY(calc(var(--caret-line, 0) * 31px))",
                }}
              />

              <div className="flex absolute bottom-0 right-0 justify-end mt-3">
                <button
                  onClick={addEntry}
                  disabled={loading}
                  className={` px-3 py-1 font-bold italic rounded-3xl ${currentStyle.text} hover:scale-105 disabled:opacity-60 transition-all duration-300`}
                >
                  {loading ? <FaSpinner /> : <FiSave />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Entries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6 transition-all duration-300">
          {visibleEntries.length === 0 && (
            <p className="text-gray-400 dark:text-gray-500 text-center mt-4">
              No diary entries yet.
            </p>
          )}

          {visibleEntries.map((entry) => {
            const isExpanded = expandedIds.includes(entry._id);
            const entryStyle =
              COLOR_STYLES[entry.color || "sky"] || COLOR_STYLES.sky;

            return (
              <div
                key={entry._id}
                className={`relative rounded-3xl p-5 shadow-sm hover:shadow-md
  transition-all duration-300 animate-fadeIn
  ${entryStyle.bg} ${entryStyle.text}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className={`text-sm font-medium ${entryStyle.date}`}>
                      {formatDay(entry.createdAt)}
                    </p>
                    <p className={`text-xs ${entryStyle.date}`}>
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400">
                    {formatTime(entry.createdAt)}
                  </span>
                </div>
                {/* Paper texture */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    backgroundImage: `
      radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)
    `,
                    backgroundSize: getPaperTexture(entry._id),
                    opacity: 0.4,
                  }}
                />

                <p
                  className={`leading-relaxed whitespace-pre-wrap ${getLineClamp(
                    isExpanded
                  )}`}
                >
                  {entry.text}
                </p>

                {(entry.text.split("\n").length > 3 ||
                  entry.text.length > 150) && (
                  <button
                    onClick={() => toggleExpand(entry._id)}
                    className={`${entryStyle.text} font-bold italic text-sm mt-1 hover:underline transition-all duration-300`}
                  >
                    {isExpanded ? "...less" : "...more"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          {entries.length > visibleCount ? (
            <button
              onClick={() => setVisibleCount((v) => v + 7)}
              className="px-6 py-2 rounded-3xl border border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-gray-400 hover:scale-105 transition-all duration-300"
            >
              Load more
            </button>
          ) : (
            <p className="text-xs text-gray-400 mt-4">That’s everything.</p>
          )}
        </div>
      </div>
    </div>
  );
}
