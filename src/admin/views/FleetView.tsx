import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  X, 
  MapPin, 
  Upload, 
  Layers,
  PhoneCall
} from 'lucide-react';
import { api, FleetItem } from '../../services/api.ts';

export const FleetView: React.FC = () => {
  const [fleet, setFleet] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<FleetItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    type: 'Narrow Hill Access Tipper / Cargo',
    capacity: '200 - 350 Cement Bags / 600 - 900 Blocks',
    services: 'Hillside site delivery, Narrow village road access',
    serviceAreas: 'Pallandri, Trarkhal, Mong, Gorah, Baloch, Thorar',
    inService: true,
    isFeatured: true,
    count: 1,
    description: '',
    imageUrl: '',
    imageAlt: '',
  });

  const loadFleet = async () => {
    try {
      const res = await api.getAdminFleet();
      if (res.success) setFleet(res.fleet);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to load fleet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFleet();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      name: '',
      identifier: `UT-FLEET-0${fleet.length + 1}`,
      type: 'Narrow Hill Access Tipper (6-Wheeler Mazda)',
      capacity: '250 Bags / 800 Blocks',
      services: 'Doorstep site unloading, steep hill climb',
      serviceAreas: 'Pallandri, Trarkhal, Baloch, Gorah, Sudhnoti',
      inService: true,
      isFeatured: true,
      count: 1,
      description: 'Mountain-specialized transport unit with reinforced low-range hill gearing.',
      imageUrl: '',
      imageAlt: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (v: FleetItem) => {
    setEditingVehicle(v);
    setFormData({
      name: v.name,
      identifier: v.identifier,
      type: v.type,
      capacity: v.capacity,
      services: Array.isArray(v.services) ? v.services.join(', ') : '',
      serviceAreas: Array.isArray(v.serviceAreas) ? v.serviceAreas.join(', ') : '',
      inService: v.inService,
      isFeatured: v.isFeatured,
      count: v.count,
      description: v.description,
      imageUrl: v.imageUrl,
      imageAlt: v.imageAlt,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.type.trim()) {
      showFeedback('error', 'Vehicle name and type are required.');
      return;
    }

    const payload = {
      ...formData,
      services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
      serviceAreas: formData.serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (editingVehicle) {
        const res = await api.updateFleet(editingVehicle.id, payload);
        if (res.success) {
          setFleet(prev => prev.map(v => (v.id === editingVehicle.id ? res.vehicle : v)));
          showFeedback('success', `Vehicle "${res.vehicle.name}" updated.`);
        }
      } else {
        const res = await api.createFleet(payload);
        if (res.success) {
          setFleet(prev => [res.vehicle, ...prev]);
          showFeedback('success', `Vehicle "${res.vehicle.name}" registered to fleet.`);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showFeedback('error', err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteFleet(id);
      if (res.success) {
        setFleet(prev => prev.filter(f => f.id !== id));
        showFeedback('success', 'Vehicle removed from fleet database.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to remove vehicle');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const filteredFleet = fleet.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.type.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Truck className="w-6 h-6 text-amber-400" />
            Transport Fleet Management
          </h1>
          <p className="text-xs text-slate-400">
            Maintain active mountain trucks, tipper capacities, and delivery routes servicing Sudhnoti District and Azad Kashmir.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Fleet Truck</span>
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
          placeholder="Search by truck identifier (e.g. UT-FLEET-01), model or type..."
          className="w-full pl-9 pr-4 py-2 bg-[#0e1d3e] border border-[#1e3c75] rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFleet.map((v) => (
          <div key={v.id} className="bg-[#0b1736] border border-[#1d3a72] rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  {v.identifier}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  v.inService ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/40 text-slate-400'
                }`}>
                  {v.inService ? `${v.count} Units Active` : 'Under Maintenance'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{v.name}</h3>
              <p className="text-xs text-amber-400/90 font-medium mb-3">{v.type}</p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{v.description}</p>

              <div className="space-y-2 p-3 bg-[#0e1d3e] rounded-lg border border-[#1b376c] text-xs">
                <div>
                  <strong className="text-slate-400">Hauling Capacity: </strong>
                  <span className="text-white font-medium">{v.capacity}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Service Coverage: </strong>
                  <span className="text-slate-200">{Array.isArray(v.serviceAreas) ? v.serviceAreas.join(', ') : v.serviceAreas}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#183262] flex justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(v)}
                className="px-3 py-1.5 bg-[#12254e] hover:bg-[#1a3368] text-slate-200 rounded text-xs flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Truck</span>
              </button>
              <button
                onClick={() => setDeleteConfirmId(v.id)}
                className="p-1.5 bg-[#12254e] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
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
                <Truck className="w-5 h-5 text-amber-400" />
                {editingVehicle ? 'Edit Vehicle Profile' : 'Register New Fleet Truck'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Vehicle Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder="e.g. UT-FLEET-01"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 uppercase font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Active Units Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Truck Model & Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mazda Titan & T3500 (6-Wheeler Hill Trucks)"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Vehicle Type & Role *</label>
                <input
                  type="text"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g. Narrow Hill Access Tipper / Cargo"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Carrying Capacity</label>
                <input
                  type="text"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="e.g. 200 - 350 Cement Bags / 600 - 900 Blocks / 200 Cft Aggregate"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Service Coverage Areas (comma separated)</label>
                <input
                  type="text"
                  value={formData.serviceAreas}
                  onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
                  placeholder="Pallandri, Trarkhal, Mong, Gorah, Baloch, Thorar"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mountain terrain agility, steep incline handling, offloading mechanism..."
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inService}
                    onChange={(e) => setFormData({ ...formData, inService: e.target.checked })}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span className="text-white">Active in Service</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span className="text-white">Feature on Public Page</span>
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
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-md"
                >
                  Save Vehicle
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
            <h3 className="text-base font-bold text-white">Remove Vehicle from Fleet?</h3>
            <p className="text-xs text-slate-300">Are you sure you want to permanently delete this transport unit from records?</p>
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
