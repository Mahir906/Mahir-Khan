import React from 'react';
import { 
  ShieldCheck, 
  Coins, 
  Truck, 
  FileCheck2, 
  Users2, 
  Globe2,
  Lock,
  BadgeCheck
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Third-Party Quality Verification',
      description: 'Every consignment undergoes pre-shipment testing by recognized international agencies (SGS, Bureau Veritas, Cotecna) before cargo is released.'
    },
    {
      icon: Coins,
      title: 'Flexible Trade Banking Terms',
      description: 'We work with top tier global banks supporting Letter of Credit (LC at Sight, Usance LC), Bank Guarantees, and escrow-backed milestone releases.'
    },
    {
      icon: Truck,
      title: 'Multimodal Freight & Chartering',
      description: 'Whether containerized FCL, breakbulk, or dedicated vessel chartering, our logistics desk guarantees vessel space allocation and optimum routes.'
    },
    {
      icon: Lock,
      title: 'Price Locking & Hedging',
      description: 'Shield your procurement from volatile spot market swings through fixed forward contracts and locked margin agreements.'
    },
    {
      icon: FileCheck2,
      title: 'Accurate Customs Documentation',
      description: 'Error-free Certificate of Origin, Phytosanitary, Bill of Lading, Packing Lists, and Consular Invoices tailored to your port of discharge.'
    },
    {
      icon: Globe2,
      title: 'Direct Origin Partnerships',
      description: 'No unnecessary intermediaries. We source directly from mills, agricultural cooperatives, and refineries to pass along maximum price efficiency.'
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-[#070e20] border-b border-[#14264e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center justify-center gap-1.5">
            <BadgeCheck className="w-4 h-4" />
            Institutional Reliability
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Leading Importers Trust USAMA TRADERS
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Engineered around contract execution security, transparency, and rapid turnaround for bulk and containerized international trade.
          </p>
        </div>

        {/* 6-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-[#0b1632] border border-[#1b366a] rounded-xl p-6 hover:border-amber-400/40 hover:bg-[#0e1d40] transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-[#14264f] flex items-center justify-center text-amber-400 mb-5 border border-[#1f3d79]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Certifications and Compliance strip */}
        <div className="mt-14 pt-8 border-t border-[#162c56] flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO 9001:2015 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-cyan-400" />
            <span>Chamber of Commerce Registered</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-amber-400" />
            <span>Incoterms® 2020 Certified Logistics</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-purple-400" />
            <span>FIATA & WCA Network Associate</span>
          </div>
        </div>

      </div>
    </section>
  );
};
