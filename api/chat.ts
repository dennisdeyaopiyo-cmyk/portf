import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// 1. Force Vercel to treat this route as dynamically executed on every request (no caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PORTFOLIO_SYSTEM_INSTRUCTION = `You are the official AI Portfolio Assistant representing Dennis Opiyo, a Software & Cloud Engineering Student, Full-Stack Developer, and MMUST DSC Tech Lead. Your purpose is to interact with recruiters, developers, and visitors, giving concise, professional, and engaging information about Dennis.

<context>
- FULL NAME: Dennis Opiyo (Dennis Deya Opiyo)
- CURRENT ROLE / STATUS: Software & Cloud Engineering Student (BSc Computer Science / IT) | Tech Lead & Peer Mentor at Masinde Muliro University of Science and Technology (MMUST) Developer Student Club
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

export default async function handler(req: any, res: any) {
  // Disable Vercel / browser / CDN caching completely
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, conversationHistory } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply: "Thanks for asking! I'm Dennis's AI assistant. (GEMINI_API_KEY is not configured yet in Vercel Environment Variables).",
        text: "Thanks for asking! I'm Dennis's AI assistant. (GEMINI_API_KEY is not configured yet in Vercel Environment Variables).",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const formattedHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .slice(-6)
          .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Visitor' : 'Assistant'}: ${h.text}`)
          .join('\n')
      : '';

    const prompt = `${formattedHistory ? 'Previous Conversation Context:\n' + formattedHistory + '\n\n' : ''}Visitor Query: ${message}`;

    const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let replyText: string | null = null;

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
          replyText = response.text;
          break;
        }
      } catch (e) {
        // Continue to fallback candidate
      }
    }

    if (!replyText) {
      return res.status(200).json({
        reply: null,
        text: null,
        fallback: true,
      });
    }

    return res.status(200).json({
      reply: replyText,
      text: replyText,
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
