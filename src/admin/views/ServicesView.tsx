import React, { useState, useEffect } from 'react';
import { HardHat, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';

interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  isPublished: boolean;
  displayOrder: number;
}

export const ServicesView: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    icon: 'HardHat',
    description: '',
    features: '',
    isPublished: true,
    displayOrder: 1,
  });

  const loadServices = async () => {
    try {
      const res = await fetch('/api/admin/services', {
        headers: { Authorization: `Bearer ${localStorage.getItem('ut_admin_token')}` },
      });
      const data = await res.json();
      if (data.success) setServices(data.services);
    } catch (err: any) {
      showFeedback('error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      icon: 'HardHat',
      description: '',
      features: 'Doorstep site delivery, Experienced operators, Certified quality',
      isPublished: true,
      displayOrder: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingService(s);
    setFormData({
      title: s.title,
      icon: s.icon,
      description: s.description,
      features: Array.isArray(s.features) ? s.features.join(', ') : '',
      isPublished: s.isPublished,
      displayOrder: s.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showFeedback('error', 'Service title is required.');
      return;
    }

    const payload = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
    };

    try {
      const token = localStorage.getItem('ut_admin_token');
      const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('success', 'Service saved successfully.');
        loadServices();
        setIsModalOpen(false);
      }
    } catch (err: any) {
      showFeedback('error', 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('ut_admin_token');
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setServices(prev => prev.filter(s => s.id !== id));
        showFeedback('success', 'Service removed.');
      }
    } catch (err: any) {
      showFeedback('error', 'Failed to delete service');
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
            <HardHat className="w-6 h-6 text-orange-400" />
            Construction & Supply Services
          </h1>
          <p className="text-xs text-slate-400">
            Configure core service offerings (Cement distribution, automated block manufacturing, mountain transport, aggregate hauling).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.id} className="bg-[#0b1736] border border-[#1d3a72] rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] text-slate-400 bg-[#0e1d3e] px-2 py-0.5 rounded">Order: {s.displayOrder}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  s.isPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/40 text-slate-400'
                }`}>
                  {s.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{s.title}</h3>
              <p className="text-xs text-slate-300 mb-3">{s.description}</p>
              
              {s.features && s.features.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#183262] text-xs text-slate-400">
                  {s.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#183262] flex justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(s)}
                className="p-1.5 bg-[#12254e] hover:bg-[#1a3368] text-slate-200 rounded"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(s.id)}
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
                {editingService ? 'Edit Service' : 'Add Construction Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Wholesale Mill-Direct Cement Supply"
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
                <label className="text-xs font-semibold text-slate-300">Key Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Guaranteed fresh, Direct trailer, Weighbridge verified"
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b1735] border border-rose-500/40 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Delete Service?</h3>
            <p className="text-xs text-slate-300">Are you sure you want to remove this service from website records?</p>
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
