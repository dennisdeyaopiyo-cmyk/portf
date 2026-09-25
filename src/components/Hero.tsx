import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Terminal, 
  Cloud, 
  Code2, 
  GraduationCap, 
  Sparkles, 
  Github, 
  Linkedin, 
  Mail, 
  CheckCircle2, 
  Cpu, 
  Box, 
  Layers,
  MessageCircle,
  User,
  Maximize2
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeroProps {
  profile: UserProfile;
  onExploreProjects: () => void;
  onContactClick: () => void;
  onOpenAiChat: () => void;
  isAiChatOpen?: boolean;
  onPhotoClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  onExploreProjects,
  onContactClick,
  onOpenAiChat,
  isAiChatOpen = false,
  onPhotoClick,
}) => {
  const [rightPanelTab, setRightPanelTab] = useState<'portrait' | 'shell'>('portrait');
  return (
    <section id="about" className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-slate-800/60">
      {/* Background Subtle Mesh Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Intro Copy & Call To Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Profile Avatar & Status Pills Header */}
            <div className="flex items-center space-x-4">
              <div 
                className="relative group shrink-0 cursor-pointer"
                onClick={onPhotoClick}
                title="Click to view full portrait"
              >
                {/* Glowing Circular Frame Ring (matching reference purple/cyan avatar halo) */}
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 opacity-90 blur-sm group-hover:opacity-100 transition-opacity animate-pulse" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-slate-950 border-2 border-cyan-400/80 shadow-2xl overflow-hidden">
                  <img
                    src={profile.avatarUrl || "/dennis_photo.png"}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top rounded-full group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/dennis_photo.png";
                    }}
                  />
                </div>
                <div className="absolute bottom-0 right-0 p-1 bg-slate-950 rounded-full border border-slate-800 shadow-md">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" title="Available for hire" />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
                  Open for Cloud & Software Engineering Roles
                </span>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                  <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                  MMUST Computer Science
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">{profile.name}</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-300">
                {profile.title}
              </p>
            </div>

            {/* Bio Paragraph */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            {/* Core Tech Stack Badges */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                Core Stack & Cloud Tools
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Python", icon: Code2, color: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
                  { name: "TypeScript", icon: Code2, color: "border-blue-500/30 bg-blue-500/10 text-blue-300" },
                  { name: "Go (Golang)", icon: Cpu, color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300" },
                  { name: "GCP Cloud Run", icon: Cloud, color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300" },
                  { name: "AWS EC2/S3", icon: Cloud, color: "border-orange-500/30 bg-orange-500/10 text-orange-300" },
                  { name: "Docker", icon: Box, color: "border-sky-500/30 bg-sky-500/10 text-sky-300" },
                  { name: "Kubernetes", icon: Layers, color: "border-purple-500/30 bg-purple-500/10 text-purple-300" },
                ].map((tech) => (
                  <span
                    key={tech.name}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${tech.color}`}
                  >
                    <tech.icon className="w-3 h-3 mr-1.5 opacity-80" />
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col items-start gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onExploreProjects}
                  className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center space-x-2 group cursor-pointer"
                >
                  <span>View My Projects</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onContactClick}
                  className="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Contact Me</span>
                </button>
              </div>

              {/* Second Row: ASK AI ASSISTANT button directly below View My Projects */}
              <div className="pt-1 flex items-center">
                <button
                  onClick={onOpenAiChat}
                  className="px-6 py-3 rounded-full bg-slate-900/90 hover:bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 cursor-pointer group"
                  title="Ask Dennis's AI Assistant"
                >
                  <div className="relative shrink-0 w-5 h-5 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                    Ask Dennis AI
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-2 flex items-center space-x-4 text-slate-400">
              <span className="text-xs uppercase font-semibold text-slate-500">Connect:</span>
              <a
                href={profile.whatsapp || "https://wa.me/254768339258"}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="hover:text-cyan-400 transition-colors"
                title="Email Dennis"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Column - Featured Portrait Card & Cloud Shell View */}
          <div className="lg:col-span-5 space-y-5">
            {/* Interactive Showcase Container */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
              {/* Card Header with View Switcher */}
              <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                
                {/* View Switcher Pills */}
                <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <button
                    onClick={() => setRightPanelTab('portrait')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                      rightPanelTab === 'portrait'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Portrait View</span>
                  </button>
                  <button
                    onClick={() => setRightPanelTab('shell')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                      rightPanelTab === 'shell'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Cloud Shell</span>
                  </button>
                </div>

                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono hidden sm:block">
                  {rightPanelTab === 'portrait' ? 'PORTRAIT' : 'BASH'}
                </div>
              </div>

              {/* View 1: Real Portrait Showcase (Framed exactly as Dennis requested) */}
              {rightPanelTab === 'portrait' ? (
                <div className="relative group p-4 bg-gradient-to-b from-slate-950/60 to-slate-900/90">
                  <div 
                    className="relative w-full aspect-[3/4] max-h-[460px] mx-auto rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl cursor-pointer group/photo bg-slate-950"
                    onClick={onPhotoClick}
                    title="Click to view full resolution portrait"
                  >
                    <img
                      src={profile.avatarUrl || "/dennis_photo.png"}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover/photo:scale-105 transition-transform duration-500 select-none"
                      onError={(e) => {
                        e.currentTarget.src = "/dennis_photo.png";
                      }}
                    />

                    {/* Gradient Overlay for Text Readability at Bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />

                    {/* Expand Hover Badge Top-Right */}
                    <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-slate-300 opacity-90 group-hover/photo:opacity-100 group-hover/photo:text-cyan-400 group-hover/photo:scale-110 transition-all shadow-lg flex items-center space-x-1.5 text-xs">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="font-semibold text-[11px] hidden sm:inline">Expand</span>
                    </div>

                    {/* Status Pill Top-Left */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Available for Hire</span>
                    </div>

                    {/* Bottom Metadata Bar */}
                    <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white text-sm tracking-tight">{profile.name}</p>
                        <p className="text-[11px] text-cyan-400 font-medium">{profile.title}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified MMUST
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Caption beneath portrait */}
                  <div className="pt-3 px-1 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] text-slate-400">Real Portrait • 3:4 High-Resolution</span>
                    <button
                      onClick={onPhotoClick}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1 cursor-pointer font-medium"
                    >
                      <span>Click to enlarge photo</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                /* View 2: Cloud Shell Terminal */
                <div className="p-5 font-mono text-xs sm:text-sm space-y-3 text-slate-300">
                  <div className="flex items-start space-x-2">
                    <span className="text-cyan-400 font-bold">$</span>
                    <span className="text-slate-200">whoami --details</span>
                  </div>
                  <div className="pl-4 text-slate-400 space-y-1">
                    <p><span className="text-cyan-400">Name:</span> {profile.name}</p>
                    <p><span className="text-cyan-400">Institution:</span> Masinde Muliro Univ. of Sci. & Tech.</p>
                    <p><span className="text-cyan-400">Degree:</span> {profile.degree}</p>
                    <p><span className="text-cyan-400">Focus:</span> Cloud Architecture & Software Eng.</p>
                  </div>

                  <div className="flex items-start space-x-2 pt-1">
                    <span className="text-cyan-400 font-bold">$</span>
                    <span className="text-slate-200">docker run -d -p 8080:80 mmust/cloud-sync:v2.0</span>
                  </div>
                  <div className="pl-4 text-emerald-400 font-mono text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Container f7a9c2b01 e.g. GCP Cloud Run Service Active</span>
                  </div>

                  <div className="flex items-start space-x-2 pt-1">
                    <span className="text-cyan-400 font-bold">$</span>
                    <span className="text-slate-200">gcloud run deploy --region=europe-west2</span>
                  </div>
                  <div className="pl-4 text-cyan-300 font-mono text-xs animate-pulse">
                    ✔ Deploying container image to Cloud Run... Done!
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Projects Built", value: `${profile.stats.projectsCount}+`, sub: "Full-Stack & Cloud" },
                { label: "Languages", value: `${profile.stats.languagesCount}`, sub: "Python, Go, TS, Java" },
                { label: "Cloud Services", value: `${profile.stats.cloudServicesCount}+`, sub: "GCP, AWS, Docker" },
                { label: "Hackathons", value: `${profile.stats.hackathonsWon}`, sub: "MMUST & National" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center hover:border-slate-700 transition-colors"
                >
                  <div className="text-xl sm:text-2xl font-extrabold text-cyan-400">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
