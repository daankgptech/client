import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../utils/Secure/api";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // NEW

export default function SignIn() {
  const navigate = useNavigate();
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
      navigate("/dashboard");
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
    <div
      className="min-h-screen flex items-center justify-center px-4
  bg-gradient-to-b from-gray-200 via-gray-100 to-gray-100
  dark:from-gray-800 dark:via-gray-900 dark:to-gray-800
"
    >
      {loading && <LoaderOverlay />}

      <div
        className="
      relative w-full max-w-md
      rounded-3xl p-8
      bg-white/90 dark:bg-gray-900/90
      backdrop-blur
      border border-gray-200/80 dark:border-gray-800
      shadow-2xl shadow-rose-200/30 dark:shadow-red-900/30
      transition-all duration-500
    "
      >
        {/* subtle ambient edge */}
        <div
          className="
        pointer-events-none absolute inset-0 rounded-3xl
        bg-gradient-to-br from-rose-300/5 via-transparent to-red-400/5
      "
        />

        {/* Header */}
        <div className="relative z-10 mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Sign in
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back. Enter your details below.
          </p>
        </div>

        {/* Inputs */}
        <div className="relative z-10 space-y-4">
          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="
          w-full rounded-2xl px-4 py-2.5
          bg-gray-50 dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          text-gray-900 dark:text-gray-100
          placeholder-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-rose-500/50
          transition
        "
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="
            w-full rounded-2xl px-4 py-2.5 pr-12
            bg-gray-50 dark:bg-gray-800
            border border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            placeholder-gray-400
            focus:outline-none
            focus:ring-2 focus:ring-rose-500/50
            transition
          "
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="
            absolute inset-y-0 right-3 flex items-center
            text-gray-400 dark:text-gray-300
            hover:text-gray-600 dark:hover:text-gray-100
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
        relative z-10 mt-6 w-full
        rounded-2xl py-2.5
        bg-gradient-to-r from-rose-600 to-red-600
        text-white font-medium
        shadow-md shadow-rose-300/40 dark:shadow-red-900/40
        transition-all duration-300
        hover:scale-[1.02]
        hover:shadow-lg
        active:scale-[0.97]
      "
        >
          Sign In
        </button>

        {/* Forgot */}
        {showForgot && (
          <div className="relative z-10 mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-500 transition"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {/* Footer */}
        <p className="relative z-10 mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-rose-600 dark:text-rose-400 hover:text-rose-500 transition"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
