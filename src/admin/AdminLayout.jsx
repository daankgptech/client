import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Megaphone,
  Wrench,
  LogOut,
  Menu,
  X,
  Clock,
  Shield,
  ExternalLink,
} from "lucide-react";
import SEO from "../utils/SEO";
import { api } from "../utils/Secure/api";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Requests", path: "/admin/requests", icon: UserCheck },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Events", path: "/admin/events", icon: Calendar },
    { label: "Notices", path: "/admin/notices", icon: Megaphone },
    { label: "Toolkit", path: "/admin/toolkit", icon: Wrench },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
      toast.success("Admin signed out successfully");
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans selection:bg-rose-500 selection:text-white">
      <SEO title="Admin Console | DAAN KGP" description="DAAN KGP Admin Console" noindex={true} />

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#09090b] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-bold font-space-grotesk text-sm">
            D
          </div>
          <span className="font-space-grotesk font-bold tracking-tight text-lg text-white">
            DAAN Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 border border-white/10"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop & Mobile Sidebar Navigation */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#09090b] border-r border-white/10 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="space-y-6">
          {/* Brand & Status */}
          <div className="px-2 pt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 font-bold font-space-grotesk text-base">
                ⚡
              </div>
              <div>
                <h2 className="font-space-grotesk font-bold text-base text-white tracking-tight leading-none">
                  DAAN Admin
                </h2>
                <p className="text-[10px] text-white/40 font-mono mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  v2.4 Live System
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-[0.5px] bg-white/10" />

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium font-space-grotesk transition-all duration-200
                    ${
                      isActive
                        ? "bg-rose-500 text-white shadow-sm border border-rose-400/30"
                        : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-white/60"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="px-3.5 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              IST
            </span>
            <span>{currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-rose-400" /> Live Website
            </span>
            <ExternalLink className="w-3 h-3 text-white/40" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
