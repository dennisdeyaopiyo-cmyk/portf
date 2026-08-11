import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Search, 
  Sparkles, 
  Layers, 
  ArrowUpRight,
  Code2,
  CheckCircle2
} from 'lucide-react';
import { Project } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Cloud & DevOps',
    'Full-Stack',
    'AI & Python',
    'Campus & Mobile',
    'Systems & APIs',
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredProject = projects.find(p => p.featured) || projects[0];

  return (
    <section id="projects" className="py-16 md:py-24 border-b border-slate-800/60 relative bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Project Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Software & Cloud Engineering Projects
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
              Hands-on applications demonstrating containerization, microservices, cloud resource provisioning, and full-stack software development.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Python, Go, Docker..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 placeholder:text-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Spotlight Banner - Featured Project */}
        {featuredProject && selectedCategory === 'All' && !searchQuery && (
          <div className="mb-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    ⭐ Featured Cloud Project
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    MMUST Campus Infrastructure
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight hover:text-cyan-300 transition-colors cursor-pointer" onClick={() => onSelectProject(featuredProject)}>
                  {featuredProject.title}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {featuredProject.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {featuredProject.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {featuredProject.techStack.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 font-mono text-xs">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center space-x-4">
                  <button
                    onClick={() => onSelectProject(featuredProject)}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
                  >
                    <span>View Architecture & Code</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <a
                    href={featuredProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="View GitHub Repository"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Side Visual Box */}
              <div className="lg:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-3 font-mono text-xs text-slate-300 shadow-inner">
                <div className="text-cyan-400 font-bold flex items-center justify-between pb-2 border-b border-slate-800">
                  <span>DEPLOYMENT METRICS</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Platform:</span>
                    <span className="text-slate-200">GCP Cloud Run</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Microservice:</span>
                    <span className="text-slate-200">Go (Gin Router)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Database:</span>
                    <span className="text-slate-200">Cloud SQL (PostgreSQL)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Auto-scaling:</span>
                    <span className="text-emerald-400 font-semibold">0 ➔ 10 instances</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Card Banner Header */}
              <div className={`p-5 bg-gradient-to-r ${project.imageBg} relative`}>
                <div className="flex items-center justify-between text-xs font-mono text-cyan-200 mb-2">
                  <span className="bg-slate-950/60 px-2.5 py-0.5 rounded-full border border-slate-800">
                    {project.category}
                  </span>
                  <span className="text-slate-300">{project.dateCompleted}</span>
                </div>

                <h3 
                  onClick={() => onSelectProject(project)}
                  className="font-bold text-white text-xl group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
                >
                  {project.title}
                </h3>
              </div>

              {/* Card Content Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {project.summary}
                  </p>

                  {/* Highlights Bullet */}
                  <div className="space-y-1.5 mb-4">
                    {project.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Badges */}
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Footer Action Links */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                    >
                      <span>Explore Architecture</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center space-x-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="Live Demo App"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
