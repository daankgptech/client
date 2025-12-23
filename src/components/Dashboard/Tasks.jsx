import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";

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

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setText("");
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
      </div>

      {/* Input Section */}
      <div className="relative z-10 w-full flex justify-between items-center gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task"
          className="flex-1 bg-gray-400/40 dark:bg-slate-950/40 border border-white/20 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-400/50 outline-none text-gray-800 dark:text-white transition-all duration-300 placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />

        <button
          onClick={addTask}
          aria-label="Save Task"
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300 active:scale-95 shadow-lg shadow-rose-500/20 flex items-center justify-center"
        >
          <FaSave className="text-base" />
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
