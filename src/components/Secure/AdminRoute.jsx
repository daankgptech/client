import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAdminAuthenticated = sessionStorage.getItem("adminAuthenticated") === "true";

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
