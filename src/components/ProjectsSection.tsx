import React, { useState, useEffect } from 'react';
import { 
  Building, 
  MapPin, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  HardHat 
} from 'lucide-react';
import { PROJECTS, ProjectItem } from '../data/tradeData.ts';
import { api } from '../services/api.ts';

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'infrastructure' | 'commercial' | 'residential' | 'public'>('all');
  const [liveProjects, setLiveProjects] = useState<ProjectItem[]>(PROJECTS);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.getPublicProjects();
        if (res.success && res.projects && res.projects.length > 0) {
          const mapped: ProjectItem[] = res.projects.map(p => ({
            id: p.id,
            title: p.title,
            location: p.location,
            category: p.category,
            scope: p.scope,
            materialsSupplied: p.materialsSupplied,
            year: p.year,
          }));
          setLiveProjects(mapped);
        }
      } catch (e) {
        // Fallback
      }
    };
    fetchProjects();
  }, []);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'infrastructure', label: 'Roads & Hill Retainers' },
    { id: 'commercial', label: 'Commercial Plazas' },
    { id: 'residential', label: 'Hillside Residential' },
    { id: 'public', label: 'Community & Mosques' },
  ];

  const filteredProjects = liveProjects.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <section id="projects" className="py-20 bg-[#09152e] border-b border-[#162d59] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center justify-center gap-1.5">
            <Building className="w-4 h-4" />
            Proven Track Record in Azad Kashmir
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Landmark Projects
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            From critical mountain retaining walls along the Sudhnoti bypass to premier commercial complexes and luxury hillside homes, explore our material footprint across the region.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                filter === cat.id
                  ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/25 border border-orange-400'
                  : 'bg-[#0f1f3e] text-slate-300 hover:bg-[#162c56] hover:text-white border border-[#1b3668]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#0b1735] border-2 border-[#1c3970] hover:border-orange-500/60 rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded">
                    {project.category.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {project.year}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {project.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{project.location}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                  {project.scope}
                </p>

                <div className="p-3.5 bg-[#0e1d3e] rounded-lg border border-[#1a3568] text-xs">
                  <strong className="text-orange-400 block mb-1">Materials Supplied by USAMA TRADERS:</strong>
                  <span className="text-white font-medium">{project.materialsSupplied}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#183362] flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully Delivered & Completed
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  Sudhnoti Division
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
