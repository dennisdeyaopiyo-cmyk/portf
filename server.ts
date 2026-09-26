import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client lazily or safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI portfolio assistant will run with fallback response.");
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Assistant Route - Interactive Recruiter & Visitor QA Twin
  app.post("/api/chat", async (req, res) => {
    // 1. Force response to never be cached (anti-caching headers)
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    try {
      const { message, conversationHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getAiClient();
      if (!ai) {
        const fallbackMsg = "Thanks for asking! I'm Dennis's AI assistant. (Note: GEMINI_API_KEY is not configured yet in environment secrets, but Dennis is a passionate Software & Cloud Engineer from Masinde Muliro University skilled in Python, TypeScript, Go, Docker, AWS, GCP, and Kubernetes!).";
        return res.json({
          reply: fallbackMsg,
          text: fallbackMsg,
        });
      }

      const PORTFOLIO_SYSTEM_INSTRUCTION = `You are the official AI Portfolio Assistant representing Dennis Opiyo, a Software & Cloud Engineer, Full-Stack Developer, and MMUST DSC Tech Lead. Your purpose is to interact with recruiters, developers, and visitors, giving concise, professional, and engaging information about Dennis.

<context>
- FULL NAME: Dennis Opiyo (Dennis Deya Opiyo)
- CURRENT ROLE / STATUS: Software & Cloud Engineer (BSc Computer Science / IT) | Tech Lead & Peer Mentor at Masinde Muliro University of Science and Technology (MMUST) Developer Student Club
- LOCATION: Kakamega & Nairobi, Kenya (Open to Remote & Global Relocation)
- CORE SKILLS: 
  * Cloud & Infrastructure: Google Cloud Platform (Cloud Run, Compute Engine, Artifact Registry), Amazon Web Services (EC2, S3, Lambda), Docker, Docker Compose, Kubernetes, Terraform (IaC), CI/CD (GitHub Actions), Linux Administration, Redis, Nginx.
  * Backend & Languages: Python (FastAPI, Django REST, Asyncio, Pandas), Go / Golang (Gin, Microservices, Concurrency), TypeScript / JavaScript (React, Node.js, Express, Tailwind CSS), Java (Spring Boot), C/C++, SQL (PostgreSQL, MySQL).
- TOP PROJECTS:
  1. MMUST Campus Cloud Sync & Resource Portal: Microservices document-sharing engine built with Go, Docker, React, and deployed on GCP Cloud Run.
  2. Multi-Cloud Infrastructure Provisioner: Automated CLI tool integrating Terraform to provision cross-cloud resources on AWS and GCP with custom Python validation.
  3. Real-Time Distributed Task Queue & Monitoring Dashboard: High-throughput async worker pool powered by Node.js, TypeScript, and Redis caching.
  4. Agribusiness Market Intelligence Platform: Real-time telemetry, crop market pricing analytics, and regional data pipelines built with Python and Django REST.
- CONTACT LINKS:
  - GitHub: https://github.com/DennisDeya
  - LinkedIn: https://linkedin.com/in/dennis-opiyo
  - Email: dennisdeyaopiyo@gmail.com
</context>

<behavior_rules>
1. TONE: Friendly, confident, professional, and helpful. Speak in the first-person plural ("We") or on behalf of Dennis (e.g., "Dennis specializes in...", "Dennis has built..."). When greeted (e.g., "hi", "hello", "hey", "good morning"), ALWAYS greet back warmly and conversationally!
2. CONCISENESS: Keep responses short and scannable (2-4 sentences or clear bullet points). Avoid long-winded essays while directly answering the visitor's question.
3. GROUNDING: Answer strictly based on the information provided in <context>. If a visitor asks something not mentioned in the context (e.g., private non-work details or unrelated topics), politely redirect them to contact Dennis directly via email (dennisdeyaopiyo@gmail.com) or LinkedIn.
4. CALL TO ACTION: When asked about projects or hiring/internships, encourage the visitor to check out the project architecture modals on this portfolio, explore his GitHub, or connect via email at dennisdeyaopiyo@gmail.com.
</behavior_rules>`;

      // Build prompt with dynamic multi-turn conversation context
      const formattedHistory = Array.isArray(conversationHistory)
        ? conversationHistory
            .slice(-6)
            .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "Visitor" : "Assistant"}: ${h.text}`)
            .join("\n")
        : "";

      const prompt = `${formattedHistory ? "Previous Conversation Context:\n" + formattedHistory + "\n\n" : ""}Visitor Query: ${message}`;

      // Candidate models in order of priority
      const candidateModels = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
      
      let reply: string | null = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: PORTFOLIO_SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });

          if (response && response.text) {
            reply = response.text;
            break;
          }
        } catch (err: any) {
          const errMsg = err?.message || String(err);
          const isQuota = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED");
          const isNotFound = errMsg.includes("404") || errMsg.includes("NOT_FOUND");
          
          if (!isQuota && !isNotFound) {
            console.warn(`[AI Note] Model ${model} unavailable: ${errMsg.slice(0, 100)}`);
          }
        }
      }

      if (!reply) {
        // Return gracefully so client-side expert knowledge engine responds instantly
        return res.json({
          reply: null,
          text: null,
          fallback: true,
        });
      }

      return res.json({ reply, text: reply });
    } catch (error: any) {
      return res.json({
        reply: null,
        text: null,
        fallback: true,
      });
    }
  });

  // Contact Form Submission API
  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required fields." });
    }

    console.log(`[Contact Form Received] From: ${name} (${email}) | Subject: ${subject}`);
    return res.json({
      success: true,
      message: "Thank you for reaching out! Dennis has received your message and will respond shortly.",
      timestamp: new Date().toISOString(),
    });
  });

  // Serve static assets or Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
