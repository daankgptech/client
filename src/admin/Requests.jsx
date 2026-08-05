import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  UserCheck,
  Check,
  X,
  Eye,
  Phone,
  Mail,
  GraduationCap,
  Building,
  School,
  Calendar,
  MapPin,
  Share2,
  User,
  AlertCircle,
} from "lucide-react";
import { api } from "../utils/Secure/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

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
        if (selectedUser?._id === reqUser._id) setSelectedUser(null);
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
        if (selectedUser?._id === reqUser._id) setSelectedUser(null);
        fetchRequests();
      }
    } catch (err) {
      console.error("Reject error:", err);
      toast.error("Failed to reject signup request");
    }
  };

  return (
    <div className="space-y-6 font-space-grotesk text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-rose-500" />
            Registration Approval Requests
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Review candidate applications. Click on any row to view all submitted signup details.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs rounded self-start sm:self-auto">
          {requests.length} Pending Application{requests.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Requests Table Rows */}
      {loading ? (
        <div className="border border-white/10 bg-transparent overflow-x-auto rounded-xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/50 uppercase tracking-wider text-[10px] font-mono">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-14">Img</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Batch - Dept</th>
                <th className="py-3 px-4 font-mono">Phone Number</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[1, 2, 3, 4, 5].map((n) => (
                <tr key={n} className="animate-pulse">
                  <td className="py-3.5 px-4 text-center"><div className="h-4 w-4 bg-white/10 rounded mx-auto" /></td>
                  <td className="py-3.5 px-4"><div className="w-9 h-9 bg-white/10 rounded-full" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-36 bg-white/10 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-28 bg-white/5 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-32 bg-white/5 rounded font-mono" /></td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-7 w-16 bg-white/5 rounded" />
                      <div className="h-7 w-16 bg-white/10 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : requests.length === 0 ? (
        <div className="p-8 border border-white/10 text-center space-y-3 bg-white/5 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h3 className="text-base font-bold text-white">All Clear!</h3>
          <p className="text-xs text-white/50">
            There are no pending registration approval requests right now.
          </p>
        </div>
      ) : (
        <div className="border border-white/10 bg-transparent overflow-x-auto rounded-xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/50 uppercase tracking-wider text-[10px] font-mono">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-14">Img</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Batch - Dept</th>
                <th className="py-3 px-4 font-mono">Phone Number</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {requests.map((u, index) => {
                const phone = u.contacts?.[0]?.phone || u.contacts?.phone || u.username;
                return (
                  <tr
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white/40 group-hover:text-rose-400">
                      {index + 1}
                    </td>

                    {/* Image */}
                    <td className="py-3.5 px-4">
                      {u.imgLink ? (
                        <img
                          src={u.imgLink}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-white/20"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xs">
                          {u.name?.[0] || u.username?.[0] || "U"}
                        </div>
                      )}
                    </td>

                    {/* Candidate Name */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white group-hover:text-rose-300 transition-colors">
                        {u.name || "N/A"}
                      </p>
                      <p className="text-[10px] text-white/50 font-mono">@{u.username}</p>
                    </td>

                    {/* Batch - Dept */}
                    <td className="py-3.5 px-4 font-mono text-white/80">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded">
                        Batch {u.batch || "-"} · {u.branch || "-"}
                      </span>
                    </td>

                    {/* Phone Number */}
                    <td className="py-3.5 px-4 font-mono text-white/80">
                      {phone}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors"
                          title="View Full Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReject(u)}
                          className="px-2.5 py-1 text-xs font-bold text-red-300 bg-red-950/40 hover:bg-red-900 border border-red-800/40 rounded flex items-center gap-1 transition-all"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => handleApprove(u)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1 transition-all shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate Full Profile Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />

          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-[#09090b] border border-white/15 rounded-2xl shadow-2xl overflow-y-auto p-6 space-y-6 text-white font-space-grotesk">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                {selectedUser.imgLink ? (
                  <img
                    src={selectedUser.imgLink}
                    alt={selectedUser.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/40 shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xl">
                    {selectedUser.name?.[0] || "U"}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedUser.name || "N/A"}</h2>
                  <p className="text-xs text-rose-400 font-mono">@{selectedUser.username}</p>
                  <span className="inline-block mt-1 text-[10px] px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase rounded-full">
                    Pending Approval Request
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Sections */}
            <div className="space-y-5 text-xs">
              {/* Section 1: Academic & Primary Info */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-white/10 pb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Academic & Primary Info
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Batch</span>
                    <span className="font-bold text-white">Batch {selectedUser.batch || "-"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Branch</span>
                    <span className="font-bold text-white">{selectedUser.branch || "-"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Current Semester</span>
                    <span className="font-bold text-white">Semester {selectedUser.semester || selectedUser.sem || "1"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Hall of Residence</span>
                    <span className="font-bold text-white">{selectedUser.hall || "-"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Degree / Course</span>
                    <span className="font-bold text-white">{selectedUser.course || "-"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Gender</span>
                    <span className="font-bold text-white">{selectedUser.gender || "-"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Dakshana COE</span>
                    <span className="font-bold text-white">{selectedUser.coe || "-"}</span>
                  </div>
                  {selectedUser.parentJNV && (
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase">Parent JNV</span>
                      <span className="font-bold text-white">{selectedUser.parentJNV}</span>
                    </div>
                  )}
                </div>
                {selectedUser.bio && (
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl italic text-white/70">
                    <span className="text-white/40 not-italic block text-[10px] uppercase mb-1 font-bold">Short Bio</span>
                    "{selectedUser.bio}"
                  </div>
                )}
              </div>

              {/* Section 2: Contact & Social Profiles */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-white/10 pb-1.5 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" /> Contact & Social Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white/5 border border-white/10 rounded-xl font-mono">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Phone Number</span>
                    <span className="text-white">{selectedUser.contacts?.[0]?.phone || selectedUser.contacts?.phone || selectedUser.phone || "-"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Email Address</span>
                    <span className="text-white">{selectedUser.contacts?.[0]?.email || selectedUser.contacts?.email || selectedUser.username}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">GitHub Link</span>
                    <span className="text-white">{selectedUser.contacts?.[0]?.github || selectedUser.contacts?.github || "Not Provided"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">LinkedIn Link</span>
                    <span className="text-white">{selectedUser.contacts?.[0]?.linkedIn || selectedUser.contacts?.linkedIn || "Not Provided"}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-white/40 block text-[10px] uppercase">Society / Involvements</span>
                    <span className="text-white">{selectedUser.involvements?.[0]?.soc || selectedUser.involvements?.soc || "Not Provided"}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Address & Personal Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-white/10 pb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Address & Emergency Info
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-white/5 border border-white/10 rounded-xl font-mono">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-sans">Date of Birth</span>
                    <span className="text-white">
                      {selectedUser.personalInfo?.dob ? new Date(selectedUser.personalInfo.dob).toLocaleDateString("en-IN") : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-sans">Blood Group</span>
                    <span className="text-white">{selectedUser.personalInfo?.bloodGroup || "-"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-sans">Emergency Contact</span>
                    <span className="text-white">{selectedUser.personalInfo?.emergencyContact || "-"}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-white/40 block text-[10px] uppercase font-sans">Full Address</span>
                    <span className="text-white font-sans">{selectedUser.personalInfo?.address || "-"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-sans">City</span>
                    <span className="text-white font-sans">{selectedUser.personalInfo?.city || "-"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-sans">State</span>
                    <span className="text-white font-sans">{selectedUser.personalInfo?.state || "-"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-sans">Pincode</span>
                    <span className="text-white">{selectedUser.personalInfo?.pincode || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = selectedUser;
                  setSelectedUser(null);
                  handleReject(target);
                }}
                className="px-4 py-2 text-xs font-bold text-red-300 bg-red-950/60 hover:bg-red-900 border border-red-800/40 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <X className="w-4 h-4" /> Reject Request
              </button>
              <button
                onClick={() => {
                  const target = selectedUser;
                  setSelectedUser(null);
                  handleApprove(target);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-900/30"
              >
                <Check className="w-4 h-4" /> Approve Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
