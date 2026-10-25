import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  HardHat, 
  Truck, 
  Award, 
  CheckCircle2, 
  Clock, 
  Users2,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#081329] border-b border-[#162d59] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center justify-center gap-1.5">
            <Building2 className="w-4 h-4" />
            Our Heritage & Roots
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About USAMA TRADERS
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            A pillar of reliability in the construction industry of Pallandri, Sudhnoti District, Azad Kashmir.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual / Highlights Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0e1d3d] border-2 border-[#1e3b74] rounded-2xl p-7 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center gap-3 pb-5 border-b border-[#1b366a]">
                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                  UT
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    USAMA TRADERS
                  </h3>
                  <p className="text-xs text-orange-400 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Pallandri, Sudhnoti, Azad Kashmir
                  </p>
                </div>
              </div>

              {/* Story Highlights */}
              <div className="py-6 space-y-4 text-xs sm:text-sm text-slate-300">
                <p className="leading-relaxed">
                  Established with a vision to deliver genuine, unadulterated construction materials across the mountainous terrain of Azad Kashmir, <strong className="text-white">USAMA TRADERS</strong> has grown into the region’s premier hub for direct factory cement, machine-pressed concrete blocks, and hill logistics.
                </p>
                <p className="leading-relaxed">
                  We bridge the logistical gap between the nation’s top cement manufacturing plants in Punjab / KPK and the builders, contractors, and families building durable homes and infrastructure in Sudhnoti District.
                </p>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1b366a] text-xs">
                <div className="p-3 bg-[#11234a] rounded-lg border border-[#1e3c75]">
                  <span className="text-orange-400 font-bold block text-base">Direct Dealer</span>
                  <span className="text-slate-400 text-[11px]">Bestway, Fauji & Askari</span>
                </div>
                <div className="p-3 bg-[#11234a] rounded-lg border border-[#1e3c75]">
                  <span className="text-white font-bold block text-base">In-House Fleet</span>
                  <span className="text-slate-400 text-[11px]">19 Mountain Delivery Units</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Values & Core Advantages */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                Why Sudhnoti Chooses Us
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Engineered for Mountain Terrain, Built for Generations
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Building in Azad Kashmir presents unique geophysical challenges: steep slopes, heavy seasonal rains, and seismic vulnerability. Weak or adulterated cement and low-grade bricks lead to catastrophic structural cracking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="p-5 bg-[#0b1836] border border-[#1c386e] rounded-xl space-y-2 hover:border-orange-500/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">100% Genuine Factory Bags</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Direct sealed supplies straight from factory silos. We never repack, adulterate, or warehouse expired cement.
                </p>
              </div>

              <div className="p-5 bg-[#0b1836] border border-[#1c386e] rounded-xl space-y-2 hover:border-orange-500/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <HardHat className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Hydraulic Block Strength</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our modern plant presses high-density blocks that withstand severe frost, mountain soil moisture, and seismic load.
                </p>
              </div>

              <div className="p-5 bg-[#0b1836] border border-[#1c386e] rounded-xl space-y-2 hover:border-orange-500/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Doorstep Mountain Delivery</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our 6-wheeler Mazda trucks reach hillside village roads where heavy standard long-haul trailers cannot climb.
                </p>
              </div>

              <div className="p-5 bg-[#0b1836] border border-[#1c386e] rounded-xl space-y-2 hover:border-orange-500/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Fair & Transparent Rates</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Daily updated mill rates with zero hidden charges. Honest computerized weighbridge slips for sand & bajri.
                </p>
              </div>
            </div>

            {/* Quote / Mission statement */}
            <div className="p-4 bg-[#0e1d3c] rounded-xl border-l-4 border-orange-500 text-xs text-slate-200 italic">
              "From foundation retaining walls along the hills of Pallandri to multi-storey civic complexes in Sudhnoti, we take pride in delivering the materials that build a stronger Azad Kashmir."
            </div>
          </div>

        </div>

        {/* Authentic Business Owners & Executive Leadership */}
        <div className="mt-20 pt-12 border-t border-[#183262]">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center justify-center gap-1.5">
              <Users2 className="w-4 h-4" />
              Ownership & Management
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Leadership & Directors
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Directly accessible partners driving quality control, mill relations, and fleet operations from our headquarters on Main By-Pass Road, Pallandri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Owner 1: Sardar Mahir Khan */}
            <div className="bg-[#0b1735] border-2 border-[#1e3c75] hover:border-orange-500/60 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 font-black text-lg flex items-center justify-center mb-4 border border-orange-500/30">
                  SM
                </div>
                <h4 className="text-lg font-bold text-white">Sardar Mahir Khan</h4>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mt-0.5">
                  Director & Supply Operations
                </p>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Oversees mill direct allocations for Bestway and Fauji cement, computerized weighbridge testing, and bulk supply contracts across Sudhnoti.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1a3466] space-y-2.5 text-xs">
                <a 
                  href="tel:+923169080566"
                  className="flex items-center gap-2 text-slate-200 hover:text-orange-400 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>0316-9080566</span>
                </a>
                <a 
                  href="mailto:sardarmahirkhan0601@gmail.com"
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 text-[11px] truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">sardarmahirkhan0601@gmail.com</span>
                </a>
                <div className="pt-2">
                  <a
                    href="https://wa.me/923169080566?text=Assalam-o-Alaikum%20Sardar%20Mahir%20Khan%2C%20I%20need%20a%20rate%20quote%20for%20cement%20and%20blocks%20from%20USAMA%20TRADERS."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/40 text-xs font-bold text-center block transition-all"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Owner 2: Sardar Usama Khan */}
            <div className="bg-[#0b1735] border-2 border-[#1e3c75] hover:border-orange-500/60 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 font-black text-lg flex items-center justify-center mb-4 border border-orange-500/30">
                  SU
                </div>
                <h4 className="text-lg font-bold text-white">Sardar Usama Khan</h4>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mt-0.5">
                  Executive Director & Commercial Lead
                </p>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Leads commercial operations, government and institutional infrastructure supply projects, and enterprise client relations in Azad Kashmir.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1a3466] space-y-2.5 text-xs">
                <a 
                  href="tel:+923095090651"
                  className="flex items-center gap-2 text-slate-200 hover:text-orange-400 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>0309-5090651</span>
                </a>
                <a 
                  href="mailto:usamaikhlaq677@gmail.com"
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 text-[11px] truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">usamaikhlaq677@gmail.com</span>
                </a>
                <div className="pt-2">
                  <a
                    href="https://wa.me/923095090651?text=Assalam-o-Alaikum%20Sardar%20Usama%20Khan%2C%20I%20would%20like%20to%20inquire%20about%20bulk%20supplies%20from%20USAMA%20TRADERS."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/40 text-xs font-bold text-center block transition-all"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Owner 3: Sardar Ali Sudozai */}
            <div className="bg-[#0b1735] border-2 border-[#1e3c75] hover:border-orange-500/60 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 font-black text-lg flex items-center justify-center mb-4 border border-orange-500/30">
                  SA
                </div>
                <h4 className="text-lg font-bold text-white">Sardar Ali Sudozai</h4>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mt-0.5">
                  Director Sales & Logistics
                </p>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Coordinates our specialized mountain fleet of 6-wheeler Mazdas and dumpers, ensuring punctual doorstep unloading on hillside construction sites.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1a3466] space-y-2.5 text-xs">
                <a 
                  href="tel:+923438590951"
                  className="flex items-center gap-2 text-slate-200 hover:text-orange-400 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>0343-8590951</span>
                </a>
                <a 
                  href="mailto:sales.ajk@usamatraders.com"
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 text-[11px] truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">sales.ajk@usamatraders.com</span>
                </a>
                <div className="pt-2">
                  <a
                    href="https://wa.me/923438590951?text=Assalam-o-Alaikum%20Sardar%20Ali%20Sudozai%2C%20I%20need%20logistics%20and%20materials%20dispatch%20details%20from%20USAMA%20TRADERS."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/40 text-xs font-bold text-center block transition-all"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Exact Location Footer Banner */}
          <div className="mt-8 p-4 bg-[#0d1c3e] rounded-xl border border-[#1e3c75] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <span><strong>Headquarters Location:</strong> Main By-Pass Road, Pallandri, District Sudhnoti, Azad Kashmir</span>
            </div>
            <span className="text-orange-400 font-mono font-bold">Postal Code: 12010</span>
          </div>
        </div>

      </div>
    </section>
  );
};
