import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Megaphone,
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { api } from "../utils/Secure/api";
import { clearCachedNotices } from "../utils/noticeCache";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    text: "",
    date: "",
    link: "",
    isActive: true,
    priority: 0,
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/notices");
      if (res.data?.success) {
        setNotices(res.data.notices || []);
      }
    } catch (err) {
      console.error("Fetch admin notices error:", err);
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormData({
      text: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      link: "",
      isActive: true,
      priority: 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({
      text: notice.text || "",
      date: notice.date || "",
      link: notice.link || "",
      isActive: Boolean(notice.isActive),
      priority: notice.priority || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text || !formData.date) {
      toast.error("Notice text and date are required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingNotice?._id) {
        const res = await api.put(`/admin/notices/${editingNotice._id}`, formData);
        if (res.data?.success) {
          toast.success("Notice updated successfully");
          clearCachedNotices();
          setModalOpen(false);
          fetchNotices();
        }
      } else {
        const res = await api.post("/admin/notices", formData);
        if (res.data?.success) {
          toast.success("Notice created successfully");
          clearCachedNotices();
          setModalOpen(false);
          fetchNotices();
        }
      }
    } catch (err) {
      console.error("Save notice error:", err);
      toast.error("Failed to save notice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (notice) => {
    try {
      const res = await api.put(`/admin/notices/${notice._id}`, {
        isActive: !notice.isActive,
      });
      if (res.data?.success) {
        toast.success(`Notice ${!notice.isActive ? "activated" : "deactivated"}`);
        clearCachedNotices();
        fetchNotices();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (notice) => {
    if (!notice?._id) return;
    if (!window.confirm(`Are you sure you want to delete this notice?`)) return;

    try {
      const res = await api.delete(`/admin/notices/${notice._id}`);
      if (res.data?.success) {
        toast.success("Notice deleted");
        clearCachedNotices();
        fetchNotices();
      }
    } catch (err) {
      console.error("Delete notice error:", err);
      toast.error("Failed to delete notice");
    }
  };

  const filteredNotices = notices.filter(
    (n) =>
      n.text?.toLowerCase().includes(search.toLowerCase()) ||
      n.date?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-space-grotesk">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-rose-500" />
            Noticeboard Management
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Total {notices.length} announcements published on Homepage Hero
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notices..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-transparent border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Notice
          </button>
        </div>
      </div>

      {/* Notice Items Table */}
      <div className="border border-white/10 bg-transparent overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Date Tag</th>
              <th className="py-3 px-4">Announcement Text</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse border-b border-white/5">
                  <td className="py-3.5 px-4"><div className="h-4 w-20 bg-white/10 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-3/4 bg-white/10 rounded" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-16 bg-white/5 rounded-full" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-8 bg-white/5 rounded" /></td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-7 w-12 bg-white/5 rounded" />
                      <div className="h-7 w-12 bg-white/10 rounded" />
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredNotices.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-white/40 italic">
                  No notices found.
                </td>
              </tr>
            ) : (
              filteredNotices.map((n) => (
                <tr key={n._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-rose-400 whitespace-nowrap">
                    {n.date}
                  </td>
                  <td className="py-3 px-4 text-white max-w-md">
                    <p className="font-medium line-clamp-2">{n.text}</p>
                    {n.link && (
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-white/50 hover:text-white flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="w-3 h-3" /> {n.link}
                      </a>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(n)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase border transition-colors ${
                        n.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-white/5 text-white/40 border-white/10"
                      }`}
                    >
                      {n.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {n.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-white/70 font-mono">{n.priority || 0}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(n)}
                        className="p-1.5 text-white/70 hover:text-white border border-white/10 hover:bg-white/10 rounded transition-colors"
                        title="Edit Notice"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(n)}
                        className="p-1.5 text-rose-400 hover:text-white border border-rose-500/20 hover:bg-rose-500/20 rounded transition-colors"
                        title="Delete Notice"
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
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#09090b] border border-white/10 w-full max-w-lg p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editingNotice ? "Edit Notice" : "Create New Notice"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/60 mb-1">Date Tag (e.g. May 20 2026) *</label>
                <input
                  type="text"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="Date or date range text"
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Notice Announcement Text *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Announcement headline text..."
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Target Action Link (Optional)</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/events or https://..."
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1">Priority (Higher shows first)</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="noticeActiveCheck"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-rose-500"
                  />
                  <label htmlFor="noticeActiveCheck" className="text-white/80 cursor-pointer font-bold">
                    Active & Published
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/10 text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
