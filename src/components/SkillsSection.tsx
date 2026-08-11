import React, { useState } from 'react';
import { 
  Code2, 
  Cloud, 
  Box, 
  Database, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Server, 
  Search,
  Sparkles,
  Info
} from 'lucide-react';
import { Skill, SkillCategory } from '../types';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedSkill, setInspectedSkill] = useState<Skill | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Stack' },
    { id: 'languages', label: 'Programming Languages' },
    { id: 'cloud', label: 'Cloud Platforms (GCP/AWS)' },
    { id: 'devops', label: 'DevOps & Containers' },
    { id: 'databases', label: 'Databases & Tools' },
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch = 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileCode':
      case 'Code2':
        return Code2;
      case 'Cloud':
      case 'CloudLightning':
        return Cloud;
      case 'Box':
        return Box;
      case 'Database':
        return Database;
      case 'Cpu':
        return Cpu;
      case 'Server':
        return Server;
      case 'Layers':
        return Layers;
      default:
        return Terminal;
    }
  };

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Expert':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Advanced':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Proficient':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <section id="skills" className="py-16 md:py-24 border-b border-slate-800/60 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Technical Expertise</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Programming Languages & Cloud Technologies
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
              Proven proficiency across low-level engineering, full-stack frameworks, containerization, and modern cloud deployment pipelines.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by language, Docker, GCP..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 placeholder:text-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const IconComponent = getSkillIcon(skill.iconName);
            const levelClass = getLevelColor(skill.level);

            return (
              <div
                key={skill.id}
                onClick={() => setInspectedSkill(skill)}
                className="group relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700/80 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors">
                          {skill.name}
                        </h3>
                        <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${levelClass} mt-1`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {skill.proficiency}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {skill.description}
                  </p>
                </div>

                {/* Bottom Tags */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {skill.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[11px] font-mono border border-slate-700/60"
                      >
                        #{tag}
                      </span>
                    ))}
                    {skill.tags.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[11px] text-slate-500">
                        +{skill.tags.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span>Used in {skill.projectsUsedCount} projects</span>
                    <span className="text-cyan-400 flex items-center group-hover:translate-x-1 transition-transform">
                      Details <Info className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skill Detail Modal */}
        {inspectedSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative space-y-4">
              <button
                onClick={() => setInspectedSkill(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>

              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{inspectedSkill.name}</h3>
                  <span className="text-xs text-cyan-400 font-mono">Proficiency Rating: {inspectedSkill.proficiency}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {inspectedSkill.description}
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-200">How Dennis uses this at MMUST & Projects:</p>
                  <p>• Applied in {inspectedSkill.projectsUsedCount} major software & cloud architecture repositories.</p>
                  <p>• Associated Tags: {inspectedSkill.tags.join(', ')}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setInspectedSkill(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
