import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../../utils/Secure/api";

export default function ProtectedRoute({
  children,
  fallback = null,
  redirect = false
}) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/me");
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return null;

  if (!authenticated) {
    return redirect ? <Navigate to="/signin" replace /> : fallback;
  }

  return children;
}