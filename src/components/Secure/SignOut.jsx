import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../utils/Secure/api";
import { FiLogOut, FiX } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../utils/Secure/AuthContext";

export default function SignOut() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await api.post("/signout");
      logout(); // 🔑 this updates navbar instantly
      toast.success("Signed out");
      navigate("/", { replace: true });
    } catch {
      toast.error("Sign out failed");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className="
      fixed inset-0 z-40
      bg-black/30
      backdrop-blur-sm
      transition-opacity duration-300
    "
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="
        group relative w-full max-w-sm
        rounded-3xl p-8
        bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        border border-gray-300/70 dark:border-gray-700
        shadow-2xl shadow-rose-200/30 dark:shadow-red-900/30
        animate-scaleIn
        transition-all duration-500
      "
        >
          {/* Ambient glow */}
          <div
            className="
          pointer-events-none absolute inset-0
          bg-gradient-to-br from-rose-300/10 via-transparent to-red-500/10
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
        "
          />

          {/* Icon */}
          <div
            className=" relative z-10 mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/15 to-red-500/15 text-rose-600 dark:text-rose-400 " >
            <FiLogOut size={26} />
          </div>
          {/* Text */}
          <h2 className="relative z-10 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Sign out?
          </h2>
          <p className="relative z-10 mt-2 text-sm text-gray-600 dark:text-gray-400">
            You’ll need to sign in again to access your account.
          </p>
          {/* Actions */}
          <div className="relative z-10 mt-7 flex gap-3">
            <button
              onClick={close}
              className="
            flex-1 flex items-center justify-center gap-2
            rounded-xl px-4 py-2.5
            text-sm font-medium
            border border-gray-300 dark:border-gray-700
            text-gray-700 dark:text-gray-300
            bg-gray-100/60 dark:bg-gray-800/60
            hover:bg-gray-200/70 dark:hover:bg-gray-700/70
            transition-all duration-300
          "
            >
              <FiX size={16} />
              Cancel
            </button>
            <button
              onClick={signOut}
              disabled={loading}
              className="
            flex-1 flex items-center justify-center gap-2
            rounded-xl px-4 py-2.5
            text-sm font-medium text-white
            bg-gradient-to-r from-rose-600 to-red-600
            shadow-md shadow-rose-300/40 dark:shadow-red-900/40
            hover:scale-[1.03]
            hover:shadow-lg
            active:scale-[0.97]
            transition-all duration-300 disabled:opacity-60
          "
            >
              <FiLogOut size={16} />
              {loading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}