import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Boxes, 
  Truck, 
  FolderGit2, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Plus, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { api, DashboardStats, InquiryItem } from '../../services/api.ts';

interface OverviewViewProps {
  onNavigate: (path: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.getAdminStats();
      if (res.success) {
        setStats(res.stats);
        setRecentInquiries(res.recentInquiries);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading operational statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0d1c3e] via-[#122650] to-[#0d1c3e] border border-[#1e3c75] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            Pallandri Central Depot • Operations Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Business Management & CMS Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time management for cement inventory, hydraulic concrete block manufacturing, fleet dispatch, and customer RFQ inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('/admin/inquiries')}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Manage Inquiries ({stats?.newInquiries || 0} New)</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/products')}
            className="px-4 py-2.5 bg-[#12254e] hover:bg-[#183162] text-slate-200 hover:text-white border border-[#20407a] font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Products */}
        <div 
          onClick={() => onNavigate('/admin/products')}
          className="bg-[#0b1736] border border-[#1d3a72] hover:border-orange-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold text-slate-400">Cement & Materials</span>
            <div className="p-2 bg-[#142852] text-orange-400 rounded-lg group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats?.publishedProducts || 0}
            <span className="text-xs font-normal text-slate-400 ml-1.5">/ {stats?.totalProducts || 0} Total</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Published on Public Catalog</span>
          </div>
        </div>

        {/* Card 2: Concrete Blocks */}
        <div 
          onClick={() => onNavigate('/admin/blocks')}
          className="bg-[#0b1736] border border-[#1d3a72] hover:border-orange-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold text-slate-400">Block Factory Lines</span>
            <div className="p-2 bg-[#142852] text-cyan-400 rounded-lg group-hover:scale-105 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats?.totalBlocks || 0}
            <span className="text-xs font-normal text-slate-400 ml-1.5">Molded Types</span>
          </div>
          <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Solid, Hollow & Paver Units</span>
          </div>
        </div>

        {/* Card 3: Mountain Fleet */}
        <div 
          onClick={() => onNavigate('/admin/fleet')}
          className="bg-[#0b1736] border border-[#1d3a72] hover:border-orange-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold text-slate-400">Mountain Fleet Units</span>
            <div className="p-2 bg-[#142852] text-amber-400 rounded-lg group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats?.activeFleet || 0}
            <span className="text-xs font-normal text-slate-400 ml-1.5">/ {stats?.totalFleet || 0} Units</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active in Sudhnoti Corridor</span>
          </div>
        </div>

        {/* Card 4: Inquiries */}
        <div 
          onClick={() => onNavigate('/admin/inquiries')}
          className="bg-[#0b1736] border border-[#1d3a72] hover:border-orange-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold text-slate-400">Quote Inquiries</span>
            <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats?.newInquiries || 0}
            <span className="text-xs font-normal text-slate-400 ml-1.5">New ({stats?.totalInquiries || 0} Total)</span>
          </div>
          <div className="text-[11px] text-orange-400 flex items-center gap-1 mt-2 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Requires Desk Response</span>
          </div>
        </div>

      </div>

      {/* Operational Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Quote Inquiries (8 Columns) */}
        <div className="lg:col-span-8 bg-[#0b1736] border border-[#1d3a72] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#183262] mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-400" />
                Recent Customer RFQ Inquiries
              </h2>
              <p className="text-[11px] text-slate-400">Direct quote requests submitted from public website and mobile users</p>
            </div>
            <button
              onClick={() => onNavigate('/admin/inquiries')}
              className="text-xs text-orange-400 hover:text-white font-semibold flex items-center gap-1"
            >
              <span>View All ({stats?.totalInquiries || 0})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No inquiries submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-[#183262] text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3">Ref Code</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Material & Qty</th>
                    <th className="pb-3">Destination</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#183262]">
                  {recentInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-[#0f1f44] transition-colors">
                      <td className="py-3 font-mono text-orange-400 font-bold">{inq.referenceId}</td>
                      <td className="py-3">
                        <div className="font-semibold text-white">{inq.name}</div>
                        <div className="text-[11px] text-slate-400">{inq.phone}</div>
                      </td>
                      <td className="py-3">
                        <div className="text-white truncate max-w-[160px]">{inq.requestedItem}</div>
                        <div className="text-[11px] text-slate-400">{inq.quantity}</div>
                      </td>
                      <td className="py-3 text-slate-300">{inq.siteLocation}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onNavigate('/admin/inquiries')}
                          className="px-2.5 py-1 bg-[#12254e] hover:bg-orange-500 hover:text-white text-slate-200 text-[11px] rounded transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Launch & Status Distribution (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-[#0b1736] border border-[#1d3a72] rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#183262]">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2 pt-1 text-xs">
              <button
                onClick={() => onNavigate('/admin/products')}
                className="w-full p-2.5 bg-[#10224a] hover:bg-[#162d5d] text-slate-200 hover:text-white rounded-lg border border-[#1f3e79] flex items-center gap-2.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-orange-400" />
                <span>Add Cement or Material</span>
              </button>
              <button
                onClick={() => onNavigate('/admin/blocks')}
                className="w-full p-2.5 bg-[#10224a] hover:bg-[#162d5d] text-slate-200 hover:text-white rounded-lg border border-[#1f3e79] flex items-center gap-2.5 transition-colors"
              >
                <Boxes className="w-4 h-4 text-cyan-400" />
                <span>Configure Block Dimensions</span>
              </button>
              <button
                onClick={() => onNavigate('/admin/gallery')}
                className="w-full p-2.5 bg-[#10224a] hover:bg-[#162d5d] text-slate-200 hover:text-white rounded-lg border border-[#1f3e79] flex items-center gap-2.5 transition-colors"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload Photos (Trucks / Blocks)</span>
              </button>
              <button
                onClick={() => onNavigate('/admin/business-profile')}
                className="w-full p-2.5 bg-[#10224a] hover:bg-[#162d5d] text-slate-200 hover:text-white rounded-lg border border-[#1f3e79] flex items-center gap-2.5 transition-colors"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Update Contact / 3 Owners Info</span>
              </button>
            </div>
          </div>

          {/* Inquiries Real Pipeline Distribution */}
          <div className="bg-[#0b1736] border border-[#1d3a72] rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#183262]">
              Inquiry Pipeline
            </h3>
            
            <div className="space-y-3 pt-1 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    New & Uncontacted
                  </span>
                  <span className="font-bold text-white">{stats?.newInquiries || 0}</span>
                </div>
                <div className="w-full bg-[#10224a] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full" 
                    style={{ width: `${stats?.totalInquiries ? ((stats.newInquiries / stats.totalInquiries) * 100) : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Contacted / In Discussion
                  </span>
                  <span className="font-bold text-white">{stats?.contactedInquiries || 0}</span>
                </div>
                <div className="w-full bg-[#10224a] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-cyan-400 h-full" 
                    style={{ width: `${stats?.totalInquiries ? ((stats.contactedInquiries / stats.totalInquiries) * 100) : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    Quoted Mill Rate
                  </span>
                  <span className="font-bold text-white">{stats?.quotedInquiries || 0}</span>
                </div>
                <div className="w-full bg-[#10224a] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-400 h-full" 
                    style={{ width: `${stats?.totalInquiries ? ((stats.quotedInquiries / stats.totalInquiries) * 100) : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Closed & Delivered
                  </span>
                  <span className="font-bold text-white">{stats?.closedInquiries || 0}</span>
                </div>
                <div className="w-full bg-[#10224a] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full" 
                    style={{ width: `${stats?.totalInquiries ? ((stats.closedInquiries / stats.totalInquiries) * 100) : 0}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
