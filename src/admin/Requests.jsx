import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  UserCheck,
  Check,
  X,
  Clock,
  Phone,
  Mail,
  GraduationCap,
  Building,
  School,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { api } from "../utils/Secure/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/requests");
      if (res.data?.success) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error("Fetch pending requests error:", err);
      toast.error("Failed to load registration approval requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (reqUser) => {
    if (!reqUser?._id) return;
    const confirmName = reqUser.name || reqUser.username;

    try {
      const res = await api.patch(`/admin/requests/${reqUser._id}/approve`);
      if (res.data?.success) {
        toast.success(`Approved signup for "${confirmName}"! User can now Sign In.`);
        fetchRequests();
      }
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Failed to approve signup request");
    }
  };

  const handleReject = async (reqUser) => {
    if (!reqUser?._id) return;
    const confirmName = reqUser.name || reqUser.username;

    if (!window.confirm(`Are you sure you want to REJECT and delete signup request for "${confirmName}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/requests/${reqUser._id}/reject`);
      if (res.data?.success) {
        toast.success(`Registration request for "${confirmName}" rejected.`);
        fetchRequests();
      }
    } catch (err) {
      console.error("Reject error:", err);
      toast.error("Failed to reject signup request");
    }
  };

  return (
    <div className="space-y-6 font-space-grotesk">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-rose-500" />
            Registration Approval Requests
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Review member profile applications pending DAAN Admin verification
          </p>
        </div>

        <div className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs rounded self-start sm:self-auto">
          {requests.length} Pending Application{requests.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Request Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-white/40 italic text-xs">
          Loading signup requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="p-8 border border-white/10 text-center space-y-3 bg-white/5">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h3 className="text-base font-bold text-white">All Clear!</h3>
          <p className="text-xs text-white/50">
            There are no pending registration approval requests right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((u) => {
            const phone = u.contacts?.[0]?.phone || u.username;
            const email = u.contacts?.[0]?.email || u.username;
            return (
              <div
                key={u._id}
                className="p-5 border border-white/10 bg-transparent hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Candidate Summary */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {u.imgLink ? (
                        <img
                          src={u.imgLink}
                          alt={u.name}
                          className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-base shrink-0">
                          {u.name?.[0] || u.username?.[0] || "U"}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-white">{u.name || "N/A"}</h3>
                        <p className="text-xs text-rose-400 font-mono">@{u.username}</p>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase rounded">
                      Pending
                    </span>
                  </div>

                  {/* Info Metadata */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/70 bg-white/5 p-3 border border-white/10 font-mono text-[11px]">
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Phone Number</span>
                      <span>{phone}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Batch & Branch</span>
                      <span>Batch {u.batch || "-"} · {u.branch || "-"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Hall of Residence</span>
                      <span>{u.hall || "-"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Degree / Course</span>
                      <span>{u.course || "-"}</span>
                    </div>
                    {u.parentJNV && (
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase">Parent JNV</span>
                        <span>{u.parentJNV}</span>
                      </div>
                    )}
                    {u.coe && (
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase">Dakshana COE</span>
                        <span>{u.coe}</span>
                      </div>
                    )}
                  </div>

                  {u.bio && (
                    <p className="text-xs text-white/60 italic border-l-2 border-rose-500/40 pl-2 py-0.5">
                      "{u.bio}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleReject(u)}
                    className="flex-1 py-2 text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Reject Request
                  </button>
                  <button
                    onClick={() => handleApprove(u)}
                    className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Candidate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
