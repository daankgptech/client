import { useState } from "react";
import { api } from "../../utils/Secure/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import BlurLoader from "../../utils/LoaderOverlay";
import { PasswordHelper } from "./PasswordHelper";
import SEO, { seoConfig } from "../../utils/SEO";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    if (!newPassword) {
      toast.error("Enter a new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.put("/reset-password", { newPassword });
      toast.success("Password updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300";
  const btnClass =
    "w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-medium shadow-md shadow-rose-300/40 hover:scale-105 active:scale-95 transition-all duration-300 flex justify-center items-center gap-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <SEO {...seoConfig.forgotPassword} />
      {loading && <BlurLoader />}

      <div className="group relative overflow-hidden w-full max-w-md rounded-3xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 border border-rose-50 dark:border-slate-700/50 p-8 shadow-xl transition-all duration-500">
        <div className="relative z-10 mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter your new password below
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={inputClass + " pr-12"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {showPassword ? (
                <AiFillEyeInvisible size={22} />
              ) : (
                <AiFillEye size={22} />
              )}
            </button>
          </div>

          <PasswordHelper password={newPassword} />

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={inputClass}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button onClick={resetPassword} className={btnClass}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
