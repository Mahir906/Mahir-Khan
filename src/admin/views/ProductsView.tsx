import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  X, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  HardHat,
  Filter
} from 'lucide-react';
import { api, ProductItem, CategoryItem } from '../../services/api.ts';

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [publishFilter, setPublishFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Bestway Cement',
    categoryId: 'cat-cement',
    description: '',
    specifications: '',
    unit: '50kg Bag',
    price: '',
    priceDisplay: 'Call for Daily Mill Rate',
    inStock: true,
    isFeatured: false,
    isPublished: true,
    imageUrl: '',
    imageAlt: '',
    strengthGrade: 'Grade 53 High Strength',
    recommendedUse: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getAdminProducts(),
        api.getAdminCategories(),
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'Bestway Cement',
      categoryId: categories[0]?.id || 'cat-cement',
      description: '',
      specifications: '',
      unit: '50kg Bag',
      price: '',
      priceDisplay: 'Call for Daily Mill Rate',
      inStock: true,
      isFeatured: false,
      isPublished: true,
      imageUrl: '',
      imageAlt: '',
      strengthGrade: 'Grade 53 High Strength',
      recommendedUse: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      categoryId: product.categoryId,
      description: product.description,
      specifications: product.specifications,
      unit: product.unit,
      price: product.price ? product.price.toString() : '',
      priceDisplay: product.priceDisplay,
      inStock: product.inStock,
      isFeatured: product.isFeatured,
      isPublished: product.isPublished,
      imageUrl: product.imageUrl,
      imageAlt: product.imageAlt,
      strengthGrade: product.strengthGrade,
      recommendedUse: product.recommendedUse,
    });
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: res.url,
        imageAlt: prev.imageAlt || file.name,
      }));
      showFeedback('success', 'Image uploaded successfully.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.brand.trim()) {
      showFeedback('error', 'Product name and brand are required.');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: formData.price ? Number(formData.price) : null,
      };

      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, payload);
        if (res.success) {
          setProducts(prev => prev.map(p => (p.id === editingProduct.id ? res.product : p)));
          showFeedback('success', `Product "${res.product.name}" updated successfully.`);
        }
      } else {
        const res = await api.createProduct(payload);
        if (res.success) {
          setProducts(prev => [res.product, ...prev]);
          showFeedback('success', `Product "${res.product.name}" added to catalog.`);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showFeedback('error', err.message || 'Operation failed');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showFeedback('success', 'Product deleted permanently.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to delete product');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await api.toggleProductPublish(id);
      if (res.success) {
        setProducts(prev => prev.map(p => (p.id === id ? res.product : p)));
        showFeedback(
          'success',
          res.product.isPublished
            ? 'Product published to live website.'
            : 'Product unpublished and hidden from visitors.'
        );
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to toggle publication');
    }
  };

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specifications.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
    const matchesPublish = 
      publishFilter === 'all' || 
      (publishFilter === 'published' ? p.isPublished : !p.isPublished);
    return matchesSearch && matchesCategory && matchesPublish;
  });

  return (
    <div className="space-y-6">
      
      {/* Feedback Toast */}
      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' 
            : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="ml-4 hover:opacity-75">✕</button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#183262]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-400" />
            Cement & Construction Products
          </h1>
          <p className="text-xs text-slate-400">
            Manage factory-sealed cements, Grade 60 steel rebar, and aggregate supplies displayed on the public catalog.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by brand name, title, or ASTM specs..."
            className="w-full pl-9 pr-4 py-2 bg-[#0e1d3e] border border-[#1e3c75] rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#0e1d3e] border border-[#1e3c75] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={publishFilter}
            onChange={(e) => setPublishFilter(e.target.value)}
            className="w-full bg-[#0e1d3e] border border-[#1e3c75] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Online</option>
            <option value="draft">Draft / Unpublished</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0b1736] border border-[#1d3a72] rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Loading product catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-2">
            <p>No products match your filter criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setPublishFilter('all'); }}
              className="px-3 py-1 bg-[#12254e] hover:bg-orange-500 text-white rounded text-[11px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-[#183262] bg-[#071126] text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Brand & Grade</th>
                  <th className="py-3 px-4">Unit & Price Display</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Live Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#183262]">
                {filteredProducts.map((p) => {
                  const cat = categories.find(c => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-[#0f1f44] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        <div className="text-[11px] text-orange-400">{cat?.name || p.categoryId}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{p.specifications}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{p.brand}</div>
                        <div className="text-[10px] text-slate-400">{p.strengthGrade}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{p.unit}</div>
                        <div className="text-[11px] text-emerald-400">{p.priceDisplay}</div>
                      </td>
                      <td className="py-3 px-4">
                        {p.inStock ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                          </span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(p.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            p.isPublished
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-slate-700/40 text-slate-400 border border-slate-600/30 hover:bg-slate-700/60'
                          }`}
                        >
                          {p.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 bg-[#12254e] hover:bg-[#1a3368] text-slate-200 hover:text-white rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 bg-[#12254e] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b1735] border border-rose-500/40 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Confirm Product Deletion</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this product? This action cannot be undone and will immediately remove it from the public website catalog.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#12254e] hover:bg-[#183162] text-slate-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0b1735] border-2 border-[#1f3f7d] rounded-2xl shadow-2xl my-8 overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 bg-[#08122c] border-b border-[#183262]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-400" />
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Cement or Material'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Bestway Cement (OPC 53 Grade)"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Brand / Manufacturer *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Bestway Cement / Fauji / Askari"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Strength Grade / Standard</label>
                  <input
                    type="text"
                    value={formData.strengthGrade}
                    onChange={(e) => setFormData({ ...formData, strengthGrade: e.target.value })}
                    placeholder="e.g. Grade 53 High Strength"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Unit / Packaging Format</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. 50kg Bag / Metric Ton / Dumper Cft"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Price Display Text</label>
                  <input
                    type="text"
                    value={formData.priceDisplay}
                    onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                    placeholder="e.g. Call for Daily Mill Rate"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Specifications</label>
                <input
                  type="text"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="ASTM C150 Type I / PS:232-2008, 28-day strength > 58 MPa"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Recommended Use in Azad Kashmir</label>
                <input
                  type="text"
                  value={formData.recommendedUse}
                  onChange={(e) => setFormData({ ...formData, recommendedUse: e.target.value })}
                  placeholder="High-altitude retaining walls, RCC roofs, bridges in Sudhnoti"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product narrative, moisture protection, and hill construction benefits..."
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Image Upload Area */}
              <div className="p-4 bg-[#0e1d3e] border border-[#1e3c74] rounded-xl space-y-3">
                <label className="text-xs font-bold text-white block">Product Photograph / Image</label>
                
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageFileChange}
                    className="text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
                  />
                  {uploadingImage && <span className="text-xs text-orange-400">Uploading...</span>}
                </div>

                {formData.imageUrl && (
                  <div className="flex items-center gap-3 pt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt={formData.imageAlt || 'Preview'} 
                      className="w-16 h-16 object-cover rounded-lg border border-[#224480]"
                    />
                    <div className="text-[11px] text-slate-300">
                      <div className="font-mono text-white truncate max-w-xs">{formData.imageUrl}</div>
                      <input
                        type="text"
                        value={formData.imageAlt}
                        onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                        placeholder="Image Alt text"
                        className="mt-1 bg-[#10224a] border border-[#21437e] rounded px-2 py-1 text-[11px] text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer bg-[#0e1d3e] p-2.5 rounded-lg border border-[#1e3c74]">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="accent-orange-500 w-4 h-4 rounded"
                  />
                  <span className="text-white font-medium">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-[#0e1d3e] p-2.5 rounded-lg border border-[#1e3c74]">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-orange-500 w-4 h-4 rounded"
                  />
                  <span className="text-white font-medium">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-[#0e1d3e] p-2.5 rounded-lg border border-[#1e3c74]">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="accent-orange-500 w-4 h-4 rounded"
                  />
                  <span className="text-white font-medium">Publish Live</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#183262] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#12254e] hover:bg-[#183162] text-slate-300 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
