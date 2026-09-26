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
    try {
      const { message, conversationHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getAiClient();
      if (!ai) {
        return res.json({
          reply: "Thanks for asking! I'm Dennis's AI assistant. (Note: GEMINI_API_KEY is not configured yet in secrets, but Dennis is a passionate Software & Cloud Engineering student at Masinde Muliro University skilled in Python, TypeScript, Java, Docker, AWS, GCP, and Kubernetes!).",
        });
      }

      const systemInstruction = `You are Dennis Opiyo's AI Portfolio Assistant, an interactive, highly intelligent, friendly, and conversational AI representative for Dennis Opiyo.
Dennis is a Software & Cloud Engineering student at Masinde Muliro University of Science and Technology (MMUST), Kakamega, Kenya.

CRITICAL INTERACTIVE GUIDELINES:
1. GREETINGS & CASUAL CONVERSATION:
   - When the user greets you (e.g., "hi", "hello", "hey", "good morning", "how are you", "what's up", "howdy", "sup"), ALWAYS greet back warmly and conversationally! (e.g., "Hello there! 👋 Great to meet you! How are you doing today? How can I assist you with Dennis's software & cloud engineering portfolio?").
   - Never respond to a casual greeting with a dry, static wall of bullet points. Be engaging, polite, human-like, and conversational.
2. ANSWERING QUESTIONS AS ASKED:
   - Always answer the user's specific question directly, accurately, and thoroughly.
   - If they ask about Dennis's cloud skills, DevOps, Docker, Kubernetes, GCP, or AWS, give clear, technical answers with specifics.
   - If they ask about his programming languages (Python, TypeScript, Go, Java, C++, SQL), explain his expertise, frameworks (FastAPI, Django, React, Node.js, Gin), and projects.
   - If they ask general programming, cloud, or computer science questions (e.g., "What is Kubernetes?", "How do I deploy on Cloud Run?", "What is CI/CD?"), answer authoritatively and connect it back to how Dennis applies these technologies in his projects.
   - If they ask about Dennis's university, coursework, or leadership, highlight his role as DSC Tech Lead & Peer Mentor at Masinde Muliro University of Science and Technology (MMUST).
   - If they ask about hiring, internships, or contact info, enthusiastically share his career goals and contact details (email: dennisdeyaopiyo@gmail.com, Kakamega/Nairobi, Kenya).
3. MULTI-TURN CONTEXT:
   - Maintain context across previous turns in the conversation.
   - Use clean Markdown with bold text, bullet points, or code snippets when helpful. Keep responses concise, helpful, and natural.

Dennis's Core Profile & Tech Stack:
- Institution: Masinde Muliro University of Science and Technology (MMUST), Kakamega, Kenya.
- Degree: Bachelor of Science in Computer Science / Information Technology (Class of 2026/2027).
- Contact: dennisdeyaopiyo@gmail.com | Masinde Muliro University, Kakamega, Kenya.
- Languages: Python (FastAPI, Django, Pandas, Asyncio), TypeScript/JavaScript (React, Node.js, Express), Go/Golang (Gin, Microservices), Java (Spring Boot), C/C++, SQL (PostgreSQL, MySQL).
- Cloud & Infrastructure: Google Cloud Platform (Cloud Run, Cloud Storage, Compute Engine, Artifact Registry), Amazon Web Services (EC2, S3, Lambda, CloudWatch), Docker & Docker Compose, Kubernetes, Terraform (IaC), GitHub Actions CI/CD pipelines, Linux Administration, Redis, Nginx.
- Featured Projects:
  1. MMUST Campus Cloud Sync & Resource Portal: Cloud-native campus document sharing and microservices API (Go, Docker, GCP Cloud Run, React).
  2. Multi-Cloud Infrastructure Provisioner: Automated CLI provisioner for AWS S3/EC2 & GCP Storage/VMs (Python CLI + Terraform).
  3. Real-Time Distributed Task Queue & Monitoring Dashboard: High-throughput async worker pool (TypeScript, Node.js, Redis, Docker).
  4. Agribusiness Market Intelligence & IoT Tracker: Yield telemetry & regional crop market analytics (Python, Django REST, PostgreSQL).
- Campus Leadership: Tech Lead & Peer Mentor at MMUST Developer Student Club, organizing Cloud Computing & Linux workshops.`;

      // Build prompt with context
      const formattedHistory = Array.isArray(conversationHistory)
        ? conversationHistory
            .slice(-6)
            .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "Visitor" : "Assistant"}: ${h.text}`)
            .join("\n")
        : "";

      const prompt = `${formattedHistory ? "Previous Conversation Context:\n" + formattedHistory + "\n\n" : ""}Visitor Query: ${message}`;

      // Candidate models in order of priority (using modern valid Gemini model names)
      const candidateModels = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
      
      let reply: string | null = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          if (response && response.text) {
            reply = response.text;
            break;
          }
        } catch (err: any) {
          // Log only brief info without noisy stack traces
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
          fallback: true,
        });
      }

      return res.json({ reply });
    } catch (error: any) {
      return res.json({
        reply: null,
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
