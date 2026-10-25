import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  Phone,
  Building2,
  HardHat,
  Award
} from 'lucide-react';

interface HeroProps {
  onExploreServices: () => void;
  onContactUs: () => void;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExploreServices, 
  onContactUs,
  onOpenCalculator 
}) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#08142c] via-[#0b1b3b] to-[#071126] pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#162d58]">
      {/* Background Architectural Grid Pattern */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #334e80 1px, transparent 1px), linear-gradient(to bottom, #334e80 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient Radial Lights (Navy, Concrete, and Warm Orange Highlight) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Column */}
          <div className="lg:col-span-8 flex flex-col items-center sm:items-start space-y-6">
            
            {/* Tagline / Location Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10234a] border border-[#203f7a] text-slate-200 text-xs sm:text-sm font-medium shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-orange-400 font-bold uppercase tracking-wider">USAMA TRADERS</span>
              <span className="text-slate-500">|</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                Pallandri, Sudhnoti, Azad Kashmir
              </span>
            </div>

            {/* Prompt's Exact Large Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase font-sans leading-[1.05]">
              BUILDING TRUST, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300">
                DELIVERING QUALITY
              </span>
            </h1>

            {/* Prompt's Required Short Description */}
            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 font-light max-w-2xl leading-relaxed">
              Your premier partner for wholesale cement supply, precision hydraulic concrete blocks, heavy mountain transportation, and turnkey civil construction services across Pallandri, Sudhnoti, and Azad Kashmir.
            </p>

            {/* Concrete & Cement Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-300 pt-1 pb-2 w-full max-w-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Authorized Dealer: Bestway, Fauji & Askari Cement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Automated Heavy Hydraulic Concrete Block Plant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Dedicated Mountain Fleet (Dumpers & Mazda 6-Wheelers)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Grade 60 Steel Rebar & Margalla Bajri Delivery</span>
              </div>
            </div>

            {/* Prompt's Two Required Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={onExploreServices}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-98 border border-orange-400/50"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onContactUs}
                className="px-7 py-4 rounded-lg bg-[#0e1d3d] hover:bg-[#152a55] text-white font-bold text-base border-2 border-slate-400/40 hover:border-orange-500 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                <span>Contact Us</span>
              </button>

              <button
                onClick={onOpenCalculator}
                className="px-5 py-4 rounded-lg bg-transparent hover:bg-[#122348] text-slate-300 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Estimate Order Costs →</span>
              </button>
            </div>

          </div>

          {/* Right Highlight Box: Quick Order / Operation Desk */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-[#0e1c3b]/95 border-2 border-[#1f3c75] rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/15 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-[#1c366b]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-500/20 rounded-lg text-orange-400 border border-orange-500/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pallandri Central Depot</h3>
                    <p className="text-[11px] text-slate-400">Main By-Pass Road, Sudhnoti</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Stock Ready
                </span>
              </div>

              {/* Snapshot Stats in Concrete Grey & White */}
              <div className="space-y-4 py-5 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-orange-500" />
                    Daily Cement Stock
                  </span>
                  <span className="font-bold text-white">5,000+ Bags</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Block Plant Output
                  </span>
                  <span className="font-bold text-white">10,000 Blocks / Day</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400" />
                    Delivery Reach
                  </span>
                  <span className="font-semibold text-white">All Sudhnoti & Poonch</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-emerald-400" />
                    Fleet Vehicles
                  </span>
                  <span className="font-semibold text-emerald-400">19 Mountain Trucks</span>
                </div>
              </div>

              {/* Call-to-Action inside Card */}
              <div className="pt-4 border-t border-[#1c366b] text-xs">
                <p className="text-slate-300 mb-3">
                  Need direct factory rates or site delivery in Sudhnoti?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+923169080566"
                    className="py-2.5 px-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call 0316-9080566</span>
                  </a>
                  <button
                    onClick={onContactUs}
                    className="py-2.5 px-3 bg-[#13274e] hover:bg-[#1a3468] text-slate-200 hover:text-white font-semibold rounded-lg text-center border border-[#21437c] transition-colors"
                  >
                    Send RFQ →
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Concrete Grey Metric Highlights */}
        <div className="mt-16 pt-8 border-t border-[#172d58] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">15+ Years</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Serving Azad Kashmir</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-500">2.5M+ Bags</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Cement Supplied</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">1,200+ Sites</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Residential & Commercial</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100% Certified</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Mill Fresh & Lab Tested</div>
          </div>
        </div>

      </div>
    </section>
  );
};
