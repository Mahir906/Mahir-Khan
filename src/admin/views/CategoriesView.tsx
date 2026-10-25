import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { api, CategoryItem } from '../../services/api.ts';

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: 1,
  });

  const loadCategories = async () => {
    try {
      const res = await api.getAdminCategories();
      if (res.success) setCategories(res.categories);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      displayOrder: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CategoryItem) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      description: c.description,
      displayOrder: c.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showFeedback('error', 'Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        const res = await api.updateCategory(editingCategory.id, formData);
        if (res.success) {
          setCategories(prev => prev.map(c => (c.id === editingCategory.id ? res.category : c)));
          showFeedback('success', 'Category updated successfully.');
        }
      } else {
        const res = await api.createCategory(formData);
        if (res.success) {
          setCategories(prev => [...prev, res.category]);
          showFeedback('success', 'Category created successfully.');
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showFeedback('error', err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteCategory(id);
      if (res.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        showFeedback('success', 'Category deleted.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to delete category');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          feedback.type === 'success' ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)}>✕</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#183262]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-orange-400" />
            Product Categories
          </h1>
          <p className="text-xs text-slate-400">
            Organize cements, concrete blocks, steel rebar, and aggregate categories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.id} className="bg-[#0b1736] border border-[#1d3a72] rounded-xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] text-slate-400 bg-[#0e1d3e] px-2 py-0.5 rounded">Order: {c.displayOrder}</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{c.name}</h3>
              <p className="text-xs text-slate-400">{c.description || 'No description provided.'}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#183262] flex justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(c)}
                className="p-1.5 bg-[#12254e] hover:bg-[#1a3368] text-slate-200 rounded"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(c.id)}
                className="p-1.5 bg-[#12254e] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0b1735] border-2 border-[#1f3f7d] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#08122c] border-b border-[#183262]">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Portland & Structural Cement"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-4 border-t border-[#183262] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#12254e] text-slate-300 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b1735] border border-rose-500/40 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Delete Category?</h3>
            <p className="text-xs text-slate-300">Are you sure you want to delete this category? Any assigned products must first be re-assigned.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 bg-[#12254e] text-slate-300 text-xs rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
