import React, { useState } from 'react';
import { 
  X, 
  Github, 
  ExternalLink, 
  Layers, 
  Code2, 
  CheckCircle2, 
  Copy, 
  Check, 
  Play, 
  Server, 
  Terminal,
  Cpu
} from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'demo'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [demoLog, setDemoLog] = useState<string[]>([]);

  const handleCopyCode = () => {
    if (project.codeSnippet) {
      navigator.clipboard.writeText(project.codeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRunSimulation = () => {
    setDemoActive(true);
    setDemoLog([
      `Initializing simulation environment for ${project.title}...`,
      `Pulling container image: mmust/${project.id}:latest`,
      `Provisioning virtual resources on Cloud Run...`,
      `Binding port 8080 ➔ SSL Endpoint Ready`,
      `✔ Healthcheck Passed (200 OK) in 142ms!`
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className={`p-6 bg-gradient-to-r ${project.imageBg} relative text-white border-b border-slate-800`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cyan-300 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>{project.category}</span>
            <span>•</span>
            <span>Completed {project.dateCompleted}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {project.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-200 opacity-90 max-w-2xl leading-relaxed">
            {project.summary}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white text-xs font-semibold border border-slate-700/80 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-cyan-500/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Deployment</span>
              </a>
            )}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 px-6 bg-slate-950">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Architecture
          </button>

          {project.codeSnippet && (
            <button
              onClick={() => setActiveTab('code')}
              className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'code'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Code Snippet ({project.codeSnippet.filename})
            </button>
          )}

          <button
            onClick={() => setActiveTab('demo')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'demo'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Container Sandbox
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Project Description
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Key Features & Achievements */}
              <div>
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
                  Technical Accomplishments & Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Diagram Text */}
              {project.architectureDiagram && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400">
                    <Server className="w-4 h-4" />
                    <span>System Architecture Topology</span>
                  </div>
                  <div className="font-mono text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 overflow-x-auto">
                    {project.architectureDiagram}
                  </div>
                </div>
              )}

              {/* Tech Stack Pills */}
              <div>
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2.5">
                  Technologies Utilized
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 font-mono text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE SNIPPET */}
          {activeTab === 'code' && project.codeSnippet && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cyan-400 flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>{project.codeSnippet.filename}</span>
                </span>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                <code>{project.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* TAB 3: LIVE DEMO SIMULATION */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Interactive Container Sandbox</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Simulate spinning up {project.title} inside a virtual GCP Cloud Run container environment.
                  </p>
                </div>

                <button
                  onClick={handleRunSimulation}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center space-x-2 mx-auto"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Run Container Simulation</span>
                </button>
              </div>

              {demoActive && (
                <div className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
                  {demoLog.map((log, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <span>➔</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
