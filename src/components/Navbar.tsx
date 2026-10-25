import React, { useState } from 'react';
import { 
  Building2, 
  Menu, 
  X, 
  PhoneCall, 
  Truck, 
  MapPin, 
  Calculator,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  onNavigateSection: (sectionId: string) => void;
  onRequestQuote: (initialItem?: string) => void;
  onNavigateToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection, onRequestQuote, onNavigateToAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'cement', label: 'Cement Products' },
    { id: 'block-factory', label: 'Block Factory' },
    { id: 'fleet', label: 'Our Fleet' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg">
      {/* Top Local Trade & Contact Ribbon */}
      <div className="bg-[#071126] border-b border-[#152a55] text-[11px] sm:text-xs text-slate-300 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              Pallandri & Sudhnoti Delivery Active
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
              Main By-Pass Road, Pallandri, District Sudhnoti, Azad Kashmir
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-200">
            <a 
              href="tel:+923169080566" 
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors font-medium"
            >
              <PhoneCall className="w-3 h-3 text-orange-500" />
              <span>Direct Sales: 0316-9080566</span>
            </a>
            <span className="text-slate-600">·</span>
            <a
              href="https://wa.me/923169080566?text=Assalam-o-Alaikum%20USAMA%20TRADERS%2C%20I%20would%20like%20to%20inquire%20about%20cement%20and%20blocks%20delivery%20in%20Sudhnoti."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>WhatsApp</span>
            </a>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => onNavigateToAdmin && onNavigateToAdmin()}
              className="text-xs font-semibold text-orange-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-[#0a1835]/95 backdrop-blur-md border-b border-[#1b366e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo / Brand Name */}
            <button 
              onClick={() => handleNavClick('hero')} 
              className="flex items-center gap-3 group text-left focus:outline-none"
            >
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200 border border-orange-400/40">
                <Building2 className="w-6 h-6 text-white font-bold" />
              </div>
              <div className="flex flex-col">
                <div className="text-xl sm:text-2xl font-black tracking-wider uppercase font-sans text-white">
                  USAMA <span className="text-orange-500">TRADERS</span>
                </div>
                <span className="text-[10px] tracking-wider uppercase text-slate-400 font-semibold flex items-center gap-1">
                  <span>Cement & Construction</span>
                  <span className="text-orange-400">·</span>
                  <span className="text-slate-300">Pallandri, AJK</span>
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-200">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="hover:text-orange-400 transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => handleNavClick('calculator')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-[#11244e] hover:bg-[#183168] border border-[#234585] rounded-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-orange-400" />
                <span>Rate Calculator</span>
              </button>

              <button 
                onClick={() => onRequestQuote()}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-md shadow-md shadow-orange-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-orange-400/40"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Get Quotation</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 xl:hidden">
              <button
                onClick={() => onRequestQuote()}
                className="sm:hidden px-2.5 py-1.5 text-xs font-bold text-white bg-orange-500 rounded-md"
              >
                Quote
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white hover:bg-[#13264f] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#091530] border-b border-[#1a3364] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-1 text-sm font-medium">
              {navLinks.map((link) => (
                <button 
                  key={link.id}
                  onClick={() => handleNavClick(link.id)} 
                  className="text-left py-2.5 px-3 rounded-md hover:bg-[#11244d] text-slate-100 hover:text-orange-400 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button 
                onClick={() => handleNavClick('calculator')} 
                className="text-left py-2.5 px-3 rounded-md hover:bg-[#11244d] text-orange-400 font-semibold"
              >
                Cost & Quantity Calculator
              </button>
              <button 
                onClick={() => handleNavClick('tracker')} 
                className="text-left py-2.5 px-3 rounded-md hover:bg-[#11244d] text-cyan-400 font-semibold"
              >
                Track Truck Delivery
              </button>
            </div>

            <div className="pt-4 border-t border-[#1a3360] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRequestQuote();
                }}
                className="w-full py-2.5 px-4 text-center font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-md flex items-center justify-center gap-2 shadow-md shadow-orange-600/30"
              >
                <MessageSquare className="w-4 h-4" />
                Request Cement & Block Quotation
              </button>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <a
                  href="tel:+923169080566"
                  className="py-2 px-3 bg-[#13274e] hover:bg-[#1a3468] text-white rounded-md text-center flex items-center justify-center gap-1.5 border border-[#234585]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
                  <span>Call 0316-9080566</span>
                </a>
                <a
                  href="https://wa.me/923169080566?text=Assalam-o-Alaikum%20USAMA%20TRADERS%2C%20I%20need%20a%20rate%20quote%20for%20cement%20and%20blocks."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-[#0d3326] hover:bg-[#124534] text-emerald-300 rounded-md text-center flex items-center justify-center gap-1.5 border border-emerald-600/30"
                >
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authorized Dealer
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-orange-400" /> AJK Mountain Fleet
                </span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
