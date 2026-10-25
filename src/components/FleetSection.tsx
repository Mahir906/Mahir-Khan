import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  Layers,
  HardHat
} from 'lucide-react';
import { FLEET_VEHICLES, FleetVehicle } from '../data/tradeData.ts';
import { api } from '../services/api.ts';

interface FleetSectionProps {
  onBookTransport: (vehicleName: string) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ onBookTransport }) => {
  const [liveFleet, setLiveFleet] = useState<FleetVehicle[]>(FLEET_VEHICLES);

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await api.getPublicFleet();
        if (res.success && res.fleet && res.fleet.length > 0) {
          const mapped: FleetVehicle[] = res.fleet.map(f => ({
            id: f.id,
            name: f.name,
            type: f.type,
            capacity: f.capacity,
            terrainSuitability: Array.isArray(f.serviceAreas) ? f.serviceAreas.join(', ') : f.serviceAreas,
            count: f.count,
            description: f.description,
          }));
          setLiveFleet(mapped);
        }
      } catch (e) {
        // Fallback
      }
    };
    fetchFleet();
  }, []);

  return (
    <section id="fleet" className="py-20 bg-[#070e20] border-b border-[#14264e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center justify-center gap-1.5">
            <Truck className="w-4 h-4" />
            Heavy Mountain Logistics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Transport Fleet & Mountain Delivery Network
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Delivering building supplies in Azad Kashmir requires specialized hill-climbing trucks and skilled mountain drivers. Our in-house fleet delivers directly to steep hillside residential plots and infrastructure projects.
          </p>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {liveFleet.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-[#0b1632] border-2 border-[#1c3970] hover:border-orange-500/60 rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                      {vehicle.type}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {vehicle.name}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-white bg-orange-600/30 border border-orange-500/40 px-3 py-1 rounded-full whitespace-nowrap">
                    {vehicle.count} Units Active
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                  {vehicle.description}
                </p>

                {/* Specs Box */}
                <div className="p-4 bg-[#0e1e3e] rounded-lg border border-[#1b376c] space-y-2.5 text-xs">
                  <div className="flex items-start gap-2">
                    <Layers className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-300">Carrying Capacity: </strong>
                      <span className="text-white font-medium">{vehicle.capacity}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-300">Terrain Suitability: </strong>
                      <span className="text-slate-200">{vehicle.terrainSuitability}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-[#183362] flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Same-Day Pallandri Dispatch Available
                </span>
                <button
                  onClick={() => onBookTransport(vehicle.name)}
                  className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Book Delivery Run
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Delivery Coverage Areas in Sudhnoti & Azad Kashmir */}
        <div className="mt-14 bg-[#0a1631] border border-[#1b376c] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#183362]">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-400" />
                Delivery Coverage Across Sudhnoti & Azad Kashmir
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Guaranteed safe doorstep unloading in these towns, tehsils, and surrounding village union councils:
              </p>
            </div>
            <a
              href="tel:+923008254410"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Inquire Site Access & Distance</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-6 text-center text-xs">
            <div className="p-3 bg-[#0e1d3e] rounded-lg border border-[#1e3c74] font-semibold text-white">
              Pallandri City & By-Pass
            </div>
            <div className="p-3 bg-[#0e1d3e] rounded-lg border border-[#1e3c74] font-semibold text-white">
              Trarkhal Tehsil
            </div>
            <div className="p-3 bg-[#0e1d3e] rounded-lg border border-[#1e3c74] font-semibold text-white">
              Baloch & Forward Areas
            </div>
            <div className="p-3 bg-[#0e1d3e] rounded-lg border border-[#1e3c74] font-semibold text-white">
              Mong & Gorah
            </div>
            <div className="p-3 bg-[#0e1d3e] rounded-lg border border-[#1e3c74] font-semibold text-white">
              Thorar & Azad Pattan
            </div>
            <div className="p-3 bg-[#0e1d3e] rounded-lg border border-[#1e3c74] font-semibold text-white">
              Rawalakot & Poonch Hub
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
