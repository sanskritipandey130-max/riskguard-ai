import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Activity,
  Brain,
  Target,
  Zap,
  DollarSign,
  Users,
  Lock,
  TrendingDown,
  Package,
  Calendar,
  ScrollText,
  Gauge,
} from "lucide-react";
import { useProject } from "../context/ProjectContext.jsx";

const steps = [
  { icon: Activity, title: "Monitor", desc: "Track business signals: financial, operational, customer, security, and market data." },
  { icon: Brain, title: "Detect & Analyze", desc: "A hybrid rules engine + AI layer identifies risks and explains exactly why they exist." },
  { icon: Target, title: "Prioritize", desc: "Risks are scored (Probability x Impact) and ranked so you know what matters most." },
  { icon: Zap, title: "Act", desc: "Get concrete mitigation actions and a 30-day plan — then monitor again." },
];

const categories = [
  { icon: DollarSign, label: "Financial Risk" },
  { icon: Activity, label: "Operational Risk" },
  { icon: TrendingDown, label: "Market Risk" },
  { icon: Lock, label: "Cybersecurity Risk" },
  { icon: ScrollText, label: "Compliance Risk" },
  { icon: Users, label: "Customer Risk" },
  { icon: Package, label: "Supply Chain Risk" },
  { icon: Calendar, label: "Project/Deadline Risk" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { loadDemo, loading } = useProject();

  const handleDemo = async () => {
    await loadDemo();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-600 text-white">
              <ShieldCheck size={18} />
            </div>
            <span className="font-bold text-ink-900">RiskGuard AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-ghost" onClick={handleDemo}>
              View Demo
            </button>
            <button className="btn-primary" onClick={() => navigate("/assessment")}>
              Start Risk Assessment
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="badge badge-medium mb-6">AI Risk Manager · Buildathon 2026</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-ink-900 leading-tight tracking-tight mb-5">
          Know Your Risks Before <br className="hidden sm:block" /> They Become Problems.
        </h1>
        <p className="text-lg text-ink-500 max-w-2xl mx-auto mb-8">
          RiskGuard AI uses intelligent risk analysis and autonomous AI agents to identify,
          prioritize and mitigate business risks before they impact your growth.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button className="btn-primary text-base px-6 py-3" onClick={() => navigate("/assessment")}>
            Start Risk Assessment <ArrowRight size={18} />
          </button>
          <button className="btn-secondary text-base px-6 py-3" disabled={loading} onClick={handleDemo}>
            {loading ? "Loading..." : "View Demo"}
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink-100">
        <h2 className="text-2xl font-bold text-ink-900 text-center mb-2">How It Works</h2>
        <p className="text-ink-500 text-center mb-10">Monitor → Detect → Analyze → Prioritize → Recommend → Act → Monitor again</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="card p-5">
              <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <s.icon size={18} />
              </div>
              <h3 className="font-semibold text-ink-900 mb-1.5">{s.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Risk Agent */}
      <section className="bg-ink-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge bg-brand-500/10 text-brand-300 border border-brand-500/30 mb-4">
              Core Differentiator
            </span>
            <h2 className="text-2xl font-bold mb-3">A Continuously Monitoring AI Risk Agent</h2>
            <p className="text-ink-300 leading-relaxed mb-4">
              Not a chatbot bolted onto a dashboard. The RiskGuard AI Agent is grounded in your
              actual business data — it explains why a risk was detected, cites real numbers,
              and tells you exactly what to fix first.
            </p>
            <ul className="space-y-2 text-sm text-ink-300">
              <li>• "What are my biggest risks?"</li>
              <li>• "Why is my financial risk high?"</li>
              <li>• "Give me a 30-day risk reduction plan."</li>
            </ul>
          </div>
          <div className="card bg-ink-900 border-ink-800 p-5 text-sm">
            <p className="text-ink-400 text-xs uppercase font-semibold mb-3">Agent detected</p>
            <p className="font-bold text-red-400 mb-1">Cash Flow Risk — CRITICAL</p>
            <p className="text-ink-300 mb-3">
              Expenses are growing 18% while revenue grows 5%, reducing operating margin.
            </p>
            <p className="text-ink-400 text-xs uppercase font-semibold mb-2">Recommended</p>
            <p className="text-ink-300">1. Review top recurring expenses · 2. Improve collection cycle</p>
          </div>
        </div>
      </section>

      {/* Risk categories */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-ink-900 text-center mb-10">Risk Categories We Cover</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c, i) => (
            <div key={i} className="card p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-ink-50 text-ink-700 flex items-center justify-center shrink-0">
                <c.icon size={16} />
              </div>
              <span className="text-sm font-semibold text-ink-800">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Demo stats */}
      <section className="bg-ink-50 border-y border-ink-100 py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { v: "8", l: "Risk categories" },
            { v: "1-25", l: "Transparent scoring range" },
            { v: "<30s", l: "To full risk analysis" },
            { v: "30-day", l: "Auto-generated plans" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-extrabold text-brand-600">{s.v}</p>
              <p className="text-sm text-ink-500 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why RiskGuard */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <Gauge className="mx-auto text-brand-600 mb-4" size={32} />
        <h2 className="text-2xl font-bold text-ink-900 mb-3">Why RiskGuard AI</h2>
        <p className="text-ink-500 max-w-2xl mx-auto leading-relaxed">
          RiskGuard AI doesn't just tell you what risks exist. It detects risks from real business
          signals, explains why they matter, predicts their impact, prioritizes them, and creates
          actionable mitigation plans through an autonomous AI agent — grounded in your data, not
          generic advice.
        </p>
      </section>

      <footer className="border-t border-ink-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-600" />
            <span className="font-semibold text-ink-800 text-sm">RiskGuard AI</span>
          </div>
          <p className="text-xs text-ink-400 text-center">
            RiskGuard AI provides AI-generated risk insights for decision support and does not
            replace professional financial, legal, compliance, or cybersecurity advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
