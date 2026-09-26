import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  LogOut, 
  LogIn, 
  Database, 
  Sparkles, 
  RefreshCw,
  FolderGit2,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Save,
  RotateCcw,
  Download,
  Users,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Compass,
  Search,
  Check,
  Calendar,
  Send,
  Copy
} from 'lucide-react';
import { 
  ADMIN_EMAIL, 
  ADMIN_PASSWORD,
  verifyAdminPassword,
  isUserAdmin,
  adminSignInWithGoogle, 
  adminSignOut, 
  subscribeToAuthState, 
  subscribeToContactMessages, 
  markContactMessageStatus, 
  deleteContactMessage,
  subscribeToPortfolioVisits,
  deletePortfolioVisit,
  deleteTestimonialFromFirestore
} from '../services/firebaseService';
import { ContactMessage, Testimonial, Project, UserProfile, PortfolioVisit } from '../types';
import { User } from '../lib/firebase';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  testimonials: Testimonial[];
  projects: Project[];
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  testimonials,
  projects,
  profile,
  onUpdateProfile,
  onResetData,
}) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dennis_admin_auth') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'visitors' | 'messages' | 'customize' | 'testimonials'>('visitors');

  // Visitor Tracking Data
  const [visits, setVisits] = useState<PortfolioVisit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [visitorFilter, setVisitorFilter] = useState('');

  // Messages Data
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageFilter, setMessageFilter] = useState('');

  // Customize Form State
  const [customFormData, setCustomFormData] = useState<UserProfile>(profile);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // General Notification Banner
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Keep customize form in sync with current profile prop
  useEffect(() => {
    setCustomFormData(profile);
  }, [profile]);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
      if (isUserAdmin(user)) {
        setIsAuthenticated(true);
        sessionStorage.setItem('dennis_admin_auth', 'true');
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Visitors and Contact Messages when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoadingVisits(true);
    const unsubVisits = subscribeToPortfolioVisits(
      (items) => {
        setVisits(items);
        setLoadingVisits(false);
      },
      () => setLoadingVisits(false)
    );

    setLoadingMessages(true);
    const unsubMessages = subscribeToContactMessages(
      (items) => {
        setMessages(items);
        setLoadingMessages(false);
      },
      () => setLoadingMessages(false)
    );

    return () => {
      unsubVisits();
      unsubMessages();
    };
  }, [isAuthenticated]);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (verifyAdminPassword(passwordInput)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('dennis_admin_auth', 'true');
      setPasswordInput('');
      setAuthError(null);
      showBanner('Welcome back, Dennis! Admin portal unlocked.');
    } else {
      setAuthError('Incorrect password. Please verify the admin password.');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    const res = await adminSignInWithGoogle();
    if (res.error) {
      setAuthError(res.error);
    } else if (res.user && isUserAdmin(res.user)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('dennis_admin_auth', 'true');
      showBanner('Signed in with authorized Google account.');
    }
  };

  const handleSignOut = async () => {
    await adminSignOut();
    sessionStorage.removeItem('dennis_admin_auth');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Customize Data Handlers
  const handleSaveCustomProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(customFormData);
    setSaveSuccessMsg('Profile settings updated successfully across portfolio!');
    showBanner('Profile updated live!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customFormData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'dennis_opiyo_portfolio_config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showBanner('Configuration JSON exported!');
  };

  const handleResetProfile = () => {
    if (confirm('Are you sure you want to reset all profile customizations back to default values?')) {
      onResetData();
      showBanner('Portfolio reset to initial default profile.');
    }
  };

  // Messages Actions
  const handleMarkStatus = async (id: string, status: 'read' | 'unread' | 'archived') => {
    const ok = await markContactMessageStatus(id, status);
    if (ok) {
      showBanner(`Message marked as ${status}`);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this message inquiry?')) return;
    const ok = await deleteContactMessage(id);
    if (ok) {
      showBanner('Message deleted from Firestore');
    }
  };

  // Visitors Actions
  const handleDeleteVisit = async (id: string) => {
    const ok = await deletePortfolioVisit(id);
    if (ok) {
      showBanner('Visit entry deleted');
    }
  };

  // Testimonials Actions
  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial from Cloud Firestore?')) return;
    const ok = await deleteTestimonialFromFirestore(id);
    if (ok) {
      showBanner('Testimonial removed from Firestore');
    }
  };

  const showBanner = (text: string) => {
    setActionSuccess(text);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Filtered views
  const filteredVisits = useMemo(() => {
    if (!visitorFilter.trim()) return visits;
    const q = visitorFilter.toLowerCase();
    return visits.filter(
      (v) =>
        v.browser.toLowerCase().includes(q) ||
        v.operatingSystem.toLowerCase().includes(q) ||
        v.deviceType.toLowerCase().includes(q) ||
        v.referrer.toLowerCase().includes(q) ||
        v.timezone.toLowerCase().includes(q) ||
        v.visitedAt.toLowerCase().includes(q)
    );
  }, [visits, visitorFilter]);

  const filteredMessages = useMemo(() => {
    if (!messageFilter.trim()) return messages;
    const q = messageFilter.toLowerCase();
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
    );
  }, [messages, messageFilter]);

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffSecs = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSecs < 60) return 'Just now';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return `${Math.floor(diffSecs / 86400)}d ago`;
    } catch {
      return 'Recent';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-6xl h-[92vh] max-h-[900px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                    Dennis's Admin & Analytics Center
                  </h3>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                    Firestore Synced
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Track who visited, review visitor messages, and customize live portfolio data
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors border border-slate-700"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock & Exit</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Success Alert Banner */}
          {actionSuccess && (
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 flex items-center space-x-2 text-xs font-semibold text-emerald-400 animate-fadeIn">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Authentication Screen */}
          {!isAuthenticated ? (
            <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 shadow-inner">
                <KeyRound className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Admin Access Required</h4>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Enter the authorized admin password to access visitor tracking logs, messages inbox, and portfolio customizer.
              </p>

              {authError && (
                <div className="w-full mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handlePasswordLogin} className="w-full space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter Admin Password (e.g. Dennis@2005)"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setAuthError(null);
                      }}
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <KeyRound className="w-4 h-4 text-slate-950" />
                  <span>Unlock Admin Portal</span>
                </button>
              </form>

              <div className="w-full flex items-center my-6">
                <div className="flex-1 border-t border-slate-800" />
                <span className="px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Or Google Sign-In
                </span>
                <div className="flex-1 border-t border-slate-800" />
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-2.5 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Dennis's Google Account</span>
              </button>
            </div>
          ) : (
            /* Authenticated Admin View */
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Navigation Sidebar */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/40 p-4 space-y-2 shrink-0">
                <button
                  onClick={() => setActiveTab('visitors')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'visitors'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4" />
                    <span>Who Visited</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                    {visits.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'messages'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4" />
                    <span>Messages Left</span>
                  </div>
                  {unreadCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950">
                      {unreadCount} new
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">{messages.length}</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('customize')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'customize'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Customize Data</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                    Live
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'testimonials'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4" />
                    <span>Testimonials</span>
                  </div>
                  <span className="text-xs text-slate-500">{testimonials.length}</span>
                </button>

                <div className="pt-4 mt-4 border-t border-slate-800/80">
                  <div className="px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Firestore Connected</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      DB: ai-studio-dennisopiyo...
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content Viewport */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/60">
                
                {/* ----------------------------------------------------------------- */}
                {/* TAB 1: WHO VISITED THE PORTFOLIO                                  */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'visitors' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
                      <div>
                        <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                          <Users className="w-5 h-5 text-cyan-400" />
                          <span>Visitors Telemetry & Timestamps</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Live log of everyone who visited Dennis's portfolio ({visits.length} recorded visits)
                        </p>
                      </div>

                      {/* Filter Search */}
                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Filter device, OS, location..."
                          value={visitorFilter}
                          onChange={(e) => setVisitorFilter(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {loadingVisits ? (
                      <div className="py-20 text-center text-slate-500 flex flex-col items-center">
                        <RefreshCw className="w-6 h-6 animate-spin mb-2 text-cyan-400" />
                        <span className="text-sm">Retrieving visitor logs from Firestore...</span>
                      </div>
                    ) : filteredVisits.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
                        <Users className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                        <p className="text-sm font-semibold text-slate-400">No visitor records found.</p>
                        <p className="text-xs text-slate-500 mt-1">
                          When visitors browse Dennis's portfolio, their device type, browser, referrer, and exact visit timestamp will log here in real time.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {filteredVisits.map((v) => {
                          const visitDate = new Date(v.visitedAt);
                          const dateFormatted = isNaN(visitDate.getTime())
                            ? v.visitedAt
                            : visitDate.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              });

                          return (
                            <div
                              key={v.id}
                              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-start space-x-3.5">
                                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                                  {v.deviceType === 'Mobile' ? (
                                    <Smartphone className="w-5 h-5" />
                                  ) : v.deviceType === 'Tablet' ? (
                                    <Tablet className="w-5 h-5" />
                                  ) : (
                                    <Monitor className="w-5 h-5" />
                                  )}
                                </div>

                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-white text-sm">
                                      {v.browser} on {v.operatingSystem}
                                    </span>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                      {v.deviceType}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
                                    <span className="flex items-center space-x-1">
                                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                                      <span>Timezone: {v.timezone}</span>
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="flex items-center space-x-1">
                                      <Compass className="w-3.5 h-3.5 text-slate-500" />
                                      <span>Referrer: {v.referrer || 'Direct'}</span>
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span>Resolution: {v.screenResolution}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                                <div className="text-right">
                                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
                                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>{formatRelativeTime(v.visitedAt)}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500">{dateFormatted}</div>
                                </div>

                                <button
                                  onClick={() => handleDeleteVisit(v.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                                  title="Delete visitor record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 2: MESSAGES VISITORS LEFT                                     */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'messages' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
                      <div>
                        <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                          <Mail className="w-5 h-5 text-cyan-400" />
                          <span>Messages Left by Visitors & Recruiters</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Inquiries submitted through the Contact form ({messages.length} total, {unreadCount} unread)
                        </p>
                      </div>

                      {/* Filter Search */}
                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Search sender, email, subject..."
                          value={messageFilter}
                          onChange={(e) => setMessageFilter(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {loadingMessages ? (
                      <div className="py-20 text-center text-slate-500 flex flex-col items-center">
                        <RefreshCw className="w-6 h-6 animate-spin mb-2 text-cyan-400" />
                        <span className="text-sm">Loading message inquiries from Firestore...</span>
                      </div>
                    ) : filteredMessages.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
                        <Mail className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                        <p className="text-sm font-semibold text-slate-400">No contact messages found.</p>
                        <p className="text-xs text-slate-500 mt-1">
                          When visitors fill out the Contact section, their messages and timestamps will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredMessages.map((msg) => {
                          const msgDate = new Date(msg.createdAt);
                          const dateFormatted = isNaN(msgDate.getTime())
                            ? msg.createdAt
                            : msgDate.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              });

                          return (
                            <div
                              key={msg.id}
                              className={`p-5 rounded-2xl border transition-all ${
                                msg.status === 'unread'
                                  ? 'bg-slate-950/90 border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                                  : 'bg-slate-950/50 border-slate-800 text-slate-300'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-white text-base">
                                      {msg.name}
                                    </span>
                                    {msg.status === 'unread' && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-400 text-slate-950">
                                        NEW
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <a
                                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                      className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
                                    >
                                      <span>{msg.email}</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>

                                <div className="text-left sm:text-right">
                                  <div className="flex items-center space-x-1 text-xs font-semibold text-slate-300 sm:justify-end">
                                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>{formatRelativeTime(msg.createdAt)}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500">{dateFormatted}</div>
                                </div>
                              </div>

                              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 my-3">
                                <span className="text-xs font-bold text-cyan-300 block mb-1">
                                  Subject: <span className="text-slate-200 font-semibold">{msg.subject}</span>
                                </span>
                                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                                  {msg.message}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                                <div className="flex items-center space-x-2">
                                  {msg.status === 'unread' ? (
                                    <button
                                      onClick={() => handleMarkStatus(msg.id, 'read')}
                                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition-colors"
                                    >
                                      Mark as Read
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleMarkStatus(msg.id, 'unread')}
                                      className="px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-xs font-semibold text-slate-400 transition-colors"
                                    >
                                      Mark as Unread
                                    </button>
                                  )}
                                  <a
                                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors flex items-center space-x-1.5"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Reply via Email</span>
                                  </a>
                                </div>

                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 3: CUSTOMIZE DATA (Relocated into Admin Page)                 */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'customize' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
                      <div>
                        <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                          <span>Customize Portfolio Profile Data</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Edit Dennis's bio, skills, contact links, and credentials live on the site
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleExportJson}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export JSON</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResetProfile}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-red-950/40 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-red-300 flex items-center space-x-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                    {saveSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{saveSuccessMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveCustomProfile} className="space-y-5 text-xs sm:text-sm">
                      {/* Avatar & Basic Info */}
                      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                        <h5 className="font-bold text-white text-sm flex items-center space-x-2">
                          <span>Identity & Photo</span>
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                              Profile Photo Image URL
                            </label>
                            <input
                              type="text"
                              value={customFormData.avatarUrl || ''}
                              onChange={(e) => setCustomFormData({ ...customFormData, avatarUrl: e.target.value })}
                              placeholder="/dennis_photo.png"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={customFormData.name}
                              onChange={(e) => setCustomFormData({ ...customFormData, name: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                              Professional Headline / Title
                            </label>
                            <input
                              type="text"
                              value={customFormData.title}
                              onChange={(e) => setCustomFormData({ ...customFormData, title: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                              University / Institution
                            </label>
                            <input
                              type="text"
                              value={customFormData.university}
                              onChange={(e) => setCustomFormData({ ...customFormData, university: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                            Bio & Professional Summary
                          </label>
                          <textarea
                            rows={3}
                            value={customFormData.bio}
                            onChange={(e) => setCustomFormData({ ...customFormData, bio: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Contact & Location */}
                      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                        <h5 className="font-bold text-white text-sm">Contact Channels & Location</h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={customFormData.email}
                              onChange={(e) => setCustomFormData({ ...customFormData, email: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={customFormData.location}
                              onChange={(e) => setCustomFormData({ ...customFormData, location: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              value={customFormData.phone}
                              onChange={(e) => setCustomFormData({ ...customFormData, phone: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                              WhatsApp Link
                            </label>
                            <input
                              type="text"
                              value={customFormData.whatsapp || ''}
                              onChange={(e) => setCustomFormData({ ...customFormData, whatsapp: e.target.value })}
                              placeholder="https://wa.me/254768339258"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Social & Profiles */}
                      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                        <h5 className="font-bold text-white text-sm">Professional Profiles</h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                              GitHub Profile URL
                            </label>
                            <input
                              type="text"
                              value={customFormData.github}
                              onChange={(e) => setCustomFormData({ ...customFormData, github: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-400 uppercase text-[10px] mb-1">
                              LinkedIn Profile URL
                            </label>
                            <input
                              type="text"
                              value={customFormData.linkedin}
                              onChange={(e) => setCustomFormData({ ...customFormData, linkedin: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Action */}
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4 text-slate-950" />
                        <span>Save & Apply Changes to Live Portfolio</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 4: TESTIMONIALS MODERATION                                    */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'testimonials' && (
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-slate-800/80">
                      <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                        <span>Visitor Endorsements & Guestbook</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Peer reviews and recommendations synced via Cloud Firestore ({testimonials.length} total)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testimonials.map((t) => (
                        <div
                          key={t.id}
                          className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-white text-sm">{t.authorName}</span>
                              <span className="text-xs text-amber-400 font-bold">★ {t.rating}</span>
                            </div>
                            <span className="text-xs text-slate-400 block mb-3">{t.authorTitle}</span>
                            <p className="text-xs text-slate-300 italic mb-4 leading-relaxed">
                              "{t.quote}"
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                            <span className="text-[10px] text-slate-500">{t.date || 'Recent'}</span>
                            <button
                              onClick={() => handleDeleteTestimonial(t.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                              title="Delete from Firestore"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
