import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, ShieldAlert, ListChecks, Radar } from "lucide-react";
import Layout from "../components/Layout.jsx";
import RequireProject from "../components/RequireProject.jsx";
import RiskBadge from "../components/RiskBadge.jsx";
import { useProject } from "../context/ProjectContext.jsx";
import { api } from "../services/api.js";

function Gauge({ score }) {
  const pct = (score / 25) * 100;
  const color = score >= 16 ? "#dc2626" : score >= 11 ? "#ea580c" : score >= 6 ? "#d97706" : "#16a34a";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#eef0f4" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-ink-900">{score}</span>
        <span className="text-[10px] text-ink-400 font-semibold">/ 25</span>
      </div>
    </div>
  );
}

export default function RiskDetails() {
  return (
    <RequireProject>
      <RiskDetailsInner />
    </RequireProject>
  );
}

function RiskDetailsInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { risks, project } = useProject();
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    const local = risks.find((r) => r._id === id);
    if (local) {
      setRisk(local);
    } else {
      api.getRisk(id).then((d) => setRisk(d.risk)).catch(() => {});
    }
  }, [id, risks]);

  if (!risk) {
    return (
      <Layout>
        <div className="p-8">Loading risk details...</div>
      </Layout>
    );
  }

  const related = risks.filter((r) => r._id !== risk._id && r.category === risk.category).slice(0, 3);

  const createActionPlan = async () => {
    await Promise.all(
      (risk.recommendations || []).slice(0, 3).map((rec) =>
        api.createAction({
          projectId: project._id,
          riskId: risk._id,
          relatedRiskName: risk.name,
          title: rec,
          description: `Action plan item for "${risk.name}"`,
          priority: risk.severity,
          dueInDays: 7,
          status: "Pending",
        })
      )
    );
    navigate("/actions");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-8">
        <button className="btn-ghost mb-4 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="card p-6 mb-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">{risk.category}</p>
              <h1 className="text-2xl font-bold text-ink-900 mb-2">{risk.name}</h1>
              <div className="flex items-center gap-3">
                <RiskBadge severity={risk.severity} />
                <span className="text-sm text-ink-500">Status: {risk.status}</span>
              </div>
            </div>
            <Gauge score={risk.score} />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="p-3 rounded-xl bg-ink-50 text-center">
              <p className="text-xs text-ink-500 font-semibold">Probability</p>
              <p className="text-lg font-bold text-ink-900">{risk.probabilityPercent}%</p>
            </div>
            <div className="p-3 rounded-xl bg-ink-50 text-center">
              <p className="text-xs text-ink-500 font-semibold">Impact</p>
              <p className="text-lg font-bold text-ink-900">{risk.impact}/5</p>
            </div>
            <div className="p-3 rounded-xl bg-ink-50 text-center">
              <p className="text-xs text-ink-500 font-semibold">Risk Score</p>
              <p className="text-lg font-bold text-ink-900">{risk.score}/25</p>
            </div>
          </div>
          <p className="text-xs text-ink-400 mt-3 text-center">
            Risk Score = Probability ({risk.probability}/5) × Impact ({risk.impact}/5) = {risk.score}/25 → {risk.severity}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="card p-5">
            <p className="font-semibold text-ink-800 mb-2 flex items-center gap-2 text-sm">
              <AlertCircle size={15} className="text-brand-600" /> Why was this detected?
            </p>
            <p className="text-sm text-ink-600 leading-relaxed">{risk.explanation}</p>
          </div>

          <div className="card p-5">
            <p className="font-semibold text-ink-800 mb-2 flex items-center gap-2 text-sm">
              <Radar size={15} className="text-brand-600" /> Early Warning Signs
            </p>
            <ul className="space-y-1.5">
              {(risk.earlyWarnings || []).map((w, i) => (
                <li key={i} className="text-sm text-ink-600 flex gap-2">
                  <span className="text-brand-500">•</span> {w}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5 md:col-span-2">
            <p className="font-semibold text-ink-800 mb-3 flex items-center gap-2 text-sm">
              <ListChecks size={15} className="text-brand-600" /> Recommended Mitigation
            </p>
            <ol className="space-y-2 mb-4">
              {(risk.recommendations || []).map((r, i) => (
                <li key={i} className="text-sm text-ink-700 flex gap-2">
                  <span className="font-bold text-brand-600">{i + 1}.</span> {r}
                </li>
              ))}
            </ol>
            <button className="btn-primary" onClick={createActionPlan}>
              Create Action Plan
            </button>
          </div>

          {related.length > 0 && (
            <div className="card p-5 md:col-span-2">
              <p className="font-semibold text-ink-800 mb-3 flex items-center gap-2 text-sm">
                <ShieldAlert size={15} className="text-brand-600" /> Related Risks
              </p>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <button
                    key={r._id}
                    onClick={() => navigate(`/risks/${r._id}`)}
                    className="px-3 py-2 rounded-xl border border-ink-200 text-sm font-medium text-ink-700 hover:bg-ink-50 flex items-center gap-2"
                  >
                    {r.name} <RiskBadge severity={r.severity} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
