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
import { PhotoModal } from './components/PhotoModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { BinaryVortexCanvas, VortexDensity } from './components/BinaryVortexCanvas';
import { subscribeToTestimonials, submitTestimonialToFirestore, recordPortfolioVisit } from './services/firebaseService';

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
    const saved = localStorage.getItem('mmust_portfolio_profile_v10');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const cleanedTitle = parsed.title?.replace(/\s*Student/gi, '').trim() || initialProfile.title;
        return {
          ...initialProfile,
          ...parsed,
          title: cleanedTitle === 'Software & Cloud Engineering' ? 'Software & Cloud Engineer' : cleanedTitle,
          avatarUrl: parsed.avatarUrl || initialProfile.avatarUrl || "/dennis_photo.png",
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  // Subscribe to live Firebase Firestore testimonials
  useEffect(() => {
    const unsubscribe = subscribeToTestimonials(
      (cloudTestimonials) => {
        setTestimonials(cloudTestimonials);
      },
      initialTestimonials
    );

    // Record visitor telemetry to Cloud Firestore
    recordPortfolioVisit();

    return () => unsubscribe();
  }, []);

  const handleAddTestimonial = async (newTestimonial: Omit<Testimonial, 'id'>) => {
    const item: Testimonial = {
      ...newTestimonial,
      id: `test-${Date.now()}`,
    };
    setTestimonials((prev) => [item, ...prev]);

    // Persist to Cloud Firestore
    try {
      await submitTestimonialToFirestore(newTestimonial);
    } catch (e) {
      console.warn('Could not save testimonial to cloud Firestore:', e);
    }
  };

  const [activeSection, setActiveSection] = useState('about');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  // 3D Rotating Binary Vortex Tunnel State (starts at Skills, ends at Projects)
  const [vortexSpeed, setVortexSpeed] = useState<number>(1);
  const [vortexDensity, setVortexDensity] = useState<VortexDensity>('dense');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [watermarkStyle, setWatermarkStyle] = useState<'full-stack' | 'prominent' | 'stealth'>('full-stack');

  // Enforce Permanent Cyberpunk Dark Mode
  useEffect(() => {
    localStorage.removeItem('mmust_portfolio_theme');
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  }, []);

  // Save profile changes locally
  useEffect(() => {
    localStorage.setItem('mmust_portfolio_profile_v10', JSON.stringify(profile));
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
        onNavigate={handleNavigate}
        onOpenAdmin={() => setAdminDashboardOpen(true)}
        onDownloadCv={handleDownloadCv}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Section 1: Hero & Personal Introduction */}
        <Hero
          profile={profile}
          onExploreProjects={() => handleNavigate('projects')}
          onContactClick={() => handleNavigate('contact')}
          onPhotoClick={() => setPhotoModalOpen(true)}
        />

        {/* Continuous 3D Rotating Binary Vortex & Dense Dropping Rain Zone: Starts at Programming Languages & Cloud Technologies, Ends at Projects */}
        <div id="vortex-continuous-zone" className="relative overflow-hidden bg-slate-950 cyber-matrix-zone">
          {/* Full-Height 3D Rotating Binary Vortex & Dense Dropping Rain Canvas */}
          <BinaryVortexCanvas
            opacity={0.92}
            speed={vortexSpeed}
            density={vortexDensity}
            isRotating={isRotating}
            watermarkStyle={watermarkStyle}
            interactive={true}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          />

          {/* Section content placed over the continuous rotating 3D binary vortex and dense dropping rain */}
          <div className="relative z-10">
            {/* Section 2: Programming Languages & Cloud Technologies (Starts here) */}
            <SkillsSection
              skills={skills}
              vortexSpeed={vortexSpeed}
              onSpeedChange={setVortexSpeed}
              vortexDensity={vortexDensity}
              onDensityChange={setVortexDensity}
              isRotating={isRotating}
              onToggleRotate={() => setIsRotating((prev) => !prev)}
              watermarkStyle={watermarkStyle}
              onToggleWatermark={(style) => setWatermarkStyle(style as 'full-stack' | 'prominent' | 'stealth')}
              hasExternalVortex={true}
            />

            {/* Section 3: Specific Featured Projects (Ends here) */}
            <ProjectsSection
              projects={projects}
              onSelectProject={(project) => setSelectedProject(project)}
              hasExternalVortex={true}
            />
          </div>
        </div>

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
        onOpenAdmin={() => setAdminDashboardOpen(true)}
      />

      {/* Firebase Cloud Admin Dashboard */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        testimonials={testimonials}
        projects={projects}
        profile={profile}
        onUpdateProfile={(updated) => setProfile(updated)}
        onResetData={handleResetData}
      />

      {/* Floating AI Button & Modal (Only Floating AI on Screen) */}
      <FloatingAiButton
        isOpen={aiChatOpen}
        onClick={() => setAiChatOpen(true)}
      />

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

      {/* High-Resolution Portrait Photo Lightbox Modal */}
      <PhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        profile={profile}
      />

    </div>
  );
}
