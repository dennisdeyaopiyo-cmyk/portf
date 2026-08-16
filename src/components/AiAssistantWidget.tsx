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
  const q = query.toLowerCase();

  if (q.includes('skill') || q.includes('stack') || q.includes('technolog') || q.includes('language') || q.includes('python') || q.includes('cloud')) {
    return `### 🛠️ Dennis Opiyo's Core Tech Stack:
- **Cloud & DevOps**: Google Cloud Platform (Cloud Run, GCS, IAM), AWS (EC2, S3, Lambda), Docker, Kubernetes, Terraform, GitHub Actions CI/CD.
- **Programming Languages**: **Python** (Expert in FastAPI/Django), **TypeScript/JavaScript** (React, Node.js), **Go** (Microservices), **Java** (Spring Boot), **SQL** (PostgreSQL/MySQL), and **C++**.
- **Databases & Systems**: PostgreSQL, Redis, Firebase, Linux (Ubuntu/Debian), Nginx.`;
  }

  if (q.includes('project') || q.includes('portfolio') || q.includes('work') || q.includes('built') || q.includes('sync')) {
    return `### 🚀 Featured Engineering Projects:
1. **MMUST Campus Cloud Sync & Resource Portal**: Cloud-native document sharing & indexing system using Go, Docker, GCP Cloud Run, and React.
2. **Multi-Cloud Infrastructure Provisioner**: CLI built in Python & Terraform automating AWS & GCP containerized clusters and storage buckets.
3. **Distributed Task Queue & Monitoring Dashboard**: High-throughput task scheduling engine with TypeScript, Node.js, Redis, and Docker.
4. **Agribusiness Market Intelligence & IoT Tracker**: Real-time sensor telemetry and yield prediction platform using Python, Django REST, and PostgreSQL.`;
  }

  if (q.includes('mmust') || q.includes('school') || q.includes('university') || q.includes('education') || q.includes('degree')) {
    return `### 🎓 Education & Campus Leadership:
- **University**: Masinde Muliro University of Science and Technology (**MMUST**), Kakamega, Kenya.
- **Degree**: Bachelor of Science in Computer Science / Information Technology (Class of 2026).
- **Leadership**: Active Peer Mentor & Tech Lead at the MMUST Developer Student Club, leading hands-on workshops on Docker, Linux, and Cloud Deployments.`;
  }

  if (q.includes('hire') || q.includes('why') || q.includes('reason') || q.includes('job') || q.includes('intern') || q.includes('role')) {
    return `### 💼 Why Hire Dennis?
- **Cloud-Native Practical Rigor**: Hands-on proficiency building production microservices on GCP and AWS with Docker and Terraform.
- **Strong Fundamentals**: Deep grounding in Computer Science, algorithms, relational schema design, and Linux systems.
- **High Agency & Fast Learner**: Proven record building end-to-end applications from scratch and mentoring peers at MMUST.
- **Open to Opportunities**: Actively seeking Cloud Engineer, DevOps, and Full-Stack Software Developer internships and entry-level positions!`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('github') || q.includes('linkedin') || q.includes('phone')) {
    return `### 📬 Contact Information:
- **Email**: \`dennisdeyaopiyo@gmail.com\`
- **Location**: Kakamega, Kenya (Masinde Muliro University)
- **Profiles**: Connect via GitHub or LinkedIn using the social links in the navigation bar or footer!
- Feel free to also send a direct message using the **Get In Touch** contact form on this page.`;
  }

  return `Dennis Opiyo is a Software & Cloud Engineering student at **Masinde Muliro University of Science and Technology (MMUST)** specializing in **GCP, AWS, Docker, Kubernetes, Python, Go, and TypeScript**.

You can ask me about:
- 🚀 **Projects**: MMUST Cloud Sync, Terraform Multi-Cloud CLI, Redis Task Queue.
- ☁️ **Cloud Skills**: Google Cloud Run, AWS S3/EC2, Kubernetes, CI/CD.
- 💻 **Languages**: Python, TypeScript, Go, Java, PostgreSQL.
- 🎓 **Education**: MMUST Computer Science coursework & leadership.`;
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
    "What are Dennis's top cloud skills in GCP & AWS?",
    "Tell me about Dennis's MMUST Campus Cloud project.",
    "Why hire Dennis for a Cloud or DevOps role?",
    "What programming languages does Dennis know?",
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      const assistantReply = data.reply || getLocalPortfolioAnswer(text, profile);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.warn('Backend /api/chat not reachable, falling back to built-in knowledge base:', error);
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
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-md">
            <Bot className="w-5 h-5 font-bold" />
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
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`group relative max-w-[88%] p-3.5 rounded-2xl ${
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
