import { Navigate } from "react-router-dom";
import { useAuth } from "../../utils/Secure/AuthContext";

export default function ProtectedRoute({ children, redirect = false }) {
  const { isAuthenticated, loading } = useAuth();

  // While checking auth, show a small inline spinner
  if (loading)
    return (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center mt-14">
      <div className="h-10 w-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
    );

  if (!isAuthenticated) {
    return redirect ? <Navigate to="/signin" replace /> : null;
  }

  return children;
}