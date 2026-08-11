import React from 'react';
import { 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Cloud, 
  Box, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ExperienceItem, Certification } from '../types';

interface TimelineSectionProps {
  experience: ExperienceItem[];
  certifications: Certification[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  experience,
  certifications,
}) => {
  return (
    <section id="experience" className="py-16 md:py-24 border-b border-slate-800/60 relative bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Milestones & Certifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience, Leadership & Cloud Certifications
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
            Practical engagement in community tech leadership, cloud engineering fellowships, and industry certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Experience & Fellowships Timeline */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span>Roles & Fellowships</span>
            </h3>

            <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
              {experience.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors" />

                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {exp.type}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {exp.title}
                      </h4>
                      <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                        {exp.companyOrOrg} • {exp.location}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {exp.responsibilities.map((resp, i) => (
                        <div key={i} className="text-xs text-slate-400 flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {exp.technologiesUsed.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[11px] font-mono border border-slate-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Cloud Certifications & Badges */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Certifications & Badges</span>
            </h3>

            <div className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start space-x-4"
                >
                  <div className="p-3 rounded-xl bg-slate-950 text-cyan-400 border border-slate-800 shrink-0">
                    <Cloud className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${cert.badgeColor}`}>
                        {cert.issuer}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{cert.issueDate}</span>
                    </div>

                    <h4 className="font-bold text-white text-sm sm:text-base">
                      {cert.title}
                    </h4>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs text-cyan-400 hover:underline pt-1"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Community Note */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-900/40 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Peer Mentorship at MMUST</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Regularly conducts code reviews and cloud deployment demonstrations for junior students in Kakamega, fostering peer learning and open source participation.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
