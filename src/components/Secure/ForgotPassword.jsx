import { useState } from "react";
import { api } from "../../utils/Secure/api";
import { toast } from "sonner";
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
    if (!newPassword) return toast.error("Enter password");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await api.put("/reset-password", { newPassword });
      toast.success("Password updated");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full px-3 py-1.5 text-[12px] rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-rose-500";

  const btn =
    "w-full px-3 py-1.5 text-[12px] rounded-md bg-rose-500 text-white hover:bg-rose-600 transition-colors duration-150 flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <SEO {...seoConfig.forgotPassword} />
      {loading && <BlurLoader />}

      <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        {/* header */}
        <div className="mb-4 text-center">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Reset Password
          </h2>
          <p className="text-[12px] text-gray-500 mt-1">
            Enter new password
          </p>
        </div>

        {/* form */}
        <div className="space-y-3">
          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`${input} pr-8`}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <AiFillEyeInvisible size={16} />
              ) : (
                <AiFillEye size={16} />
              )}
            </button>
          </div>

          <PasswordHelper password={newPassword} />

          {/* Confirm */}
          <input
            type={showPassword ? "text" : "password"}
            className={input}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* button */}
          <button onClick={resetPassword} className={btn}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
}