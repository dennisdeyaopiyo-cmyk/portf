import React, { useState } from 'react';
import { 
  Code2, 
  Bot, 
  SlidersHorizontal, 
  Menu, 
  X, 
  GraduationCap, 
  Send, 
  FileText,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  profile: UserProfile;
  activeSection: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenAiChat: () => void;
  onOpenCustomizer: () => void;
  onDownloadCv: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeSection,
  theme,
  onToggleTheme,
  onNavigate,
  onOpenAiChat,
  onOpenCustomizer,
  onDownloadCv,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Tech Stack' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & MMUST Status */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('about')}>
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20 shrink-0">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400 font-bold text-lg overflow-hidden relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[8px]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-100 text-base sm:text-lg tracking-tight hover:text-cyan-400 transition-colors">
                {profile.name}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                CS & Cloud
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-400">
              <GraduationCap className="w-3 h-3 mr-1 text-cyan-400" />
              <span className="truncate max-w-[180px] sm:max-w-xs">MMUST Student</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Accessible Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to High-Contrast Light Theme' : 'Switch to Dark Theme'}
            title={theme === 'dark' ? 'Switch to High-Contrast Light Theme' : 'Switch to Dark Theme'}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer group"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-[11px] font-medium hidden lg:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-cyan-600 group-hover:-rotate-12 transition-transform duration-300" />
                <span className="text-[11px] font-medium hidden lg:inline">Dark Mode</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenAiChat}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/30 transition-all shadow-sm"
            title="Ask Dennis's AI Twin questions about his experience"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Ask AI Assistant</span>
          </button>

          <button
            onClick={onDownloadCv}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>CV</span>
          </button>

          <button
            onClick={onOpenCustomizer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
            title="Customize Portfolio Profile & Data"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Navigation Toggle & Theme Switcher */}
        <div className="flex md:hidden items-center space-x-1.5">
          {/* Mobile Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-2 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600" />
            )}
          </button>

          <button
            onClick={onOpenAiChat}
            className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
            title="Ask AI Assistant"
          >
            <Bot className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeSection === item.id
                    ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            <button
              onClick={() => {
                onToggleTheme();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-800/80 text-slate-200 border border-slate-700"
            >
              <div className="flex items-center space-x-2">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
                <span>{theme === 'dark' ? 'Switch to High-Contrast Light' : 'Switch to Dark Mode'}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono uppercase">{theme}</span>
            </button>

            <button
              onClick={() => {
                onOpenAiChat();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ask AI Recruiter Assistant</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onDownloadCv();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download CV</span>
              </button>

              <button
                onClick={() => {
                  onOpenCustomizer();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
