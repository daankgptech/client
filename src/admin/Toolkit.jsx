import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Wrench,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  RefreshCw,
  X,
  Folder,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  FileText,
  Link as LinkIcon,
  Tag,
  FolderPlus,
} from "lucide-react";
import { api } from "../utils/Secure/api";
import { cache } from "../utils/cache";
import SEO from "../utils/SEO";

export default function AdminToolkit() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Resource Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Category Modal State (Add & Edit Category)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [newCategoryKey, setNewCategoryKey] = useState("");
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  // Invalidate cache for all sections so client sees updated data
  const invalidateClientCache = () => {
    cache.remove("/toolkit/categories");
    cache.remove("/toolkit/erp");
    cache.remove("/toolkit/fresher");
    cache.remove("/toolkit/academic");
    cache.remove("/toolkit/cdc");
    categories.forEach((cat) => cache.remove(`/toolkit/${cat.key}`));
    cache.remove("/toolkit");
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await api.get("/admin/toolkit/categories");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCategories(res.data.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to fetch admin categories:", err);
      toast.error("Failed to load toolkit categories.");
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch admin toolkit items
  const fetchToolkitItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/toolkit?category=${activeCategory}&search=${encodeURIComponent(searchQuery)}`);
      if (res.data?.success) {
        setItems(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch admin toolkit error:", err);
      toast.error("Failed to fetch toolkit resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchToolkitItems();
  }, [activeCategory, searchQuery]);

  // Resource Modal Handlers
  const openCreateModal = () => {
    if (categories.length === 0) {
      toast.error("Please add at least one category before adding resources.");
      openCreateCategoryModal();
      return;
    }
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setLink("");
    const defaultCatKey = activeCategory !== "all" ? activeCategory : categories[0]?.key || "";
    setCategory(defaultCatKey);
    setIsPopular(false);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setLink(item.link || "");
    setCategory(item.category || categories[0]?.key || "");
    setIsPopular(Boolean(item.isPopular));
    setIsActive(item.isActive !== undefined ? item.isActive : true);
    setModalOpen(true);
  };

  // Category Modal Handlers
  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setNewCategoryLabel("");
    setNewCategoryKey("");
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setNewCategoryLabel(cat.label || "");
    setNewCategoryKey(cat.key || "");
    setCategoryModalOpen(true);
  };

  // Save / Update Resource Item
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!title.trim() || !link.trim() || !category) {
      toast.error("Title, resource link, and category are required.");
      return;
    }

    setSubmitting(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      link: link.trim(),
      category: category.toLowerCase().trim(),
      isPopular,
      isActive,
    };

    try {
      if (editingItem) {
        const res = await api.put(`/admin/toolkit/${editingItem._id}`, payload);
        if (res.data?.success) {
          toast.success("Toolkit resource updated successfully!");
          invalidateClientCache();
          fetchToolkitItems();
          setModalOpen(false);
        }
      } else {
        const res = await api.post("/admin/toolkit", payload);
        if (res.data?.success) {
          toast.success("New toolkit resource added!");
          invalidateClientCache();
          fetchToolkitItems();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Save toolkit resource error:", err);
      // toast.error(err.response?.data?.message || "Failed to save toolkit resource.");
    } finally {
      setSubmitting(false);
    }
  };

  // Save / Edit Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryLabel.trim()) {
      toast.error("Category label is required.");
      return;
    }

    setCategorySubmitting(true);
    const payload = {
      label: newCategoryLabel.trim(),
      key: newCategoryKey.trim() || undefined,
    };

    try {
      if (editingCategory && editingCategory._id) {
        const res = await api.put(`/admin/toolkit/categories/${editingCategory._id}`, payload);
        if (res.data?.success && res.data.data) {
          toast.success(`Category '${res.data.data.label}' updated!`);
          invalidateClientCache();
          await fetchCategories();
          await fetchToolkitItems();
          setCategoryModalOpen(false);
        }
      } else {
        const res = await api.post("/admin/toolkit/categories", payload);
        if (res.data?.success && res.data.data) {
          toast.success(`New Category '${res.data.data.label}' created!`);
          invalidateClientCache();
          const createdCat = res.data.data;
          await fetchCategories();
          setActiveCategory(createdCat.key);
          setCategoryModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Save category error:", err);
      toast.error(err.response?.data?.message || "Failed to save category.");
    } finally {
      setCategorySubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (cat) => {
    if (!cat || !cat._id) return;
    if (!window.confirm(`Are you sure you want to delete category "${cat.label}"?`)) return;

    try {
      const res = await api.delete(`/admin/toolkit/categories/${cat._id}`);
      if (res.data?.success) {
        toast.success(`Category '${cat.label}' deleted.`);
        invalidateClientCache();
        await fetchCategories();
        if (activeCategory === cat.key) setActiveCategory("all");
        await fetchToolkitItems();
      }
    } catch (err) {
      console.error("Delete category error:", err);
      toast.error(err.response?.data?.message || "Failed to delete category.");
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const newStatus = !item.isActive;
      const res = await api.put(`/admin/toolkit/${item._id}`, { isActive: newStatus });
      if (res.data?.success) {
        toast.success(`Resource set to ${newStatus ? "Active" : "Hidden"}`);
        invalidateClientCache();
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isActive: newStatus } : i))
        );
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteItem = async (itemId, resourceTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${resourceTitle}"?`)) return;

    try {
      const res = await api.delete(`/admin/toolkit/${itemId}`);
      if (res.data?.success) {
        toast.success(`Deleted "${resourceTitle}".`);
        invalidateClientCache();
        setItems((prev) => prev.filter((i) => i._id !== itemId));
      }
    } catch (err) {
      console.error("Delete toolkit error:", err);
      toast.error("Failed to delete toolkit resource.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8 space-y-6 font-sans selection:bg-red-600 selection:text-white">
      <SEO title="Toolkit Manager | DAAN KGP Admin" description="Toolkit Manager Admin" noindex={true} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center text-white shadow-lg shadow-red-950/50">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Toolkit Resource Manager</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Manage resources and categories dynamically across Toolkit sections.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              fetchCategories();
              fetchToolkitItems();
            }}
            disabled={loading}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-900/50 text-zinc-400 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-500" : ""}`} />
          </button>

          {/* Add Category Button */}
          <button
            onClick={openCreateCategoryModal}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-red-600 text-zinc-200 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <FolderPlus className="w-4 h-4 text-red-400" />
            <span>Add Category</span>
          </button>

          {/* Add Resource Button */}
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 transition-all shrink-0 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Resource</span>
          </button>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Tabs with Edit & Delete Controls */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-red-600 text-white shadow-md shadow-red-950"
                : "bg-zinc-950 border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-red-900/40"
            }`}
          >
            All Categories ({categories.length})
          </button>

          {categoriesLoading ? (
            <span className="text-xs text-zinc-500 animate-pulse">Loading categories...</span>
          ) : categories.length === 0 ? (
            <button
              onClick={openCreateCategoryModal}
              className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-400 hover:text-white text-xs font-medium flex items-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Create First Category</span>
            </button>
          ) : (
            categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <div key={cat._id || cat.key} className="flex items-center gap-1 group">
                  <button
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-red-600 text-white shadow-md shadow-red-950"
                        : "bg-zinc-950 border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-red-900/40"
                    }`}
                  >
                    {cat.label}
                  </button>

                  {/* Category Edit & Delete Actions */}
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditCategoryModal(cat)}
                      className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title={`Edit '${cat.label}' Category`}
                    >
                      <Edit3 className="w-3 h-3 text-red-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-red-200 transition-colors"
                      title={`Delete '${cat.label}' Category`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Live Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Resources Table / Cards Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-white/10 rounded" />
                  <div className="h-4 w-16 bg-white/5 rounded-full" />
                </div>
                <div className="h-3 w-full bg-white/5 rounded" />
                <div className="h-3 w-2/3 bg-white/5 rounded" />
                <div className="pt-2 flex justify-between border-t border-zinc-900">
                  <div className="h-6 w-20 bg-white/10 rounded" />
                  <div className="h-6 w-16 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 p-12 rounded-2xl text-center">
            <Wrench className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Resources Found</h3>
            <p className="text-xs text-zinc-500 mb-4">No toolkit resources match your filter criteria.</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add Resource
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className={`bg-zinc-950 border p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                item.isActive ? "border-zinc-800 hover:border-red-900/60" : "border-zinc-900 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.isActive
                      ? "bg-red-950/80 border border-red-800/60 text-red-400"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-600"
                  }`}
                >
                  <Folder className="w-5 h-5" />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-semibold text-red-400 bg-red-950/80 border border-red-900/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>

                    {item.isPopular && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Popular
                      </span>
                    )}

                    {item.isActive ? (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>

                  {item.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{item.description}</p>
                  )}

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-400 hover:underline inline-flex items-center gap-1 font-mono mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {item.link}
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:self-center shrink-0">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    item.isActive
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-400 hover:bg-emerald-900/60"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                  title="Toggle resource visibility"
                >
                  {item.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-zinc-500" />}
                  <span>{item.isActive ? "Active" : "Hidden"}</span>
                </button>

                <button
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-red-400" />
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteItem(item._id, item.title)}
                  className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900 hover:text-white transition-all text-xs"
                  title="Delete Resource"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT RESOURCE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-red-900/40 rounded-2xl p-6 shadow-2xl shadow-red-950/50 relative animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-950 border border-red-800 flex items-center justify-center text-red-500">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {editingItem ? "Edit Toolkit Resource" : "Add New Toolkit Resource"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  Category Section *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white focus:outline-none"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat._id || cat.key} value={cat.key}>
                      {cat.label} ({cat.key})
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource Title */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  Resource Title *
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Past Year CDC Question Vault 2026"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Resource Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of what this resource contains..."
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              {/* Resource Target Link URL */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  Resource Link (URL) *
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://erp.iitkgp.ac.in/ or https://drive.google.com/..."
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs font-medium text-zinc-300 cursor-pointer">
                    Active (Public)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isPopular" className="text-xs font-medium text-zinc-300 cursor-pointer">
                    Mark as Popular
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </div>
                  ) : editingItem ? (
                    "Update Resource"
                  ) : (
                    "Create Resource"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-red-900/40 rounded-2xl p-6 shadow-2xl shadow-red-950/50 relative animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-950 border border-red-800 flex items-center justify-center text-red-500">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
              </div>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Category Label */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  Category Display Name *
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                  <input
                    type="text"
                    value={newCategoryLabel}
                    onChange={(e) => {
                      setNewCategoryLabel(e.target.value);
                      if (!editingCategory && !newCategoryKey) {
                        setNewCategoryKey(
                          e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, "-")
                        );
                      }
                    }}
                    placeholder="e.g. ERP Portal, Fresher Zone, or Career"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Category URL Key */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  URL Key (Slug)
                </label>
                <input
                  type="text"
                  value={newCategoryKey}
                  onChange={(e) => setNewCategoryKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="e.g. erp or fresher or career"
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 font-mono focus:outline-none"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Will be accessed via URL: <span className="font-mono text-red-400">/toolkit/{newCategoryKey || "category-key"}</span>
                </p>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={categorySubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 disabled:opacity-50"
                >
                  {categorySubmitting ? (
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </div>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
