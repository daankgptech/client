import { useEffect, useState } from "react";
import { api } from "../../utils/Secure/api";
import { LuBook } from "react-icons/lu";
import { FiSave } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import SEO, { Breadcrumbs, seoConfig } from "../../utils/SEO";

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());
  const [color, setColor] = useState("sky"); // default Tailwind color
  const [expandedIds, setExpandedIds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(7);
  const [colorSelectOpen, setColorSelectOpen] = useState(false);

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
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
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

    setLoading(true);

    toast
      .promise(api.post("/diary", { text, color }), {
        loading: "Saving...",
        success: "Diary saved!",
        error: "Couldn't save.",
      })
      .then(() => {
        setText("");
        setColor("sky");
        fetchEntries();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const deleteEntry = (id) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">Wanna delete this diary?</span>

          <button
            onClick={async () => {
              try {
                await api.delete(`/diary/${id}`);
                setEntries((prev) => prev.filter((e) => e._id !== id));
                toast.success("Deleted successfully", {
                  id: t.id,
                  duration: 2000,
                });
              } catch {
                toast.error("Failed to delete entry", {
                  id: t.id,
                  duration: 3000,
                });
              }
            }}
            className="px-2 py-1 text-xs rounded bg-rose-500 text-white"
          >
            Delete
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2 py-1 text-xs rounded bg-gray-200"
          >
            Cancel
          </button>
        </div>
      ),
      { duration: Infinity }, // confirm should not auto-close
    );
  };
  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="container w-full min-h-screen px-4 py-6 bg-gray-100 dark:bg-gray-900">
      <SEO {...seoConfig.diary} />

      {/* header */}
      <div className="pb-4">
        <Breadcrumbs items={seoConfig.diary.breadcrumbs} />
      </div>
      <div className="container flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
          <LuBook className="w-5 h-5 text-rose-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Diary
        </h1>
      </div>

      <section className="px-1 md:container w-full grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* input */}
        <div className={`${currentStyle.bg} rounded-xl p-3 col-span-2`}>
          {/* top */}
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setColorSelectOpen(true)}
              className="
            px-2 py-1 text-[12px]
            rounded-md
            border border-gray-300 dark:border-gray-700
          "
            >
              {color}
            </button>

            <span className="text-[11px] text-gray-500">{formatTime(now)}</span>
          </div>

          {/* date */}
          <div className="flex justify-end mb-2 text-right">
            <div>
              <p className="text-[12px] text-gray-700 dark:text-gray-300">
                {formatDay(now)}
              </p>
              <p className="text-[11px] text-gray-500">{formatDate(now)}</p>
            </div>
          </div>

          <div className="bg-transparent relative">
            <div
              className={`absolute left-6 top-0 bottom-0 w-[2px] ${currentStyle.bg} opacity-40`}
            />

            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write..."
              className={`no-scrollbar
      w-full resize-none outline-none
      text-[14px] leading-7
      px-4 pl-10 py-3
      ${currentStyle.text}
      placeholder-gray-400
      bg-transparent
      bg-[linear-gradient(to_bottom,transparent_27px,#d1d5db_28px)]
      bg-[length:100%_28px]
    `}
            />
          </div>

          {/* action */}
          <div className="flex justify-end mt-2">
            <button
              onClick={addEntry}
              disabled={loading}
              className={`
            px-3 py-1.5 text-[12px]
            rounded-md
            ${currentStyle.text}
            disabled:opacity-50
          `}
            >
              {loading ? "..." : "Save"}
            </button>
          </div>
        </div>

        {/* entries */}
        <div className="col-span-1 grid grid-cols-1 gap-3 items-start">
          {visibleEntries.length === 0 && (
            <p className="text-[12px] text-gray-400 text-center">No entries</p>
          )}

          {visibleEntries.map((entry) => {
            const isExpanded = expandedIds.includes(entry._id);
            const entryStyle =
              COLOR_STYLES[entry.color || "sky"] || COLOR_STYLES.sky;

            return (
              <div
                key={entry._id}
                className={`
              rounded-xl p-3
              ${entryStyle.bg} ${entryStyle.text}
            `}
              >
                {/* header */}
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <p className={`text-[12px] ${entryStyle.date}`}>
                      {formatDay(entry.createdAt)}
                    </p>
                    <p className={`text-[11px] ${entryStyle.date}`}>
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">
                      {formatTime(entry.createdAt)}
                    </span>

                    <button
                      onClick={() => deleteEntry(entry._id)}
                      className="text-gray-400 hover:text-rose-500"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* text */}
                <p
                  className={`
                text-[12px] whitespace-pre-wrap
                ${isExpanded ? "" : "line-clamp-3"}
              `}
                >
                  {entry.text}
                </p>

                {/* expand */}
                {entry.text.length > 120 && (
                  <button
                    onClick={() => toggleExpand(entry._id)}
                    className={`text-[11px] mt-1 ${entryStyle.text}`}
                  >
                    {isExpanded ? "less" : "more"}
                  </button>
                )}
              </div>
            );
          })}
          {/* load more */}
          <div className="flex w-full items-center justify-center pt-2">
            {entries.length > visibleCount ? (
              <button
                onClick={() => setVisibleCount((v) => v + 7)}
                className="
            px-3 py-1.5 text-[12px]
            rounded-md
            border border-gray-300 dark:border-gray-700
            text-gray-600 dark:text-gray-300
          "
              >
                Load more
              </button>
            ) : (
              <p className="text-[11px] text-gray-400">End</p>
            )}
          </div>
        </div>
      </section>

      <SelectModal
        open={colorSelectOpen}
        title="Mood Color"
        options={colors}
        value={color}
        onSelect={(v) => setColor(v)}
        onClose={() => setColorSelectOpen(false)}
      />
    </div>
  );
}
const SelectModal = ({ open, title, options, value, onSelect, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div
        className="
          relative z-10
          w-[90%] max-w-sm
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-xl
          p-4
        "
      >
        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-rose-500"
          >
            ✕
          </button>
        </div>

        {/* options */}
        <div className="space-y-1 max-h-[45vh] overflow-y-auto no-scrollbar">
          {options.map((opt) => {
            const active = opt === value;

            return (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  onClose();
                }}
                className={`
                  w-full flex items-center
                  px-3 py-1.5 rounded-md
                  text-[12px]
                  transition-colors duration-150
                  ${
                    active
                      ? "bg-rose-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
