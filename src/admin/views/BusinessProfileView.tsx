import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  Plus, 
  Trash2,
  Upload
} from 'lucide-react';
import { api, PublicProfile } from '../../services/api.ts';

export const BusinessProfileView: React.FC = () => {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [newPhone, setNewPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [newArea, setNewArea] = useState('');
  const [facebook, setFacebook] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // 3 Named Business Owners
  const [owners, setOwners] = useState<Array<{ name: string; role: string; phone: string; email: string }>>([
    { name: 'Sardar Mahir Khan', role: 'Director & Supply Operations', phone: '0316-9080566', email: 'sardarmahirkhan0601@gmail.com' },
    { name: 'Sardar Usama Khan', role: 'Executive Director & Commercial Lead', phone: '0309-5090651', email: 'usamaikhlaq677@gmail.com' },
    { name: 'Sardar Ali Sudozai', role: 'Director Sales & Logistics', phone: '0343-8590951', email: 'sales.ajk@usamatraders.com' },
  ]);

  const loadProfile = async () => {
    try {
      const res = await api.getAdminProfile();
      if (res.success && res.profile) {
        const p = res.profile;
        setProfile(p);
        setName(p.name);
        setTagline(p.tagline);
        setAbout(p.about);
        setAddress(p.address);
        setCity(p.city);
        setDistrict(p.district);
        setRegion(p.region);
        setCountry(p.country);
        setPostalCode(p.postalCode);
        setPhoneNumbers(p.phoneNumbers || []);
        setWhatsappNumber(p.whatsappNumber);
        setEmail(p.email);
        setBusinessHours(p.businessHours);
        setServiceAreas(p.serviceAreas || []);
        setLogoUrl(p.logoUrl || '');
        setFacebook(p.socialLinks?.facebook || '');
        if (p.owners && p.owners.length > 0) {
          setOwners(p.owners);
        }
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to load business profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddPhone = () => {
    if (newPhone.trim()) {
      setPhoneNumbers([...phoneNumbers, newPhone.trim()]);
      setNewPhone('');
    }
  };

  const handleRemovePhone = (index: number) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  const handleAddArea = () => {
    if (newArea.trim()) {
      setServiceAreas([...serviceAreas, newArea.trim()]);
      setNewArea('');
    }
  };

  const handleRemoveArea = (index: number) => {
    setServiceAreas(serviceAreas.filter((_, i) => i !== index));
  };

  const handleOwnerChange = (index: number, field: string, val: string) => {
    const updated = [...owners];
    updated[index] = { ...updated[index], [field]: val };
    setOwners(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: Partial<PublicProfile> = {
        name,
        tagline,
        about,
        address,
        city,
        district,
        region,
        country,
        postalCode,
        phoneNumbers,
        whatsappNumber,
        email,
        businessHours,
        serviceAreas,
        logoUrl,
        socialLinks: {
          facebook,
          whatsapp: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`,
        },
        owners,
      };

      const res = await api.updateAdminProfile(payload);
      if (res.success) {
        showFeedback('success', 'Business profile & owners contact details updated successfully.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update business profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-xs">Loading business profile...</div>;
  }

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
            <Building2 className="w-6 h-6 text-orange-400" />
            Business Profile & Executive Directory
          </h1>
          <p className="text-xs text-slate-400">
            Configure official enterprise credentials, depot address in Pallandri, official contact numbers, and 3 named business partners.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Enterprise Details */}
        <div className="bg-[#0b1736] border border-[#1d3a72] rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#183262]">
            General Business Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Registered Business Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Official Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">About USAMA TRADERS (Public Story)</label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Street / Depot Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">City & District</label>
              <input
                type="text"
                value={`${city}, ${district}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setCity(parts[0]?.trim() || city);
                  if (parts[1]) setDistrict(parts[1].trim());
                }}
                className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Region & Country</label>
              <input
                type="text"
                value={`${region}, ${country}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setRegion(parts[0]?.trim() || region);
                  if (parts[1]) setCountry(parts[1].trim());
                }}
                className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Official Channels & Contact Numbers */}
        <div className="bg-[#0b1736] border border-[#1d3a72] rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#183262]">
            Official Contact Channels & Hours
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Official WhatsApp Hotline *</label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+92 300 8254410"
                className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Official Corporate Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sales.ajk@usamatraders.com"
                className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">General Telephone Lines</label>
            <div className="flex flex-wrap gap-2">
              {phoneNumbers.map((p, idx) => (
                <span key={idx} className="bg-[#12254e] text-white text-xs px-2.5 py-1 rounded-lg border border-[#203f7a] flex items-center gap-2">
                  <span>{p}</span>
                  <button type="button" onClick={() => handleRemovePhone(idx)} className="text-rose-400 hover:text-white">✕</button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1 max-w-sm">
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Add phone e.g. +92 345 8891234"
                className="bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleAddPhone}
                className="px-3 py-1.5 bg-[#142852] hover:bg-orange-500 text-white rounded-lg text-xs"
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Depot Operating Hours</label>
            <input
              type="text"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Delivery Service Coverage Areas</label>
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map((a, idx) => (
                <span key={idx} className="bg-[#12254e] text-white text-xs px-2.5 py-1 rounded-lg border border-[#203f7a] flex items-center gap-2">
                  <span>{a}</span>
                  <button type="button" onClick={() => handleRemoveArea(idx)} className="text-rose-400 hover:text-white">✕</button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1 max-w-sm">
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Add area e.g. Trarkhal Tehsil"
                className="bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="px-3 py-1.5 bg-[#142852] hover:bg-orange-500 text-white rounded-lg text-xs"
              >
                Add Area
              </button>
            </div>
          </div>
        </div>

        {/* 3 Business Owners Named Directory */}
        <div className="bg-[#0b1736] border border-[#1d3a72] rounded-xl p-6 shadow-xl space-y-5">
          <div className="pb-2 border-b border-[#183262]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-orange-400" />
              Three Named Business Owners & Directors
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual executive contacts registered for USAMA TRADERS commercial operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {owners.map((owner, idx) => (
              <div key={idx} className="p-5 bg-[#0e1d3e] border border-[#1e3c75] rounded-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#183262]">
                  <span className="text-xs font-bold text-orange-400 uppercase">
                    Partner #{idx + 1}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={owner.name}
                    onChange={(e) => handleOwnerChange(idx, 'name', e.target.value)}
                    className="w-full bg-[#10224a] border border-[#21437e] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Designation / Executive Role *</label>
                  <input
                    type="text"
                    required
                    value={owner.role}
                    onChange={(e) => handleOwnerChange(idx, 'role', e.target.value)}
                    className="w-full bg-[#10224a] border border-[#21437e] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Direct Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={owner.phone}
                    onChange={(e) => handleOwnerChange(idx, 'phone', e.target.value)}
                    className="w-full bg-[#10224a] border border-[#21437e] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Official Business Email *</label>
                  <input
                    type="email"
                    required
                    value={owner.email}
                    onChange={(e) => handleOwnerChange(idx, 'email', e.target.value)}
                    className="w-full bg-[#10224a] border border-[#21437e] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-lg shadow-orange-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Business Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
