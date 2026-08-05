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
} from "lucide-react";
import SEO from "../utils/SEO";
import { api } from "../utils/Secure/api";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Requests", path: "/admin/requests", icon: UserCheck },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Events", path: "/admin/events", icon: Calendar },
    { label: "Notices", path: "/admin/notices", icon: Megaphone },
    { label: "Toolkit", path: "/admin/toolkit", icon: Wrench },
  ];

  // Fetch count of pending approval requests for menu badge
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await api.get("/admin/requests");
        if (res.data?.success) {
          setPendingRequestsCount(res.data.requests?.length || res.data.count || 0);
        }
      } catch (err) {
        console.warn("Failed to fetch pending requests count for badge:", err);
      }
    };

    fetchPendingCount();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (err) {
      console.error("Logout server error:", err);
    } finally {
      // Clear all admin tokens & authentication flags from browser storage
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminAuthenticated");
      sessionStorage.removeItem("adminUser");

      toast.success("Admin signed out successfully");
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-500 selection:text-white">
      <SEO title="Admin Console | DAAN KGP" description="DAAN KGP Admin Console" noindex={true} />

      {/* Minimal Top Header: Menu Items + Sign Out Only */}
      <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-xl border-b border-white/10 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Scrollable Navigation Menu Items */}
          <nav className="flex items-center gap-0 overflow-x-auto py-1 max-w-full font-space-grotesk text-xs flex-1 [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-1.5 px-3.5 py-1.5 font-semibold whitespace-nowrap transition-all duration-200 shrink-0
                    ${isActive
                      ? "bg-red-500 text-white shadow-md shadow-red-500/20 border border-red-400/30"
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-white/5"
                    }
                  `}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-white/60"}`} />
                  <span>{item.label}</span>
                  {item.path === "/admin/requests" && pendingRequestsCount > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full transition-colors ${
                        isActive
                          ? "bg-white text-red-600"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-1 md:px-3.5 py-0.5 md:py-1.5 rounded text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 transition-all duration-200 shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:flex">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
