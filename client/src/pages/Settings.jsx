import React from "react";
import { ShieldCheck, KeyRound, Database, Bot } from "lucide-react";
import Layout from "../components/Layout.jsx";
import { useProject } from "../context/ProjectContext.jsx";

export default function Settings() {
  const { project, aiAvailable } = useProject();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-ink-900 mb-1">Settings</h1>
        <p className="text-ink-500 mb-6">System status and configuration for RiskGuard AI.</p>

        <div className="card p-5 mb-4">
          <p className="font-semibold text-ink-800 text-sm mb-4 flex items-center gap-2">
            <Bot size={16} className="text-brand-600" /> AI Configuration
          </p>
          <div className="flex items-center justify-between py-2 border-b border-ink-100">
            <span className="text-sm text-ink-600">Gemini API connection</span>
            <span className={`badge ${aiAvailable ? "badge-low" : "badge-medium"}`}>
              {aiAvailable ? "Connected" : "Using deterministic fallback"}
            </span>
          </div>
          <p className="text-xs text-ink-500 mt-3">
            Set <code className="bg-ink-100 px-1.5 py-0.5 rounded">GEMINI_API_KEY</code> in the
            server's <code className="bg-ink-100 px-1.5 py-0.5 rounded">.env</code> file to enable
            live AI explanations, the conversational agent, and simulation narratives. Without it,
            RiskGuard AI runs entirely on its deterministic rules engine so the app never breaks.
          </p>
        </div>

        <div className="card p-5 mb-4">
          <p className="font-semibold text-ink-800 text-sm mb-4 flex items-center gap-2">
            <Database size={16} className="text-brand-600" /> Active Project
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-ink-400 text-xs">Name</p>
              <p className="font-medium text-ink-800">{project?.name || "—"}</p>
            </div>
            <div>
              <p className="text-ink-400 text-xs">Industry</p>
              <p className="font-medium text-ink-800">{project?.industry || "—"}</p>
            </div>
            <div>
              <p className="text-ink-400 text-xs">Data source</p>
              <p className="font-medium text-ink-800">{project?.isDemo ? "Demo dataset (NovaCart)" : "User-submitted assessment"}</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="font-semibold text-ink-800 text-sm mb-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-600" /> Disclaimer
          </p>
          <p className="text-xs text-ink-500 leading-relaxed">
            RiskGuard AI provides AI-generated risk insights for decision support and does not
            replace professional financial, legal, compliance, or cybersecurity advice.
          </p>
        </div>
      </div>
    </Layout>
  );
}
