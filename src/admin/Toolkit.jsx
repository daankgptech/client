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
    setCategory(categories[0]?.key || "erp");
    setIsPopular(false);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setLink(item.link || "");
    setCategory(item.category || categories[0]?.key || "erp");
    setIsPopular(Boolean(item.isPopular));
    setIsActive(item.isActive !== false);
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
      toast.error(err.response?.data?.message || "Failed to save toolkit resource.");
    } finally {
      setSubmitting(false);
    }
  };

  // Save / Update Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryLabel.trim()) {
      toast.error("Category display name is required.");
      return;
    }

    const categoryKey = (newCategoryKey || newCategoryLabel).toLowerCase().trim().replace(/[^a-z0-9-]/g, "");

    if (!categoryKey) {
      toast.error("Valid category URL key is required.");
      return;
    }

    setCategorySubmitting(true);
    const payload = {
      label: newCategoryLabel.trim(),
      key: categoryKey,
    };

    try {
      if (editingCategory) {
        const res = await api.put(`/admin/toolkit/categories/${editingCategory._id}`, payload);
        if (res.data?.success) {
          toast.success(`Category '${newCategoryLabel}' updated!`);
          invalidateClientCache();
          fetchCategories();
          setCategoryModalOpen(false);
        }
      } else {
        const res = await api.post("/admin/toolkit/categories", payload);
        if (res.data?.success) {
          toast.success(`New Category '${newCategoryLabel}' created!`);
          invalidateClientCache();
          fetchCategories();
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

  // Delete Category Handler
  const handleDeleteCategory = async (cat) => {
    if (!cat?._id) return;
    if (!window.confirm(`Are you sure you want to delete category '${cat.label}'?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/toolkit/categories/${cat._id}`);
      if (res.data?.success) {
        toast.success(`Category '${cat.label}' deleted.`);
        if (activeCategory === cat.key) setActiveCategory("all");
        invalidateClientCache();
        fetchCategories();
      }
    } catch (err) {
      console.error("Delete category error:", err);
      toast.error(err.response?.data?.message || "Failed to delete category.");
    }
  };

  // Toggle Active / Hidden Status
  const handleToggleActive = async (item) => {
    try {
      const res = await api.put(`/admin/toolkit/${item._id}`, {
        ...item,
        isActive: !item.isActive,
      });
      if (res.data?.success) {
        toast.success(`Resource '${item.title}' is now ${!item.isActive ? "Active" : "Hidden"}`);
        invalidateClientCache();
        fetchToolkitItems();
      }
    } catch (err) {
      console.error("Toggle active status error:", err);
      toast.error("Failed to change resource status.");
    }
  };

  // Delete Toolkit Item Handler
  const handleDeleteItem = async (id, itemTitle) => {
    if (!window.confirm(`Are you sure you want to delete resource '${itemTitle}'?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/toolkit/${id}`);
      if (res.data?.success) {
        toast.success(`Resource '${itemTitle}' deleted.`);
        invalidateClientCache();
        fetchToolkitItems();
      }
    } catch (err) {
      console.error("Delete toolkit error:", err);
      toast.error("Failed to delete toolkit resource.");
    }
  };

  return (
    <div className="space-y-6 font-space-grotesk text-white">
      <SEO title="Toolkit Manager | DAAN KGP Admin" description="Toolkit Manager Admin" noindex={true} />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            {/* <Wrench className="w-6 h-6 text-red-500" /> */}
            Toolkit Resource Manager
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Manage links, documents, and dynamic categories across DAAN Toolkit sections
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              fetchCategories();
              fetchToolkitItems();
            }}
            disabled={loading}
            className="p-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-red-500" : ""}`} />
          </button>

          <button
            onClick={openCreateCategoryModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all"
          >
            <FolderPlus className="w-3.5 h-3.5 text-red-400" />
            <span>Add Category</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all shrink-0 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs & Live Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-w-full">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
              activeCategory === "all"
                ? "bg-red-500 text-white border-red-500"
                : "bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/20"
            }`}
          >
            All Categories ({categories.length})
          </button>

          {categoriesLoading ? (
            <span className="text-xs text-white/40 italic animate-pulse">Loading categories...</span>
          ) : categories.length === 0 ? (
            <button
              onClick={openCreateCategoryModal}
              className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Create First Category</span>
            </button>
          ) : (
            categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <div key={cat._id || cat.key} className="flex items-center gap-1 group shrink-0">
                  <button
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                      isActive
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {cat.label}
                  </button>

                  {/* Category Action Controls */}
                  <div className="flex items-center gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditCategoryModal(cat)}
                      className="p-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
                      title={`Edit '${cat.label}' Category`}
                    >
                      <Edit3 className="w-3 h-3 text-red-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1 bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white border border-red-800/40 transition-colors"
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
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-9 pr-4 py-1.5 bg-transparent border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-red-500 transition-all font-space-grotesk"
          />
        </div>
      </div>

      {/* Resources Table / Cards Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-white/10 rounded" />
                  <div className="h-4 w-16 bg-white/5 rounded-full" />
                </div>
                <div className="h-3 w-full bg-white/5 rounded" />
                <div className="h-3 w-2/3 bg-white/5 rounded" />
                <div className="pt-2 flex justify-between border-t border-white/10">
                  <div className="h-6 w-20 bg-white/10 rounded" />
                  <div className="h-6 w-16 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="border border-white/10 bg-white/5 p-12 text-center space-y-3">
            <Wrench className="w-10 h-10 text-white/30 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white">No Resources Found</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto">No toolkit resources match your current category or search criteria.</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Resource
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className={`border bg-transparent p-4 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all group ${
                  item.isActive ? "border-white/10" : "border-white/5 opacity-60"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 uppercase tracking-wider">
                      {item.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.isPopular && (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Popular
                        </span>
                      )}

                      {item.isActive ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-white/40 bg-white/5 border border-white/10 px-2 py-0.5">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-red-300 transition-colors">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed font-sans">{item.description}</p>
                  )}

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-400 hover:underline inline-flex items-center gap-1 font-mono break-all pt-1"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[240px]">{item.link}</span>
                  </a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`px-2.5 py-1 text-xs font-bold flex items-center gap-1 transition-all border ${
                      item.isActive
                        ? "bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                    }`}
                    title="Toggle resource visibility"
                  >
                    {item.isActive ? <ToggleRight className="w-3.5 h-3.5 text-emerald-400" /> : <ToggleLeft className="w-3.5 h-3.5 text-white/40" />}
                    <span>{item.isActive ? "Active" : "Hidden"}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <Edit3 className="w-3 h-3 text-red-400" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item._id, item.title)}
                    className="p-1 px-2 bg-red-950/40 border border-red-800/40 text-red-300 hover:bg-red-900 hover:text-white transition-all text-xs font-bold ml-auto"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT RESOURCE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#09090b] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5 text-white font-space-grotesk">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {editingItem ? "Edit Toolkit Resource" : "Add New Toolkit Resource"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-white/60 hover:text-white rounded bg-white/5 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              {/* Category Selection */}
              <div>
                <label className="block text-white/70 font-bold mb-1">Category Section *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-red-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat._id || cat.key} value={cat.key} className="bg-[#09090b]">
                      {cat.label} ({cat.key})
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource Title */}
              <div>
                <label className="block text-white/70 font-bold mb-1">Resource Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Past Year CDC Question Vault 2026"
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              {/* Resource Description */}
              <div>
                <label className="block text-white/70 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of what this resource contains..."
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 resize-none font-sans"
                />
              </div>

              {/* Resource Link URL */}
              <div>
                <label className="block text-white/70 font-bold mb-1">Resource Link (URL) *</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://erp.iitkgp.ac.in/ or https://drive.google.com/..."
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  required
                />
              </div>

              {/* Status Checkboxes */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-red-500 rounded cursor-pointer"
                  />
                  <span className="text-white/80 font-bold">Active (Public)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 accent-red-500 rounded cursor-pointer"
                  />
                  <span className="text-white/80 font-bold">Mark as Popular</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/10 bg-white/5 text-white/70 hover:text-white font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingItem ? "Update Resource" : "Create Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#09090b] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5 text-white font-space-grotesk">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
              </div>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 text-white/60 hover:text-white rounded bg-white/5 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 font-bold mb-1">Category Display Name *</label>
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
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">URL Key (Slug)</label>
                <input
                  type="text"
                  value={newCategoryKey}
                  onChange={(e) => setNewCategoryKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="e.g. erp or fresher or career"
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 border border-white/10 bg-white/5 text-white/70 hover:text-white font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={categorySubmitting}
                  className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {categorySubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
