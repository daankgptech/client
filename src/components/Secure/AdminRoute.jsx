import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAdminAuthenticated = sessionStorage.getItem("adminAuthenticated") === "true";
  const hasToken = !!(localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken"));

  if (!isAdminAuthenticated && !hasToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
