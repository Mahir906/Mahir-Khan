import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  Truck, 
  FolderGit2, 
  HardHat, 
  Image, 
  MessageSquare, 
  Building2, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink, 
  Bell, 
  Search, 
  User, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api, InquiryItem } from '../services/api.ts';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch inquiries periodically to show new badge
    const loadInquiries = async () => {
      try {
        const res = await api.getAdminInquiries();
        if (res.success) {
          setInquiries(res.inquiries);
        }
      } catch (e) {
        // ignore
      }
    };
    loadInquiries();
    const interval = setInterval(loadInquiries, 30000);
    return () => clearInterval(interval);
  }, []);

  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;

  const navItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/categories', label: 'Categories', icon: Layers },
    { path: '/admin/blocks', label: 'Block Factory', icon: Boxes },
    { path: '/admin/fleet', label: 'Our Fleet', icon: Truck },
    { path: '/admin/projects', label: 'Projects', icon: FolderGit2 },
    { path: '/admin/services', label: 'Services', icon: HardHat },
    { path: '/admin/gallery', label: 'Media Gallery', icon: Image },
    { 
      path: '/admin/inquiries', 
      label: 'Quote Inquiries', 
      icon: MessageSquare,
      badge: newInquiriesCount > 0 ? newInquiriesCount : undefined 
    },
    { path: '/admin/business-profile', label: 'Business Profile', icon: Building2 },
    { path: '/admin/settings', label: 'Settings & Logs', icon: Settings },
  ];

  const getPageTitle = () => {
    const item = navItems.find(n => n.path === currentPath);
    return item ? item.label : 'Admin Dashboard';
  };

  const handleNavClick = (path: string) => {
    setMobileSidebarOpen(false);
    onNavigate(path);
  };

  return (
    <div className="min-h-screen bg-[#070e20] text-slate-100 flex flex-col font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#091530] border-r border-[#183262] transition-all duration-300 lg:static ${
            mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
          } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#183262]">
            <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? 'lg:justify-center w-full' : ''}`}>
              <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md">
                UT
              </div>
              {(!sidebarCollapsed || mobileSidebarOpen) && (
                <div className="flex flex-col truncate">
                  <span className="text-sm font-black text-white tracking-wider uppercase font-sans">
                    USAMA <span className="text-orange-500">TRADERS</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Operations Portal
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-600/30'
                      : 'text-slate-300 hover:bg-[#112349] hover:text-white'
                  } ${sidebarCollapsed ? 'lg:justify-center' : ''}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {(!sidebarCollapsed || mobileSidebarOpen) && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {(!sidebarCollapsed || mobileSidebarOpen) && item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer with Current Admin */}
          <div className="p-3 border-t border-[#183262] bg-[#071126]">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-[#152a55] border border-[#21437e] text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              {(!sidebarCollapsed || mobileSidebarOpen) && (
                <div className="flex-1 truncate">
                  <div className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                </div>
              )}
            </div>

            {(!sidebarCollapsed || mobileSidebarOpen) && (
              <button
                onClick={logout}
                className="mt-3 w-full py-1.5 px-3 bg-[#112349] hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-[#1e3a70] hover:border-rose-500/40 rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Navigation Header */}
          <header className="sticky top-0 z-30 h-16 bg-[#0a1835]/95 backdrop-blur-md border-b border-[#1b366e] px-4 sm:px-6 flex items-center justify-between gap-4">
            
            {/* Left Controls & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-[#12254e] lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 text-slate-300 hover:text-white rounded-lg hover:bg-[#12254e]"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="hidden sm:inline">Admin</span>
                <ChevronRight className="w-3 h-3 hidden sm:inline" />
                <span className="text-white font-bold">{getPageTitle()}</span>
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-3">
              
              {/* Public Website Link */}
              <button
                onClick={() => onNavigate('/')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-[#10224a] hover:bg-[#162d5d] border border-[#20407a] rounded-lg transition-colors cursor-pointer"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
              </button>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-[#12254e] rounded-lg relative"
                  title="Customer Inquiries"
                >
                  <Bell className="w-4 h-4" />
                  {newInquiriesCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#0e1d3e] border border-[#1e3c75] rounded-xl shadow-2xl p-4 z-50 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1a3568]">
                      <span className="font-bold text-white">Recent Inquiries</span>
                      <span className="text-[10px] text-orange-400 font-bold">{newInquiriesCount} New</span>
                    </div>

                    <div className="divide-y divide-[#183262] max-h-60 overflow-y-auto my-2">
                      {inquiries.slice(0, 5).map((inq) => (
                        <div 
                          key={inq.id}
                          onClick={() => {
                            setNotificationsOpen(false);
                            onNavigate('/admin/inquiries');
                          }}
                          className="py-2.5 px-1 hover:bg-[#142852] cursor-pointer rounded"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{inq.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{inq.referenceId}</span>
                          </div>
                          <div className="text-[11px] text-slate-300 truncate">{inq.requestedItem}</div>
                          <div className="text-[10px] text-orange-400 mt-0.5">{inq.siteLocation}</div>
                        </div>
                      ))}
                      {inquiries.length === 0 && (
                        <div className="py-4 text-center text-slate-400">No quote inquiries logged yet.</div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        onNavigate('/admin/inquiries');
                      }}
                      className="w-full mt-2 py-1.5 text-center text-orange-400 hover:text-white font-bold bg-[#14264e] hover:bg-[#1a3368] rounded transition-colors"
                    >
                      View All Inquiries →
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Avatar & Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-[#12254e] rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#0e1d3e] border border-[#1e3c75] rounded-xl shadow-2xl p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-[#1a3568]">
                      <div className="font-bold text-white">{user?.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('/admin/business-profile');
                      }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-[#142852] rounded flex items-center gap-2"
                    >
                      <Building2 className="w-3.5 h-3.5 text-orange-400" />
                      <span>Business Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('/admin/settings');
                      }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-[#142852] rounded flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Security & Logs</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/30 rounded flex items-center gap-2 border-t border-[#1a3568] mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

          </header>

          {/* Main Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
};
