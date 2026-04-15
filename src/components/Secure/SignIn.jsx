import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../utils/Secure/api";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // NEW
import SEO, { seoConfig } from "../../utils/SEO";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // NEW

  const [form, setForm] = useState({ username: "", password: "" });

  const submit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/signin", form);
      console.log("SignIn response:", res.data);
      toast.success("Signed in");
      navigate(from, { replace: true });
      window.location.reload();
    } catch (e) {
      console.error("SignIn error detailed:", e);
      toast.error(e.response?.data?.msg || e.message || "Sign in failed");
      setShowForgot(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <SEO {...seoConfig.signin} />
      {loading && <LoaderOverlay />}
      <div
        className="
    w-full max-w-md mx-auto
    flex flex-col gap-5
    p-5
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    transition-colors duration-150
  "
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Sign in
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back. Enter your details below.
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="
        w-full
        rounded-lg
        bg-gray-50 dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        px-3 py-2
        text-sm
        text-gray-900 dark:text-gray-100
        placeholder-gray-400
        focus:outline-none focus:ring-1 focus:ring-gray-400
      "
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="
          w-full
          rounded-lg
          bg-gray-50 dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          px-3 py-2 pr-9
          text-sm
          text-gray-900 dark:text-gray-100
          placeholder-gray-400
          focus:outline-none focus:ring-1 focus:ring-gray-400
        "
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="
          absolute inset-y-0 right-2 flex items-center
          text-gray-400 hover:text-gray-600
          dark:text-gray-500 dark:hover:text-gray-200
          transition
        "
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={submit}
          className="
      w-full
      py-2.5
      rounded-lg
      text-sm font-medium
      bg-gray-900 text-white
      dark:bg-gray-100 dark:text-gray-900
      hover:opacity-90
      transition
    "
        >
          Sign In
        </button>

        {/* Optional Footer */}
        <div className="text-center">
          <Link
            to="/outer-forgot-password"
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
