import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Filter,
  Eye
} from 'lucide-react';
import { api, GalleryItem } from '../../services/api.ts';

export const GalleryView: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'cement' as GalleryItem['category'],
    imageUrl: '',
    imageAlt: '',
    description: '',
    isPublished: true,
  });

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'cement', label: 'Cement' },
    { id: 'block_factory', label: 'Block Factory' },
    { id: 'trucks', label: 'Trucks' },
    { id: 'construction_projects', label: 'Construction Projects' },
    { id: 'general', label: 'General Gallery' },
  ];

  const loadGallery = async () => {
    try {
      const res = await api.getAdminGallery();
      if (res.success) setItems(res.gallery);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showFeedback('error', 'File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setUploading(true);
    setUploadProgress('Validating and uploading photo to server...');

    try {
      const res = await api.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: res.url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        imageAlt: prev.imageAlt || file.name,
      }));
      setUploadProgress('Upload complete!');
      showFeedback('success', 'Original business photo uploaded successfully.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      showFeedback('error', 'Please upload or provide an image URL.');
      return;
    }

    try {
      const res = await api.createGalleryItem(formData);
      if (res.success) {
        setItems(prev => [res.item, ...prev]);
        showFeedback('success', `Photo "${res.item.title}" added to gallery.`);
        setIsModalOpen(false);
        setFormData({
          title: '',
          category: 'cement',
          imageUrl: '',
          imageAlt: '',
          description: '',
          isPublished: true,
        });
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to save gallery photo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteGalleryItem(id);
      if (res.success) {
        setItems(prev => prev.filter(i => i.id !== id));
        showFeedback('success', 'Photo removed permanently.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to delete photo');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const filteredItems = items.filter(i => {
    if (selectedCategory === 'all') return true;
    return i.category === selectedCategory;
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
            <ImageIcon className="w-6 h-6 text-amber-400" />
            Media & Business Photo Gallery
          </h1>
          <p className="text-xs text-slate-400">
            Real photographic records of cement stock, automated block plants, mountain trucks, and Sudhnoti construction sites.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Business Photo</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-[#10224a] text-slate-300 hover:text-white border border-[#1e3c75]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-[#0b1736] border border-[#1d3a72] rounded-xl overflow-hidden shadow-lg group flex flex-col justify-between">
            <div className="relative aspect-video bg-[#071126] flex items-center justify-center overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.imageAlt || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-center p-4 text-slate-500">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[10px]">Photo Record</span>
                </div>
              )}
              <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-orange-400 font-bold uppercase text-[9px] px-2 py-0.5 rounded border border-[#1f3f7e]">
                {item.category.replace('_', ' ')}
              </span>
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white mb-1 truncate">{item.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#183262] flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs">
            No photos found in this category. Click "Upload Business Photo" to add an original site photo.
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0b1735] border-2 border-[#1f3f7d] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#08122c] border-b border-[#183262]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-400" />
                Upload Business Photograph
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              
              {/* File input */}
              <div className="p-5 bg-[#0e1d3e] border border-dashed border-[#234584] rounded-xl text-center space-y-2">
                <input
                  type="file"
                  id="gallery-file-input"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="gallery-file-input"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File (JPG, PNG, WebP)</span>
                </label>
                <p className="text-[10px] text-slate-400">Max size 5MB. Verified content validation enabled.</p>
                {uploadProgress && <p className="text-xs text-orange-400 font-semibold">{uploadProgress}</p>}
              </div>

              {formData.imageUrl && (
                <div className="flex items-center gap-3 p-3 bg-[#10224a] rounded-lg border border-[#21437e]">
                  <img src={formData.imageUrl} alt="Uploaded preview" className="w-16 h-16 object-cover rounded-lg" />
                  <div className="text-xs text-slate-300 truncate flex-1">
                    <span className="text-emerald-400 font-bold block">File Stored:</span>
                    <span className="font-mono text-[10px] truncate block text-slate-300">{formData.imageUrl}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Bestway Cement Stock in Pallandri Depot"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Category Tag *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="cement">Cement</option>
                  <option value="block_factory">Block Factory</option>
                  <option value="trucks">Trucks</option>
                  <option value="construction_projects">Construction Projects</option>
                  <option value="general">General Gallery</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Description / Context</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Notes about site location, machinery, or batch curing..."
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
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
                  disabled={uploading || !formData.imageUrl}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md disabled:opacity-50"
                >
                  Save Photo
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
            <h3 className="text-base font-bold text-white">Delete Photograph?</h3>
            <p className="text-xs text-slate-300">Are you sure you want to permanently delete this photo record and file?</p>
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
