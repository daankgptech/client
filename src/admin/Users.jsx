import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Users as UsersIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  Filter,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { api } from "../utils/Secure/api";
import UserEditModal from "./UserEditModal";

const BATCH_OPTIONS = Array.from({ length: 15 }, (_, i) => (2015 + i).toString());

const BRANCH_OPTIONS = [
  "CS", "EE", "EC", "ME", "CE", "CH", "AE", "AG", "BT", "CY",
  "EX", "GG", "HS", "IE", "IM", "MA", "MF", "MI", "MT", "NA",
  "PH", "QE", "TS",
];

const HALL_OPTIONS = [
  "Azad", "BC Roy", "BR Ambedkar", "HJB", "JBR", "LBS", "MMM",
  "Patel", "RK", "RP", "SAM", "VS", "SN / IG", "MT", "GKH",
  "Sister Nivedita", "RLB", "NVH",
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 10 });

  // Filtering States
  const [graduatedFilter, setGraduatedFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [hallFilter, setHallFilter] = useState("all");

  // Sorting States
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: search.trim(),
        batch: batchFilter,
        branch: branchFilter,
        hall: hallFilter,
        graduated: graduatedFilter,
        sortBy,
        sortOrder,
        page: page.toString(),
        limit: "10",
      });

      const res = await api.get(`/admin/users?${queryParams.toString()}`);
      if (res.data?.success) {
        setUsers(res.data.users || []);
        setPagination(res.data.pagination || { total: 0, pages: 1, limit: 10 });
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      toast.error("Failed to load user directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, graduatedFilter, batchFilter, branchFilter, hallFilter, sortBy, sortOrder, page]);

  const handleResetFilters = () => {
    setSearch("");
    setGraduatedFilter("all");
    setBatchFilter("all");
    setBranchFilter("all");
    setHallFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
    toast.info("Filters reset to default");
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  // Delete User Account
  const handleDeleteUser = async (user) => {
    if (!user?._id) return;
    const confirmName = user.name || user.username;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete user account "${confirmName}"?`
      )
    ) {
      return;
    }

    try {
      const res = await api.delete(`/admin/users/${user._id}`);
      if (res.data?.success) {
        toast.success(`User "${confirmName}" deleted successfully`);
        fetchUsers();
      }
    } catch (err) {
      console.error("Delete user error:", err);
      toast.error("Failed to delete user account");
    }
  };

  const isFiltered =
    search !== "" ||
    graduatedFilter !== "all" ||
    batchFilter !== "all" ||
    branchFilter !== "all" ||
    hallFilter !== "all" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  return (
    <div className="space-y-6 font-space-grotesk">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            {/* <UsersIcon className="w-6 h-6 text-rose-500" /> */}
            User Directory Management
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Total {pagination.total || users.length} registered DAAN KGPians
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, branch, batch, hall..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-transparent border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter & Sorting Controls Toolbar */}
      <div className="p-3.5 bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter & Sort Controls
          </span>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] text-white/60 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-1">Status</label>
            <select
              value={graduatedFilter}
              onChange={(e) => {
                setGraduatedFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Roles</option>
              <option value="false">Scholars (Students)</option>
              <option value="true">Alumni (Graduated)</option>
            </select>
          </div>

          {/* Batch Filter */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-1">Batch</label>
            <select
              value={batchFilter}
              onChange={(e) => {
                setBatchFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Batches</option>
              {BATCH_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  Batch {b}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-1">Branch</label>
            <select
              value={branchFilter}
              onChange={(e) => {
                setBranchFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Branches</option>
              {BRANCH_OPTIONS.map((br) => (
                <option key={br} value={br}>
                  {br}
                </option>
              ))}
            </select>
          </div>

          {/* Hall Filter */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-1">Hall</label>
            <select
              value={hallFilter}
              onChange={(e) => {
                setHallFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Halls</option>
              {HALL_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="createdAt">Sign Up Date</option>
              <option value="name">Name (A-Z)</option>
              <option value="batch">Batch Year</option>
              <option value="cgpa">CGPA Score</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-1">Order</label>
            <button
              type="button"
              onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="w-full px-2 py-1.5 bg-[#09090b] border border-white/10 text-white hover:border-white/20 flex items-center justify-between font-bold"
            >
              <span>{sortOrder === "asc" ? "Ascending (↑)" : "Descending (↓)"}</span>
              <ArrowUpDown className="w-3 h-3 text-rose-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="border border-white/10 bg-transparent overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Member Name</th>
              <th className="py-3 px-4">Username / Email</th>
              <th className="py-3 px-4">Branch</th>
              <th className="py-3 px-4">Batch</th>
              <th className="py-3 px-4">Hall</th>
              <th className="py-3 px-4">CGPA</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((n) => (
                <tr key={n} className="animate-pulse border-b border-white/5">
                  <td className="py-3.5 px-4"><div className="h-4 w-32 bg-white/10 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-3 w-40 bg-white/5 rounded font-mono" /></td>
                  <td className="py-3.5 px-4"><div className="h-3.5 w-12 bg-white/10 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-3.5 w-16 bg-white/10 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-3.5 w-20 bg-white/5 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-3.5 w-10 bg-white/5 rounded" /></td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-7 w-12 bg-white/5 rounded" />
                      <div className="h-7 w-12 bg-white/10 rounded" />
                    </div>
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-white/40 italic">
                  No users found matching current filters.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      {u.imgLink ? (
                        <img
                          src={u.imgLink}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name?.[0] || u.username?.[0] || "U"}
                        </div>
                      )}
                      <div>
                        <span>{u.name || "N/A"}</span>
                        {u.graduated && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                            Alumni
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/70 font-mono text-[11px]">{u.username}</td>
                  <td className="py-3 px-4 text-white/80">{u.branch || "-"}</td>
                  <td className="py-3 px-4 text-white/80">Batch {u.batch || "-"}</td>
                  <td className="py-3 px-4 text-white/80">{u.hall || "-"}</td>
                  <td className="py-3 px-4 text-white/80">{u.cgpa || "-"}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 rounded transition-colors"
                        title="Edit Full Profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 rounded transition-colors"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        {pagination.pages > 1 && (
          <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs font-space-grotesk">
            <span className="text-white/50">
              Page {pagination.page} of {pagination.pages} ({pagination.total} users total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-white/10 hover:bg-white/5 text-white/80 disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                className="px-3 py-1 border border-white/10 hover:bg-white/5 text-white/80 disabled:opacity-30"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Schema User Edit Modal */}
      {editModalOpen && editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => {
            setEditModalOpen(false);
            setEditingUser(null);
          }}
          onSaveSuccess={fetchUsers}
        />
      )}
    </div>
  );
}
