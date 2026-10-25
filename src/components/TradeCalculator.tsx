import React, { useState } from 'react';
import { 
  Calculator, 
  Truck, 
  MapPin, 
  Layers, 
  HardHat, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface TradeCalculatorProps {
  onForwardCalculation: (summary: string) => void;
}

export const TradeCalculator: React.FC<TradeCalculatorProps> = ({ onForwardCalculation }) => {
  const [materialType, setMaterialType] = useState('cement-bestway');
  const [quantity, setQuantity] = useState<number>(300);
  const [destination, setDestination] = useState('Pallandri By-Pass Road');
  const [needOffloading, setNeedOffloading] = useState(true);

  // Destinations in Sudhnoti & Azad Kashmir
  const destinations = [
    'Pallandri City & Main Bazar',
    'Pallandri By-Pass Road & Court Area',
    'Trarkhal Main Town & Surroundings',
    'Baloch Tehsil & Upper Villages',
    'Gorah & Degree College Road',
    'Mong Town & Hill Artery',
    'Thorar Tehsil',
    'Rawalakot (Poonch Hub)',
  ];

  const getMaterialLabel = () => {
    switch (materialType) {
      case 'cement-bestway': return 'Bestway Cement Bags (50kg)';
      case 'cement-fauji': return 'Fauji Cement Bags (50kg)';
      case 'cement-askari': return 'Askari Cement Bags (50kg)';
      case 'block-8solid': return '8" Solid Concrete Blocks';
      case 'block-6hollow': return '6" Hollow Concrete Blocks';
      case 'steel-rebar': return 'Grade 60 Steel Rebar (Tons)';
      case 'bajri-margalla': return 'Margalla Bajri (Cubic Feet)';
      default: return 'Construction Supplies';
    }
  };

  const calculateFleetRecommendation = () => {
    if (materialType.startsWith('cement')) {
      const trucks = Math.ceil(quantity / 250);
      return `${trucks} x 6-Wheeler Mazda Titan (${Math.min(quantity, 250)} bags/trip)`;
    } else if (materialType.startsWith('block')) {
      const trucks = Math.ceil(quantity / 800);
      return `${trucks} x Dedicated Block Delivery Mazda (${Math.min(quantity, 800)} blocks/trip)`;
    } else if (materialType === 'steel-rebar') {
      return `${Math.ceil(quantity / 10)} x Heavy Flatbed Steel Truck Load`;
    } else {
      const dumpers = Math.ceil(quantity / 800);
      return `${dumpers} x 10-Wheeler Aggregate Dumper`;
    }
  };

  const getEstimatedTurnaround = () => {
    if (destination.includes('Pallandri')) return 'Within 2 - 4 Hours (Same Day)';
    if (destination.includes('Trarkhal') || destination.includes('Gorah')) return 'Within 3 - 6 Hours (Same Day)';
    return 'Within 24 Hours';
  };

  const handleCreateRfq = () => {
    const summary = `Construction RFQ: ${quantity} units of ${getMaterialLabel()} for site delivery to ${destination}. Transport: ${calculateFleetRecommendation()}. Unloading assistance: ${needOffloading ? 'Requested' : 'Standard'}. Estimated dispatch turnaround: ${getEstimatedTurnaround()}.`;
    onForwardCalculation(summary);
  };

  return (
    <section id="calculator" className="py-20 bg-[#08132b] border-b border-[#162d59] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center justify-center gap-1.5">
            <Calculator className="w-4 h-4" />
            Instant Project Estimator
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Estimate Cement, Blocks & Mountain Freight
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Calculate vehicle loads, delivery transit time, and request immediate mill pricing for your construction site in Sudhnoti District.
          </p>
        </div>

        {/* Calculator Panel */}
        <div className="bg-[#0b1836] border-2 border-[#1c3970] rounded-2xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Material Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <HardHat className="w-3.5 h-3.5 text-orange-400" />
                Select Material / Supply Category
              </label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="cement-bestway">Bestway Cement (50kg OPC High Strength Bags)</option>
                <option value="cement-fauji">Fauji Cement (50kg Fast-Cure Bags)</option>
                <option value="cement-askari">Askari Sulphate Resistant Cement Bags</option>
                <option value="block-8solid">8" Solid Concrete Blocks (Hydraulic Machine Pressed)</option>
                <option value="block-6hollow">6" Hollow Load-Bearing Masonry Blocks</option>
                <option value="steel-rebar">Grade 60 Steel Rebar (ASTM A615 Certified)</option>
                <option value="bajri-margalla">Margalla Hill Washed Bajri (1/2" Down Aggregate)</option>
              </select>
            </div>

            {/* Quantity Slider / Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Required Quantity:</span>
                <span className="text-orange-400 font-bold text-sm">
                  {quantity} {materialType.startsWith('cement') ? 'Bags' : materialType.startsWith('block') ? 'Blocks' : materialType === 'steel-rebar' ? 'Tons' : 'Cft'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={materialType === 'steel-rebar' ? 1 : 50}
                  max={materialType === 'steel-rebar' ? 50 : 3000}
                  step={materialType === 'steel-rebar' ? 1 : 25}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer h-2 bg-[#122852] rounded-lg"
                />
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-24 bg-[#10224a] border border-[#21437e] rounded-lg px-2 py-1.5 text-sm text-white text-right focus:outline-none"
                />
              </div>
            </div>

            {/* Destination in Sudhnoti */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Construction Site Destination (Sudhnoti / AJK)
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>

            {/* Offloading Checkbox */}
            <div className="flex items-center justify-between p-3.5 bg-[#10234a] rounded-lg border border-[#1e3c74]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-xs font-bold text-white">Include On-Site Manual / Crane Labor Offloading</div>
                  <div className="text-[11px] text-slate-300">Skilled team to stack cement in warehouse or offload blocks safely</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={needOffloading}
                onChange={(e) => setNeedOffloading(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer rounded"
              />
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-[#0e1f44] border-2 border-[#203f7a] rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1f3c72]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Logistical Assessment
                </h3>
                <span className="text-xs text-orange-400 font-semibold">
                  AJK Mountain Route
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" /> Material:
                  </span>
                  <span className="font-bold text-white">{getMaterialLabel()}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-orange-400" /> Fleet Allocation:
                  </span>
                  <span className="font-bold text-white text-right">{calculateFleetRecommendation()}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" /> Delivery Zone:
                  </span>
                  <span className="font-medium text-white">{destination}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" /> Turnaround:
                  </span>
                  <span className="font-medium text-emerald-400">{getEstimatedTurnaround()}</span>
                </div>
              </div>

              {/* Note */}
              <div className="p-3 bg-[#0a1630] rounded-lg border border-[#1b3464] text-[11px] text-slate-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>
                  Exact rates reflect current daily mill tariff (Bestway/Fauji) and diesel freight index. We guarantee zero price escalation once booking is confirmed.
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCreateRfq}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 border border-orange-400/40"
            >
              <span>Transfer to Official Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
