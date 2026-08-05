import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../../utils/Secure/api";

export default function AdminRoute({ children }) {
  const [verifying, setVerifying] = useState(true);
  const [authorized, setAuthorized] = useState(() => {
    const isAuth = sessionStorage.getItem("adminAuthenticated") === "true";
    const hasToken = !!(localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken"));
    return isAuth && hasToken;
  });

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
      if (!token) {
        setAuthorized(false);
        setVerifying(false);
        return;
      }

      try {
        const res = await api.get("/admin/verify");
        if (res.data?.success && res.data?.authenticated) {
          setAuthorized(true);
          sessionStorage.setItem("adminAuthenticated", "true");
        } else {
          setAuthorized(false);
          sessionStorage.removeItem("adminAuthenticated");
          sessionStorage.removeItem("adminToken");
          localStorage.removeItem("adminToken");
        }
      } catch (err) {
        setAuthorized(false);
        sessionStorage.removeItem("adminAuthenticated");
        sessionStorage.removeItem("adminToken");
        localStorage.removeItem("adminToken");
      } finally {
        setVerifying(false);
      }
    };

    checkAdmin();
  }, []);

  if (verifying && !authorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-space-grotesk">
        <div className="flex flex-col items-center gap-3 p-6 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-white/70">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
