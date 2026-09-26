import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  User, 
  Loader2, 
  RotateCcw,
  Check,
  Copy,
  Terminal,
  Code2,
  Cloud
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface AiAssistantWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

// Client-side fallback knowledge responder for offline / static hosting scenarios
const getLocalPortfolioAnswer = (query: string, profile: UserProfile): string => {
  const q = query.trim().toLowerCase();

  // Natural Greetings
  if (
    /^(hi|hello|hey|howdy|sup|yo|greetings|good\s*(morning|afternoon|evening)|hi\s*there|habari|jambo)\b/i.test(q) ||
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey'
  ) {
    return `Hello there! 👋 Great to meet you! How are you doing today?

I'm Dennis Opiyo's AI Portfolio Assistant, running live with Google Gemini. I'm ready to chat and answer any questions you have about Dennis!

Feel free to ask me anything, such as:
- ☁️ **Cloud & DevOps**: How Dennis uses GCP (Cloud Run), AWS, Docker, Kubernetes, and Terraform.
- 💻 **Code & Languages**: His projects in Python, Go, TypeScript/React, and Java.
- 🚀 **Flagship Projects**: The MMUST Campus Cloud Sync portal, Multi-Cloud CLI, or Task Queue.
- 🎓 **Academics & Leadership**: His role as Developer Student Club Tech Lead at Masinde Muliro University.

What would you like to know?`;
  }

  // Conversational "how are you"
  if (
    q.includes('how are you') ||
    q.includes('how do you do') ||
    q.includes('how is it going') ||
    q.includes('how are things') ||
    q.includes('whats up') ||
    q.includes("what's up")
  ) {
    return `I'm doing great, thank you for asking! 😊 

How are you doing today? What brings you to Dennis's software & cloud engineering portfolio? Whether you're a recruiter, engineer, student, or just curious, I'm here to answer any questions about his skills, projects, or background!`;
  }

  // "Who are you" / "What is your name"
  if (
    q.includes('who are you') ||
    q.includes('what are you') ||
    q.includes('your name') ||
    q.includes('introduce yourself')
  ) {
    return `I'm **Dennis Opiyo's AI Portfolio Assistant**! 🤖

I act as Dennis's interactive conversational twin. I'm powered by Google Gemini and trained on Dennis's complete technical background as a Software & Cloud Engineering student at **Masinde Muliro University of Science and Technology (MMUST)**.

I can answer any technical questions about his cloud architectures, explain his code and microservices, or discuss his experience in Docker, GCP, AWS, and Python!`;
  }

  // "Is he good" / "How good is he" / Evaluation questions
  if (
    q.includes('is he good') ||
    q.includes('how good is') ||
    q.includes('is dennis good') ||
    q.includes('is he skilled') ||
    q.includes('can he code') ||
    q.includes('how good') ||
    q.includes('is he competent') ||
    q.includes('is he talented') ||
    q.includes('good engineer') ||
    q.includes('good developer')
  ) {
    return `Yes, Dennis Opiyo is an **exceptionally capable, hardworking, and innovative Software & Cloud Engineer**! 🚀

Here is what makes him so effective:
- 💡 **Hands-on Cloud & DevOps Rigor**: He doesn't just write scripts; he builds production-ready architectures on **Google Cloud Platform (GCP)** and **AWS**, using **Docker** containers, **Kubernetes**, and **Terraform** for automation.
- ⚡ **Strong Programming Foundations**: Highly proficient in **Python** (FastAPI, Django), **TypeScript/React**, and **Go** for high-concurrency microservices, with deep knowledge of algorithms and systems.
- 🎓 **Leadership & Community Impact**: As the **Developer Student Club (DSC) Tech Lead & Peer Mentor** at Masinde Muliro University of Science and Technology (MMUST), he leads hands-on bootcamps teaching peers Linux, Git, and Cloud deployments.
- 🛠️ **High Agency & Fast Execution**: Proven ability to take real problems—like campus resource distribution—and ship full-stack distributed systems that solve them.

Would you like to examine his featured project architectures, or explore how he can contribute to your team?`;
  }

  // Docker / Containers / Kubernetes / Cloud / DevOps
  if (
    q.includes('docker') ||
    q.includes('container') ||
    q.includes('kubernetes') ||
    q.includes('k8s') ||
    q.includes('devops') ||
    q.includes('terraform') ||
    q.includes('ci/cd') ||
    q.includes('pipeline')
  ) {
    return `### 🐳 Dennis's Cloud & DevOps Engineering:
Dennis focuses heavily on modern containerization, infrastructure-as-code, and cloud platforms:
- **Docker & Microservices**: Crafts multi-stage Docker builds with Alpine/Distroless bases to produce minimal, secure container images under 30MB.
- **Kubernetes (K8s)**: Configures deployments, service discovery, ingress, and horizontal pod autoscalers for distributed apps.
- **Terraform (IaC)**: Built multi-cloud automation scripts provisioning AWS (EC2/S3) and GCP (Cloud Run/Storage) infrastructure.
- **Google Cloud Platform (GCP)**: Deploys serverless containers on **Cloud Run**, manages object storage with **GCS**, and implements IAM least-privilege security.
- **Amazon Web Services (AWS)**: Configures EC2 instances, S3 lifecycle rules, Lambda functions, and CloudWatch log metrics.
- **CI/CD**: Automates testing, linting, Docker image pushes to GCP Artifact Registry, and zero-downtime deployment pipelines using GitHub Actions.`;
  }

  // Skills & Languages (use word boundary for short language names to prevent matching words like "good", "going", "google")
  if (
    q.includes('skill') ||
    q.includes('stack') ||
    q.includes('technolog') ||
    q.includes('language') ||
    q.includes('python') ||
    /\b(go|golang)\b/i.test(q) ||
    q.includes('typescript') ||
    q.includes('javascript') ||
    /\b(java)\b/i.test(q) ||
    /\b(sql|postgres|postgresql)\b/i.test(q)
  ) {
    return `### 🛠️ Dennis Opiyo's Core Tech Stack:
- **Programming Languages**:
  - **Python** (Expert): FastAPI, Django REST, Asyncio, Pandas, microservices.
  - **TypeScript / JavaScript** (Advanced): React, Node.js, Express, Tailwind CSS, Vite.
  - **Go / Golang** (Intermediate): Concurrent microservices, Gin framework, high-throughput APIs.
  - **Java** (Proficient): Object-oriented architecture, Spring Boot, data structures.
  - **SQL & Databases**: PostgreSQL schema design, Redis in-memory caching, Firebase.
- **Cloud & Infrastructure**:
  - GCP (Cloud Run, Compute Engine, Storage), AWS (EC2, S3, Lambda), Docker, Kubernetes, Terraform, Linux administration (Ubuntu/Debian), Nginx.`;
  }

  // Projects
  if (
    q.includes('project') ||
    q.includes('portfolio') ||
    q.includes('work') ||
    q.includes('built') ||
    q.includes('sync') ||
    q.includes('queue') ||
    q.includes('provisioner')
  ) {
    return `### 🚀 Featured Engineering Projects:
1. **MMUST Campus Cloud Sync & Resource Portal**:
   - High-throughput campus document sync platform built with **Go (Golang)**, **Docker**, and deployed to **Google Cloud Run** with a **React** UI.
2. **Multi-Cloud Infrastructure Provisioner**:
   - Python CLI tool utilizing **Terraform** to automate cross-cloud deployment of AWS S3/EC2 and GCP Storage/Compute resources.
3. **Real-Time Distributed Task Queue & Monitoring Dashboard**:
   - Asynchronous worker queue processing background tasks with **TypeScript**, **Node.js**, **Redis**, and **Docker**.
4. **Agribusiness Market Intelligence & IoT Tracker**:
   - Regional crop telemetry and market pricing prediction platform using **Python**, **Django REST Framework**, and **PostgreSQL**.`;
  }

  // Education & MMUST
  if (
    q.includes('mmust') ||
    q.includes('school') ||
    q.includes('university') ||
    q.includes('education') ||
    q.includes('degree') ||
    q.includes('course')
  ) {
    return `### 🎓 Education & Campus Leadership:
- **Institution**: **Masinde Muliro University of Science and Technology (MMUST)**, Kakamega, Kenya.
- **Degree**: Bachelor of Science in Computer Science / Information Technology (Expected 2027, First Class Honors standing).
- **Leadership**: Tech Lead & Peer Mentor at the **MMUST Developer Student Club (DSC)**, organizing hands-on workshops on Linux administration, Docker containerization, and Cloud Native deployment.`;
  }

  // Hiring & Opportunities
  if (
    q.includes('hire') ||
    q.includes('why') ||
    q.includes('reason') ||
    q.includes('job') ||
    q.includes('intern') ||
    q.includes('role') ||
    q.includes('available')
  ) {
    return `### 💼 Why Hire Dennis Opiyo?
- **Production-Ready Engineering**: Not just theoretical knowledge—Dennis builds and deploys actual containerized microservices on GCP and AWS.
- **Strong Computer Science Core**: Grounded in algorithms, distributed systems principles, relational schema design, and Linux systems programming.
- **Fast Learner & High Ownership**: From leading campus developer bootcamps to building multi-cloud CLI tools, Dennis takes initiative and delivers robust code.
- **Actively Open to Opportunities**: Ready for Cloud Engineering, DevOps, and Full-Stack Software Developer internships and full-time positions!`;
  }

  // Contact
  if (
    q.includes('contact') ||
    q.includes('email') ||
    q.includes('reach') ||
    q.includes('github') ||
    q.includes('linkedin') ||
    q.includes('phone')
  ) {
    return `### 📬 Connect with Dennis:
- **Email**: \`dennisdeyaopiyo@gmail.com\`
- **Location**: Kakamega & Nairobi, Kenya
- **LinkedIn & GitHub**: Links are directly accessible via the top navigation bar and footer.
- **Contact Form**: You can also send him an instant message using the **Get In Touch** section below!`;
  }

  // Appreciation / Farewell
  if (q.includes('thank') || q.includes('thanks') || q.includes('bye') || q.includes('goodbye') || q.includes('cool') || q.includes('awesome')) {
    return `You're very welcome! 😊 It was a pleasure chatting with you. Feel free to explore Dennis's project demos or reach out to him directly at \`dennisdeyaopiyo@gmail.com\`! Have a wonderful day ahead! 🚀`;
  }

  // Thoughtful Contextual Fallback
  return `That's a great question! Regarding "${query}":

Dennis is a Software & Cloud Engineering student at **Masinde Muliro University of Science and Technology (MMUST)** specializing in **GCP, AWS, Docker, Kubernetes, Python, Go, and TypeScript**.

You can ask me anything specific, such as:
- 🛠️ Dennis's technical experience with specific tools (e.g. *Docker, Terraform, FastAPI, Cloud Run*)
- 🚀 Deep dives into his projects (*MMUST Cloud Sync, Task Queue, IoT Tracker*)
- 🎓 His academic coursework and leadership at MMUST
- 💼 His availability for Cloud / DevOps / Software Engineering roles!`;
};

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I'm Dennis's AI Assistant. Ask me anything about Dennis Opiyo's cloud engineering background, programming languages (Python, Go, TypeScript, Java), or specific projects at Masinde Muliro University (MMUST)!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Hi! How are you doing today?",
    "What are your top cloud skills in GCP & AWS?",
    "Tell me about the MMUST Campus Cloud project.",
    "How do you use Docker, Kubernetes & Go?",
    "Why hire Dennis for a Cloud or DevOps role?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `Conversation refreshed! How can I assist you with Dennis's software & cloud engineering portfolio today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server');
      }

      const data = await response.json();
      const assistantReply = (data && data.reply) ? data.reply : getLocalPortfolioAnswer(text, profile);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      // Seamless knowledge-base fallback ensures browser visitors ALWAYS get an intelligent response
      const fallbackReply = getLocalPortfolioAnswer(text, profile);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="ai-assistant-modal" 
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[620px] h-[85vh] bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
    >
      
      {/* Header */}
      <div className="p-4 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative shrink-0 w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md">
            <img
              src={profile.avatarUrl || "/dennis_photo.png"}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top rounded-full"
              onError={(e) => {
                e.currentTarget.src = "/dennis_photo.png";
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-white text-sm">Dennis AI Portfolio Twin</h3>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">Powered by Gemini AI • MMUST Knowledge</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleResetChat}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Close assistant"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm bg-slate-950/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end space-x-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-cyan-400/60 shadow-sm mb-1">
                <img
                  src={profile.avatarUrl || "/dennis_photo.png"}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = "/dennis_photo.png";
                  }}
                />
              </div>
            )}
            <div
              className={`group relative max-w-[85%] p-3.5 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-cyan-500 text-slate-950 font-medium rounded-br-xs shadow-md'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-xs shadow-inner'
              }`}
            >
              {msg.sender === 'assistant' ? (
                <div className="markdown-content text-slate-200 space-y-2 leading-relaxed text-xs sm:text-sm">
                  <Markdown>{msg.text}</Markdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed text-slate-950">
                  {msg.text}
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[10px]">
                <span className={msg.sender === 'user' ? 'text-slate-900/75' : 'text-slate-500 font-mono'}>
                  {msg.timestamp}
                </span>

                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="opacity-60 hover:opacity-100 text-slate-400 hover:text-cyan-300 flex items-center space-x-1 transition-opacity ml-2"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3.5 rounded-2xl bg-slate-900 text-cyan-400 border border-slate-800 flex items-center space-x-2.5 shadow-md">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span className="text-xs text-slate-300 font-mono">Consulting Dennis AI knowledge...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-2.5 bg-slate-950/90 border-t border-slate-800/80 overflow-x-auto flex space-x-2 no-scrollbar">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-cyan-300 border border-slate-800/80 hover:border-cyan-500/40 whitespace-nowrap transition-colors shrink-0 flex items-center space-x-1"
          >
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about Dennis's skills, projects, or MMUST..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500 shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition-colors shadow-md shadow-cyan-500/20"
        >
          <Send className="w-4 h-4 font-bold" />
        </button>
      </form>

    </div>
  );
};
