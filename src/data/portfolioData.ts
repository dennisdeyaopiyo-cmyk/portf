import { UserProfile, Skill, Project, EducationItem, ExperienceItem, Certification, Testimonial } from '../types';
import dennisExactPhoto from '../assets/images/dennis_exact_photo_1786532038241.jpg';

export const initialProfile: UserProfile = {
  name: "Dennis Opiyo",
  title: "Software & Cloud Engineering Student",
  avatarUrl: dennisExactPhoto,
  university: "Masinde Muliro University of Science and Technology (MMUST)",
  degree: "BSc in Computer Science",
  location: "Kakamega / Nairobi, Kenya",
  bio: "Passionate CS student specializing in Cloud Infrastructure, Containerization, Microservices, and Full-Stack Development. Building resilient systems with Go, Python, TypeScript, Docker, and GCP.",
  aboutLong: "I am a driven Computer Science student at Masinde Muliro University of Science and Technology (MMUST) with a passion for modern cloud architecture, containerized microservices, and high-performance software systems. My journey spans writing low-level system code in C++ & Go, building scalable Python/Django & TypeScript backends, and provisioning automated cloud infrastructure using Terraform, Docker, and Google Cloud Platform (GCP). On campus, I serve as a Peer Tech Lead helping fellow students master git workflows, Linux basics, and cloud deployment pipelines.",
  email: "dennisdeyaopiyo@gmail.com",
  phone: "+254 768 339 258",
  whatsapp: "https://wa.me/254768339258",
  github: "https://github.com/dennisopiyo",
  linkedin: "https://linkedin.com/in/dennisopiyo",
  twitter: "https://x.com/dennisopiyo_dev",
  availableForHire: true,
  preferredRole: "Cloud Engineer / DevOps Intern / Full-Stack Developer",
  stats: {
    projectsCount: 14,
    languagesCount: 8,
    cloudServicesCount: 12,
    hackathonsWon: 3,
  },
};

export const initialSkills: Skill[] = [
  // Programming Languages
  {
    id: "lang-python",
    name: "Python",
    category: "languages",
    proficiency: 92,
    level: "Expert",
    iconName: "FileCode",
    description: "REST APIs (FastAPI/Django), Data Processing, Automation Scripts, AI/ML SDK integrations.",
    projectsUsedCount: 8,
    featured: true,
    tags: ["FastAPI", "Django", "Asyncio", "Pandas", "Scripting"],
  },
  {
    id: "lang-ts",
    name: "TypeScript / JavaScript",
    category: "languages",
    proficiency: 90,
    level: "Expert",
    iconName: "Code2",
    description: "Full-stack React, Node.js/Express backends, Async processing, Type-safe APIs.",
    projectsUsedCount: 10,
    featured: true,
    tags: ["React 19", "Node.js", "Express", "Vite", "Tailwind CSS"],
  },
  {
    id: "lang-go",
    name: "Go (Golang)",
    category: "languages",
    proficiency: 82,
    level: "Advanced",
    iconName: "Cpu",
    description: "High-concurrency microservices, CLI tools, gRPC services, and lightweight containerized apps.",
    projectsUsedCount: 4,
    featured: true,
    tags: ["Goroutines", "Gin Framework", "gRPC", "Dockerized Microservices"],
  },
  {
    id: "lang-java",
    name: "Java",
    category: "languages",
    proficiency: 80,
    level: "Proficient",
    iconName: "Coffee",
    description: "Object-oriented software architecture, Spring Boot APIs, and Enterprise Systems coursework at MMUST.",
    projectsUsedCount: 5,
    featured: true,
    tags: ["Spring Boot", "OOP", "Maven", "JUnit"],
  },
  {
    id: "lang-cpp",
    name: "C / C++",
    category: "languages",
    proficiency: 75,
    level: "Intermediate",
    iconName: "Terminal",
    description: "Memory management, Data Structures & Algorithms, OS concepts at MMUST.",
    projectsUsedCount: 3,
    featured: false,
    tags: ["Pointers", "Algorithms", "Memory Allocation", "System Calls"],
  },
  {
    id: "lang-sql",
    name: "SQL & PostgreSQL",
    category: "languages",
    proficiency: 88,
    level: "Advanced",
    iconName: "Database",
    description: "Complex query optimization, indexing, relational schema design, transactions, and migration tools.",
    projectsUsedCount: 9,
    featured: true,
    tags: ["PostgreSQL", "MySQL", "Indexing", "ORMs", "Prisma/Drizzle"],
  },
  {
    id: "lang-rust",
    name: "Rust",
    category: "languages",
    proficiency: 62,
    level: "Learning",
    iconName: "Zap",
    description: "Memory safety without garbage collection, exploring webassembly and fast system CLI tooling.",
    projectsUsedCount: 2,
    featured: false,
    tags: ["Cargo", "Ownership Model", "Wasm"],
  },

  // Cloud Technologies
  {
    id: "cloud-gcp",
    name: "Google Cloud Platform (GCP)",
    category: "cloud",
    proficiency: 88,
    level: "Advanced",
    iconName: "Cloud",
    description: "Cloud Run serverless containers, Cloud Storage, Compute Engine VMs, Artifact Registry, IAM.",
    projectsUsedCount: 6,
    featured: true,
    tags: ["Cloud Run", "GCS", "Compute Engine", "IAM", "BigQuery"],
  },
  {
    id: "cloud-aws",
    name: "Amazon Web Services (AWS)",
    category: "cloud",
    proficiency: 82,
    level: "Advanced",
    iconName: "CloudLightning",
    description: "EC2 instances, S3 bucket management, AWS Lambda serverless functions, CloudWatch monitoring.",
    projectsUsedCount: 5,
    featured: true,
    tags: ["AWS EC2", "AWS S3", "AWS Lambda", "Route53", "IAM"],
  },
  {
    id: "cloud-docker",
    name: "Docker & Containerization",
    category: "devops",
    proficiency: 90,
    level: "Expert",
    iconName: "Box",
    description: "Multi-stage Dockerfiles, Docker Compose multi-service stacks, image optimization & security scanning.",
    projectsUsedCount: 9,
    featured: true,
    tags: ["Multi-stage Builds", "Docker Compose", "Alpine Images", "Container Security"],
  },
  {
    id: "cloud-k8s",
    name: "Kubernetes (k8s)",
    category: "devops",
    proficiency: 76,
    level: "Intermediate",
    iconName: "Layers",
    description: "Deployments, Services, Ingress controllers, ConfigMaps, Secrets, and local Minikube cluster management.",
    projectsUsedCount: 3,
    featured: true,
    tags: ["Deployments", "Services", "Ingress", "Minikube", "Helm"],
  },
  {
    id: "cloud-terraform",
    name: "Terraform (IaC)",
    category: "devops",
    proficiency: 78,
    level: "Intermediate",
    iconName: "FileText",
    description: "Infrastructure-as-Code for provisioning repeatable GCP and AWS cloud resources automatically.",
    projectsUsedCount: 3,
    featured: true,
    tags: ["HCL", "State Management", "AWS Provider", "GCP Provider"],
  },
  {
    id: "cloud-cicd",
    name: "CI/CD & GitHub Actions",
    category: "devops",
    proficiency: 85,
    level: "Advanced",
    iconName: "GitBranch",
    description: "Automated test suites, automated linting, container builds, and direct deployment to Cloud Run/EC2.",
    projectsUsedCount: 7,
    featured: true,
    tags: ["GitHub Actions", "Automated Pipelines", "Linting & Testing", "Artifact Deploy"],
  },

  // Databases & Tools
  {
    id: "tool-git",
    name: "Git & GitHub",
    category: "databases",
    proficiency: 95,
    level: "Expert",
    iconName: "GitCommit",
    description: "Branching strategies, interactive rebase, pull requests, code reviews, and releases.",
    projectsUsedCount: 12,
    featured: false,
    tags: ["Git Flow", "Rebase", "Merge Conflicts", "PR Automation"],
  },
  {
    id: "tool-redis",
    name: "Redis",
    category: "databases",
    proficiency: 80,
    level: "Proficient",
    iconName: "Server",
    description: "In-memory caching, Pub/Sub messaging, Rate limiting, and session caching for Node & Python backends.",
    projectsUsedCount: 4,
    featured: false,
    tags: ["Caching", "Pub/Sub", "Session Store", "Key-Value"],
  },
  {
    id: "tool-linux",
    name: "Linux Administration",
    category: "devops",
    proficiency: 88,
    level: "Advanced",
    iconName: "HardDrive",
    description: "Ubuntu / Debian server management, Bash scripting, systemd services, SSH key setup, firewall configuration.",
    projectsUsedCount: 8,
    featured: false,
    tags: ["Bash Scripting", "SSH", "Systemd", "Cron Jobs", "Nginx"],
  },
];

export const initialProjects: Project[] = [
  {
    id: "proj-mmust-cloud-sync",
    title: "MMUST Campus Cloud Sync & Document Portal",
    summary: "Cloud-native campus learning resource hub built for Masinde Muliro University students with fast Go microservices and GCP Cloud Run.",
    description: "A secure, resilient campus platform built specifically for students and department lecturers at Masinde Muliro University. Enables fast PDF resource indexing, lecture notes synchronization, cloud storage bucket management, and real-time updates.",
    category: "Cloud & DevOps",
    techStack: ["Go (Golang)", "GCP Cloud Run", "Docker", "PostgreSQL", "React", "Tailwind CSS"],
    githubUrl: "https://github.com/dennisopiyo/mmust-campus-cloud-sync",
    liveDemoUrl: "https://mmust-cloud-sync.demo.app",
    featured: true,
    imageBg: "from-blue-600 via-indigo-700 to-slate-900",
    highlights: [
      "Containerized Go API deployed on Google Cloud Run with scale-to-zero auto-scaling",
      "GCP Cloud Storage integration with signed URLs for safe course material downloads",
      "PostgreSQL full-text search indexing over 1,200+ MMUST departmental papers and notes",
      "99.9% uptime with automated CI/CD deployment pipeline via GitHub Actions"
    ],
    architectureDiagram: "Browser / React SPA ➔ Cloud Run (Go Gin API) ➔ GCP Cloud Storage (PDF Notes) & Cloud SQL (PostgreSQL Metadata)",
    codeSnippet: {
      filename: "main.go",
      language: "go",
      code: `package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type Resource struct {
	ID        string \`json:"id"\`
	Title     string \`json:"title"\`
	Course    string \`json:"course"\`
	FileURL   string \`json:"file_url"\`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := gin.Default()
	router.GET("/api/v1/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy", "institution": "MMUST"})
	})

	log.Printf("Starting MMUST Campus Sync API on port %s...", port)
	router.Run(":" + port)
}`
    },
    dateCompleted: "2026-03",
    role: "Lead Developer & Cloud Architect"
  },
  {
    id: "proj-terraform-multicloud",
    title: "Multi-Cloud Automated Infrastructure Provisioner",
    summary: "Terraform + Python CLI automating dual-cloud infrastructure creation across AWS EC2/S3 and GCP Cloud Engine/GCS.",
    description: "An automated infrastructure-as-code repository and CLI tool designed to eliminate manual cloud console configuration. Generates production-ready VPCs, security groups, EC2 instances, S3 buckets, and GCP Cloud Run services with zero credential leaks.",
    category: "Cloud & DevOps",
    techStack: ["Python", "Terraform", "AWS CLI", "Google Cloud SDK", "Docker", "Bash"],
    githubUrl: "https://github.com/dennisopiyo/multicloud-terraform-cli",
    liveDemoUrl: "https://github.com/dennisopiyo/multicloud-terraform-cli",
    featured: true,
    imageBg: "from-emerald-600 via-teal-800 to-slate-900",
    highlights: [
      "Automates VPC creation, public/private subnets, and IAM policy bindings in under 3 minutes",
      "Python CLI wrapper with click-based UI for interactive resource declaration",
      "Supports remote state storage in encrypted AWS S3 buckets with DynamoDB state locking",
      "Includes cost estimator module warning users before spawning high-cost instances"
    ],
    architectureDiagram: "Developer CLI ➔ Python Orchestrator ➔ Terraform Engine ➔ [AWS IAM/S3/EC2 & GCP Cloud Engine/Cloud Run]",
    codeSnippet: {
      filename: "provision.py",
      language: "python",
      code: `import subprocess
import sys
import json

def run_terraform_plan(environment="staging", cloud_provider="gcp"):
    print(f"🚀 Initializing Terraform for {cloud_provider.upper()} ({environment})...")
    
    cmd_init = ["terraform", "init", f"-backend-config=env/{environment}.tfvars"]
    subprocess.run(cmd_init, check=True)
    
    cmd_plan = ["terraform", "plan", "-out=tfplan.binary"]
    res = subprocess.run(cmd_plan, capture_output=True, text=True)
    
    if res.returncode == 0:
        print("✅ Terraform execution plan built successfully.")
    else:
        print(f"❌ Error building plan: {res.stderr}")

if __name__ == "__main__":
    run_terraform_plan()`
    },
    dateCompleted: "2026-01",
    role: "DevOps Engineer"
  },
  {
    id: "proj-distributed-task-queue",
    title: "Distributed Task Queue & Real-Time Monitor",
    summary: "Asynchronous task queue system with Redis, Node.js worker pools, Docker Compose, and a live web dashboard.",
    description: "A robust distributed worker pool that processes background jobs (email dispatches, PDF rendering, image compression) with configurable retry logic, exponential backoff, dead-letter queues, and real-time monitoring graphs.",
    category: "Full-Stack",
    techStack: ["TypeScript", "Node.js", "Redis", "Docker", "React", "Recharts"],
    githubUrl: "https://github.com/dennisopiyo/distributed-task-queue",
    liveDemoUrl: "https://distributed-queue-dashboard.demo.app",
    featured: true,
    imageBg: "from-purple-600 via-violet-800 to-slate-900",
    highlights: [
      "Handles up to 1,500 background jobs/sec with Redis Pub/Sub and concurrent worker threads",
      "Real-time WebSocket dashboard reporting active, delayed, completed, and failed job metrics",
      "Docker Compose environment pre-configured with 1 Master Node, 3 Worker Replicas, and Redis",
      "Automated unit testing with 94% code coverage using Vitest"
    ],
    architectureDiagram: "React UI ➔ Express API ➔ Redis Queue ➔ [Worker Node 1, Worker Node 2, Worker Node 3] ➔ Status DB",
    codeSnippet: {
      filename: "worker.ts",
      language: "typescript",
      code: `import { createClient } from 'redis';

interface QueueTask {
  id: string;
  payload: Record<string, any>;
  retries: number;
}

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

async function startWorker(workerId: string) {
  await redis.connect();
  console.log(\`[Worker \${workerId}] Listening for incoming background jobs...\`);

  while (true) {
    const job = await redis.blPop('jobs:pending', 0);
    if (job) {
      const task: QueueTask = JSON.parse(job.element);
      console.log(\`[Worker \${workerId}] Processing Task \${task.id}\`);
      // Simulate heavy processing task...
      await new Promise(r => setTimeout(r, 800));
      await redis.hSet('jobs:status', task.id, 'COMPLETED');
    }
  }
}

startWorker('worker-01');`
    },
    dateCompleted: "2025-11",
    role: "Full-Stack Developer"
  },
  {
    id: "proj-agri-iot-platform",
    title: "Agribusiness IoT & Yield Forecasting Portal",
    summary: "Smart agriculture IoT data aggregator with Python/Django REST API, PostgreSQL, and farmer advisory dashboard.",
    description: "Developed to assist local farmers in Western Kenya by aggregating field soil moisture, temperature, and crop health readings. Utilizes Python data pipelines to predict irrigation requirements and market prices.",
    category: "AI & Python",
    techStack: ["Python", "Django REST Framework", "PostgreSQL", "Pandas", "React", "Tailwind CSS"],
    githubUrl: "https://github.com/dennisopiyo/agri-iot-smart-yield",
    liveDemoUrl: "https://agri-iot-kenya.demo.app",
    featured: false,
    imageBg: "from-amber-600 via-orange-700 to-slate-900",
    highlights: [
      "REST API handling incoming sensor telemetry data from ESP32 microcontrollers",
      "Automated daily SMS/WhatsApp alerts for weather alerts and recommended fertilizer schedules",
      "Interactive data visualizations with Recharts showing soil moisture trends",
      "Designed for low-bandwidth cellular connections in rural agricultural setups"
    ],
    dateCompleted: "2025-09",
    role: "Backend & IoT Developer"
  },
  {
    id: "proj-campus-event-hub",
    title: "MMUST Tech Club Events & Hackathon Platform",
    summary: "Mobile-responsive portal for student club registration, workshop ticketing, and hackathon submission scoring.",
    description: "Built for Masinde Muliro University Developer Student Community to manage tech workshops, track attendance, host coding competitions, and distribute digital badges.",
    category: "Campus & Mobile",
    techStack: ["TypeScript", "React", "Firebase", "Tailwind CSS", "Lucide React"],
    githubUrl: "https://github.com/dennisopiyo/mmust-tech-events-hub",
    liveDemoUrl: "https://mmust-tech-hub.demo.app",
    featured: false,
    imageBg: "from-cyan-600 via-blue-800 to-slate-900",
    highlights: [
      "Served over 650+ MMUST engineering and computer science students",
      "QR code check-in scanner built into mobile web app for attendance verification",
      "Real-time leaderboard during campus coding sprints and hackathons",
      "Zero-latency state synchronization with Firebase Firestore"
    ],
    dateCompleted: "2025-07",
    role: "Lead Frontend Developer & Community Organizer"
  },
  {
    id: "proj-micro-billing-api",
    title: "High-Throughput Payment & M-Pesa Gateway Service",
    summary: "Microservice handling MPesa Daraja API transactions, webhook verification, and automated retry handling.",
    description: "A secure C# / Java Spring Boot backend microservice that bridges mobile money payments (Safaricom M-Pesa API) with enterprise billing applications with strict idempotency and audit logs.",
    category: "Systems & APIs",
    techStack: ["Java", "Spring Boot", "MySQL", "Docker", "M-Pesa API"],
    githubUrl: "https://github.com/dennisopiyo/mpesa-billing-microservice",
    liveDemoUrl: "https://github.com/dennisopiyo/mpesa-billing-microservice",
    featured: false,
    imageBg: "from-green-600 via-emerald-800 to-slate-900",
    highlights: [
      "STK Push integration with automated callback encryption and signature checks",
      "Reconciliation worker resolving pending payment callbacks automatically",
      "Containerized Docker setup with MySQL database migrations"
    ],
    dateCompleted: "2025-05",
    role: "Backend Developer"
  }
];

export const initialEducation: EducationItem[] = [
  {
    id: "edu-mmust",
    institution: "Masinde Muliro University of Science and Technology (MMUST)",
    location: "Kakamega, Kenya",
    degree: "Bachelor of Science",
    fieldOfStudy: "Computer Science / Software Engineering",
    startDate: "2023",
    endDate: "Expected 2027",
    status: "In Progress",
    gpaOrGrade: "First Class Honors Standing (Current Average: 3.8 / 4.0)",
    description: "Studying core Computer Science principles with focus on Cloud Computing, Operating Systems, Computer Networks, Software Engineering, Database Systems, and Distributed Algorithms.",
    relevantCoursework: [
      "Cloud Computing & Distributed Systems",
      "Data Structures & Algorithms (C++ / Java)",
      "Database Systems & Query Optimization",
      "Object-Oriented Programming (Java / Python)",
      "Operating Systems & Linux Architecture",
      "Computer Networks & Security Protocls",
      "Software Testing & Quality Assurance"
    ],
    achievements: [
      "Student Tech Lead for MMUST Developer Student Community (2024 - Present)",
      "1st Place Winner - MMUST Annual Innovation Hackathon (2025)",
      "Dean's Honor List for outstanding academic performance in Year 1 & Year 2"
    ],
    logoIcon: "GraduationCap"
  }
];

export const initialExperience: ExperienceItem[] = [
  {
    id: "exp-peer-lead",
    title: "Student Tech Lead & Cloud Peer Mentor",
    companyOrOrg: "MMUST Developer Student Community",
    location: "Kakamega, Kenya",
    startDate: "Oct 2024",
    endDate: "Present",
    isCurrent: true,
    description: "Organizing weekly hands-on workshops on Linux, Git workflows, Docker containerization, and Google Cloud Platform for over 150+ student members at Masinde Muliro University.",
    responsibilities: [
      "Led 12+ interactive cloud workshops training students on GCP Cloud Run and AWS S3/EC2 setup.",
      "Mentored junior CS students in debugging Python, C++, and Web Development assignments.",
      "Co-coordinated the MMUST Annual Inter-Departmental Hackathon with 20+ participating teams."
    ],
    technologiesUsed: ["GCP", "Docker", "Git", "Python", "Linux", "Community Leadership"],
    type: "Leadership"
  },
  {
    id: "exp-cloud-intern-prep",
    title: "Software & Cloud Systems Fellow",
    companyOrOrg: "Open Source Tech Collective Kenya",
    location: "Nairobi / Remote",
    startDate: "May 2025",
    endDate: "Sep 2025",
    isCurrent: false,
    description: "Contributed to open source DevOps tools, writing multi-stage Dockerfiles and automating deployment tests using GitHub Actions.",
    responsibilities: [
      "Refactored monolithic Node.js application scripts into containerized microservices.",
      "Created Terraform configuration templates for GCP Cloud SQL and AWS RDS setup.",
      "Improved deployment build speed by 40% through Docker cache optimization."
    ],
    technologiesUsed: ["Docker", "Terraform", "GitHub Actions", "Go", "TypeScript", "PostgreSQL"],
    type: "Internship"
  }
];

export const initialCertifications: Certification[] = [
  {
    id: "cert-gcp-cloud-eng",
    title: "Google Cloud Associate Cloud Engineer (Prep)",
    issuer: "Google Cloud Skill Boost",
    issueDate: "2025",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    icon: "Cloud"
  },
  {
    id: "cert-aws-practitioner",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issueDate: "2025",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    icon: "Award"
  },
  {
    id: "cert-docker-foundations",
    title: "Docker & Kubernetes Container Essentials",
    issuer: "Docker Training & Linux Foundation",
    issueDate: "2024",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    icon: "Box"
  },
  {
    id: "cert-python-meta",
    title: "Meta Professional Software Developer",
    issuer: "Coursera / Meta",
    issueDate: "2024",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icon: "CheckCircle2"
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    rating: 5.0,
    quote: "This young man is very disciplined; he delivered a professional and high-quality project. He is always in contact and active regarding time, Good work.",
    authorName: "Elemar Rice",
    authorTitle: "Tech Lead & Client",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    date: "August 2025"
  },
  {
    id: "test-2",
    rating: 5.0,
    quote: "Dennis is an exceptional engineer. He automated our entire container deployment pipeline with zero downtime and clean documentation.",
    authorName: "Rita Treds",
    authorTitle: "Product Manager",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    date: "July 2025"
  },
  {
    id: "test-3",
    rating: 5.0,
    quote: "Outstanding work on our cloud backend microservices. Dennis communicated proactive updates every day and delivered ahead of deadline.",
    authorName: "Augus Drix",
    authorTitle: "Senior Software Architect",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    date: "June 2025"
  },
  {
    id: "test-4",
    rating: 5.0,
    quote: "Dennis stands out as one of MMUST's top software talents. His dedication to mastering Cloud Engineering and mentoring peers is inspiring.",
    authorName: "Dr. J. Ochieng",
    authorTitle: "MMUST CS Department Lecturer",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    date: "May 2025"
  },
  {
    id: "test-5",
    rating: 5.0,
    quote: "Highly skilled developer! The FastAPI microservices Dennis built handled high traffic smoothly with under 50ms latency.",
    authorName: "Sarah Jenkins",
    authorTitle: "Fintech Startup Founder",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    date: "April 2025"
  },
  {
    id: "test-6",
    rating: 5.0,
    quote: "Working with Dennis on containerizing multi-tier applications was seamless. Highly disciplined, thorough, and highly recommended!",
    authorName: "Kevin Barasa",
    authorTitle: "DevOps Lead",
    authorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    date: "March 2025"
  }
];
