import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  X, 
  Layers, 
  AlertTriangle,
  Upload
} from 'lucide-react';
import { api, BlockItem } from '../../services/api.ts';

export const BlocksView: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<BlockItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    dimensions: '8" x 8" x 16"',
    compressiveStrength: '1,800 - 2,200 PSI',
    application: '',
    weight: '22 - 24 kg',
    materialMix: 'High-ratio Portland cement, fine aggregate & washed quarry dust',
    productionCapacity: '10,000 units / day',
    priceEstimate: 'Direct Plant Rate with Delivery',
    inStock: true,
    isPublished: true,
    imageUrl: '',
    imageAlt: '',
  });

  const loadBlocks = async () => {
    try {
      const res = await api.getAdminBlocks();
      if (res.success) setBlocks(res.blocks);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to load block products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingBlock(null);
    setFormData({
      name: '',
      dimensions: '8" x 8" x 16"',
      compressiveStrength: '1,800 - 2,200 PSI',
      application: 'Hill retaining walls, foundation basements, load-bearing mountain walls',
      weight: '22 - 24 kg',
      materialMix: 'High-ratio Portland cement, fine aggregate & washed quarry dust',
      productionCapacity: '10,000 units / day',
      priceEstimate: 'Direct Plant Rate with Delivery',
      inStock: true,
      isPublished: true,
      imageUrl: '',
      imageAlt: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b: BlockItem) => {
    setEditingBlock(b);
    setFormData({
      name: b.name,
      dimensions: b.dimensions,
      compressiveStrength: b.compressiveStrength,
      application: b.application,
      weight: b.weight,
      materialMix: b.materialMix,
      productionCapacity: b.productionCapacity,
      priceEstimate: b.priceEstimate,
      inStock: b.inStock,
      isPublished: b.isPublished,
      imageUrl: b.imageUrl,
      imageAlt: b.imageAlt,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dimensions.trim()) {
      showFeedback('error', 'Block name and dimensions are required.');
      return;
    }

    try {
      if (editingBlock) {
        const res = await api.updateBlock(editingBlock.id, formData);
        if (res.success) {
          setBlocks(prev => prev.map(b => (b.id === editingBlock.id ? res.block : b)));
          showFeedback('success', `Block "${res.block.name}" updated successfully.`);
        }
      } else {
        const res = await api.createBlock(formData);
        if (res.success) {
          setBlocks(prev => [res.block, ...prev]);
          showFeedback('success', `Block "${res.block.name}" added to factory line.`);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showFeedback('error', err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteBlock(id);
      if (res.success) {
        setBlocks(prev => prev.filter(b => b.id !== id));
        showFeedback('success', 'Block product removed from catalog.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to delete block');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await api.toggleBlockPublish(id);
      if (res.success) {
        setBlocks(prev => prev.map(b => (b.id === id ? res.block : b)));
        showFeedback(
          'success',
          res.block.isPublished ? 'Block published to public website.' : 'Block hidden from public website.'
        );
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to toggle status');
    }
  };

  const filteredBlocks = blocks.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.dimensions.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.application.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' 
            : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)}>✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#183262]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Boxes className="w-6 h-6 text-cyan-400" />
            Block Factory Management
          </h1>
          <p className="text-xs text-slate-400">
            Control automated hydraulic press block specifications, daily batch capacity, and moisture resistance attributes.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Block Product</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by block name, dimensions (e.g. 8x8x16) or application..."
          className="w-full pl-9 pr-4 py-2 bg-[#0e1d3e] border border-[#1e3c75] rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Grid of Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlocks.map((b) => (
          <div key={b.id} className="bg-[#0b1736] border border-[#1d3a72] rounded-xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-orange-400 font-mono">{b.dimensions}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                  {b.compressiveStrength}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{b.name}</h3>
              <p className="text-xs text-slate-300 mb-4">{b.application}</p>

              <div className="space-y-1.5 text-xs text-slate-400 border-t border-[#183262] pt-3">
                <div className="flex justify-between">
                  <span>Unit Weight:</span>
                  <span className="text-white font-medium">{b.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="text-slate-200">{b.productionCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Indication:</span>
                  <span className="text-emerald-400">{b.priceEstimate}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#183262] flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(b.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  b.isPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/40 text-slate-400'
                }`}
              >
                {b.isPublished ? 'Published' : 'Draft'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(b)}
                  className="p-1.5 bg-[#12254e] hover:bg-[#1a3368] text-slate-200 rounded"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(b.id)}
                  className="p-1.5 bg-[#12254e] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded"
                  title="Delete"
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
                <Boxes className="w-5 h-5 text-cyan-400" />
                {editingBlock ? 'Edit Block Specifications' : 'Add Block Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Block Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 8 Inch Solid Mountain-Grade Heavy Concrete Block"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Dimensions *</label>
                  <input
                    type="text"
                    required
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder='8" x 8" x 16"'
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Compressive Strength</label>
                  <input
                    type="text"
                    value={formData.compressiveStrength}
                    onChange={(e) => setFormData({ ...formData, compressiveStrength: e.target.value })}
                    placeholder="1,800 - 2,200 PSI"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Unit Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Approx. 22 - 24 kg"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Daily Production Capacity</label>
                  <input
                    type="text"
                    value={formData.productionCapacity}
                    onChange={(e) => setFormData({ ...formData, productionCapacity: e.target.value })}
                    placeholder="10,000 units / day"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Recommended Mountain Application</label>
                <textarea
                  rows={2}
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  placeholder="Retaining walls, basements, exterior load-bearing walls..."
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Material Mix & Aggregates</label>
                <input
                  type="text"
                  value={formData.materialMix}
                  onChange={(e) => setFormData({ ...formData, materialMix: e.target.value })}
                  placeholder="Portland cement, washed quarry dust, fine bajri..."
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="accent-cyan-500 w-4 h-4 rounded"
                  />
                  <span>Ready Stock in Yard</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="accent-cyan-500 w-4 h-4 rounded"
                  />
                  <span>Publish to Website</span>
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
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  Save Block
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
            <h3 className="text-base font-bold text-white">Delete Block Product?</h3>
            <p className="text-xs text-slate-300">This will remove this block line from both the admin and public plant showcase.</p>
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
