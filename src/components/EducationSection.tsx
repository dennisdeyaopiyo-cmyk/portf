import React from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  MapPin, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';
import { EducationItem } from '../types';

interface EducationSectionProps {
  education: EducationItem[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  return (
    <section id="education" className="py-16 md:py-24 border-b border-slate-800/60 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education & University Experience
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
            Pursuing Computer Science at Masinde Muliro University of Science and Technology, combining rigorous theoretical foundations with modern cloud systems engineering.
          </p>
        </div>

        {/* Main Education Card */}
        {education.map((edu) => (
          <div
            key={edu.id}
            className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
              
              {/* Left Column: Degree & Institution Info */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {edu.status}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                      {edu.institution}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-sm text-slate-300">
                  <div className="flex items-center text-slate-400">
                    <BookOpen className="w-4 h-4 mr-2 text-cyan-400 shrink-0" />
                    <span className="font-semibold text-slate-200">{edu.degree} - {edu.fieldOfStudy}</span>
                  </div>

                  <div className="flex items-center text-slate-400">
                    <Calendar className="w-4 h-4 mr-2 text-cyan-400 shrink-0" />
                    <span>{edu.startDate} — {edu.endDate}</span>
                  </div>

                  <div className="flex items-center text-slate-400">
                    <MapPin className="w-4 h-4 mr-2 text-cyan-400 shrink-0" />
                    <span>{edu.location}</span>
                  </div>

                  {edu.gpaOrGrade && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-cyan-300 font-mono mt-3">
                      🏆 Standing: {edu.gpaOrGrade}
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-2">
                  {edu.description}
                </p>
              </div>

              {/* Right Column: Coursework & Student Leadership */}
              <div className="lg:col-span-7 space-y-6">
                {/* Coursework Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                    Core Engineering Coursework
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {edu.relevantCoursework.map((course) => (
                      <span
                        key={course}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-300 text-xs font-medium border border-slate-800"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Academic & Campus Achievements */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                    <Award className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    Campus Leadership & Recognition at MMUST
                  </h4>
                  <div className="space-y-2.5">
                    {edu.achievements.map((achievement, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm text-slate-300 flex items-start space-x-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
};
