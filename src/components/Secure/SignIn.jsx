import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../utils/Secure/api";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // NEW
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>Sign In | DAAN KGP</title>
        <meta
          name="description"
          content="Claim your candidature on DAAN KGP. Sign in to unlock your dashboard, personal tools, and DAAN KGPian-only features. Stay connected, track your activity, and take your place in the DAAN KGP community."
        />
        <meta property="og:title" content="Sign In | DAAN KGP" />
        <meta
          property="og:description"
          content="Claim your candidature on DAAN KGP. Sign in to unlock your dashboard, personal tools, and DAAN KGPian-only features. Stay connected, track your activity, and take your place in the DAAN KGP community."
        />
      </Helmet>
      {loading && <LoaderOverlay />}
      <div
        className=" group relative overflow-hidden
          rounded-3xl
          bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
          dark:from-slate-900 dark:via-slate-800 dark:to-gray-900
          border border-rose-50 dark:border-slate-700/50
          p-8
          shadow-xl 
          transition-all duration-500
          hover:border-rose-400/40 dark:hover:border-rose-500/50
          hover:shadow-lg hover:shadow-rose-900/20 "
      >
        {/* subtle ambient edge */}
        <div className=" pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-100/10 via-transparent to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Header */}
        <div className="relative z-10 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 relative z-10 text-center">
            Sign in
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 relative z-10">
            Welcome back. Enter your details below.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 relative z-10">
          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className=" w-full rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
              className="  w-full rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
        <div className="w-full flex justify-center items-center mt-4">
          <button
            onClick={submit}
            className=" align-middle text-center rounded-3xl bg-rose-600 py-3 px-6 text-white font-medium hover:bg-rose-500 active:scale-[0.98] transition-all duration-300 hover:scale-95 relative z-10"
          >
            Sign In
          </button>
        </div>

        {/* Forgot */}
          <div className="relative z-10 mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-500 transition hover:underline"
            >
              Forgot password?
            </Link>
          </div>
      </div>
    </div>
  );
}
