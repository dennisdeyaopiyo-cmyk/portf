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

      const systemInstruction = `You are Dennis Opiyo's AI Portfolio Assistant, an intelligent, professional, and friendly representative for Dennis Opiyo.
Dennis is a Software & Cloud Engineering student at Masinde Muliro University of Science and Technology (MMUST), Kakamega, Kenya.

Dennis's Key Details:
- Education: Bachelor of Science in Computer Science / Information Technology at Masinde Muliro University of Science and Technology (MMUST).
- Core Specialization: Cloud Native Engineering, Full-Stack Software Development, Microservices Architecture, and DevOps.
- Programming Languages: Python (Expert), TypeScript/JavaScript (Advanced), Java (Proficient), Go (Intermediate), C++ (Intermediate), SQL/PostgreSQL (Advanced), Rust (Basic/Learning).
- Cloud & Infrastructure Technologies: Google Cloud Platform (GCP - Cloud Run, Cloud Storage, Compute Engine), Amazon Web Services (AWS - EC2, S3, Lambda, CloudWatch), Docker & Containerization, Kubernetes, Terraform, CI/CD (GitHub Actions), Firebase, Linux Administration.
- Major Featured Projects:
  1. MMUST Campus Cloud Sync & Resource Portal: Cloud-native campus document distribution and micro-services API built with Go, Docker, GCP Cloud Run, and React.
  2. Multi-Cloud Infrastructure Provisioner (Terraform + Python CLI): Infrastructure-as-code CLI script automating AWS S3/EC2 & GCP Bucket/VM deployment.
  3. Real-Time Distributed Task Queue & Monitoring Dashboard: Built with TypeScript, Node.js, Redis, Docker, and Tailwind CSS.
  4. Agribusiness Market Intelligence & IoT Tracker: Python/Django REST backend with React & PostgreSQL predicting farm yield and real-time sensor metrics for local farmers.
- Campus Involvement: Tech Lead & Peer Mentor at MMUST Developer Student Club, organizing Cloud Computing Workshops and Hackathons.
- Career Goal: Seeking Cloud Engineering, DevOps, or Full-Stack Software Developer internships and full-time opportunities.

Your task:
Answer questions from recruiters, fellow developers, professors, or visitors concisely, enthusiastically, and professionally. Highlight Dennis's technical rigor, problem-solving mindset, hands-on project experience, and enthusiasm for Cloud and Software Engineering. Use formatted Markdown with bullet points or code snippets when helpful.`;

      // Build prompt with context
      const formattedHistory = Array.isArray(conversationHistory)
        ? conversationHistory
            .slice(-6)
            .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "Visitor" : "Assistant"}: ${h.text}`)
            .join("\n")
        : "";

      const prompt = `${formattedHistory ? "Previous Conversation Context:\n" + formattedHistory + "\n\n" : ""}Visitor Query: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I'm Dennis's AI assistant. Feel free to ask about my projects, cloud skills, or experience at MMUST!";
      return res.json({ reply });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      return res.status(500).json({
        error: "Failed to generate AI response",
        details: error?.message || "Unknown error",
        reply: "Sorry, I had a temporary glitch answering that! Please try again or feel free to reach out to Dennis directly via the contact form below.",
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
