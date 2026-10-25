import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Lock, 
  ShieldCheck, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Database,
  KeyRound
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';

export const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadLogs = async () => {
    try {
      const res = await api.getAuditLogs();
      if (res.success) setAuditLogs(res.logs);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showFeedback('error', 'New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showFeedback('error', 'New password and confirmation do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.updatePassword(currentPassword, newPassword);
      if (res.success) {
        showFeedback('success', 'Administrator password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        loadLogs();
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          feedback.type === 'success' ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)}>✕</button>
        </div>
      )}

      {/* Header */}
      <div className="pb-2 border-b border-[#183262]">
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          Security, Authentication & Audit Logs
        </h1>
        <p className="text-xs text-slate-400">
          Enforce administrator credential security, database persistence integrity, and review audit trails.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Password Management & System Integrity */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Change Password */}
          <div className="bg-[#0b1736] border border-[#1d3a72] rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#183262]">
              <KeyRound className="w-4 h-4 text-orange-400" />
              Update Administrator Password
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">New Password (Min. 8 characters)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#10224a] border border-[#21437e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          </div>

          {/* System Health */}
          <div className="bg-[#0b1736] border border-[#1d3a72] rounded-xl p-6 shadow-xl space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#183262]">
              <Database className="w-4 h-4 text-emerald-400" />
              Database Engine Status
            </h3>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Storage Provider:</span>
                <span className="text-white font-medium">Atomic File-Backed Relational Engine</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Persistence Location:</span>
                <span className="text-slate-200 font-mono text-[11px]">/data/database.json</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Admin Session:</span>
                <span className="text-emerald-400 font-semibold">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Token Expiry:</span>
                <span className="text-white">24-Hour Rotating JWT</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Audit Logs (7 Columns) */}
        <div className="lg:col-span-7 bg-[#0b1736] border border-[#1d3a72] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#183262]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              Security Audit Trail (Last 100 Actions)
            </h2>
            <button
              onClick={loadLogs}
              className="text-[11px] text-orange-400 hover:text-white"
            >
              Refresh Logs
            </button>
          </div>

          <div className="max-h-[500px] overflow-y-auto divide-y divide-[#183262]">
            {logsLoading ? (
              <div className="py-10 text-center text-slate-400 text-xs">Loading audit logs...</div>
            ) : auditLogs.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">No audit logs recorded yet.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3 px-1 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-white font-medium">{log.details}</div>
                  <div className="text-[10px] text-slate-400">
                    By: <strong className="text-slate-300">{log.adminEmail}</strong> · Entity: {log.entity} {log.entityId ? `(#${log.entityId})` : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
