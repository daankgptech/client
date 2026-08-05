import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { api } from "../utils/Secure/api";
import SEO from "../utils/SEO";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Only redirect if backend server verifies active admin token
    const verifyExistingAdmin = async () => {
      const token = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
      const isAdminAuth = sessionStorage.getItem("adminAuthenticated") === "true";

      if (token || isAdminAuth) {
        try {
          const res = await api.get("/admin/verify");
          if (res.data?.success && res.data?.authenticated) {
            sessionStorage.setItem("adminAuthenticated", "true");
            navigate("/admin/dashboard", { replace: true });
            return;
          }
        } catch (err) {
          console.warn("Stored admin token verification failed:", err.message);
          // Token is invalid/expired -> clear stale session
          sessionStorage.removeItem("adminAuthenticated");
          sessionStorage.removeItem("adminUser");
          sessionStorage.removeItem("adminToken");
          localStorage.removeItem("adminToken");
        }
      }
      setCheckingAuth(false);
    };

    verifyExistingAdmin();
  }, [navigate]);

  const handleFillDemo = () => {
    setUsername("shani");
    setPassword("234131");
    toast.info("Demo credentials loaded! Click Sign In.", { duration: 2000 });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      // Call server endpoint
      const response = await api.post("/admin/login", {
        username: username.trim(),
        pass: password.trim(),
      });

      if (response.data && response.data.success) {
        const { token, user } = response.data;
        if (token) {
          localStorage.setItem("adminToken", token);
          sessionStorage.setItem("adminToken", token);
        }
        sessionStorage.setItem("adminAuthenticated", "true");
        sessionStorage.setItem("adminUser", JSON.stringify(user || { username: "shani", role: "admin" }));

        toast.success(`Welcome back, ${user?.username || "shani"}!`, {
          description: "Admin panel access authorized.",
        });

        navigate("/admin/dashboard", { replace: true });
      } else {
        toast.error(response.data?.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      // Fallback local check in case network or offline mode
      const inputUser = username.trim().toLowerCase();
      const inputPass = password.trim();

      if (inputUser === "shani" && inputPass === "234131") {
        sessionStorage.setItem("adminAuthenticated", "true");
        sessionStorage.setItem("adminUser", JSON.stringify({ username: "shani", role: "admin" }));
        toast.success("Welcome back, shani!", { description: "Authenticated successfully." });
        navigate("/admin/dashboard", { replace: true });
      } else {
        const errorMsg = error.response?.data?.message || "Invalid username or password.";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white relative overflow-hidden px-4 py-12">
      <SEO title="Admin Portal Login | DAAN KGP" description="DAAN KGP Admin Access Portal" noindex={true} />

      {/* Crimson Ambient Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Overlay Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f12_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-zinc-950/90 border border-red-900/30 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.15)] transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-500 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <ShieldCheck className="w-8 h-8 text-red-500" />
            </div>
            <div className="inline-block px-3 py-1 mb-2 rounded-full bg-red-950/80 border border-red-900/60 text-red-400 text-xs font-semibold uppercase tracking-widest">
              DAAN KGP Admin Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Control Center
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Sign in with your admin credentials
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4 text-red-400/80" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 focus:border-red-600 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-all duration-200"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4 text-red-400/80" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-10 py-3 bg-zinc-900/80 border border-zinc-800 focus:border-red-600 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-all duration-200"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Credential Helper Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-500">Creds: shani / 234131</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" /> Auto-fill Demo
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-red-950/50 hover:shadow-red-700/40 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {loading ? (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying Credentials...
                </div>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 text-center border-t border-zinc-900 pt-4">
            <p className="text-xs text-zinc-500">
              Restricted Area &bull; Unauthorized access logged
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
