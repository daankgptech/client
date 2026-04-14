import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
      {/* backdrop */}
      <div onClick={close} className="fixed inset-0 z-40 bg-black/40" />

      {/* modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="
        w-full max-w-sm
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-800
        rounded-xl
        p-4
      "
        >
          {/* icon */}
          <div className="mb-3 flex justify-center text-rose-500">
            <FiLogOut size={18} />
          </div>

          {/* text */}
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center">
            Sign out?
          </h2>
          <p className="text-[12px] text-gray-500 mt-1 text-center">
            You’ll need to sign in again
          </p>

          {/* actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={close}
              className="
            flex-1 flex items-center justify-center gap-1
            px-3 py-1.5
            text-[12px]
            rounded-md
            bg-gray-100 dark:bg-gray-800
            text-gray-700 dark:text-gray-300
            hover:bg-gray-200 dark:hover:bg-gray-700
            transition-colors duration-150
          "
            >
              <FiX size={14} />
              Cancel
            </button>

            <button
              onClick={signOut}
              disabled={loading}
              className="
            flex-1 flex items-center justify-center gap-1
            px-3 py-1.5
            text-[12px]
            rounded-md
            bg-rose-500 text-white
            hover:bg-rose-600
            transition-colors duration-150
            disabled:opacity-50
          "
            >
              <FiLogOut size={14} />
              {loading ? "Signing..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
