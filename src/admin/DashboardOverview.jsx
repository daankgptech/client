import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Users,
  Calendar,
  Activity,
  Server,
  Database,
  Cpu,
  RefreshCw,
  Zap,
  TrendingUp,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { api } from "../utils/Secure/api";

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
  const [logs, setLogs] = useState([]);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, logsRes] = await Promise.allSettled([
        api.get("/admin/stats"),
        api.get("/admin/logs"),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.data?.success) {
        setStats(statsRes.value.data.stats);
      }
      if (logsRes.status === "fulfilled" && logsRes.value.data?.success) {
        setLogs(logsRes.value.data.logs || []);
      }
    } catch (err) {
      console.error("Fetch overview error:", err);
      toast.error("Failed to load system stats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSystemAction = async (actionType) => {
    try {
      const res = await api.post("/admin/action", { action: actionType });
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchData();
      }
    } catch (err) {
      toast.error("Action execution failed");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse font-space-grotesk">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-2">
            <div className="h-8 w-56 bg-white/10 rounded-lg" />
            <div className="h-3 w-80 bg-white/5 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-white/10 rounded" />
            <div className="h-8 w-24 bg-white/10 rounded" />
          </div>
        </div>

        {/* 4 Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="p-4 border border-white/10 bg-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-28 bg-white/10 rounded" />
                <div className="h-7 w-7 rounded bg-white/10" />
              </div>
              <div className="h-9 w-20 bg-white/15 rounded-lg" />
              <div className="h-3 w-36 bg-white/5 rounded" />
            </div>
          ))}
        </div>

        {/* 2 Big Grid Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card Skeleton */}
          <div className="border border-white/10 p-5 bg-white/5 space-y-4">
            <div className="h-5 w-40 bg-white/10 rounded" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-white/10 rounded" />
                    <div className="h-3 w-24 bg-white/5 rounded" />
                  </div>
                  <div className="h-3 w-16 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Card Skeleton */}
          <div className="border border-white/10 p-5 bg-white/5 space-y-4">
            <div className="h-5 w-48 bg-white/10 rounded" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-full bg-white/5 border border-white/5 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-space-grotesk tracking-tight text-white flex items-center gap-2">
            {/* <Activity className="w-6 h-6 text-rose-500" /> */}
            System Overview
          </h1>
          <p className="text-xs text-white/50 font-space-grotesk mt-1">
            Real-time infrastructure performance & database telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSystemAction("clear_cache")}
            className="px-3 py-1.5 text-xs font-medium font-space-grotesk border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
          >
            Clear Cache
          </button>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium font-space-grotesk bg-rose-500 hover:bg-rose-600 text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="p-4 bg-transparent border border-white/10 hover:border-white/20 transition-all duration-200">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-space-grotesk font-bold uppercase tracking-wider text-white/50">
              Total Members
            </span>
            <div className="p-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-space-grotesk text-white">
            {stats.totalUsers || 0}
          </p>
          <p className="text-[10px] text-white/40 font-mono mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Registered DAAN KGPians
          </p>
        </div>

        {/* Total Events */}
        <div className="p-4 bg-transparent border border-white/10 hover:border-white/20 transition-all duration-200">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-space-grotesk font-bold uppercase tracking-wider text-white/50">
              Events Published
            </span>
            <div className="p-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-space-grotesk text-white">
            {stats.totalEvents || 0}
          </p>
          <p className="text-[10px] text-white/40 font-mono mt-2">Active & past events</p>
        </div>

        {/* Database Telemetry */}
        <div className="p-4 bg-transparent border border-white/10 hover:border-white/20 transition-all duration-200">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-space-grotesk font-bold uppercase tracking-wider text-white/50">
              MongoDB Telemetry
            </span>
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-space-grotesk text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {stats.dbStatus}
          </p>
          <p className="text-[10px] text-white/40 font-mono mt-2">Heartbeat active</p>
        </div>

        {/* Memory & Uptime */}
        <div className="p-4 bg-transparent border border-white/10 hover:border-white/20 transition-all duration-200">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-space-grotesk font-bold uppercase tracking-wider text-white/50">
              Node RAM & Uptime
            </span>
            <div className="p-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {stats.memoryUsageMB?.heapUsed || 0} MB
          </p>
          <p className="text-[10px] text-white/40 font-mono mt-2">
            Uptime: {stats.uptimeFormatted}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Recent Signups & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Member Registrations */}
        <div className="border border-white/10 p-5 bg-transparent">
          <h2 className="text-sm font-bold font-space-grotesk uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-500" /> Recent Signups
          </h2>

          {stats.recentSignups && stats.recentSignups.length > 0 ? (
            <div className="divide-y divide-white/10">
              {stats.recentSignups.map((u) => (
                <div key={u._id} className="py-2.5 flex items-center justify-between text-xs font-space-grotesk">
                  <div>
                    <p className="font-bold text-white">{u.name || u.username}</p>
                    <p className="text-[10px] text-white/50">
                      {u.branch || "General"} · Batch {u.batch || "N/A"}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "Recent"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/40 italic py-4">No recent member signups recorded.</p>
          )}
        </div>

        {/* System Activity & Logs */}
        <div className="border border-white/10 p-5 bg-transparent">
          <h2 className="text-sm font-bold font-space-grotesk uppercase tracking-wider text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-500" /> Security & Audit Trail
          </h2>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div key={log.id} className="p-2 border border-white/5 bg-white/5 font-mono text-[11px] flex justify-between items-start gap-2">
                <span className="text-white/80">{log.message}</span>
                <span className="text-[9px] text-white/40 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
