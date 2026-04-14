import { useEffect, useState, useRef } from "react";
import { FiEdit2 } from "react-icons/fi";
import { FaSave, FaCheck, FaStar, FaRegStar, FaSpinner } from "react-icons/fa";
import { api } from "../../utils/Secure/api";
import toast from "react-hot-toast";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!text.trim()) return;

    try {
      setActionLoading("add");
      const response = await api.post("/tasks", { text: text.trim() });
      setTasks((prev) => [...prev, response.data]);
      setText("");
      toast.success("Task added");
    } catch (error) {
      console.error("Add task error:", error);
      toast.error("Failed to add task");
    } finally {
      setActionLoading(null);
    }
  };

  const togglePreferred = async (id) => {
    try {
      setActionLoading(`preferred-${id}`);
      const response = await api.patch(`/tasks/${id}/preferred`);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data : task)),
      );
    } catch (error) {
      console.error("Toggle preferred error:", error);
      toast.error("Failed to update task");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleTask = async (id) => {
    try {
      setActionLoading(`toggle-${id}`);
      const response = await api.patch(`/tasks/${id}/toggle`);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data : task)),
      );
    } catch (error) {
      console.error("Toggle task error:", error);
      toast.error("Failed to update task");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteTask = async (id) => {
    try {
      setActionLoading(`delete-${id}`);
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted");
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task");
    } finally {
      setActionLoading(null);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditingText(task.text);
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;

    try {
      setActionLoading(`edit-${id}`);
      const response = await api.put(`/tasks/${id}`, {
        text: editingText.trim(),
      });
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data : task)),
      );
      setEditingId(null);
      setEditingText("");
      toast.success("Task updated");
    } catch (error) {
      console.error("Save edit error:", error);
      toast.error("Failed to update task");
    } finally {
      setActionLoading(null);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.preferred === b.preferred) return 0;
    return a.preferred ? -1 : 1;
  });

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
      {/* Header */}
      <div>
        <h3 className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
          To-Do
        </h3>
      </div>

      {/* Input */}
      <div className="flex gap-2 w-full">
        <AutoTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onEnter={addTask}
          placeholder="Add a task"
          className="
        flex-1 min-w-0
        bg-gray-50 dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg px-3 py-2
        text-sm
        text-gray-800 dark:text-gray-100
        placeholder:text-gray-400
        focus:outline-none focus:ring-1 focus:ring-gray-400
      "
        />

        <button
          onClick={addTask}
          disabled={actionLoading === "add"}
          className="
        px-3 rounded-md
        bg-gray-200 dark:bg-gray-700
        text-gray-700 dark:text-gray-200
        hover:opacity-80
        transition
        disabled:opacity-50
      "
        >
          {actionLoading === "add" ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaSave />
          )}
        </button>
      </div>

      {/* List */}
      <ul className="flex-1 w-full space-y-2 overflow-y-auto pr-1">
        {loading ? (
          <li className="text-sm text-gray-500 italic text-center py-4">
            Loading tasks...
          </li>
        ) : sortedTasks.length === 0 ? (
          <li className="text-sm text-gray-500 italic text-center py-4">
            No tasks yet
          </li>
        ) : (
          sortedTasks.map((task) => (
            <li
              key={task._id}
              className={`
            flex items-center gap-2
            rounded-lg px-2 py-2
            border
            ${
              task.preferred
                ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                : task.completed
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }
          `}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id)}
                disabled={actionLoading === `toggle-${task._id}`}
                className="accent-green-500"
              />

              {/* Text */}
              <div className="flex-1 min-w-0">
                {editingId === task._id ? (
                  <AutoTextarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(task._id)}
                    className="
                  w-full bg-transparent border-b
                  border-gray-300 dark:border-gray-600
                  text-sm outline-none
                  text-gray-800 dark:text-white
                "
                  />
                ) : (
                  <p
                    className={`text-sm ${
                      task.completed
                        ? "line-through text-green-600 dark:text-green-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {task.text}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 text-gray-400">
                {editingId === task._id ? (
                  <button
                    onClick={() => saveEdit(task._id)}
                    disabled={actionLoading === `edit-${task._id}`}
                    className="hover:text-green-500"
                  >
                    {actionLoading === `edit-${task._id}` ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaCheck />
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => togglePreferred(task._id)}
                      disabled={actionLoading === `preferred-${task._id}`}
                      className={`
                    hover:text-purple-500
                    ${task.preferred ? "text-purple-500" : ""}
                  `}
                    >
                      {task.preferred ? <FaStar /> : <FaRegStar />}
                    </button>

                    <button
                      onClick={() => startEdit(task)}
                      className="hover:text-blue-500"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() => deleteTask(task._id)}
                      disabled={actionLoading === `delete-${task._id}`}
                      className="hover:text-red-500"
                    >
                      {actionLoading === `delete-${task._id}` ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        "×"
                      )}
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!value) {
      el.style.height = "auto";
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
