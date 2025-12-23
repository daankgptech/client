import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaSave } from "react-icons/fa";

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
  const [remindTime, setRemindTime] = useState("");
  // Safely check for Notification API
  const [permission, setPermission] = useState(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Helper to schedule notification
  const scheduleReminder = (task) => {
    if (!task.remindAt || task.completed) return;

    const delay = new Date(task.remindAt).getTime() - Date.now();
    if (delay <= 0) return;

    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && Notification.permission === "granted") {
        new Notification("Task Reminder", {
          body: task.text,
          icon: "/favicon.ico" // Optional: add your icon path
        });
      }
    }, delay);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    // Re-schedule reminders on reload
    const timers = tasks.map(task => scheduleReminder(task));
    return () => timers.forEach(clear => clear && clear());
    // eslint-disable-next-line
  }, []);

  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  const addTask = async () => {
    if (!text.trim()) return;

    // If time is set but permission isn't granted, ask first
    if (remindTime && permission !== "granted") {
      await requestPermission();
    }

    const remindAt = remindTime ? new Date(remindTime).getTime() : null;

    const newTask = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      remindAt,
    };

    setTasks((prev) => [...prev, newTask]);
    setText("");
    setRemindTime("");

    if (remindAt) {
      scheduleReminder(newTask);
    }
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="group relative rounded-3xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-rose-50 dark:border-slate-700/50 px-3 py-6 md:p-6 transition-all duration-300 hover:border-gray-500/40 dark:hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-900/20 w-full h-full flex flex-col items-start overflow-hidden">
      {/* BACKGROUND LAYER: Hover Effect Only */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-100/5 via-transparent to-red-500/5 dark:from-rose-500/10 dark:to-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* CONTENT LAYER */}
      <div className="relative z-10 w-full flex justify-between items-center mb-4">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold">
          Tasks & Notes
        </h3>
        {permission !== "granted" && (
          <button
            onClick={requestPermission}
            className="text-[10px] uppercase font-bold text-rose-500 hover:text-rose-600 underline"
          >
            Enable Alerts
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="relative z-10 w-full flex justify-between items-center gap-2 mb-6 overflow-hidden">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task"
          className="flex-1 bg-gray-400/40 dark:bg-slate-950/40 border border-white/20 dark:border-slate-800 rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-rose-400/50 outline-none text-gray-800 dark:text-white transition-all duration-300"
        />

        <div className="relative px-1 py-[2px] md:p-3  flex items-center justify-center bg-gray-400/30 dark:bg-slate-950/40 border border-white/20 dark:border-slate-800 rounded-2xl hover:bg-gray-400/50 transition-all duration-300">
          <FaCalendarAlt className="text-gray-700 dark:text-gray-300 text-sm pointer-events-none" />
          <input
            type="datetime-local"
            value={remindTime}
            onChange={(e) => setRemindTime(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer [color-scheme:dark]"
          />
        </div>

        <button
          onClick={addTask}
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 active:scale-95"
        >
          <FaSave />
        </button>
      </div>

      {/* List Section */}
      <ul className="relative z-10 w-full space-y-3 max-h-[260px] overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <li className="text-sm text-gray-500 italic text-center py-4">
            No tasks yet
          </li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between rounded-2xl bg-gray-400/20 dark:bg-slate-950/30 p-3 border border-white/10 dark:border-slate-800/50"
            >
              <label className="flex items-center gap-3 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-4 h-4 rounded-full border-2 border-rose-400 accent-rose-500"
                />
                <div>
                  <p
                    className={`text-sm ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {task.text}
                  </p>
                  {task.remindAt && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      ⏰{" "}
                      {new Date(task.remindAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
              </label>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 text-xl px-2"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}