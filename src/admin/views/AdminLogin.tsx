import React, { useState, useEffect } from 'react';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onNavigateHome }) => {
  const { login, setupFirstAdmin } = useAuth();
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [email, setEmail] = useState('admin@usamatraders.com');
  const [password, setPassword] = useState('UsamaTraders2026!');
  const [name, setName] = useState('Usama Sardar');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const res = await api.checkSetupStatus();
        if (res.needsSetup) {
          setNeedsSetup(true);
          setIsSetupMode(true);
        }
      } catch (e) {
        // ignore
      }
    };
    checkSetup();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSetupMode) {
        await setupFirstAdmin(email, password, name);
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070e20] text-slate-100 flex flex-col items-center justify-center p-4 relative">
      {/* Background Subtle Nautical & Grid Accents */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #334e80 1px, transparent 1px), linear-gradient(to bottom, #334e80 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative w-full max-w-md bg-[#091530] border-2 border-[#1c386e] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-600/30 border border-orange-400/50">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider uppercase font-sans">
            USAMA <span className="text-orange-500">TRADERS</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {isSetupMode ? 'Initial Administrator Setup' : 'Commercial Operations Portal'}
          </p>
        </div>

        {/* Demo Credentials Notice for Verification */}
        {!isSetupMode && (
          <div className="mb-6 p-3.5 bg-[#0e1d3e] border border-[#1e3c75] rounded-xl text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-orange-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Initial Administrator Credentials</span>
            </div>
            <div className="font-mono text-[11px] text-slate-200">
              Email: <strong className="text-white">admin@usamatraders.com</strong>
            </div>
            <div className="font-mono text-[11px] text-slate-200">
              Password: <strong className="text-white">UsamaTraders2026!</strong>
            </div>
            <div className="text-[10px] text-slate-400 pt-0.5">
              (You can change your password anytime in the Admin Settings tab)
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSetupMode && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Administrator Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Usama Sardar"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#10224a] border border-[#21437e] rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Administrator Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@usamatraders.com"
                className="w-full pl-9 pr-4 py-2.5 bg-[#10224a] border border-[#21437e] rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-[#10224a] border border-[#21437e] rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : isSetupMode ? 'Create Initial Admin' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#183262] text-center">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>

      </div>
    </div>
  );
};
