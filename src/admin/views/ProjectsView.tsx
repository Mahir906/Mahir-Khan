import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  X,
  Layers
} from 'lucide-react';
import { api, ProjectItem } from '../../services/api.ts';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    category: 'infrastructure' as ProjectItem['category'],
    scope: '',
    materialsSupplied: '',
    year: '2026',
    status: 'Completed' as ProjectItem['status'],
    isFeatured: true,
    isPublished: true,
  });

  const loadProjects = async () => {
    try {
      const res = await api.getAdminProjects();
      if (res.success) setProjects(res.projects);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      location: 'Pallandri, Sudhnoti, Azad Kashmir',
      category: 'infrastructure',
      scope: '',
      materialsSupplied: 'Bestway OPC Cement, 8" Solid Blocks, Margalla Bajri',
      year: new Date().getFullYear().toString(),
      status: 'Completed',
      isFeatured: true,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      location: p.location,
      category: p.category,
      scope: p.scope,
      materialsSupplied: p.materialsSupplied,
      year: p.year,
      status: p.status,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim()) {
      showFeedback('error', 'Project title and location are required.');
      return;
    }

    try {
      if (editingProject) {
        const res = await api.updateProject(editingProject.id, formData);
        if (res.success) {
          setProjects(prev => prev.map(p => (p.id === editingProject.id ? res.project : p)));
          showFeedback('success', `Project "${res.project.title}" updated.`);
        }
      } else {
        const res = await api.createProject(formData);
        if (res.success) {
          setProjects(prev => [res.project, ...prev]);
          showFeedback('success', `Project "${res.project.title}" created.`);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showFeedback('error', err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteProject(id);
      if (res.success) {
        setProjects(prev => prev.filter(p => p.id !== id));
        showFeedback('success', 'Project removed.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to delete project');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await api.toggleProjectPublish(id);
      if (res.success) {
        setProjects(prev => prev.map(p => (p.id === id ? res.project : p)));
        showFeedback('success', res.project.isPublished ? 'Project published live.' : 'Project drafted.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to toggle status');
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.materialsSupplied.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#183262]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-purple-400" />
            Landmark Construction Projects
          </h1>
          <p className="text-xs text-slate-400">
            Showcase infrastructure retaining walls, commercial plazas, and community developments supplied by USAMA TRADERS in Azad Kashmir.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project Showcase</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project title, location (e.g. Trarkhal), or materials..."
            className="w-full pl-9 pr-4 py-2 bg-[#0e1d3e] border border-[#1e3c75] rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#0e1d3e] border border-[#1e3c75] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
          >
            <option value="all">All Project Sectors</option>
            <option value="infrastructure">Infrastructure & Hill Retainers</option>
            <option value="commercial">Commercial Plazas</option>
            <option value="residential">Residential Hillside</option>
            <option value="public">Public & Community Mosques</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <div key={p.id} className="bg-[#0b1736] border border-[#1d3a72] rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                  {p.category}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {p.year}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{p.title}</h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>{p.location}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{p.scope}</p>

              <div className="p-3 bg-[#0e1d3e] rounded-lg border border-[#1a3568] text-xs">
                <strong className="text-orange-400 block mb-0.5">Materials Supplied:</strong>
                <span className="text-white">{p.materialsSupplied}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#183262] flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(p.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  p.isPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/40 text-slate-400'
                }`}
              >
                {p.isPublished ? 'Published' : 'Draft'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(p)}
                  className="p-1.5 bg-[#12254e] hover:bg-[#1a3368] text-slate-200 rounded"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(p.id)}
                  className="p-1.5 bg-[#12254e] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0b1735] border-2 border-[#1f3f7d] rounded-2xl shadow-2xl my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#08122c] border-b border-[#183262]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-purple-400" />
                {editingProject ? 'Edit Construction Project' : 'Add Project Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Pallandri By-Pass Hill Retaining Works"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Location in Sudhnoti / AJK *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Trarkhal Main Road, Sudhnoti"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Category Sector</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="infrastructure">Infrastructure</option>
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="public">Public / Mosques</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Project Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2025 - 2026"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Current Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Materials Supplied</label>
                <input
                  type="text"
                  value={formData.materialsSupplied}
                  onChange={(e) => setFormData({ ...formData, materialsSupplied: e.target.value })}
                  placeholder="e.g. 12,000 Bags Bestway OPC, 45,000 8-inch Blocks"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Scope of Work & Narrative</label>
                <textarea
                  rows={3}
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  placeholder="Describe structural hill reinforcement, foundations, concrete slab casting..."
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-purple-500 w-4 h-4 rounded"
                  />
                  <span className="text-white">Featured Project</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="accent-purple-500 w-4 h-4 rounded"
                  />
                  <span className="text-white">Publish Live</span>
                </label>
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
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b1735] border border-rose-500/40 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Delete Project Record?</h3>
            <p className="text-xs text-slate-300">Are you sure you want to permanently delete this project?</p>
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
