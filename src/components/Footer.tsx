import React from 'react';
import { Building2, Mail, Phone, MapPin, ArrowUp, ShieldCheck, Truck, HardHat } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onRequestQuote: () => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onRequestQuote, onNavigateToAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050c1b] text-slate-300 border-t border-[#132549] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-wider uppercase font-sans">
                  USAMA <span className="text-orange-500">TRADERS</span>
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Construction & Cement • Pallandri, AJK
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Premier cement dealer, automated hydraulic concrete block manufacturer, and heavy mountain transport provider headquartered in Pallandri, Sudhnoti, Azad Kashmir.
            </p>

            <div className="flex items-center gap-3 pt-2 text-slate-400 text-[11px] flex-wrap">
              <span className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Authorized Factory Dealer
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Truck className="w-3.5 h-3.5 text-orange-400" />
                19 Mountain Fleet Units
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#14264f] pb-2">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigateSection('hero')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('about')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('cement')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Cement Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('block-factory')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Block Factory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('fleet')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Our Fleet
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('projects')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Landmark Projects
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('gallery')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Operations Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('contact')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Contact Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Materials & Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#14264f] pb-2">
              Supplies & Services
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>Bestway & Fauji OPC Cement</li>
              <li>Askari Sulphate Resistant Cement</li>
              <li>8" Solid Mountain Masonry Blocks</li>
              <li>6" Hollow & Solid Concrete Blocks</li>
              <li>Grade 60 Steel Rebar (ASTM A615)</li>
              <li>Margalla Crushed Bajri (1/2" Down)</li>
              <li>Washed River Sand Dumpers</li>
              <li>Heavy-Duty Interlocking Tuff Tiles</li>
            </ul>
          </div>

          {/* Direct Office in Pallandri */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#14264f] pb-2">
              Pallandri Office & Contacts
            </h4>
            <div className="space-y-2 text-slate-300">
              <div>
                <a 
                  href="tel:+923169080566"
                  className="flex items-center gap-2 hover:text-orange-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Sardar Mahir Khan: <strong>0316-9080566</strong></span>
                </a>
              </div>
              <div>
                <a 
                  href="tel:+923095090651"
                  className="flex items-center gap-2 hover:text-orange-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Sardar Usama Khan: <strong>0309-5090651</strong></span>
                </a>
              </div>
              <div>
                <a 
                  href="tel:+923438590951"
                  className="flex items-center gap-2 hover:text-orange-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Sardar Ali Sudozai: <strong>0343-8590951</strong></span>
                </a>
              </div>
              <div className="pt-1">
                <a 
                  href="mailto:sardarmahirkhan0601@gmail.com" 
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>sardarmahirkhan0601@gmail.com</span>
                </a>
              </div>
              <div>
                <a 
                  href="mailto:sales.ajk@usamatraders.com" 
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>sales.ajk@usamatraders.com</span>
                </a>
              </div>
              <p className="flex items-start gap-2 pt-1 text-[11px] text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>Main By-Pass Road, Pallandri, District Sudhnoti, Azad Kashmir</span>
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href="https://wa.me/923169080566?text=Assalam-o-Alaikum%20USAMA%20TRADERS%2C%20I%20need%20a%20cement%20and%20blocks%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all text-center flex items-center justify-center gap-1 shadow-md"
              >
                <span>WhatsApp</span>
              </a>
              <button
                onClick={onRequestQuote}
                className="py-2 px-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-xs transition-all text-center cursor-pointer shadow-md"
              >
                <span>Get Quote</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#122242] flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} USAMA TRADERS. All rights reserved. Registered Cement & Building Materials Merchant, Pallandri, Sudhnoti, Azad Kashmir, Pakistan.
          </div>

          <div className="flex items-center gap-6">
            <span>PSQCA & ASTM Compliant</span>
            <span>·</span>
            <span>AJK Chamber of Commerce</span>
            <span>·</span>
            {onNavigateToAdmin && (
              <>
                <button
                  onClick={onNavigateToAdmin}
                  className="text-orange-400 hover:text-white transition-colors cursor-pointer font-semibold"
                >
                  Admin Portal
                </button>
                <span>·</span>
              </>
            )}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
