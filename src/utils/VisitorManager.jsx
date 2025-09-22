import { useEffect } from "react";
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const VisitorManager = ({ onCountUpdate, API_URL }) => {
  useEffect(() => {
    const updateVisitor = async () => {
      try {
        const hasVisited = sessionStorage.getItem("visited");
        let data;

        if (!hasVisited) {
          // Mark session as visited
          sessionStorage.setItem("visited", "true");

          // Hit backend to increment visitor count
          const res = await fetch(`${API_URL}/api/visitor/hit`, { method: "POST" });
          data = await res.json();
        } else {
          // Already visited in this session, just fetch current count
          const res = await fetch(`${API_URL}/api/visitor/count`);
          data = await res.json();
        }

        // Notify parent component
        if (onCountUpdate) onCountUpdate(data.count);
      } catch (err) {
        console.error("VisitorManager error:", err);
      }
    };

    updateVisitor();
  }, [onCountUpdate, API_URL]);

  return null; // this component does not render anything
};

export default VisitorManager;