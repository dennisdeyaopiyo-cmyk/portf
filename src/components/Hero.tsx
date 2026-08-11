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
  MessageCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeroProps {
  profile: UserProfile;
  onExploreProjects: () => void;
  onContactClick: () => void;
  onOpenAiChat: () => void;
  isAiChatOpen?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  onExploreProjects,
  onContactClick,
  onOpenAiChat,
  isAiChatOpen = false,
}) => {
  const [isFloating, setIsFloating] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (slotRef.current) {
        const rect = slotRef.current.getBoundingClientRect();
        // Trigger float transition when the button slot reaches ~75px from top (just as it disappears under sticky navbar)
        setIsFloating(rect.top <= 75);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
              <div className="relative group shrink-0">
                {/* Glowing Circular Frame Ring (matching reference purple/cyan avatar halo) */}
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 opacity-90 blur-sm group-hover:opacity-100 transition-opacity animate-pulse" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-slate-950 border-2 border-cyan-400/80 shadow-2xl overflow-hidden">
                  <img
                    src={profile.avatarUrl || "/dennis_avatar.png"}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
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
              {!isAiChatOpen && (
                <div ref={slotRef} className="min-h-[52px] flex items-center">
                  <motion.button
                    layout
                    onClick={onOpenAiChat}
                    transition={{
                      type: "spring",
                      stiffness: 70,
                      damping: 20,
                      mass: 1.0
                    }}
                    className={
                      isFloating
                        ? "fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-gradient-to-r from-[#0d343b] via-[#12454f] to-[#0a282f] border-[2.5px] border-[#20e8db] text-[#03171e] font-black shadow-[0_0_25px_rgba(32,232,219,0.45)] hover:shadow-[0_0_35px_rgba(32,232,219,0.65)] hover:scale-105 active:scale-95 transition-shadow flex items-center space-x-3 cursor-pointer group"
                        : "px-6 py-3 rounded-full bg-gradient-to-r from-[#0d343b] via-[#12454f] to-[#0a282f] border-[2.5px] border-[#20e8db] text-[#03171e] font-black shadow-[0_0_25px_rgba(32,232,219,0.35)] hover:shadow-[0_0_35px_rgba(32,232,219,0.55)] hover:scale-105 active:scale-95 transition-shadow flex items-center space-x-3 cursor-pointer group"
                    }
                    title="Ask Dennis's AI Assistant"
                  >
                    {/* Radial Neural Node Icon */}
                    <div className="relative shrink-0 w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-[#20e8db] group-hover:rotate-45 transition-transform duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="10" fill="currentColor" />
                        <circle cx="50" cy="50" r="17" stroke="currentColor" strokeWidth="4.5" fill="none" />
                        
                        <line x1="50" y1="33" x2="50" y2="17" stroke="currentColor" strokeWidth="4" />
                        <circle cx="50" cy="11" r="5.5" fill="currentColor" />

                        <line x1="62" y1="38" x2="74" y2="26" stroke="currentColor" strokeWidth="4" />
                        <circle cx="78" cy="22" r="5.5" fill="currentColor" />

                        <line x1="67" y1="50" x2="83" y2="50" stroke="currentColor" strokeWidth="4" />
                        <circle cx="89" cy="50" r="5.5" fill="currentColor" />

                        <line x1="62" y1="62" x2="74" y2="74" stroke="currentColor" strokeWidth="4" />
                        <circle cx="78" cy="78" r="5.5" fill="currentColor" />

                        <line x1="50" y1="67" x2="50" y2="83" stroke="currentColor" strokeWidth="4" />
                        <circle cx="50" cy="89" r="5.5" fill="currentColor" />

                        <line x1="38" y1="62" x2="26" y2="74" stroke="currentColor" strokeWidth="4" />
                        <circle cx="22" cy="78" r="5.5" fill="currentColor" />

                        <line x1="33" y1="50" x2="17" y2="50" stroke="currentColor" strokeWidth="4" />
                        <circle cx="11" cy="50" r="5.5" fill="currentColor" />

                        <line x1="38" y1="38" x2="26" y2="26" stroke="currentColor" strokeWidth="4" />
                        <circle cx="22" cy="22" r="5.5" fill="currentColor" />
                      </svg>
                    </div>

                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#021117] drop-shadow-sm">
                      ASK AI ASSISTANT
                    </span>
                  </motion.button>
                </div>
              )}
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

          {/* Right Column - Terminal Shell Preview & Quick Stats Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Terminal Window Box */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Shell Top Header */}
              <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>dennis@mmust-cloud-shell:~</span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                  BASH
                </div>
              </div>

              {/* Shell Code Body */}
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
