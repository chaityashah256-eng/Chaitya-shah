import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Server } from "lucide-react";
import Markdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
};

export default function AgentWidget({ currentContext, isOpen, setIsOpen, triggerMessage }: { currentContext?: string; isOpen: boolean; setIsOpen: (open: boolean) => void; triggerMessage?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hi! I'm the Reach AI Agent. I can help you find the right influencers, structure your outreach, or answer any questions about the platform. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggerMessage) {
      handleSendContent(triggerMessage);
    }
  }, [triggerMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendContent = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.map(m => ({ role: m.role, text: m.text })),
          context: currentContext
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate response.");
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "model", text: data.text }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "model", text: `Error: ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const sendText = input;
    setInput("");
    handleSendContent(sendText);
  };

  return (
    <>
      {/* Chat Window */}
      <div 
        className={`fixed top-24 right-6 w-[360px] h-[580px] max-h-[85vh] flex flex-col bg-[#0f0f13] border border-indigo-900/40 shadow-[-10px_0_40px_rgba(79,70,229,0.2)] rounded-3xl overflow-hidden transition-all duration-300 origin-top-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header - Glassmorphism */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 p-4 shrink-0 flex items-center justify-between text-white relative border-b border-indigo-500/20 shadow-sm overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-600/10 to-transparent"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="relative">
              <div className="bg-indigo-600/30 p-2 rounded-xl backdrop-blur-md border border-indigo-400/30">
                <Bot className="w-5 h-5 text-indigo-300 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#0f0f13] shadow-[0_0_5px_rgba(52,211,153,0.8)]"></div>
            </div>
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-100 flex items-center gap-1.5">
                Nebulla AI <Server className="w-3 h-3 text-indigo-400" />
              </h3>
              <p className="text-[9px] text-indigo-300 flex items-center font-mono">
                Gemini Node Active // Reach Platform
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors relative z-10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#000000] relative"
        >
          {/* subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>

          {messages.map((m) => (
            <div key={m.id} className={`flex w-full relative z-10 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2.5 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-1 border shadow-lg ${
                  m.role === 'user' 
                    ? 'bg-slate-900 border-slate-700 text-slate-300' 
                    : 'bg-indigo-950/60 border-indigo-900/40 text-indigo-300 backdrop-blur-md'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`px-4 py-3 text-xs leading-relaxed shadow-xl ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-slate-50 rounded-2xl rounded-tr-sm border border-indigo-500/50 whitespace-pre-wrap' 
                    : 'bg-[#141419] text-slate-300 rounded-2xl rounded-tl-sm border border-slate-800/80 font-sans'
                }`}>
                  {m.role === 'user' ? (
                    m.text
                  ) : (
                    <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-indigo-500/30 prose-a:text-indigo-400 marker:text-indigo-500 max-w-none text-xs">
                      <Markdown>{m.text}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex w-full justify-start relative z-10">
              <div className="flex gap-2.5 max-w-[85%] flex-row">
                <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-1 bg-indigo-950/60 border-indigo-900/40 text-indigo-300 backdrop-blur-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#141419] border border-indigo-500/30 rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span className="text-[10px] text-indigo-300/80 font-bold uppercase tracking-widest font-mono">Synthesizing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form 
          onSubmit={handleSend}
          className="p-3 bg-[#0a0a0d] border-t border-indigo-900/50 shrink-0 relative z-20"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query Gemini AI Cloud..."
              disabled={isLoading}
              className="w-full bg-[#13131a] border border-indigo-500/20 rounded-2xl pl-4 pr-12 py-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-400 focus:bg-indigo-950/20 focus:ring-1 focus:ring-indigo-400 transition-all font-mono"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bg-indigo-600/80 text-white p-2 rounded-xl hover:bg-indigo-500 border border-indigo-400/50 disabled:opacity-30 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2.5">
            <span className="text-[9px] font-mono text-indigo-500/60 font-semibold tracking-widest uppercase flex items-center justify-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Powered by Gemini Cloud
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
