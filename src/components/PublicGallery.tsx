import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Layers, 
  Truck, 
  Building2, 
  Boxes, 
  Maximize2, 
  X, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { api, GalleryItem } from '../services/api.ts';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Operations', icon: Layers },
  { id: 'cement', label: 'Cement & Warehousing', icon: Boxes },
  { id: 'block_factory', label: 'Block Plant', icon: Boxes },
  { id: 'trucks', label: 'Fleet & Dispatch', icon: Truck },
  { id: 'construction_projects', label: 'Project Sites', icon: Building2 },
];

export const PublicGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const res = await api.getPublicGallery(selectedCategory === 'all' ? undefined : selectedCategory);
      if (res && res.success && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Error fetching gallery items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-[#070e22] border-b border-[#14264e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center justify-center gap-1.5">
            <Camera className="w-4 h-4 text-orange-400" />
            Field Operations & Facilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Visual Proof of Quality & Operations
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Authentic photos from our Pallandri central staging yard, automated hydraulic block press plant, mountain transport fleet, and active construction sites in Sudhnoti District.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20'
                    : 'bg-[#0d1a38] text-slate-300 border-[#1a3366] hover:bg-[#12244d] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading field photos...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center bg-[#0b1735] border border-[#1b376c] rounded-2xl p-8 max-w-md mx-auto">
            <Camera className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h4 className="text-white font-bold text-base mb-1">No Photos in this Category</h4>
            <p className="text-xs text-slate-400">
              Photos uploaded by the USAMA TRADERS Pallandri admin desk will display here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group bg-[#0b1735] border border-[#1b376c] hover:border-orange-500/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 flex flex-col"
              >
                {/* Photo or Graphic Banner */}
                <div className="relative h-48 bg-[#0f2146] overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0c1938] to-[#12254e]">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-2">
                        {item.category === 'cement' && <Boxes className="w-6 h-6" />}
                        {item.category === 'block_factory' && <Boxes className="w-6 h-6" />}
                        {item.category === 'trucks' && <Truck className="w-6 h-6" />}
                        {item.category === 'construction_projects' && <Building2 className="w-6 h-6" />}
                        {item.category === 'general' && <Camera className="w-6 h-6" />}
                      </div>
                      <span className="text-[11px] font-mono text-orange-400 uppercase tracking-wider font-bold">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-orange-400 px-2 py-0.5 rounded border border-white/10">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Zoom Icon overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {item.description || 'Verified on-ground operation in Pallandri, Sudhnoti.'}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#1b376c] flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                    <span>Click to expand</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Lightbox */}
        {activeModalItem && (
          <div 
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setActiveModalItem(null)}
          >
            <div 
              className="bg-[#0b1735] border-2 border-[#1e3c75] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-orange-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Preview */}
              <div className="w-full h-72 sm:h-96 bg-[#091329] flex items-center justify-center relative overflow-hidden">
                {activeModalItem.imageUrl ? (
                  <img
                    src={activeModalItem.imageUrl}
                    alt={activeModalItem.imageAlt || activeModalItem.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      USAMA TRADERS FIELD ARCHIVE
                    </div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Operational photo recorded at USAMA TRADERS facility in Pallandri, Sudhnoti, Azad Kashmir.
                    </p>
                  </div>
                )}
              </div>

              {/* Information */}
              <div className="p-6 bg-[#0d1c3e] border-t border-[#1b376c]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-orange-400 uppercase bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                    {activeModalItem.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Pallandri Depot Operation
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {activeModalItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {activeModalItem.description}
                </p>
                {activeModalItem.imageAlt && (
                  <p className="text-[11px] text-slate-400 mt-3 italic">
                    Caption: {activeModalItem.imageAlt}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
