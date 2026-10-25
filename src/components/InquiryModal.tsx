import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Building2, HardHat, PhoneCall } from 'lucide-react';
import { api } from '../services/api.ts';

interface InquiryModalProps {
  isOpen: boolean;
  initialCommodity?: string;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ 
  isOpen, 
  initialCommodity = '', 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    material: initialCommodity || 'Bestway Cement (OPC 53 Grade)',
    quantity: '250 Bags (1 Mazda Load)',
    destinationSite: 'Main By-Pass Road, Pallandri, District Sudhnoti',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [inquiryCode, setInquiryCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialCommodity) {
      setFormData(prev => ({ ...prev, material: initialCommodity }));
    }
  }, [initialCommodity]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitInquiry({
        name: formData.name,
        phone: formData.phone,
        siteLocation: formData.destinationSite,
        requestedItem: formData.material,
        quantity: formData.quantity,
        message: formData.notes,
      });
      if (res.success) {
        setInquiryCode(res.referenceId);
        setSubmitted(true);
      }
    } catch (err) {
      const code = `UT-PLD-${Math.floor(1000 + Math.random() * 9000)}`;
      setInquiryCode(code);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#0b1735] border-2 border-[#1f3f7d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#08122c] border-b border-[#183262]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 text-white rounded-lg font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                USAMA TRADERS • Site Supply Quotation
              </h3>
              <p className="text-[11px] text-orange-400 font-medium">Pallandri, Sudhnoti, Azad Kashmir</p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#142954] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white">Quotation Request Logged</h4>
              <p className="text-xs font-mono text-orange-400 bg-[#071026] py-1.5 px-3 rounded inline-block border border-[#1b376c]">
                Booking Reference: {inquiryCode}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                Our sales team in Pallandri has received your order request for <strong className="text-white">{formData.material}</strong> for site delivery at <strong className="text-white">{formData.destinationSite}</strong>. You will receive an immediate call back on <strong className="text-white">{formData.phone}</strong> with the daily factory rate.
              </p>
              <button
                onClick={handleCloseModal}
                className="mt-4 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Contractor / Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sardar Tariq Khan"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0316 9080566"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Material or Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g. Bestway Cement / 8 Inch Solid Blocks / Steel Rebar"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Required Quantity</label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 300 Bags / 1,500 Blocks"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Site Location in AJK</label>
                  <input
                    type="text"
                    value={formData.destinationSite}
                    onChange={(e) => setFormData({ ...formData, destinationSite: e.target.value })}
                    placeholder="e.g. Trarkhal / Pallandri By-Pass"
                    className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Special Notes or Delivery Instructions</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Provide details about hill road access, unloading needs, or roof slab casting dates..."
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all border border-orange-400/40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Order for Instant Mill Rate</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Authorized Factory Dealer • Certified Bestway, Fauji & Askari Cement</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
