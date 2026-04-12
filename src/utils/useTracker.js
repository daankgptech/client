import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "./Secure/api";

const getSessionId = () => {
  let sessionId = localStorage.getItem("daan_session_id");
  if (!sessionId) {
    // Generate simple unique ID
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("daan_session_id", sessionId);
  }
  return sessionId;
};

const useTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const sessionId = getSessionId();
        await api.post("/track", {
          page: location.pathname,
          sessionId,
          referrer: document.referrer
        });
      } catch (error) {
        // Soft fail on tracking error to not interrupt UX
        console.error("Tracker error:", error);
      }
    };

    trackPageView();
  }, [location]);
};

export default useTracker;
