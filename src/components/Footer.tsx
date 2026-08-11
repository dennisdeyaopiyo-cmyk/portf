import React from 'react';
import { ArrowUp, Code2, GraduationCap, Github, Linkedin, Mail, Heart, MessageCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface FooterProps {
  profile: UserProfile;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onScrollToTop }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-12 relative text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & MMUST Shoutout */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="h-8 w-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-sm">
                DO
              </div>
              <span className="font-bold text-white text-base">{profile.name}</span>
            </div>

            <p className="text-xs text-slate-500 max-w-md">
              Software & Cloud Systems Student at {profile.university}.
            </p>
          </div>

          {/* Center Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href={profile.whatsapp || "https://wa.me/254768339258"}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors"
              title="WhatsApp Chat"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
              title="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Back to top */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onScrollToTop}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center space-x-2 text-xs font-semibold"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built with React 19, TypeScript, Express & GCP</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
