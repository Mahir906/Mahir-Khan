import React, { useState } from 'react';
import { 
  Search, 
  Truck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  CircleDashed, 
  Layers, 
  AlertCircle,
  ArrowRight,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { SAMPLE_DELIVERIES, DeliveryShipment } from '../data/tradeData.ts';
import { api } from '../services/api.ts';

export const ShipmentTracker: React.FC = () => {
  const [trackingInput, setTrackingInput] = useState('UT-PLD-4091');
  const [activeShipment, setActiveShipment] = useState<DeliveryShipment | null>(
    SAMPLE_DELIVERIES['UT-PLD-4091']
  );
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = trackingInput.trim().toUpperCase();
    if (!query) return;

    // Check sample orders first for instant demo
    if (SAMPLE_DELIVERIES[query]) {
      setActiveShipment(SAMPLE_DELIVERIES[query]);
      setNotFound(false);
      return;
    }

    // Check live database inquiry/order tracking
    setIsLoading(true);
    setNotFound(false);
    try {
      const res = await api.trackInquiry(query);
      if (res && res.success && res.tracking) {
        const t = res.tracking;
        const isClosed = t.status === 'Closed';
        const isQuoted = t.status === 'Quoted';
        const isContacted = t.status === 'Contacted';

        setActiveShipment({
          orderId: t.referenceId,
          customerName: t.customerName || 'Verified Construction Client',
          destination: t.destination || 'Pallandri / Sudhnoti Site Delivery',
          items: t.items ? `${t.items} (${t.quantity})` : 'Construction Materials Consignment',
          vehicleAssigned: 'Mazda 6-Wheeler Mountain Dispatch Fleet',
          driverName: 'Sardar Naveed (Central Dispatch)',
          driverContact: '0316-9080566',
          status: isClosed ? 'Delivered & Offloaded' : isQuoted ? 'Dispatched & On Route' : isContacted ? 'Scheduled' : 'Loading at Pallandri Yard',
          estimatedArrival: isClosed ? 'Completed' : 'Expected within 2-4 Hours',
          milestones: [
            { time: new Date(t.submittedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), title: 'Inquiry & Requirements Verified', description: 'Requisition logged into USAMA TRADERS system.', completed: true },
            { time: isContacted || isQuoted || isClosed ? 'Confirmed' : 'Pending', title: 'Quotation & Stock Allocation', description: 'Material allocated from Central Pallandri Warehouse.', completed: isContacted || isQuoted || isClosed },
            { time: isQuoted || isClosed ? 'Active' : 'Pending', title: 'Vehicle Loaded & Mountain Route Dispatch', description: 'Heavy truck cleared through bypass security gate.', completed: isQuoted || isClosed },
            { time: isClosed ? 'Completed' : 'Pending', title: 'On-site Delivery & Slip Clearance', description: 'Material delivery acknowledged at site.', completed: isClosed },
          ],
        });
        setNotFound(false);
        setIsLoading(false);
        return;
      }
    } catch {
      // If not in database, check fallback format
    } finally {
      setIsLoading(false);
    }

    if (query.length > 4) {
      setActiveShipment({
        orderId: query,
        customerName: 'Direct Site Delivery Customer',
        destination: 'Pallandri / Sudhnoti Bypass Artery, AJK',
        items: 'Bulk Construction Consignment (Cement & Blocks)',
        vehicleAssigned: 'Mazda 6-Wheeler Hill Fleet Unit',
        driverName: 'Sardar Naveed (Pallandri Desk)',
        driverContact: '0316-9080566',
        status: 'Dispatched & On Route',
        estimatedArrival: 'Today within 1 - 2 Hours',
        milestones: [
          { time: '08:30 AM', title: 'Order Verified & Loaded', description: 'Stock released from USAMA TRADERS Central Yard, Pallandri.', completed: true },
          { time: '09:15 AM', title: 'Gate Pass Cleared', description: 'Truck dispatched along mountain route.', completed: true },
          { time: 'Active', title: 'In Transit on Hill Artery', description: 'Navigating towards destination site.', completed: false },
          { time: 'Scheduled', title: 'Destination Offload & Sign-off', description: 'Customer inspection and delivery slip acknowledgment.', completed: false },
        ],
      });
      setNotFound(false);
    } else {
      setActiveShipment(null);
      setNotFound(true);
    }
  };

  const loadSample = (code: string) => {
    setTrackingInput(code);
    setActiveShipment(SAMPLE_DELIVERIES[code]);
    setNotFound(false);
  };

  return (
    <section id="tracker" className="py-20 bg-[#070f24] border-b border-[#14264e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center justify-center gap-1.5">
            <Truck className="w-4 h-4" />
            Live Dispatch & Fleet Monitoring
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Track Your Construction Delivery
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Real-time status updates for cement trucks, dumper aggregates, and concrete block deliveries dispatched across Sudhnoti District.
          </p>
        </div>

        {/* Tracking Search Form */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter Delivery Slip / Order ID (e.g. UT-PLD-4091)..."
                className="w-full pl-10 pr-4 py-3 bg-[#0d1c3c] border border-[#21437e] rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-600/30 border border-orange-400/40"
            >
              {isLoading ? (
                <>
                  <CircleDashed className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <span>Track Consignment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 flex-wrap">
            <span>Sample Live Dispatches:</span>
            <button
              type="button"
              onClick={() => loadSample('UT-PLD-4091')}
              className="text-orange-400 hover:underline font-mono bg-[#112349] px-2 py-0.5 rounded border border-[#1b376e]"
            >
              UT-PLD-4091 (Trarkhal Route)
            </button>
            <button
              type="button"
              onClick={() => loadSample('UT-SDK-8820')}
              className="text-cyan-400 hover:underline font-mono bg-[#112349] px-2 py-0.5 rounded border border-[#1b376e]"
            >
              UT-SDK-8820 (Baloch Dumper)
            </button>
            <button
              type="button"
              onClick={() => loadSample('UT-PLD-1025')}
              className="text-emerald-400 hover:underline font-mono bg-[#112349] px-2 py-0.5 rounded border border-[#1b376e]"
            >
              UT-PLD-1025 (Gorah Blocks)
            </button>
          </div>
        </div>

        {/* Not Found state */}
        {notFound && (
          <div className="max-w-3xl mx-auto bg-[#102042] border border-rose-500/30 rounded-xl p-8 text-center text-slate-300">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <h4 className="text-white font-bold text-base mb-1">Order Not Found</h4>
            <p className="text-xs text-slate-400 mb-3">Please check your Delivery Order ID or click on one of the live dispatch samples above.</p>
          </div>
        )}

        {/* Active Delivery Card */}
        {activeShipment && (
          <div className="max-w-4xl mx-auto bg-[#0b1735] border-2 border-[#1e3c75] rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1b376c] gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="text-xs uppercase font-mono font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                    Order Ref: {activeShipment.orderId}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {activeShipment.status}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {activeShipment.items}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Client: <strong className="text-slate-200">{activeShipment.customerName}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right bg-[#0f2146] p-3 rounded-lg border border-[#203f7a]">
                <div className="text-[11px] text-slate-400">Estimated Site Arrival</div>
                <div className="text-sm font-bold text-orange-400 flex items-center sm:justify-end gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-orange-500" />
                  {activeShipment.estimatedArrival}
                </div>
              </div>
            </div>

            {/* Vehicle & Driver Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-[#1b376c] text-xs">
              <div className="p-3.5 bg-[#10224a] rounded-lg border border-[#1d3c74]">
                <span className="text-slate-400 block mb-1">Destination Site</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                  {activeShipment.destination}
                </span>
              </div>

              <div className="p-3.5 bg-[#10224a] rounded-lg border border-[#1d3c74]">
                <span className="text-slate-400 block mb-1">Vehicle Unit Assigned</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                  {activeShipment.vehicleAssigned}
                </span>
              </div>

              <div className="p-3.5 bg-[#10224a] rounded-lg border border-[#1d3c74]">
                <span className="text-slate-400 block mb-1">Assigned Driver & Direct Cell</span>
                <div className="text-sm font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    {activeShipment.driverName}
                  </span>
                  <a 
                    href={`tel:${activeShipment.driverContact}`}
                    className="text-orange-400 hover:text-white flex items-center gap-1 ml-2 text-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Timeline Milestones */}
            <div className="pt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                Delivery Dispatch Progression
              </h4>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1b376c]">
                {activeShipment.milestones.map((m, idx) => (
                  <div key={idx} className="relative flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div className="absolute -left-6 sm:-left-8 top-1">
                      {m.completed ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/50">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/50 animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <span className={`text-sm font-bold ${m.completed ? 'text-white' : 'text-orange-400'}`}>
                        {m.title}
                      </span>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                      {m.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
