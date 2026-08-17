import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EducationSection } from './components/EducationSection';
import { TimelineSection } from './components/TimelineSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { FloatingAiButton } from './components/FloatingAiButton';
import { ProjectModal } from './components/ProjectModal';
import { PortfolioCustomizer } from './components/PortfolioCustomizer';
import { Footer } from './components/Footer';

import { 
  initialProfile, 
  initialSkills, 
  initialProjects, 
  initialEducation, 
  initialExperience, 
  initialCertifications,
  initialTestimonials 
} from './data/portfolioData';
import { Project, UserProfile, Testimonial } from './types';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mmust_portfolio_profile_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialProfile,
          ...parsed,
          avatarUrl: initialProfile.avatarUrl,
        };
      } catch {
        return initialProfile;
      }
    }
    return initialProfile;
  });

  const [skills] = useState(initialSkills);
  const [projects] = useState(initialProjects);
  const [education] = useState(initialEducation);
  const [experience] = useState(initialExperience);
  const [certifications] = useState(initialCertifications);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('mmust_portfolio_testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  const handleAddTestimonial = (newTestimonial: Omit<Testimonial, 'id'>) => {
    const item: Testimonial = {
      ...newTestimonial,
      id: `test-${Date.now()}`,
    };
    const updated = [item, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem('mmust_portfolio_testimonials', JSON.stringify(updated));
  };

  const [activeSection, setActiveSection] = useState('about');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  // Theme Management (Dark vs High-Contrast Light with Accessibility Preference Detection)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('mmust_portfolio_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // Check OS preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('mmust_portfolio_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Save profile changes locally
  useEffect(() => {
    localStorage.setItem('mmust_portfolio_profile_v6', JSON.stringify(profile));
  }, [profile]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'projects', 'education', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadCv = () => {
    const cvText = `
================================================================================
${profile.name.toUpperCase()} - RESUME & PORTFOLIO
${profile.title}
Institution: ${profile.university} (${profile.degree})
Location: ${profile.location}
Contact: ${profile.email} | ${profile.github} | ${profile.linkedin}
================================================================================

SUMMARY:
${profile.aboutLong}

CORE SKILLS:
- Programming Languages: Python, TypeScript/JavaScript, Go (Golang), Java, C/C++, SQL
- Cloud & DevOps: GCP (Cloud Run, Cloud Storage, Compute Engine), AWS (EC2, S3, Lambda), Docker, Kubernetes, Terraform, GitHub Actions CI/CD, Linux Administration

FEATURED PROJECTS:
${projects.map((p) => `- ${p.title} (${p.techStack.join(', ')}): ${p.summary}`).join('\n')}

EDUCATION:
- ${profile.university}
  Degree: ${profile.degree} (Expected 2027)
  Standing: First Class Honors Standing

EXPERIENCE & LEADERSHIP:
${experience.map((e) => `- ${e.title} @ ${e.companyOrOrg} (${e.startDate} - ${e.endDate}): ${e.description}`).join('\n')}
================================================================================
    `;

    const blob = new Blob([cvText.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${profile.name.toLowerCase().replace(/\s+/g, '_')}_resume.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    setProfile(initialProfile);
    localStorage.removeItem('mmust_portfolio_profile');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigate={handleNavigate}
        onOpenAiChat={() => setAiChatOpen(true)}
        onOpenCustomizer={() => setCustomizerOpen(true)}
        onDownloadCv={handleDownloadCv}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Section 1: Hero & Personal Introduction */}
        <Hero
          profile={profile}
          onExploreProjects={() => handleNavigate('projects')}
          onContactClick={() => handleNavigate('contact')}
          onOpenAiChat={() => setAiChatOpen(true)}
          isAiChatOpen={aiChatOpen}
        />

        {/* Section 2: Programming Languages & Cloud Technologies */}
        <SkillsSection skills={skills} />

        {/* Section 3: Specific Featured Projects */}
        <ProjectsSection
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        {/* Section 4: Education & Masinde Muliro University Spotlight */}
        <EducationSection education={education} />

        {/* Section 5: Experience, Leadership & Certifications */}
        <TimelineSection
          experience={experience}
          certifications={certifications}
        />

        {/* Section 6: Testimonials / What They Say (Infinite Marquee) */}
        <TestimonialsSection
          testimonials={testimonials}
          onAddTestimonial={handleAddTestimonial}
        />

        {/* Section 7: Contact & Inquiries */}
        <ContactSection profile={profile} />

      </main>

      {/* Footer */}
      <Footer
        profile={profile}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Always Visible Floating AI Twin Trigger Pill */}
      <FloatingAiButton
        isOpen={aiChatOpen}
        onClick={() => setAiChatOpen(true)}
      />

      {/* Floating AI Twin Recruiter Assistant Widget */}
      <AiAssistantWidget
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        profile={profile}
      />

      {/* Project Architecture Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Portfolio Profile Customizer Drawer */}
      <PortfolioCustomizer
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => setProfile(updated)}
        onResetData={handleResetData}
      />

    </div>
  );
}
