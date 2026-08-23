import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, Sparkles } from "lucide-react";
import Layout from "../components/Layout.jsx";
import RequireProject from "../components/RequireProject.jsx";
import { useProject } from "../context/ProjectContext.jsx";
import { api } from "../services/api.js";

const suggestions = [
  "What are my biggest risks?",
  "Why is my financial risk high?",
  "What should I fix first?",
  "What happens if I do nothing?",
  "Give me a 30-day risk reduction plan.",
  "Which risk can affect revenue the most?",
];

const timelineSeed = (risks) => {
  const base = [
    { time: "10:42 AM", text: "Financial and operational data analyzed" },
    { time: "10:43 AM", text: risks[0] ? `${risks[0].name} anomaly detected` : "Baseline scan complete" },
    { time: "10:43 AM", text: "Risk severity calculated across 8 categories" },
    { time: "10:44 AM", text: "Mitigation strategy generated" },
    { time: "10:44 AM", text: "Action plan created in Action Center" },
  ];
  return base;
};

export default function AIAgent() {
  return (
    <RequireProject>
      <AgentInner />
    </RequireProject>
  );
}

function AgentInner() {
  const { project, risks, aiAvailable } = useProject();
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: `Hi, I'm the RiskGuard AI Agent. I'm actively monitoring ${project.name}'s risk profile — currently ${risks.length} risk(s) detected. Ask me anything about them.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || sending) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setSending(true);
    try {
      const { answer } = await api.askAgent(project._id, question);
      setMessages((m) => [...m, { role: "agent", text: answer }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "agent", text: `Sorry, I hit an error: ${err.message}` }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-8 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col card overflow-hidden h-[calc(100vh-4rem)]">
          <div className="p-5 border-b border-ink-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-bold text-ink-900">RiskGuard AI Agent</p>
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active — Monitoring your business risks
                </p>
              </div>
            </div>
            {!aiAvailable && <span className="badge badge-medium text-[10px]">Fallback mode</span>}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-brand-600 text-white" : "bg-ink-50 text-ink-800 border border-ink-100"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-ink-50 border border-ink-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-brand-600" />
                  <span className="text-xs text-ink-500">Analyzing your risk data...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-ink-100">
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-ink-50 hover:bg-ink-100 text-ink-600 font-medium border border-ink-100">
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Ask about your risks..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button className="btn-primary !px-4" onClick={() => send()} disabled={sending}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="font-semibold text-ink-800 text-sm mb-4 flex items-center gap-2">
              <Sparkles size={15} className="text-brand-600" /> Agent Activity
            </p>
            <div className="space-y-4">
              {timelineSeed(risks).map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5" />
                    {i < 4 && <div className="w-px flex-1 bg-ink-100 my-1" />}
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-400 font-semibold">{t.time}</p>
                    <p className="text-sm text-ink-700">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="font-semibold text-ink-800 text-sm mb-3">Workflow</p>
            <div className="flex flex-col gap-1.5 text-xs font-medium text-ink-500">
              {["Monitor", "Detect", "Analyze", "Prioritize", "Recommend", "Act", "Monitor again"].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
