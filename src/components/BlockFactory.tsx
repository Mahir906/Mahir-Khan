import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  ShieldCheck, 
  Layers, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Wrench, 
  Droplets,
  HardHat,
  Gauge
} from 'lucide-react';
import { BLOCK_PRODUCTS, BlockProduct } from '../data/tradeData.ts';
import { api } from '../services/api.ts';

interface BlockFactoryProps {
  onRequestQuote: (blockName: string) => void;
}

export const BlockFactory: React.FC<BlockFactoryProps> = ({ onRequestQuote }) => {
  const [liveBlocks, setLiveBlocks] = useState<BlockProduct[]>(BLOCK_PRODUCTS);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await api.getPublicBlocks();
        if (res.success && res.blocks && res.blocks.length > 0) {
          const mapped: BlockProduct[] = res.blocks.map(b => ({
            id: b.id,
            name: b.name,
            dimensions: b.dimensions,
            compressiveStrength: b.compressiveStrength,
            application: b.application,
            weight: b.weight,
            materialMix: b.materialMix,
            productionCapacity: b.productionCapacity,
          }));
          setLiveBlocks(mapped);
        }
      } catch (e) {
        // Fallback
      }
    };
    fetchBlocks();
  }, []);
  return (
    <section id="block-factory" className="py-20 bg-[#09152e] border-b border-[#162d59] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center justify-center gap-1.5">
            <Boxes className="w-4 h-4" />
            Automated Hydraulic Plant • Pallandri, Sudhnoti
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Concrete Block Factory & Precast Plant
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Engineered specifically to replace brittle traditional red bricks with high-compressive-strength, moisture-resistant masonry blocks built for Azad Kashmir’s mountain environment.
          </p>
        </div>

        {/* Manufacturing Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="p-5 bg-[#0e1e3e] border border-[#1e3c74] rounded-xl flex items-start gap-4">
            <div className="p-3 bg-orange-500/20 text-orange-400 rounded-lg shrink-0">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">High-Pressure Hydraulic Press</h4>
              <p className="text-xs text-slate-300">
                Triple-vibration compaction ensures uniform density and compressive strength up to 2,200 PSI.
              </p>
            </div>
          </div>

          <div className="p-5 bg-[#0e1e3e] border border-[#1e3c74] rounded-xl flex items-start gap-4">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-lg shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Guaranteed 14-Day Water Curing</h4>
              <p className="text-xs text-slate-300">
                Every batch is thoroughly pond-cured to achieve maximum chemical hydration before dispatching to sites.
              </p>
            </div>
          </div>

          <div className="p-5 bg-[#0e1e3e] border border-[#1e3c74] rounded-xl flex items-start gap-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Frost & Moisture Impermeable</h4>
              <p className="text-xs text-slate-300">
                Water absorption &lt; 8%, preventing winter freeze-shattering common with red bricks in Sudhnoti.
              </p>
            </div>
          </div>
        </div>

        {/* Block Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveBlocks.map((block) => (
            <div
              key={block.id}
              className="bg-[#0b1735] hover:bg-[#0f1f42] border-2 border-[#1c3970] hover:border-orange-500/60 rounded-xl p-6 flex flex-col justify-between transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                    {block.dimensions}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {block.compressiveStrength}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {block.name}
                </h3>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  <strong className="text-slate-400">Best for: </strong>
                  {block.application}
                </p>

                <div className="space-y-2 pt-3 border-t border-[#183362] text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Unit Weight:</span>
                    <span className="text-white font-medium">{block.weight}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Daily Capacity:</span>
                    <span className="text-slate-200 font-mono text-[11px]">{block.productionCapacity}</span>
                  </div>

                  <div className="pt-1">
                    <span className="text-slate-400 block text-[11px]">Material Composition:</span>
                    <span className="text-slate-300 text-[11px]">{block.materialMix}</span>
                  </div>
                </div>
              </div>

              {/* Order / Inquire Button */}
              <div className="mt-6 pt-4 border-t border-[#183362]">
                <button
                  onClick={() => onRequestQuote(`${block.name} (${block.dimensions})`)}
                  className="w-full py-2.5 px-3 bg-[#13274f] hover:bg-orange-500 hover:text-white text-orange-300 font-bold text-xs rounded-lg border border-[#21437e] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Factory Quote & Delivery</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Why Masonry Blocks over Red Bricks in Azad Kashmir */}
        <div className="mt-14 bg-[#0a1631] border border-[#1b376c] rounded-2xl p-6 sm:p-8">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400" />
            Comparison: USAMA TRADERS Concrete Blocks vs. Traditional Red Clay Bricks
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 bg-[#0e1d3e] rounded-xl border border-[#1f3d76]">
              <span className="text-orange-400 font-bold block text-sm mb-1">1. Faster Construction Time</span>
              <p>One 8" block replaces 4.5 standard bricks, reducing masonry labor costs by 40% and cutting mortar cement consumption by half.</p>
            </div>

            <div className="p-4 bg-[#0e1d3e] rounded-xl border border-[#1f3d76]">
              <span className="text-orange-400 font-bold block text-sm mb-1">2. Earthquake & Load Resistance</span>
              <p>Higher structural bond with RCC columns and lintels. Recommended by structural engineers for seismic zones in Azad Kashmir.</p>
            </div>

            <div className="p-4 bg-[#0e1d3e] rounded-xl border border-[#1f3d76]">
              <span className="text-orange-400 font-bold block text-sm mb-1">3. Thermal & Sound Insulation</span>
              <p>Engineered hollow cavities provide superior thermal insulation during cold Sudhnoti winters, keeping homes warmer.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
