import React, { useState, useEffect } from 'react';
import { 
  Package, 
  CheckCircle2, 
  Send, 
  Search, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  PhoneCall, 
  HardHat 
} from 'lucide-react';
import { CEMENT_PRODUCTS, CementProduct } from '../data/tradeData.ts';
import { api, ProductItem } from '../services/api.ts';

interface CementProductsProps {
  onRequestQuote: (productName: string) => void;
}

export const CementProducts: React.FC<CementProductsProps> = ({ onRequestQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cement' | 'steel' | 'aggregates'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveProducts, setLiveProducts] = useState<CementProduct[]>(CEMENT_PRODUCTS);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await api.getPublicProducts();
        if (res.success && res.products && res.products.length > 0) {
          const mapped: CementProduct[] = res.products.map(p => ({
            id: p.id,
            brand: p.brand,
            type: p.name,
            category: (p.categoryId === 'cat-steel' ? 'steel' : p.categoryId === 'cat-aggregates' ? 'aggregates' : 'cement') as any,
            tagline: p.description,
            specs: p.specifications,
            packaging: p.unit,
            recommendedUse: p.recommendedUse,
            popularInAJK: p.isFeatured,
            rateEstimate: p.priceDisplay,
            strengthGrade: p.strengthGrade,
          }));
          setLiveProducts(mapped);
        }
      } catch (e) {
        // Fallback to static
      }
    };
    fetchLive();
  }, []);

  const categories = [
    { id: 'all', label: 'All Construction Supplies' },
    { id: 'cement', label: 'Premium Cement Brands' },
    { id: 'steel', label: 'Grade 60 Steel Rebar' },
    { id: 'aggregates', label: 'Crushed Bajri & Sand' },
  ];

  const filteredProducts = liveProducts.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recommendedUse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="cement" className="py-20 bg-[#070e22] border-b border-[#14264e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center gap-2">
              <HardHat className="w-4 h-4" />
              Direct Mill Supplies & Authorized Dealerships
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cement & Structural Materials
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Fresh, factory-sealed cement bags from Pakistan's most trusted manufacturers, high-yield seismic steel rebar, and washed Margalla aggregates delivered directly to sites across Sudhnoti.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cement brand, rebar or bajri..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#0e1b36] border border-[#1e3b72] rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/25 border border-orange-400'
                  : 'bg-[#0f1f3e] text-slate-300 hover:bg-[#162c56] hover:text-white border border-[#1b3668]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-[#0b1632] hover:bg-[#0e1d40] border-2 border-[#1a3466] hover:border-orange-500/60 rounded-xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-blue-950/60"
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <span className="text-[10px] font-medium text-slate-300 bg-[#14264f] px-2 py-0.5 rounded border border-[#1e3c74]">
                    {product.strengthGrade}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-1.5">
                  {product.type}
                </h3>
                
                <p className="text-xs text-orange-300/90 italic mb-3">
                  "{product.tagline}"
                </p>

                {/* Specs and Packaging */}
                <div className="space-y-2.5 pt-3 border-t border-[#162d59] text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5 font-semibold">Recommended Application in AJK:</span>
                    <span className="text-white font-medium">{product.recommendedUse}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5 font-semibold">Specifications / Standard:</span>
                    <span className="text-slate-200">{product.specs}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5 font-semibold">Packaging & Supply Format:</span>
                    <span className="text-slate-200">{product.packaging}</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Order Action */}
              <div className="mt-6 pt-4 border-t border-[#162d59] space-y-3">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{product.rateEstimate}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onRequestQuote(`${product.brand} - ${product.type}`)}
                    className="py-2.5 px-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Inquire Rate</span>
                  </button>

                  <a
                    href="tel:+923008254410"
                    className="py-2.5 px-3 bg-[#112349] hover:bg-[#183162] text-slate-200 hover:text-white font-semibold text-xs rounded-lg border border-[#203f7a] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3 h-3 text-orange-400" />
                    <span>Call Sales</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Mountain Bulk Supply Callout */}
        <div className="mt-12 bg-gradient-to-r from-[#0d1c3b] via-[#12244c] to-[#0d1c3b] border border-[#203e78] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              Contractors & Bulk Buyers: Get Direct Trailer-Load Discount
            </h4>
            <p className="text-sm text-slate-300">
              Ordering 500+ bags or full 10-wheeler dumper aggregates? Enjoy special contractor trade rates with scheduled multi-point unloading across Sudhnoti.
            </p>
          </div>
          <button
            onClick={() => onRequestQuote('Contractor Bulk Cement Order (500+ Bags)')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-lg whitespace-nowrap shadow-md cursor-pointer transition-all border border-orange-400/50"
          >
            Request Bulk Mill Quote
          </button>
        </div>

      </div>
    </section>
  );
};
