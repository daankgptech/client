import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  Settings,
  LogOut,
  Search,
  RefreshCw,
  Server,
  Database,
  Cpu,
  UserCheck,
  UserX,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  Menu,
  X,
  Copy,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  Upload,
  Bell,
  Megaphone,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { api } from "../utils/Secure/api";
import SEO from "../utils/SEO";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Live Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    activeSessions: 1,
    dbStatus: "Connected",
    uptimeFormatted: "0h 0m 0s",
    memoryUsageMB: { heapUsed: "0", heapTotal: "0", rss: "0" },
    recentSignups: [],
    systemHealth: "Optimal",
  });

  // User Management State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPagination, setUserPagination] = useState({ total: 0, pages: 1, limit: 10 });
  const [usersLoading, setUsersLoading] = useState(false);

  // Events State
  const [events, setEvents] = useState([]);
  const [eventSearch, setEventSearch] = useState("");
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDriveLink, setEventDriveLink] = useState("");
  const [eventSubmitting, setEventSubmitting] = useState(false);

  // Noticeboard CRUD State
  const [adminNotices, setAdminNotices] = useState([]);
  const [noticeSearch, setNoticeSearch] = useState("");
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [noticeText, setNoticeText] = useState("");
  const [noticeDate, setNoticeDate] = useState("");
  const [noticeLink, setNoticeLink] = useState("");
  const [noticeIsActive, setNoticeIsActive] = useState(true);
  const [noticeSubmitting, setNoticeSubmitting] = useState(false);

  // Cloudinary Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);

  // System Logs State
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState("all");

  // Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial dashboard data
  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, logsRes, eventsRes, noticesRes] = await Promise.allSettled([
        api.get("/admin/stats"),
        api.get("/admin/logs"),
        api.get("/admin/events"),
        api.get("/admin/notices"),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.data?.success) {
        setStats(statsRes.value.data.stats);
      }

      if (logsRes.status === "fulfilled" && logsRes.value.data?.success) {
        setLogs(logsRes.value.data.logs);
      }

      if (eventsRes.status === "fulfilled" && eventsRes.value.data?.success) {
        setEvents(eventsRes.value.data.events || []);
      }

      if (noticesRes.status === "fulfilled" && noticesRes.value.data?.success) {
        setAdminNotices(noticesRes.value.data.notices || []);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch users directory
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get(`/admin/users?search=${encodeURIComponent(userSearch)}&page=${userPage}&limit=10`);
      if (res.data?.success) {
        setUsers(res.data.users || []);
        setUserPagination(res.data.pagination || { total: 0, pages: 1, limit: 10 });
      }
    } catch (err) {
      console.error("Users fetch error:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch notices
  const fetchAdminNotices = async () => {
    try {
      const res = await api.get("/admin/notices");
      if (res.data?.success) {
        setAdminNotices(res.data.notices || []);
      }
    } catch (err) {
      console.error("Fetch admin notices error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "noticeboard") {
      fetchAdminNotices();
    }
  }, [activeTab, userSearch, userPage]);

  // Cloudinary Image File Upload Handler
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, GIF).");
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success && res.data.url) {
        setEventImage(res.data.url);
        toast.success("Image uploaded to Cloudinary successfully!", { id: toastId });
      } else {
        toast.error(res.data?.message || "Cloudinary upload failed.", { id: toastId });
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload image to Cloudinary.", { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  // Event Modal handlers
  const openCreateEventModal = () => {
    setEditingEvent(null);
    setEventTitle("");
    setEventDescription("");
    setEventImage("");
    setEventDate(new Date().toISOString().split("T")[0]);
    setEventDriveLink("");
    setEventModalOpen(true);
  };

  const openEditEventModal = (event) => {
    setEditingEvent(event);
    setEventTitle(event.title || "");
    setEventDescription(event.description || "");
    setEventImage(event.image || "");
    const formattedDate = event.date
      ? new Date(event.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setEventDate(formattedDate);
    setEventDriveLink(event.driveLink || "");
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDescription.trim() || !eventImage.trim() || !eventDate) {
      toast.error("Please fill in all required fields and upload an image.");
      return;
    }

    setEventSubmitting(true);
    const payload = {
      title: eventTitle.trim(),
      description: eventDescription.trim(),
      image: eventImage.trim(),
      date: eventDate,
      driveLink: eventDriveLink.trim(),
    };

    try {
      if (editingEvent) {
        const res = await api.put(`/admin/events/${editingEvent._id}`, payload);
        if (res.data?.success) {
          toast.success("Event updated successfully!");
          const updated = res.data.event || { ...editingEvent, ...payload };
          setEvents((prev) => prev.map((ev) => (ev._id === editingEvent._id ? updated : ev)));
        }
      } else {
        const res = await api.post("/admin/events", payload);
        if (res.data?.success) {
          toast.success("New event created successfully!");
          if (res.data.event) {
            setEvents((prev) => [res.data.event, ...prev]);
          } else {
            fetchDashboardData();
          }
        }
      }
      setEventModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Save event error:", err);
      toast.error(err.response?.data?.message || "Failed to save event.");
    } finally {
      setEventSubmitting(false);
    }
  };

  const handleDeleteEventClick = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;

    try {
      const res = await api.delete(`/admin/events/${eventId}`);
      if (res.data?.success) {
        toast.success(`Event "${title}" deleted.`);
        setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Delete event error:", err);
      toast.error("Failed to delete event.");
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    if (!eventSearch.trim()) return events;
    const q = eventSearch.toLowerCase();
    return events.filter(
      (ev) =>
        ev.title?.toLowerCase().includes(q) ||
        ev.description?.toLowerCase().includes(q)
    );
  }, [events, eventSearch]);

  // Noticeboard Modal Handlers
  const openCreateNoticeModal = () => {
    setEditingNotice(null);
    setNoticeText("");
    setNoticeDate(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    setNoticeLink("");
    setNoticeIsActive(true);
    setNoticeModalOpen(true);
  };

  const openEditNoticeModal = (notice) => {
    setEditingNotice(notice);
    setNoticeText(notice.text || "");
    setNoticeDate(notice.date || "");
    setNoticeLink(notice.link || "");
    setNoticeIsActive(notice.isActive !== undefined ? notice.isActive : true);
    setNoticeModalOpen(true);
  };

  const handleSaveNotice = async (e) => {
    e.preventDefault();
    if (!noticeText.trim() || !noticeDate.trim()) {
      toast.error("Notice text and date are required.");
      return;
    }

    setNoticeSubmitting(true);
    const payload = {
      text: noticeText.trim(),
      date: noticeDate.trim(),
      link: noticeLink.trim(),
      isActive: noticeIsActive,
    };

    try {
      if (editingNotice) {
        const res = await api.put(`/admin/notices/${editingNotice._id}`, payload);
        if (res.data?.success) {
          toast.success("Notice updated successfully!");
          const updated = res.data.notice || { ...editingNotice, ...payload };
          setAdminNotices((prev) => prev.map((n) => (n._id === editingNotice._id ? updated : n)));
        }
      } else {
        const res = await api.post("/admin/notices", payload);
        if (res.data?.success) {
          toast.success("New notice published to Homepage!");
          if (res.data.notice) {
            setAdminNotices((prev) => [res.data.notice, ...prev]);
          } else {
            fetchAdminNotices();
          }
        }
      }
      setNoticeModalOpen(false);
    } catch (err) {
      console.error("Save notice error:", err);
      toast.error(err.response?.data?.message || "Failed to save notice.");
    } finally {
      setNoticeSubmitting(false);
    }
  };

  const handleToggleNoticeActive = async (notice) => {
    try {
      const newStatus = !notice.isActive;
      const res = await api.put(`/admin/notices/${notice._id}`, { isActive: newStatus });
      if (res.data?.success) {
        toast.success(`Notice status set to ${newStatus ? "Active" : "Hidden"}`);
        setAdminNotices((prev) =>
          prev.map((n) => (n._id === notice._id ? { ...n, isActive: newStatus } : n))
        );
      }
    } catch (err) {
      toast.error("Failed to update notice status.");
    }
  };

  const handleDeleteNoticeClick = async (noticeId, text) => {
    if (!window.confirm(`Delete notice "${text.substring(0, 30)}..."?`)) return;

    try {
      const res = await api.delete(`/admin/notices/${noticeId}`);
      if (res.data?.success) {
        toast.success("Notice deleted.");
        setAdminNotices((prev) => prev.filter((n) => n._id !== noticeId));
      }
    } catch (err) {
      toast.error("Failed to delete notice.");
    }
  };

  // Filtered Notices
  const filteredAdminNotices = useMemo(() => {
    if (!noticeSearch.trim()) return adminNotices;
    const q = noticeSearch.toLowerCase();
    return adminNotices.filter(
      (n) => n.text?.toLowerCase().includes(q) || n.date?.toLowerCase().includes(q)
    );
  }, [adminNotices, noticeSearch]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (err) {
      // Ignore network fail on logout
    }
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminAuthenticated");
    sessionStorage.removeItem("adminUser");
    toast.success("Admin logged out successfully.");
    navigate("/admin/login", { replace: true });
  };

  // Handle Admin Action (e.g. Flush Cache, Ping DB)
  const handleAdminAction = async (actionName) => {
    try {
      const res = await api.post("/admin/action", { action: actionName });
      if (res.data?.success) {
        toast.success(res.data.message || "Action completed!");
        fetchDashboardData();
      }
    } catch (err) {
      toast.error("Action failed to execute.");
    }
  };

  // Delete User
  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user '${username}'?`)) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data?.success) {
        toast.success(`User '${username}' deleted.`);
        fetchUsers();
        fetchDashboardData();
      }
    } catch (err) {
      toast.error("Failed to delete user.");
    }
  };

  // Mock activity chart data generated dynamically based on total users & events
  const chartData = useMemo(() => {
    const baseVal = Math.max(stats.totalUsers || 10, 5);
    return [
      { name: "Mon", users: Math.round(baseVal * 0.4), requests: 120 },
      { name: "Tue", users: Math.round(baseVal * 0.55), requests: 210 },
      { name: "Wed", users: Math.round(baseVal * 0.7), requests: 180 },
      { name: "Thu", users: Math.round(baseVal * 0.82), requests: 290 },
      { name: "Fri", users: Math.round(baseVal * 0.9), requests: 340 },
      { name: "Sat", users: Math.round(baseVal * 0.95), requests: 410 },
      { name: "Sun", users: baseVal, requests: 480 },
    ];
  }, [stats.totalUsers]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    if (logFilter === "all") return logs;
    return logs.filter((l) => l.level === logFilter);
  }, [logs, logFilter]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      <SEO title="Admin Dashboard | DAAN KGP" description="DAAN KGP Admin Dashboard" noindex={true} />

      {/* TOP HEADER */}
      <header className="h-16 bg-zinc-950/90 border-b border-red-900/30 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-red-500" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center shadow-lg shadow-red-950/50">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-wide">DAAN</span>
                <span className="text-xs bg-red-950 border border-red-800/80 text-red-400 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ADMIN
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Clock & Status */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800/80 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span className="font-mono text-zinc-200">{currentTime.toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800/80 px-3 py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-medium">{stats.dbStatus}</span>
          </div>
        </div>

        {/* Right Admin Profile & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-900/50 text-zinc-400 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-red-500" : ""}`} />
          </button>

          <div className="flex items-center gap-2 bg-zinc-900 border border-red-900/30 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-bold flex items-center justify-center text-xs">
              S
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">shani</p>
              <p className="text-[10px] text-red-400 leading-none mt-1">Super Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 bg-zinc-950 border-r border-red-900/20 p-4 gap-2 shrink-0">
          <p className="text-[10px] uppercase font-bold text-red-500 tracking-wider px-3 py-1">
            Navigation
          </p>

          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "users", label: "User Directory", icon: Users },
              { id: "events", label: "Events & News", icon: Calendar },
              { id: "noticeboard", label: "Noticeboard", icon: Bell },
              { id: "logs", label: "System Health", icon: Activity },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-950/50 font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto bg-gradient-to-br from-zinc-900 to-zinc-950 border border-red-900/20 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2 text-red-400 font-semibold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>DAAN Core v2.4</span>
            </div>
            <p className="text-zinc-400 text-[11px]">Smooth & Fast Admin System</p>
          </div>
        </aside>

        {/* SIDEBAR (Mobile Drawer) */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
            <div className="w-64 bg-zinc-950 border-r border-red-900/30 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="font-extrabold text-red-500">ADMIN MENU</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              <nav className="space-y-1">
                {[
                  { id: "overview", label: "Overview", icon: LayoutDashboard },
                  { id: "users", label: "User Directory", icon: Users },
                  { id: "events", label: "Events & News", icon: Calendar },
                  { id: "noticeboard", label: "Noticeboard", icon: Bell },
                  { id: "logs", label: "System Health", icon: Activity },
                  { id: "settings", label: "Settings", icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium ${
                        isActive
                          ? "bg-red-600 text-white font-semibold"
                          : "text-zinc-400 hover:bg-zinc-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-red-950/30 border border-red-900/30 p-6 rounded-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Welcome Back, Admin <span className="text-red-500">shani</span>
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    System status is operational. All microservices are active.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdminAction("clear_cache")}
                    className="px-3.5 py-2 rounded-xl bg-red-950/50 border border-red-800/40 text-red-300 hover:bg-red-900/80 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-red-400" />
                    Flush Cache
                  </button>
                  <button
                    onClick={() => handleAdminAction("ping_db")}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-red-600 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Database className="w-3.5 h-3.5 text-red-400" />
                    Ping DB
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="bg-zinc-950/80 border border-zinc-800/80 hover:border-red-900/40 p-5 rounded-2xl transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Total Users
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-red-950/50 border border-red-800/30 flex items-center justify-center text-red-400">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-white">
                      {stats.totalUsers}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +12%
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2">Registered alumni & students</p>
                </div>

                {/* Total Events */}
                <div className="bg-zinc-950/80 border border-zinc-800/80 hover:border-red-900/40 p-5 rounded-2xl transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Events Active
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-red-950/50 border border-red-800/30 flex items-center justify-center text-red-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-white">
                      {stats.totalEvents}
                    </span>
                    <span className="text-xs font-semibold text-red-400">Active</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2">Upcoming & published events</p>
                </div>

                {/* Server Uptime */}
                <div className="bg-zinc-950/80 border border-zinc-800/80 hover:border-red-900/40 p-5 rounded-2xl transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      System Uptime
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-red-950/50 border border-red-800/30 flex items-center justify-center text-red-400">
                      <Server className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-white font-mono">
                      {stats.uptimeFormatted}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2">Node.js server uptime</p>
                </div>

                {/* Memory Usage */}
                <div className="bg-zinc-950/80 border border-zinc-800/80 hover:border-red-900/40 p-5 rounded-2xl transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Heap Memory
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-red-950/50 border border-red-800/30 flex items-center justify-center text-red-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-white">
                      {stats.memoryUsageMB?.heapUsed || "0"} MB
                    </span>
                    <span className="text-xs text-zinc-400">
                      / {stats.memoryUsageMB?.heapTotal || "0"} MB
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2">Allocated memory footprint</p>
                </div>
              </div>

              {/* Chart & Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Growth Chart */}
                <div className="lg:col-span-2 bg-zinc-950/90 border border-zinc-800 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-white text-base">User Activity & Traffic</h3>
                      <p className="text-xs text-zinc-400">Weekly traffic trend metrics</p>
                    </div>
                    <span className="text-xs bg-red-950 border border-red-800 text-red-400 px-2.5 py-1 rounded-full font-medium">
                      Realtime
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#09090b",
                            borderColor: "#991b1b",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="#ef4444"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorUsers)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick System Log Feed */}
                <div className="bg-zinc-950/90 border border-zinc-800 p-6 rounded-2xl flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-base">System Stream</h3>
                    <button
                      onClick={() => setActiveTab("logs")}
                      className="text-xs text-red-400 hover:underline font-medium"
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto max-h-64 pr-1">
                    {logs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] text-zinc-400">
                          <span className="font-mono text-red-400 uppercase font-semibold">
                            [{log.type}]
                          </span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-zinc-200 font-sans">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER DIRECTORY */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">User Directory</h2>
                  <p className="text-sm text-zinc-400">Manage registered members, students and alumni</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(1);
                    }}
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-300">
                    <thead className="bg-zinc-900/90 text-xs uppercase text-red-400 font-semibold border-b border-zinc-800">
                      <tr>
                        <th className="py-3.5 px-4">Member</th>
                        <th className="py-3.5 px-4">Branch</th>
                        <th className="py-3.5 px-4">Batch</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-800/60">
                      {usersLoading ? (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-zinc-500">
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                              Loading users list...
                            </div>
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-zinc-500">
                            No users found matching query.
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u._id} className="hover:bg-zinc-900/40 transition-colors">
                            <td className="py-3.5 px-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-rose-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {(u.name || u.username || "U")[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-white leading-snug">{u.name || u.username}</p>
                                <p className="text-xs text-zinc-500">@{u.username}</p>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-zinc-300 text-xs">{u.branch || "N/A"}</td>
                            <td className="py-3.5 px-4 text-zinc-300 text-xs">{u.batch || "N/A"}</td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950 border border-emerald-800/60 text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u._id, u.username)}
                                className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-950 hover:text-red-300 transition-all text-xs"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer */}
                <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>
                    Showing Page {userPagination.page} of {userPagination.pages} ({userPagination.total} total users)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={userPage <= 1}
                      onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 disabled:opacity-40 hover:border-red-900"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={userPage >= userPagination.pages}
                      onClick={() => setUserPage((p) => p + 1)}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 disabled:opacity-40 hover:border-red-900"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVENTS MANAGEMENT */}
          {activeTab === "events" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Events & News Management</h2>
                  <p className="text-sm text-zinc-400">Create, edit, search, and manage DAAN community events</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400" />
                    <input
                      type="text"
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      placeholder="Search events..."
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Add Event Button */}
                  <button
                    onClick={openCreateEventModal}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 transition-all shrink-0 active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Event</span>
                  </button>
                </div>
              </div>

              {/* Event Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.length === 0 ? (
                  <div className="col-span-2 bg-zinc-950 border border-zinc-800 p-12 rounded-2xl text-center">
                    <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-1">No Events Found</h3>
                    <p className="text-xs text-zinc-500 mb-4">There are no events matching your search criteria.</p>
                    <button
                      onClick={openCreateEventModal}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs inline-flex items-center gap-2 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create First Event
                    </button>
                  </div>
                ) : (
                  filteredEvents.map((ev) => (
                    <div
                      key={ev._id}
                      className="bg-zinc-950 border border-zinc-800 hover:border-red-900/60 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        {ev.image ? (
                          <img
                            src={ev.image}
                            alt={ev.title}
                            className="w-24 h-24 rounded-xl object-cover border border-zinc-800 shrink-0 group-hover:border-red-600/40 transition-colors"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-center text-red-500 shrink-0">
                            <Calendar className="w-8 h-8" />
                          </div>
                        )}

                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-semibold text-red-400 bg-red-950/80 border border-red-900/60 px-2 py-0.5 rounded-full">
                              {new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-base truncate">{ev.title}</h3>
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{ev.description}</p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
                        {ev.driveLink ? (
                          <a
                            href={ev.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Drive Link
                          </a>
                        ) : (
                          <span className="text-zinc-600 text-[11px]">No link</span>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditEventModal(ev)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-red-400" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEventClick(ev._id, ev.title)}
                            className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900 hover:text-white transition-all text-xs"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* EVENT MODAL / DRAWER */}
              {eventModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-zinc-950 border border-red-900/40 rounded-2xl p-6 shadow-2xl shadow-red-950/50 animate-fadeIn relative">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-red-950 border border-red-800 flex items-center justify-center text-red-500">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          {editingEvent ? "Edit Event" : "Create New Event"}
                        </h3>
                      </div>
                      <button
                        onClick={() => setEventModalOpen(false)}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEvent} className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                          Event Title *
                        </label>
                        <div className="relative">
                          <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                          <input
                            type="text"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="e.g. Annual DAAN KGP Meetup 2026"
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                          Description *
                        </label>
                        <textarea
                          rows={3}
                          value={eventDescription}
                          onChange={(e) => setEventDescription(e.target.value)}
                          placeholder="Event summary, venue details, timing..."
                          className="w-full p-3 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                          required
                        />
                      </div>

                      {/* Cloudinary Image File Upload Setup */}
                      <div>
                        <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                          Event Cover Image (Cloudinary Upload) *
                        </label>

                        <div className="space-y-3">
                          {/* Drag/Click File Picker */}
                          <div className="relative border-2 border-dashed border-zinc-800 hover:border-red-600/60 bg-zinc-900/60 rounded-xl p-4 transition-all text-center group cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              disabled={uploadingImage}
                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                              {uploadingImage ? (
                                <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
                                  <RefreshCw className="w-5 h-5 animate-spin text-red-500" />
                                  Uploading to Cloudinary...
                                </div>
                              ) : (
                                <>
                                  <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-800/60 text-red-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Upload className="w-4 h-4" />
                                  </div>
                                  <p className="text-xs font-medium text-white">
                                    Click or drop image file to upload to Cloudinary
                                  </p>
                                  <p className="text-[10px] text-zinc-500">
                                    PNG, JPG, WEBP, GIF (Direct Cloudinary Storage)
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Image Preview & URL Display */}
                          {eventImage ? (
                            <div className="flex items-center gap-3 p-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                              <img
                                src={eventImage}
                                alt="Preview"
                                className="w-12 h-12 rounded-lg object-cover border border-zinc-700 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Cloudinary Ready
                                </p>
                                <p className="text-[10px] text-zinc-400 truncate font-mono mt-0.5">{eventImage}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setEventImage("")}
                                className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors"
                                title="Remove Image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="relative">
                              <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                              <input
                                type="url"
                                value={eventImage}
                                onChange={(e) => setEventImage(e.target.value)}
                                placeholder="Or paste Cloudinary image URL..."
                                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Event Date & Drive Link Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                            Event Date *
                          </label>
                          <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full p-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                            Drive / Registration Link
                          </label>
                          <div className="relative">
                            <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                            <input
                              type="url"
                              value={eventDriveLink}
                              onChange={(e) => setEventDriveLink(e.target.value)}
                              placeholder="https://drive.google.com/..."
                              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="pt-4 border-t border-zinc-900 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEventModalOpen(false)}
                          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={eventSubmitting || uploadingImage || !eventImage}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 disabled:opacity-50"
                        >
                          {eventSubmitting ? (
                            <div className="flex items-center gap-1.5">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Saving...
                            </div>
                          ) : editingEvent ? (
                            "Update Event"
                          ) : (
                            "Create Event"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: NOTICEBOARD MANAGEMENT */}
          {activeTab === "noticeboard" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Homepage Noticeboard CRUD</h2>
                  <p className="text-sm text-zinc-400">Manage notices displayed directly on the Homepage Noticeboard</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400" />
                    <input
                      type="text"
                      value={noticeSearch}
                      onChange={(e) => setNoticeSearch(e.target.value)}
                      placeholder="Search notices..."
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Add Notice Button */}
                  <button
                    onClick={openCreateNoticeModal}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 transition-all shrink-0 active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Notice</span>
                  </button>
                </div>
              </div>

              {/* Noticeboard Items List */}
              <div className="space-y-3">
                {filteredAdminNotices.length === 0 ? (
                  <div className="bg-zinc-950 border border-zinc-800 p-12 rounded-2xl text-center">
                    <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-1">No Notices Found</h3>
                    <p className="text-xs text-zinc-500 mb-4">No noticeboard items match your filter.</p>
                    <button
                      onClick={openCreateNoticeModal}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs inline-flex items-center gap-2 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add First Notice
                    </button>
                  </div>
                ) : (
                  filteredAdminNotices.map((n) => (
                    <div
                      key={n._id}
                      className={`bg-zinc-950 border p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        n.isActive ? "border-zinc-800 hover:border-red-900/60" : "border-zinc-900 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          n.isActive ? "bg-red-950/80 border border-red-800/60 text-red-400" : "bg-zinc-900 border border-zinc-800 text-zinc-600"
                        }`}>
                          <Megaphone className="w-5 h-5" />
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-semibold text-red-400 bg-red-950/80 border border-red-900/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              {n.date}
                            </span>
                            {n.isActive ? (
                              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                                Active on Homepage
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                                Hidden
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-white text-base leading-snug">{n.text}</h3>

                          {n.link && (
                            <a
                              href={n.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-red-400 hover:underline flex items-center gap-1 mt-1 font-mono"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {n.link}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        <button
                          onClick={() => handleToggleNoticeActive(n)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            n.isActive
                              ? "bg-emerald-950/40 border-emerald-800 text-emerald-400 hover:bg-emerald-900/60"
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                          title="Toggle homepage visibility"
                        >
                          {n.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-zinc-500" />}
                          <span>{n.isActive ? "Active" : "Hidden"}</span>
                        </button>

                        <button
                          onClick={() => openEditNoticeModal(n)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-red-400" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteNoticeClick(n._id, n.text)}
                          className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900 hover:text-white transition-all text-xs"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* NOTICE MODAL */}
              {noticeModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-zinc-950 border border-red-900/40 rounded-2xl p-6 shadow-2xl shadow-red-950/50 animate-fadeIn relative">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-red-950 border border-red-800 flex items-center justify-center text-red-500">
                          <Bell className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          {editingNotice ? "Edit Notice" : "Publish New Notice"}
                        </h3>
                      </div>
                      <button
                        onClick={() => setNoticeModalOpen(false)}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveNotice} className="space-y-4">
                      {/* Notice Text */}
                      <div>
                        <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                          Notice Text / Announcement *
                        </label>
                        <textarea
                          rows={3}
                          value={noticeText}
                          onChange={(e) => setNoticeText(e.target.value)}
                          placeholder="e.g., Summer Quarter Classes Start or Annual Convocation 2026"
                          className="w-full p-3 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                          required
                        />
                      </div>

                      {/* Notice Date */}
                      <div>
                        <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                          Display Date Label *
                        </label>
                        <input
                          type="text"
                          value={noticeDate}
                          onChange={(e) => setNoticeDate(e.target.value)}
                          placeholder="e.g. May 20 2026 or Apr 30 - Jul 15"
                          className="w-full p-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                          required
                        />
                      </div>

                      {/* Optional Target Link */}
                      <div>
                        <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                          Action Redirect Link (Optional)
                        </label>
                        <div className="relative">
                          <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                          <input
                            type="url"
                            value={noticeLink}
                            onChange={(e) => setNoticeLink(e.target.value)}
                            placeholder="https://daankgp.org/events/meetup"
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Active Toggle Checkbox */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="noticeIsActive"
                          checked={noticeIsActive}
                          onChange={(e) => setNoticeIsActive(e.target.checked)}
                          className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                        />
                        <label htmlFor="noticeIsActive" className="text-xs font-medium text-zinc-300 cursor-pointer">
                          Display this notice publicly on Homepage Noticeboard
                        </label>
                      </div>

                      {/* Modal Footer */}
                      <div className="pt-4 border-t border-zinc-900 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setNoticeModalOpen(false)}
                          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={noticeSubmitting}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 disabled:opacity-50"
                        >
                          {noticeSubmitting ? (
                            <div className="flex items-center gap-1.5">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Saving...
                            </div>
                          ) : editingNotice ? (
                            "Update Notice"
                          ) : (
                            "Publish Notice"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SYSTEM HEALTH & LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">System Diagnostics & Logs</h2>
                  <p className="text-sm text-zinc-400">Real-time audit stream & metrics</p>
                </div>

                <div className="flex items-center gap-2">
                  {["all", "info", "warn", "error"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogFilter(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                        logFilter === lvl
                          ? "bg-red-600 text-white"
                          : "bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logs Box */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 font-mono text-xs space-y-2 max-h-[500px] overflow-y-auto">
                {filteredLogs.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-zinc-500">{new Date(l.timestamp).toLocaleString()}</span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold uppercase ${
                            l.level === "warn"
                              ? "bg-amber-950 text-amber-400 border border-amber-800"
                              : l.level === "error"
                              ? "bg-red-950 text-red-400 border border-red-800"
                              : "bg-blue-950 text-blue-400 border border-blue-800"
                          }`}
                        >
                          {l.level}
                        </span>
                        <span className="text-red-400">[{l.type}]</span>
                      </div>
                      <p className="text-zinc-200 font-sans">{l.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn max-w-3xl">
              <div>
                <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
                <p className="text-sm text-zinc-400">System configuration and security profile</p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center font-bold text-2xl text-white">
                    S
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-lg">shani</h3>
                    <p className="text-xs text-red-400">Super Administrator Account</p>
                    <p className="text-xs text-zinc-500 mt-1">Credentials: username="shani" & pass=234131</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase text-red-400 tracking-wider">
                    Security Info
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-zinc-500 block mb-1">Session Token</span>
                      <span className="text-zinc-200 font-mono">JWT 24-Hour Expiration</span>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-zinc-500 block mb-1">Access Level</span>
                      <span className="text-emerald-400 font-semibold">Full System Control</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
