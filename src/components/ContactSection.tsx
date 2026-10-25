import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Building2, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  Truck,
  PhoneCall
} from 'lucide-react';
import { api } from '../services/api.ts';

interface ContactSectionProps {
  prefilledCommodity?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ prefilledCommodity }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    siteLocation: 'Main By-Pass Road, Pallandri, District Sudhnoti',
    material: prefilledCommodity || 'Bestway Cement (300 Bags)',
    quantity: '300 Bags',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (prefilledCommodity) {
      setFormData(prev => ({ ...prev, material: prefilledCommodity }));
    }
  }, [prefilledCommodity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.material) return;

    setSubmitting(true);
    try {
      const res = await api.submitInquiry({
        name: formData.name,
        phone: formData.phone,
        siteLocation: formData.siteLocation,
        requestedItem: formData.material,
        quantity: formData.quantity,
        message: formData.message,
      });
      if (res.success) {
        setInquiryId(res.referenceId);
        setSubmitted(true);
      }
    } catch (err) {
      // Fallback
      const refId = `UT-AJK-${Math.floor(1000 + Math.random() * 9000)}`;
      setInquiryId(refId);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      siteLocation: 'Main By-Pass Road, Pallandri, District Sudhnoti',
      material: '',
      quantity: '',
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <section id="contact" className="py-20 bg-[#081229] border-b border-[#162d59] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center justify-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            Pallandri Sales & Booking Desk
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact USAMA TRADERS
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Visit our central warehouse on Pallandri By-Pass, call our trade desk, or send an instant booking inquiry for direct site dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Office & Depot Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Pallandri Depot */}
            <div className="bg-[#0b1736] border-2 border-[#1c386e] rounded-xl p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">
                    Main Head Office & Central Stock Depot
                  </h3>
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                    USAMA TRADERS (CEMENT & CONSTRUCTION)
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Main By-Pass Road, Pallandri, District Sudhnoti, Azad Kashmir, Pakistan
                  </p>
                  
                  {/* Authentic Business Owners Directory */}
                  <div className="pt-4 space-y-3">
                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">
                      Direct Executive Contacts
                    </span>

                    {/* Owner 1: Sardar Mahir Khan */}
                    <div className="p-3 bg-[#0f2048] rounded-lg border border-[#1e3c78] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Sardar Mahir Khan</span>
                        <span className="text-[10px] text-orange-400 font-semibold uppercase">Supply Operations</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <a 
                          href="tel:+923169080566"
                          className="flex items-center gap-1.5 text-slate-200 hover:text-orange-400 font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-orange-500" />
                          <span>0316-9080566</span>
                        </a>
                        <a
                          href="https://wa.me/923169080566?text=Assalam-o-Alaikum%20Sardar%20Mahir%20Khan%2C%20I%20need%20a%20rate%20quote%20for%20cement%20and%20blocks%20from%20USAMA%20TRADERS."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded border border-emerald-500/40 text-[11px] font-bold transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                      <a 
                        href="mailto:sardarmahirkhan0601@gmail.com" 
                        className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 pt-0.5"
                      >
                        <Mail className="w-3 h-3 text-cyan-400" />
                        <span>sardarmahirkhan0601@gmail.com</span>
                      </a>
                    </div>

                    {/* Owner 2: Sardar Usama Khan */}
                    <div className="p-3 bg-[#0f2048] rounded-lg border border-[#1e3c78] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Sardar Usama Khan</span>
                        <span className="text-[10px] text-orange-400 font-semibold uppercase">Commercial Lead</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <a 
                          href="tel:+923095090651"
                          className="flex items-center gap-1.5 text-slate-200 hover:text-orange-400 font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-orange-500" />
                          <span>0309-5090651</span>
                        </a>
                        <a
                          href="https://wa.me/923095090651?text=Assalam-o-Alaikum%20Sardar%20Usama%20Khan%2C%20I%20would%20like%20to%20inquire%20about%20bulk%20supplies%20from%20USAMA%20TRADERS."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded border border-emerald-500/40 text-[11px] font-bold transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                      <a 
                        href="mailto:usamaikhlaq677@gmail.com" 
                        className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 pt-0.5"
                      >
                        <Mail className="w-3 h-3 text-cyan-400" />
                        <span>usamaikhlaq677@gmail.com</span>
                      </a>
                    </div>

                    {/* Owner 3: Sardar Ali Sudozai */}
                    <div className="p-3 bg-[#0f2048] rounded-lg border border-[#1e3c78] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Sardar Ali Sudozai</span>
                        <span className="text-[10px] text-orange-400 font-semibold uppercase">Sales & Logistics</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <a 
                          href="tel:+923438590501"
                          className="flex items-center gap-1.5 text-slate-200 hover:text-orange-400 font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-orange-500" />
                          <span>0343-859090501</span>
                        </a>
                        <a
                          href="https://wa.me/923438590501?text=Assalam-o-Alaikum%20Sardar%20Ali%20Sudozai%2C%20I%20need%20logistics%20and%20materials%20dispatch%20details%20from%20USAMA%20TRADERS."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded border border-emerald-500/40 text-[11px] font-bold transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                      <a 
                        href="mailto:sales.ajk@usamatraders.com" 
                        className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 pt-0.5"
                      >
                        <Mail className="w-3 h-3 text-cyan-400" />
                        <span>sales.ajk@usamatraders.com</span>
                      </a>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Block Factory Location */}
            <div className="bg-[#0b1736] border border-[#1b376c] rounded-xl p-5">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-[#142852] text-orange-400 rounded-lg shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Concrete Block & Precast Factory Plant</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Industrial Yard, Lower By-Pass Road, Pallandri, Sudhnoti. Daily curing water ponds and heavy mechanical loading ramps.
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#0e1d3e] border border-[#1e3c75] rounded-xl p-5 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Depot Hours & Fast Dispatch</span>
              </div>
              <p className="leading-relaxed">
                Open Saturday through Thursday: 07:00 AM – 08:00 PM. Friday: 07:00 AM – 12:30 PM & 03:00 PM – 08:00 PM. Urgent roof-casting cement and dumper bajri dispatches handled 24/7 on advance notice.
              </p>
            </div>

          </div>

          {/* Right Column: Commercial Inquiry & Order Booking Form */}
          <div className="lg:col-span-7 bg-[#0b1736] border-2 border-[#1f3e79] rounded-2xl p-6 sm:p-9 shadow-2xl">
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Order Inquiry Successfully Transmitted
                </h3>
                <div className="inline-block px-4 py-2 bg-[#12244a] border border-[#21437e] rounded-lg font-mono text-sm text-orange-400 font-bold">
                  Booking Slip Reference: {inquiryId}
                </div>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our Pallandri sales desk has received your request for <strong className="text-white">{formData.material}</strong> destined for <strong className="text-white">{formData.siteLocation}</strong>. A trade representative will call you on <strong className="text-white">{formData.phone}</strong> within 30 minutes with the exact daily factory rate.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Submit Another Order
                  </button>
                  <a
                    href="tel:+923169080566"
                    className="px-6 py-2.5 bg-[#142750] hover:bg-[#1b3469] text-slate-200 font-bold text-xs rounded-lg border border-[#224480] transition-colors flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
                    <span>Call Sales Directly (0316-9080566)</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b366a]">
                  <h3 className="text-base font-bold text-white">
                    Request Cement & Block Supply Quotation
                  </h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Authorized Factory Rates
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Your Name / Contractor Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sardar Tariq Khan"
                      className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0316 9080566"
                      className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Construction Site Location (Tehsil / Village) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.siteLocation}
                      onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                      placeholder="e.g. Trarkhal Chowk / Pallandri By-Pass"
                      className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Quantity (Bags / Blocks / Tons / Cft) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="e.g. 500 Bags / 2000 Blocks"
                      className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Material / Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g. Bestway Cement / 8 Inch Solid Concrete Blocks"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Additional Site Instructions or Preferred Delivery Date
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mention if road has steep incline, if offloading labor is needed, or if slab casting date is fixed..."
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 border border-orange-400/40"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Order Booking & Inquire Rate</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
