import { useEffect, useState, useRef } from "react";
import { FiEdit2 } from "react-icons/fi";
import { FaSave, FaCheck, FaStar, FaRegStar } from "react-icons/fa";

export default function Tasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      preferred: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setText("");
  };
  const togglePreferred = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, preferred: !task.preferred } : task
      )
    );
  };

  const toggleTask = (id, value) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: value ?? !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id) => {
    if (!editingText.trim()) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: editingText.trim() } : task
      )
    );
    setEditingId(null);
    setEditingText("");
  };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.preferred === b.preferred) return 0;
    return a.preferred ? -1 : 1;
  });

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-rose-50 dark:border-slate-700/50 px-2 py-4 md:p-4 lg:p-6 transition-all duration-300 hover:border-gray-500/40 dark:hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-900/20 w-full h-full flex flex-col items-start">
      {/* Hover background */}
      <div className=" pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-100/5 via-transparent to-red-500/5 dark:from-rose-500/10 dark:to-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="relative z-10 w-full mb-4">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold pl-2">
          To-Do
        </h3>
      </div>

      {/* Input */}
      <div className="relative z-10 flex gap-2 md:gap-4 lg:gap-6 mb-5 w-full">
        <AutoTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onEnter={addTask}
          // onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task"
          className="flex-1 min-w-0 bg-gray-400/40 dark:bg-slate-950/40 border border-white/30 dark:border-slate-800 rounded-3xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-500/60 outline-none text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />

        <button
          onClick={addTask}
          aria-label="Save Task"
          className="shrink-0 transition-all active:scale-95 hover:scale-105 flex items-center justify-center bg-gray-300 dark:bg-gray-900/20 text-red-500 dark:text-red-400 rounded-2xl px-4 py-1"
        >
          <FaSave />
        </button>
      </div>

      {/* List */}
      <ul className="relative z-10 flex-1 w-full space-y-2 overflow-y-auto pr-1">
        {sortedTasks.length === 0 ? (
          <li className="text-sm text-gray-500 italic text-center py-6">
            No tasks yet
          </li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center gap-2 rounded-3xl px-2 py-1 md:p-3 border transition-colors
                ${
                  task.preferred
                    ? "bg-fuchsia-400/20 border-fuchsia-400/40 shadow-md shadow-fuchsia-500/20"
                    : task.completed
                    ? "bg-emerald-400/10 border-emerald-400/30 shadow-md shadow-emerald-500/20"
                    : "bg-gray-400/20 dark:bg-slate-950/30 border-white/10 dark:border-slate-800/50"
                }`}
            >
              <label className="relative flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="peer sr-only"
                />

                <span
                  className="
      w-5 h-5 rounded-full
      border-2 border-gray-400 hover:border-emerald-400
      flex items-center justify-center
      transition-all duration-300
      peer-checked:bg-emerald-500
      peer-checked:border-emerald-500
      peer-hover:scale-105
      peer-checked:shadow-[0_0_12px_rgba(16,185,129,0.6)]
    "
                >
                  <svg
                    className="
        w-3 h-3 text-white
        scale-0
        transition-transform duration-200 ease-out
        peer-checked:scale-100
      "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </label>
              <div className="flex-1 min-w-0">
                {editingId === task.id ? (
                  <AutoTextarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                    className="w-full bg-transparent border-b border-yellow-400 text-sm outline-none text-gray-800 dark:text-white"
                  />
                ) : (
                  <p
                    className={`text-xs md:text-sm ${
                      task.completed
                        ? "line-through text-emerald-600 dark:text-emerald-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {task.text}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                {editingId === task.id ? (
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="text-emerald-500 hover:text-emerald-600 p-1"
                  >
                    <FaCheck />
                  </button>
                ) : (
                  <>
                    {/* <button
                      onClick={() => toggleTask(task.id, true)}
                      className="text-emerald-500 hover:text-emerald-600 p-1"
                      title="Mark completed"
                    >
                      <FaCheck />
                    </button> */}
                    <button
                      onClick={() => togglePreferred(task.id)}
                      className={`p-[2px] md:p-1 transition-all duration-300 hover:scale-125 ${
                        task.preferred
                          ? "text-fuchsia-500"
                          : "text-gray-400 hover:text-fuchsia-500"
                      }`}
                      title="Star it."
                    >
                      {task.preferred ? <FaStar /> : <FaRegStar />}
                      {/* <FiZap /> */}
                    </button>
                    <button
                      onClick={() => startEdit(task)}
                      className="text-gray-400 hover:text-blue-500 p-[2px] md:p-1 transition-all duration-300 hover:scale-125"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-red-500 p-[2px] md:p-1 font-bold transition-all duration-300 hover:scale-125"
                      title="Delete"
                    >
                      X{/* <FaTrash /> */}
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
export function AutoTextarea({
  value,
  onChange,
  onEnter,
  placeholder = "Type...",
  className = "",
  ...props
}) {
  const ref = useRef(null);

  // 👇 THIS is the missing piece
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!value) {
      el.style.height = "auto"; // back to row=1
    }
  }, [value]);

  const handleChange = (e) => {
    onChange(e);

    const el = ref.current;
    el.style.height = "auto";

    if (e.target.value) {
      el.style.height = el.scrollHeight + "px";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter?.();
    }
  };

  return (
    <textarea
      ref={ref}
      value={value}
      rows={1}
      placeholder={placeholder}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={`resize-none overflow-hidden ${className}`}
      {...props}
    />
  );
}
