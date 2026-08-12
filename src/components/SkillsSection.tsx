import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Cloud, 
  Box, 
  Database, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Server, 
  Search,
  Sparkles,
  Info,
  X,
  Zap,
  GitBranch,
  HardDrive,
  Coffee,
  FileText,
  GitCommit,
  ExternalLink,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { Skill, SkillCategory } from '../types';

interface SkillsSectionProps {
  skills: Skill[];
}

// Custom code/command snippets for each technology
const TECH_SNIPPETS: Record<string, { language: string; filename: string; code: string }> = {
  'lang-python': {
    language: 'python',
    filename: 'fastapi_microservice.py',
    code: `from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel

app = FastAPI(title="MMUST Cloud Sync")

class ResourcePayload(BaseModel):
    title: str
    department: str
    file_url: str

@app.post("/api/v1/sync")
async def sync_resource(payload: ResourcePayload, bg: BackgroundTasks):
    bg.add_task(process_gcs_indexing, payload.file_url)
    return {"status": "indexed", "dept": payload.department}`
  },
  'lang-ts': {
    language: 'typescript',
    filename: 'server.ts',
    code: `import { GoogleGenAI } from "@google/genai";
import express from "express";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const app = express();

app.post("/api/ai/analyze", async (req, res) => {
  const { code } = req.body;
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: \`Perform security audit on: \${code}\`
  });
  res.json({ analysis: result.text });
});`
  },
  'lang-go': {
    language: 'go',
    filename: 'main.go',
    code: `package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/api/v1/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"service": "mmust-go-cloud-sync",
		})
	})
	r.Run(":3000")
}`
  },
  'cloud-gcp': {
    language: 'bash',
    filename: 'deploy_cloud_run.sh',
    code: `# Deploy containerized service to Google Cloud Run
gcloud run deploy mmust-campus-portal \\
  --image europe-west2-docker.pkg.dev/mmust-project/portal:v2 \\
  --region europe-west2 \\
  --platform managed \\
  --allow-unauthenticated \\
  --min-instances 0 \\
  --max-instances 10`
  },
  'cloud-docker': {
    language: 'dockerfile',
    filename: 'Dockerfile',
    code: `# Multi-stage Dockerfile for production
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM alpine:3.20
COPY --from=builder /app/server /server
EXPOSE 3000
CMD ["/server"]`
  },
  'cloud-aws': {
    language: 'bash',
    filename: 'aws_provision.sh',
    code: `# Provision S3 bucket and Lambda serverless function
aws s3 mb s3://mmust-student-archives-2026 --region eu-west-2
aws lambda create-function \\
  --function-name syncLectureNotes \\
  --runtime python3.11 \\
  --role arn:aws:iam::123456789:role/LambdaRole \\
  --handler index.handler`
  },
  'cloud-k8s': {
    language: 'yaml',
    filename: 'deployment.yaml',
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: mmust-portal-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mmust-portal
  template:
    metadata:
      labels:
        app: mmust-portal
    spec:
      containers:
      - name: api
        image: gcr.io/mmust-cloud/api:v1.0
        ports:
        - containerPort: 3000`
  },
  'lang-sql': {
    language: 'sql',
    filename: 'query_optimization.sql',
    code: `-- Indexed full-text search over course archives
SELECT doc_id, title, department, 
       TS_RANK(search_vector, query) AS rank
FROM mmust_course_documents,
     TO_TSQUERY('english', 'computer + networks') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;`
  },
  'cloud-terraform': {
    language: 'hcl',
    filename: 'main.tf',
    code: `resource "google_cloud_run_v2_service" "app" {
  name     = "mmust-portal-prod"
  location = "europe-west2"

  template {
    containers {
      image = "gcr.io/mmust-sync/api:latest"
      resources {
        limits = { cpu = "1000m", memory = "512Mi" }
      }
    }
  }
}`
  },
  'cloud-cicd': {
    language: 'yaml',
    filename: 'deploy.yml',
    code: `name: Cloud Run Deployment
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: \${{ secrets.GCP_SA_KEY }}
      - run: gcloud run deploy mmust-portal --image=gcr.io/$PROJECT/app`
  },
  'tool-linux': {
    language: 'bash',
    filename: 'nginx_proxy.conf',
    code: `# Reverse proxy & SSL routing
server {
    listen 80;
    server_name portal.mmust.ac.ke;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`
  },
  'lang-java': {
    language: 'java',
    filename: 'StudentController.java',
    code: `@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    @Autowired
    private StudentRepository repository;

    @GetMapping("/{regNo}")
    public ResponseEntity<Student> getStudent(@PathVariable String regNo) {
        return repository.findByRegNo(regNo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}`
  }
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedSkill, setInspectedSkill] = useState<Skill | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Stack' },
    { id: 'languages', label: 'Programming Languages' },
    { id: 'cloud', label: 'Cloud Platforms (GCP/AWS)' },
    { id: 'devops', label: 'DevOps & Containers' },
    { id: 'databases', label: 'Databases & Tools' },
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch = 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileCode':
      case 'Code2':
        return Code2;
      case 'Cloud':
      case 'CloudLightning':
        return Cloud;
      case 'Box':
        return Box;
      case 'Database':
        return Database;
      case 'Cpu':
        return Cpu;
      case 'Server':
        return Server;
      case 'Layers':
        return Layers;
      case 'Coffee':
        return Coffee;
      case 'Zap':
        return Zap;
      case 'GitBranch':
      case 'GitCommit':
        return GitBranch;
      case 'FileText':
        return FileText;
      case 'HardDrive':
        return HardDrive;
      default:
        return Terminal;
    }
  };

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Expert':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Advanced':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Proficient':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <section id="skills" className="py-20 md:py-28 border-b border-slate-800/60 relative bg-slate-950 overflow-hidden">
      
      {/* Background ambient lighting grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.12),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
              <span>Interactive Branching Tech Tree</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Programming Languages & Cloud Technologies
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Scroll down or up to watch skills sprout like leaves from the central technology rod. Click any card to inspect full capabilities & code architecture.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Python, Docker, GCP, SQL..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Central Rod / Tree Branch Container */}
        <div className="relative py-8">
          
          {/* THE CENTRAL ROD / STEM (Desktop center, Mobile left side) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 via-indigo-500 to-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.8)] z-10">
            {/* Top Glowing Core Terminal Node */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-400 border-4 border-slate-950 shadow-[0_0_20px_#22d3ee] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            </div>
            {/* Bottom Terminal Root Node */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-indigo-500 border-4 border-slate-950 shadow-[0_0_20px_#6366f1]" />
          </div>

          {/* Mobile Central Rod Line (Left aligned) */}
          <div className="md:hidden absolute left-5 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-500/30 shadow-[0_0_15px_rgba(6,182,212,0.7)] z-10">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_12px_#22d3ee]" />
          </div>

          {/* Leaves / Cards Staggered Alternating Container */}
          <div className="space-y-10 md:space-y-14 relative">
            {filteredSkills.map((skill, index) => {
              const IconComponent = getSkillIcon(skill.iconName);
              const levelClass = getLevelColor(skill.level);
              const isEven = index % 2 === 0; // Even items branch to Left, Odd items branch to Right (and sitting lower)

              // Slow & smooth motion animation variant: sprouting like leaves from the central rod stem
              const cardVariants = {
                hidden: {
                  opacity: 0,
                  scale: 0.35,
                  x: isEven ? 120 : -120, // Sprouting from the central rod stem
                  rotate: isEven ? -10 : 10, // Organic leaf opening angle
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  rotate: 0,
                  transition: {
                    duration: 0.85, // Slow & smooth ease as requested
                    ease: [0.16, 1, 0.3, 1], // Custom smooth cubic-bezier curve
                  },
                },
              };

              const mobileVariants = {
                hidden: {
                  opacity: 0,
                  scale: 0.35,
                  x: -60, // Originates from left rod
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  transition: {
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              };

              return (
                <div 
                  key={skill.id}
                  className={`relative flex items-center w-full ${
                    isEven 
                      ? 'md:w-1/2 md:mr-auto md:justify-end md:pr-10' 
                      : 'md:w-1/2 md:ml-auto md:justify-start md:pl-10'
                  } pl-12 md:pl-0`}
                >
                  
                  {/* CENTRAL ROD BRANCH CONNECTING STEM (Desktop) */}
                  <motion.div 
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: isEven ? 'right center' : 'left center' }}
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-0.5 pointer-events-none ${
                      isEven 
                        ? 'right-0 w-10 bg-gradient-to-l from-cyan-400 via-cyan-500/50 to-transparent' 
                        : 'left-0 w-10 bg-gradient-to-r from-cyan-400 via-cyan-500/50 to-transparent'
                    }`}
                  >
                    {/* Glowing Leaf Attachment Node on Central Rod */}
                    <div 
                      className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_12px_#22d3ee] ${
                        isEven ? '-right-2' : '-left-2'
                      }`}
                    />
                  </motion.div>

                  {/* Mobile Connecting Branch Line */}
                  <div className="md:hidden absolute left-5 top-1/2 -translate-y-1/2 w-7 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-500/30 pointer-events-none">
                    <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_8px_#22d3ee]" />
                  </div>

                  {/* Animated Skill Leaf Card */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.25 }}
                    variants={typeof window !== 'undefined' && window.innerWidth >= 768 ? cardVariants : mobileVariants}
                    whileHover={{ 
                      scale: 1.035, 
                      y: -4,
                      boxShadow: '0 20px 40px -10px rgba(6, 182, 212, 0.28)',
                      transition: { duration: 0.3, ease: 'easeOut' }
                    }}
                    onClick={() => setInspectedSkill(skill)}
                    className="group relative w-full max-w-lg p-6 rounded-2xl bg-slate-900/85 border border-slate-800/90 hover:border-cyan-500/60 hover:bg-slate-900 transition-colors duration-300 cursor-pointer flex flex-col justify-between shadow-xl backdrop-blur-md overflow-hidden"
                  >
                    {/* Leaf Organic Outline Glow on Hover */}
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center space-x-3.5">
                          <div className="p-3 rounded-xl bg-slate-800/90 text-cyan-400 border border-slate-700/80 group-hover:scale-110 group-hover:bg-cyan-500/15 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-all duration-300 shadow-md">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-white text-lg group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                              {skill.name}
                            </h3>
                            <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${levelClass} mt-1 tracking-wider`}>
                              {skill.level}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono text-cyan-400 font-extrabold bg-cyan-950/60 px-2 py-1 rounded-md border border-cyan-800/50">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full bg-slate-800/80 rounded-full h-1.5 mb-4 overflow-hidden p-0.5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: false }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full rounded-full shadow-[0_0_8px_#22d3ee]"
                        />
                      </div>

                      {/* Skill Description */}
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {skill.description}
                      </p>
                    </div>

                    {/* Bottom Section */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {skill.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-300 text-[11px] font-mono border border-slate-800 group-hover:border-cyan-900/60 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                        {skill.tags.length > 4 && (
                          <span className="px-1.5 py-0.5 text-[11px] text-slate-500 font-mono">
                            +{skill.tags.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span className="text-slate-500">Used in {skill.projectsUsedCount} projects</span>
                        <span className="text-cyan-400 font-bold flex items-center group-hover:translate-x-1 transition-transform">
                          Inspect <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTERACTIVE SKILL CONTENT MODAL (Triggered on Card Click) */}
        <AnimatePresence>
          {inspectedSkill && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-lg">
              
              {/* Backdrop Click to Close */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setInspectedSkill(null)}
                className="absolute inset-0"
              />

              {/* Main Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 250, damping: 22 }}
                className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] relative z-10 max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setInspectedSkill(null)}
                  className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner">
                    {React.createElement(getSkillIcon(inspectedSkill.iconName), { className: "w-8 h-8" })}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-2xl font-black text-white">{inspectedSkill.name}</h3>
                      <span className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded border ${getLevelColor(inspectedSkill.level)}`}>
                        {inspectedSkill.level}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-cyan-400 mt-1">
                      Proficiency Rating: {inspectedSkill.proficiency}% • Category: {inspectedSkill.category.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Content Overview */}
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5">Overview</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {inspectedSkill.description}
                    </p>
                  </div>

                  {/* Code Architecture / Command Snippet Terminal */}
                  {TECH_SNIPPETS[inspectedSkill.id] && (
                    <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
                      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          </div>
                          <span className="text-xs font-mono text-slate-400 ml-2">
                            {TECH_SNIPPETS[inspectedSkill.id].filename}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCopyCode(TECH_SNIPPETS[inspectedSkill.id].code)}
                          className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/50 transition-colors"
                        >
                          {copiedSnippet ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed bg-slate-950">
                        <code>{TECH_SNIPPETS[inspectedSkill.id].code}</code>
                      </pre>
                    </div>
                  )}

                  {/* MMUST Academic & Project Integration Context */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-xs text-slate-300 space-y-2">
                    <p className="font-bold text-cyan-400 flex items-center gap-1.5 text-sm">
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      Dennis's Production & Academic Application
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      Utilized extensively across {inspectedSkill.projectsUsedCount} major software repositories, including cloud-native microservices, automated CI/CD deployment pipelines, and MMUST Computer Science coursework.
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Key Skills & Frameworks</h4>
                    <div className="flex flex-wrap gap-2">
                      {inspectedSkill.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-lg bg-slate-800/90 text-cyan-300 text-xs font-mono border border-slate-700/70"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="pt-4 border-t border-slate-800/80 flex justify-end">
                    <button
                      onClick={() => setInspectedSkill(null)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                    >
                      Close Inspector
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
