import React, { useEffect } from 'react';
import { X, ExternalLink, Download, GraduationCap, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const photoSrc = profile.avatarUrl || '/dennis_photo.png';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-w-lg w-full bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-bold text-white text-sm sm:text-base">{profile.name}</h3>
            <span className="text-xs text-cyan-400 font-medium hidden sm:inline">• Profile Portrait</span>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={photoSrc}
              download="Dennis_Opiyo_Photo.jpg"
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
              title="Download Original Photo"
            >
              <Download className="w-4 h-4" />
            </a>
            <a
              href={photoSrc}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real Photo Container */}
        <div className="relative bg-slate-950 max-h-[75vh] flex items-center justify-center overflow-hidden p-2 sm:p-4">
          <img
            src={photoSrc}
            alt={profile.name}
            className="w-auto h-auto max-h-[72vh] max-w-full rounded-2xl object-contain shadow-2xl select-none"
            onError={(e) => {
              e.currentTarget.src = '/dennis_photo.png';
            }}
          />
        </div>

        {/* Caption & University Details */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-base">{profile.name}</p>
              <p className="text-xs text-cyan-400">{profile.title}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Verified Portrait
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 gap-2">
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-1.5 text-cyan-400 shrink-0" />
              <span className="truncate">{profile.university}</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
              <span>Portrait Photo</span>
              <a
                href="/Screenshot From 2026-09-25 18-10-16.png"
                download="Dennis_Opiyo_Photo.png"
                className="text-cyan-400 hover:underline"
                title="Download original screenshot"
              >
                Download PNG
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
