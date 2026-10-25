import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Phone, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  ExternalLink, 
  Save, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { api, InquiryItem } from '../../services/api.ts';

export const InquiriesView: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadInquiries = async () => {
    try {
      const res = await api.getAdminInquiries();
      if (res.success) {
        setInquiries(res.inquiries);
        if (res.inquiries.length > 0 && !selectedInquiry) {
          setSelectedInquiry(res.inquiries[0]);
          setNotesDraft(res.inquiries[0].internalNotes || '');
        }
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSelectInquiry = (inq: InquiryItem) => {
    setSelectedInquiry(inq);
    setNotesDraft(inq.internalNotes || '');
  };

  const handleUpdateStatus = async (id: string, newStatus: InquiryItem['status']) => {
    try {
      const res = await api.updateInquiryStatus(id, newStatus);
      if (res.success) {
        setInquiries(prev => prev.map(i => (i.id === id ? res.inquiry : i)));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(res.inquiry);
        }
        showFeedback('success', `Status updated to ${newStatus}`);
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update status');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    try {
      const res = await api.updateInquiryNotes(selectedInquiry.id, notesDraft);
      if (res.success) {
        setInquiries(prev => prev.map(i => (i.id === selectedInquiry.id ? res.inquiry : i)));
        setSelectedInquiry(res.inquiry);
        showFeedback('success', 'Internal notes saved.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to save notes');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteInquiry(id);
      if (res.success) {
        setInquiries(prev => prev.filter(i => i.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
        showFeedback('success', 'Inquiry deleted permanently.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to delete inquiry');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const formatCleanPhone = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      return `92${cleaned.substring(1)}`;
    }
    return cleaned;
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesSearch = 
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.siteLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.requestedItem.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' 
            : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)}>✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#183262]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-orange-400" />
            Customer RFQ & Inquiry Management
          </h1>
          <p className="text-xs text-slate-400">
            Confidential customer quote requests submitted for cement supply, concrete blocks, and mountain delivery across Sudhnoti.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-semibold bg-[#112349] px-3 py-1.5 rounded-lg border border-[#1e3c75]">
            Total Inquiries: <strong className="text-white">{inquiries.length}</strong>
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-7 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, ref (e.g. UT-PLD-4091), or location..."
            className="w-full pl-9 pr-4 py-2 bg-[#0e1d3e] border border-[#1e3c75] rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="sm:col-span-5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'New', 'Contacted', 'Quoted', 'Closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-[#10224a] text-slate-300 hover:text-white border border-[#1e3d74]'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Master-Detail Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Inquiries List (5 Columns) */}
        <div className="lg:col-span-5 bg-[#0b1736] border border-[#1d3a72] rounded-xl overflow-hidden shadow-xl max-h-[700px] flex flex-col">
          <div className="p-3.5 bg-[#071126] border-b border-[#183262] text-xs font-bold text-slate-300 flex justify-between items-center">
            <span>Inquiries ({filteredInquiries.length})</span>
            <span className="text-[11px] text-orange-400 font-normal">Click to review details</span>
          </div>

          <div className="overflow-y-auto divide-y divide-[#183262] flex-1">
            {filteredInquiries.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400">
                No inquiries match your criteria.
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelectInquiry(inq)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#122650] border-l-4 border-orange-500' : 'hover:bg-[#0f1f44]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-orange-400">{inq.referenceId}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        inq.status === 'New' 
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : inq.status === 'Contacted'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : inq.status === 'Quoted'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {inq.status}
                      </span>
                    </div>

                    <div className="font-bold text-white text-sm">{inq.name}</div>
                    <div className="text-xs text-slate-300 truncate mt-0.5">{inq.requestedItem}</div>
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{inq.siteLocation}</span>
                      </span>
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Inquiry Detail Panel (7 Columns) */}
        <div className="lg:col-span-7 bg-[#0b1736] border border-[#1d3a72] rounded-xl p-6 shadow-xl">
          {selectedInquiry ? (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#183262]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      {selectedInquiry.referenceId}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedInquiry.name}</h2>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Status:</span>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleUpdateStatus(selectedInquiry.id, e.target.value as any)}
                    className="bg-[#10224a] border border-[#21437e] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Closed">Closed / Delivered</option>
                  </select>
                </div>
              </div>

              {/* Direct Quick Actions for Calling & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call: {selectedInquiry.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${formatCleanPhone(selectedInquiry.phone)}?text=${encodeURIComponent(`Assalam-o-Alaikum ${selectedInquiry.name}, this is USAMA TRADERS Pallandri regarding your inquiry (${selectedInquiry.referenceId}) for ${selectedInquiry.requestedItem}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 bg-[#12244e] hover:bg-[#1a3368] text-emerald-400 font-bold text-xs rounded-lg border border-[#203f7a] flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Chat</span>
                </a>
              </div>

              {/* Specifications & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#0e1d3e] rounded-xl border border-[#1b376c] text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Requested Material:</span>
                  <span className="font-bold text-white text-sm">{selectedInquiry.requestedItem}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Volume / Quantity:</span>
                  <span className="font-bold text-orange-400 text-sm">{selectedInquiry.quantity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Construction Site Location:</span>
                  <span className="font-medium text-white flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    {selectedInquiry.siteLocation}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Target Delivery / Casting Date:</span>
                  <span className="font-medium text-white mt-0.5 block">
                    {selectedInquiry.deliveryDate || 'Standard Urgent Dispatch'}
                  </span>
                </div>
              </div>

              {/* Customer Message */}
              {selectedInquiry.message && (
                <div className="space-y-1 text-xs">
                  <label className="text-slate-400 font-semibold block">Customer Message / Site Access Notes:</label>
                  <div className="p-3.5 bg-[#10224a] rounded-lg border border-[#1e3c74] text-slate-200 leading-relaxed italic">
                    "{selectedInquiry.message}"
                  </div>
                </div>
              )}

              {/* Internal Administration & Dispatch Notes */}
              <div className="space-y-2 text-xs pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-white font-bold flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5 text-orange-400" />
                    Internal Sales Desk Notes (Confidential)
                  </label>
                  <span className="text-[10px] text-slate-400">Visible to managers only</span>
                </div>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Record quoted mill rate, assigned truck driver (e.g. Mazda AJK-7821), or site gate pass instructions..."
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Internal Notes</span>
                </button>
              </div>

              {/* Delete Inquiry Action */}
              <div className="pt-4 border-t border-[#183262] flex justify-end">
                <button
                  onClick={() => setDeleteConfirmId(selectedInquiry.id)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Inquiry Record</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select an inquiry from the left panel to view customer contact info and delivery details.
            </div>
          )}
        </div>

      </div>

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b1735] border border-rose-500/40 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Delete Inquiry Permanently?</h3>
            <p className="text-xs text-slate-300">Are you sure you want to delete this customer inquiry record?</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 bg-[#12254e] text-slate-300 text-xs rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
