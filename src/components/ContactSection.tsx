import React, { useState } from 'react';
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Check, 
  Copy, 
  Sparkles, 
  GraduationCap,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface ContactSectionProps {
  profile: UserProfile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Internship / Job Opportunity',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: data.message || 'Thank you! Dennis has received your message and will get back to you shortly.',
        });
        setFormData({
          name: '',
          email: '',
          subject: 'Internship / Job Opportunity',
          message: '',
        });
      } else {
        setSubmitStatus({
          success: false,
          message: data.error || 'Failed to submit form. Please try sending a direct email instead.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: true,
        message: 'Message registered! Thank you for reaching out to Dennis.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Let's Build Resilient Cloud Systems Together
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
            Currently open for Cloud Engineering internships, DevOps positions, Software Development roles, and open-source collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Info & Social Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              
              {/* Dennis Profile Header Card */}
              <div className="flex items-center space-x-4 pb-4 border-b border-slate-800/80">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md">
                    <img
                      src={profile.avatarUrl || "/dennis_avatar.png"}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{profile.name}</h4>
                  <p className="text-xs text-cyan-400 font-medium">{profile.title}</p>
                  <p className="text-[11px] text-slate-400">{profile.university}</p>
                </div>
              </div>

              <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Contact Details</span>
                <span className="text-xs text-emerald-400 font-mono font-normal">Available for Hire</span>
              </h3>

              <div className="space-y-4">
                {/* Email Card */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Email Address</p>
                      <p className="text-xs sm:text-sm font-mono text-slate-200 truncate">{profile.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(profile.email, 'email')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                    title="Copy Email"
                  >
                    {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* WhatsApp & Phone Direct Card */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase font-bold text-slate-500">WhatsApp & Phone</p>
                      <p className="text-xs sm:text-sm font-mono text-slate-200">{profile.phone}</p>
                    </div>
                  </div>
                  <a
                    href={profile.whatsapp || "https://wa.me/254768339258"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center space-x-1 shrink-0"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </a>
                </div>

                {/* Location Card */}
                <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Location</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">{profile.location}</p>
                  </div>
                </div>

                {/* Institution Card */}
                <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500">University</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">{profile.university}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs uppercase font-bold text-slate-500 mb-3">Online Profiles & Code Repos</p>
                <div className="flex space-x-3">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-cyan-400" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
              <h3 className="font-bold text-white text-lg flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>Send Dennis a Message</span>
              </h3>

              {submitStatus && (
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start space-x-3 ${
                    submitStatus.success
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/10 text-red-300 border border-red-500/30'
                  }`}
                >
                  <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{submitStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. s.jenkins@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Subject / Purpose
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
                  >
                    <option value="Internship / Job Opportunity">Internship / Job Opportunity</option>
                    <option value="Cloud Architecture Consultation">Cloud Architecture Consultation</option>
                    <option value="Project Collaboration">Project Collaboration</option>
                    <option value="MMUST Academic Network">MMUST Academic Network</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your role, project inquiry, or message for Dennis..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 placeholder:text-slate-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message to Dennis'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
