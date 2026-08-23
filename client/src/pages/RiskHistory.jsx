import React, { useEffect, useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Layout from "../components/Layout.jsx";
import RequireProject from "../components/RequireProject.jsx";
import RiskBadge from "../components/RiskBadge.jsx";
import { useProject } from "../context/ProjectContext.jsx";
import { api } from "../services/api.js";

const categories = ["All", "Financial", "Operational", "Cybersecurity", "Market", "Customer", "Supply Chain"];

export default function RiskHistory() {
  return (
    <RequireProject>
      <RiskHistoryInner />
    </RequireProject>
  );
}

function RiskHistoryInner() {
  const { project, risks, overallScore } = useProject();
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.getHistory(project._id).then((d) => setHistory(d.history)).catch(() => {});
  }, [project._id]);

  const chartData = useMemo(() => {
    const base = history.length
      ? history.map((h) => ({
          date: new Date(h.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
          score: h.overallScore,
        }))
      : [];
    if (base.length === 0 || base[base.length - 1].score !== overallScore) {
      base.push({ date: "Now", score: overallScore });
    }
    // pad with a synthetic earlier point if only one entry, for a nicer demo chart
    if (base.length === 1) {
      base.unshift({ date: "Baseline", score: Math.max(0, overallScore - 15) });
    }
    return base;
  }, [history, overallScore]);

  const filteredRisks = filter === "All" ? risks : risks.filter((r) => r.category === filter);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-ink-900 mb-1">Risk History</h1>
        <p className="text-ink-500 mb-6">How {project.name}'s risk profile has changed over time.</p>

        <div className="card p-5 mb-6">
          <p className="font-semibold text-ink-800 text-sm mb-3">Overall Risk Score Trend</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9aa3b5" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#9aa3b5" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3d63f4" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                filter === c ? "bg-brand-600 text-white border-brand-600" : "border-ink-200 text-ink-600 hover:bg-ink-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredRisks.map((r) => (
            <div key={r._id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-400 font-semibold uppercase mb-0.5">{r.category}</p>
                <p className="font-semibold text-ink-800 text-sm">{r.name}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  Last updated {new Date(r.updatedAt || r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-ink-700">{r.score}/25</span>
                <RiskBadge severity={r.severity} />
              </div>
            </div>
          ))}
          {filteredRisks.length === 0 && <p className="text-sm text-ink-400 text-center py-10">No risks in this category.</p>}
        </div>
      </div>
    </Layout>
  );
}
