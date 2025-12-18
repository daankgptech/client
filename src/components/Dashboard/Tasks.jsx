import React, { useEffect, useState } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [permission, setPermission] = useState(Notification?.permission);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const addTask = () => {
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text: text.trim(),
      completed: false
    };

    setTasks(prev => [...prev, newTask]);
    setText("");

    if (permission === "granted") {
      new Notification("Task added", {
        body: newTask.text
      });
    }
  };

  const toggleTask = id => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-3xl
        bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        border border-rose-50
        dark:border-slate-700/50
        px-3 py-6 md:p-6
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

      {/* Header & Notification Toggle */}
      <div className="relative z-10 w-full flex justify-between items-center mb-4">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold">Tasks & Notes</h3>
        {permission !== "granted" && (
          <button 
            className="text-[10px] uppercase font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 underline underline-offset-4 decoration-rose-500/30"
            onClick={requestPermission}
          >
            Enable Alerts
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="relative z-10 w-full flex gap-2 mb-6">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a task"
          onKeyDown={e => e.key === "Enter" && addTask()}
          className="
            flex-1 bg-gray-400/40 dark:bg-slate-950/40 
            border border-white/20 dark:border-slate-800
            rounded-2xl px-2 md:px-4 py-1 md:py-2 text-sm
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-500 dark:placeholder:text-gray-600
            focus:outline-none focus:ring-2 focus:ring-rose-400/50
          "
        />
        <button 
          onClick={addTask}
          className="
            bg-rose-400 hover:bg-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500
            text-white px-2 md:px-4 py-1 md:py-2 rounded-2xl text-sm font-medium
            transition-all duration-200 active:scale-95
          "
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <ul className="relative z-10 w-full space-y-3 overflow-y-auto max-h-[250px] pr-1 custom-scrollbar">
        {tasks.length === 0 && (
          <li className="text-sm text-gray-500 dark:text-gray-500 italic text-center py-4">No tasks/notes yet</li>
        )}

        {tasks.map(task => (
          <li 
            key={task.id} 
            className="
              flex items-center justify-between group/item
              rounded-2xl bg-gray-400/20 dark:bg-slate-950/30 
              p-3 border border-white/10 dark:border-slate-800/50
              transition-all duration-200 hover:bg-gray-400/40 dark:hover:bg-slate-950/60
            "
          >
            <label className="flex items-center gap-3 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="
                  w-4 h-4 rounded-full border-2 border-rose-400/50 
                  text-rose-500 focus:ring-rose-400/50 focus:ring-offset-0 
                  bg-transparent transition-all checked:bg-rose-500
                "
              />
              <span className={`text-sm transition-all duration-300 ${
                task.completed 
                  ? "line-through text-gray-500 decoration-rose-500/50" 
                  : "text-gray-800 dark:text-gray-200"
              }`}>
                {task.text}
              </span>
            </label>

            <button 
              className="
                text-gray-400 hover:text-red-500 
                dark:text-gray-600 dark:hover:text-red-400
                text-xl leading-none transition-colors px-2
              " 
              onClick={() => deleteTask(task.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}