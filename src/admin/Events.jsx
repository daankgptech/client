import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Upload,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "../utils/Secure/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    date: "",
    driveLink: "",
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/events");
      if (res.data?.success) {
        setEvents(res.data.events || []);
      }
    } catch (err) {
      console.error("Fetch admin events error:", err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      date: new Date().toISOString().split("T")[0],
      driveLink: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      image: event.image || "",
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      driveLink: event.driveLink || "",
    });
    setModalOpen(true);
  };

  // Cloudinary image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await api.post("/admin/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success && res.data.url) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
        toast.success("Image uploaded to Cloudinary");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.image || !formData.date) {
      toast.error("Title, description, image, and date are required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingEvent?._id) {
        const res = await api.put(`/admin/events/${editingEvent._id}`, formData);
        if (res.data?.success) {
          toast.success("Event updated successfully");
          setModalOpen(false);
          fetchEvents();
        }
      } else {
        const res = await api.post("/admin/events", formData);
        if (res.data?.success) {
          toast.success("Event created successfully");
          setModalOpen(false);
          fetchEvents();
        }
      }
    } catch (err) {
      console.error("Save event error:", err);
      toast.error("Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (event) => {
    if (!event?._id) return;
    if (!window.confirm(`Are you sure you want to delete event "${event.title}"?`)) return;

    try {
      const res = await api.delete(`/admin/events/${event._id}`);
      if (res.data?.success) {
        toast.success("Event deleted");
        fetchEvents();
      }
    } catch (err) {
      console.error("Delete event error:", err);
      toast.error("Failed to delete event");
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-space-grotesk">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-rose-500" />
            Manage Events
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Total {events.length} published campus events & workshops
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event title..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-transparent border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Event Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="h-40 w-full bg-white/10 rounded" />
              <div className="h-5 w-3/4 bg-white/10 rounded" />
              <div className="h-3.5 w-full bg-white/5 rounded" />
              <div className="h-3.5 w-2/3 bg-white/5 rounded" />
              <div className="pt-2 flex justify-between border-t border-white/10">
                <div className="h-6 w-16 bg-white/10 rounded" />
                <div className="h-6 w-16 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 border border-white/10 text-center text-white/40 italic">
          No events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((item) => (
            <div
              key={item._id}
              className="border border-white/10 bg-transparent p-4 flex flex-col justify-between hover:border-white/20 transition-all group"
            >
              <div className="space-y-3">
                <div className="relative h-40 w-full overflow-hidden border border-white/10 bg-white/5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] bg-black/80 text-white border border-white/20">
                    {item.date ? new Date(item.date).toLocaleDateString("en-IN") : "No Date"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-tight group-hover:text-rose-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                {item.driveLink ? (
                  <a
                    href={item.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-rose-400 hover:text-white flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Drive Photos
                  </a>
                ) : (
                  <span className="text-[10px] text-white/30 italic">No Drive Link</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-white/70 hover:text-white border border-white/10 hover:bg-white/10 rounded transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-rose-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 text-rose-400 hover:text-white border border-rose-500/20 hover:bg-rose-500/20 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#09090b] border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/60 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual DAAN Alumni Meet 2026"
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Cover Image *</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL or upload file below..."
                    className="flex-1 px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  />
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer font-bold shrink-0">
                    {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="h-20 object-cover border border-white/10" />
                )}
              </div>

              <div>
                <label className="block text-white/60 mb-1">Description *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event details..."
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Google Drive Link (Optional)</label>
                <input
                  type="url"
                  value={formData.driveLink}
                  onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
