export type SkillCategory = 'languages' | 'cloud' | 'devops' | 'databases' | 'frameworks';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  level: 'Expert' | 'Advanced' | 'Proficient' | 'Intermediate' | 'Learning';
  iconName: string;
  description: string;
  projectsUsedCount: number;
  featured: boolean;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: 'Cloud & DevOps' | 'Full-Stack' | 'AI & Python' | 'Campus & Mobile' | 'Systems & APIs';
  techStack: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  featured: boolean;
  imageBg: string; // Gradient or image preview URL
  highlights: string[];
  architectureDiagram?: string;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
  dateCompleted: string;
  role: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  location: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  status: 'In Progress' | 'Completed';
  gpaOrGrade?: string;
  description: string;
  relevantCoursework: string[];
  achievements: string[];
  logoIcon: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  companyOrOrg: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  technologiesUsed: string[];
  type: 'Internship' | 'Leadership' | 'Open Source' | 'Freelance' | 'Certification';
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  badgeColor: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  rating: number; // e.g. 5.0
  quote: string;
  authorName: string;
  authorTitle?: string;
  authorAvatar?: string;
  date?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  avatarUrl?: string;
  university: string;
  degree: string;
  location: string;
  bio: string;
  aboutLong: string;
  email: string;
  phone: string;
  whatsapp?: string;
  github: string;
  linkedin: string;
  twitter: string;
  availableForHire: boolean;
  preferredRole: string;
  stats: {
    projectsCount: number;
    languagesCount: number;
    cloudServicesCount: number;
    hackathonsWon: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
