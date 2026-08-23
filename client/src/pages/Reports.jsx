import React, { useState } from "react";
import { FileText, Sparkles, Loader2, CheckSquare, Square, Printer } from "lucide-react";
import Layout from "../components/Layout.jsx";
import RequireProject from "../components/RequireProject.jsx";
import RiskBadge from "../components/RiskBadge.jsx";
import { useProject } from "../context/ProjectContext.jsx";
import { api } from "../services/api.js";

export default function Reports() {
  return (
    <RequireProject>
      <ReportsInner />
    </RequireProject>
  );
}

function ReportsInner() {
  const { project } = useProject();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState({});

  const generate = async () => {
    setLoading(true);
    try {
      const data = await api.generateReport(project._id);
      setReport(data);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key) => setChecked((c) => ({ ...c, [key]: !c[key] }));

  if (!report) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Reports</h1>
          <p className="text-ink-500 mb-8">Generate a professional AI risk report for {project.name}.</p>
          <div className="card p-10 text-center">
            <FileText className="mx-auto text-brand-600 mb-4" size={32} />
            <h3 className="font-bold text-ink-900 mb-2">AI Risk Report</h3>
            <p className="text-sm text-ink-500 max-w-sm mx-auto mb-6">
              Includes overall risk score, top 5 risks, critical risks, trend, and a full 30-day
              AI mitigation plan.
            </p>
            <button className="btn-primary text-base px-6 py-3" onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {loading ? "Generating..." : "Generate AI Risk Report"}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { plan } = report.mitigationPlan ? { plan: report.mitigationPlan } : { plan: null };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8 print:p-0">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">RiskGuard AI — Executive Report</h1>
            <p className="text-ink-500 text-sm">Generated {new Date(report.generatedAt).toLocaleString()}</p>
          </div>
          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>

        <div className="card p-6 mb-5">
          <p className="text-xs font-semibold text-ink-500 uppercase mb-2">Executive Summary</p>
          <p className="text-sm text-ink-700 leading-relaxed">{report.summary}</p>
          <div className="flex items-center gap-6 mt-4">
            <div>
              <p className="text-3xl font-extrabold text-ink-900">{report.overallScore}</p>
              <p className="text-xs text-ink-500">Overall Risk Score / 100</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-red-600">{report.criticalRisks.length}</p>
              <p className="text-xs text-ink-500">Critical Risks</p>
            </div>
          </div>
        </div>

        <div className="card p-6 mb-5">
          <p className="text-xs font-semibold text-ink-500 uppercase mb-3">Top 5 Risks</p>
          <div className="space-y-2">
            {report.topRisks.map((r) => (
              <div key={r._id} className="flex items-center justify-between border-b border-ink-100 pb-2 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-ink-800">{r.name}</p>
                  <p className="text-xs text-ink-500">{r.category} · Score {r.score}/25</p>
                </div>
                <RiskBadge severity={r.severity} />
              </div>
            ))}
          </div>
        </div>

        {plan && (
          <div className="card p-6 mb-5">
            <p className="text-xs font-semibold text-ink-500 uppercase mb-4">30-Day AI Mitigation Plan</p>
            <div className="space-y-5">
              {Object.entries(plan).map(([key, phase]) => (
                <div key={key}>
                  <p className="text-sm font-bold text-brand-700 mb-2">{phase.label}</p>
                  <div className="space-y-1.5">
                    {phase.days.map((d, i) => {
                      const itemKey = `${key}-${i}`;
                      return (
                        <button
                          key={itemKey}
                          onClick={() => toggle(itemKey)}
                          className="w-full flex items-start gap-2 text-left px-2 py-1.5 rounded-lg hover:bg-ink-50"
                        >
                          {checked[itemKey] ? (
                            <CheckSquare size={16} className="text-brand-600 mt-0.5 shrink-0" />
                          ) : (
                            <Square size={16} className="text-ink-300 mt-0.5 shrink-0" />
                          )}
                          <span className={`text-sm ${checked[itemKey] ? "line-through text-ink-400" : "text-ink-700"}`}>
                            <span className="font-semibold">Day {d.day}:</span> {d.task}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn-secondary print:hidden" onClick={() => setReport(null)}>
          Generate New Report
        </button>
      </div>
    </Layout>
  );
}
