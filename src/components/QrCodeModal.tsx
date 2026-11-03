import React, { useEffect, useState, useRef } from 'react';
import { X, QrCode, Download, Copy, Check, Share2, Globe, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import { UserProfile } from '../types';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

const OFFICIAL_VERCEL_URL = 'https://dennis-opiyo-portfolio.vercel.app';

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>(OFFICIAL_VERCEL_URL);
  const [customUrl, setCustomUrl] = useState<string>(OFFICIAL_VERCEL_URL);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize with the current window origin / href or Vercel URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const liveUrl = window.location.origin;
      setCurrentUrl(liveUrl);
      if (!customUrl) {
        setCustomUrl(OFFICIAL_VERCEL_URL);
      }
    }
  }, [isOpen]);

  // Generate QR Code on canvas and as Data URL
  useEffect(() => {
    if (!isOpen) return;
    const targetUrl = customUrl.trim() || OFFICIAL_VERCEL_URL;
    setIsGenerating(true);

    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#030712', // Deep slate/black for maximum camera scan reliability
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error('QR generation error:', err);
        setIsGenerating(false);
      });
  }, [customUrl, currentUrl, isOpen]);

  // Escape key listener
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

  const activeUrl = customUrl.trim() || currentUrl || 'https://dennisopiyo.vercel.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;

    // Create a styled canvas with branding badge for professional CV printing
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const exportCanvas = document.createElement('canvas');
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      const cardWidth = 600;
      const cardHeight = 760;
      exportCanvas.width = cardWidth;
      exportCanvas.height = cardHeight;

      // Dark cyberpunk background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // Gradient accent border
      const gradient = ctx.createLinearGradient(0, 0, cardWidth, 0);
      gradient.addColorStop(0, '#06b6d4');
      gradient.addColorStop(0.5, '#3b82f6');
      gradient.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cardWidth, 6);

      // Header text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(profile.name, cardWidth / 2, 55);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '15px sans-serif';
      ctx.fillText(profile.title, cardWidth / 2, 85);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.fillText(profile.university, cardWidth / 2, 110);

      // White QR Container with soft rounded rect
      const qrBoxX = 75;
      const qrBoxY = 135;
      const qrBoxSize = 450;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 20);
      ctx.fill();

      // Draw QR image
      ctx.drawImage(img, qrBoxX + 25, qrBoxY + 25, 400, 400);

      // URL Footer Box
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(50, 615, 500, 50, 12);
      ctx.fill();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      const truncatedUrl = activeUrl.length > 42 ? activeUrl.substring(0, 39) + '...' : activeUrl;
      ctx.fillText(truncatedUrl, cardWidth / 2, 646);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('Scan with any smartphone camera to view portfolio', cardWidth / 2, 705);

      // Trigger download
      const link = document.createElement('a');
      link.download = `Dennis_Opiyo_Portfolio_QR.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    };
    img.src = qrDataUrl;
  };

  const shareText = encodeURIComponent(`Explore Dennis Opiyo's Software & Cloud Engineering Portfolio: ${activeUrl}`);
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(activeUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out Dennis Opiyo's Software & Cloud Engineering Portfolio 🚀")}&url=${encodeURIComponent(activeUrl)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                <span>Portfolio QR Code</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono">LIVE</span>
              </h3>
              <p className="text-[11px] text-slate-400">Scan or download to share your Vercel deployment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Target URL Selector / Custom Vercel URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Your Vercel / Portfolio URL:</span>
              </label>
              {activeUrl.includes('vercel.app') && (
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Vercel Live
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://dennis-opiyo-portfolio.vercel.app"
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition-colors font-mono"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setCustomUrl(OFFICIAL_VERCEL_URL)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  customUrl === OFFICIAL_VERCEL_URL
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                ★ Vercel Link (dennis-opiyo-portfolio.vercel.app)
              </button>
              {currentUrl && currentUrl !== OFFICIAL_VERCEL_URL && (
                <button
                  type="button"
                  onClick={() => setCustomUrl(currentUrl)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    customUrl === currentUrl
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Current Browser Tab
                </button>
              )}
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center relative group">
            {/* The crisp scannable QR Code */}
            <div className="p-3 bg-white rounded-2xl shadow-xl shadow-cyan-500/10 transition-transform group-hover:scale-[1.02]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${activeUrl}`}
                  className="w-52 h-52 sm:w-56 sm:h-56 block object-contain"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-slate-500 text-xs">
                  {isGenerating ? 'Generating QR...' : 'Loading QR...'}
                </div>
              )}
            </div>

            {/* Quick Summary under QR */}
            <div className="mt-3.5 space-y-0.5">
              <p className="text-xs font-semibold text-white">{profile.name}</p>
              <p className="text-[11px] text-cyan-400 font-medium">{profile.title}</p>
              <p className="text-[10px] text-slate-500 font-mono break-all max-w-xs">{activeUrl}</p>
            </div>
          </div>

          {/* Action Buttons: Download & Copy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Branded PNG</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Portfolio Link</span>
                </>
              )}
            </button>
          </div>

          {/* Social Quick Share */}
          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 mb-2 font-medium flex items-center gap-1.5">
              <Share2 className="w-3 h-3 text-cyan-400" />
              <span>Quick Share:</span>
            </p>
            <div className="flex items-center gap-2">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <span>X / Twitter</span>
              </a>
            </div>
          </div>

          {/* Instant 2-second Chrome / Edge Trick */}
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-left space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Browser Shortcut (Google Chrome / Edge)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              When visiting your live Vercel URL in Chrome or Edge, simply <strong className="text-white">right-click anywhere on the page</strong> and click <strong className="text-white">&ldquo;Create QR Code for this Page&rdquo;</strong>, or click the Share icon in Chrome&apos;s address bar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
