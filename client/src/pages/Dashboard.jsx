import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import Layout from "../components/Layout.jsx";
import RequireProject from "../components/RequireProject.jsx";
import StatCard from "../components/StatCard.jsx";
import RiskMatrix from "../components/RiskMatrix.jsx";
import RiskBadge from "../components/RiskBadge.jsx";
import { useProject } from "../context/ProjectContext.jsx";

const SEVERITY_COLORS = { Critical: "#dc2626", High: "#ea580c", Medium: "#d97706", Low: "#16a34a" };

function alertIcon(sev) {
  if (sev === "Critical") return <AlertOctagon className="text-red-500" size={16} />;
  if (sev === "High") return <AlertTriangle className="text-orange-500" size={16} />;
  return <Info className="text-amber-500" size={16} />;
}

export default function Dashboard() {
  return (
    <RequireProject>
      <DashboardInner />
    </RequireProject>
  );
}

function DashboardInner() {
  const { project, risks, overallScore, aiAvailable } = useProject();
  const navigate = useNavigate();

  const counts = useMemo(() => {
    return {
      critical: risks.filter((r) => r.severity === "Critical").length,
      high: risks.filter((r) => r.severity === "High").length,
      medium: risks.filter((r) => r.severity === "Medium").length,
      low: risks.filter((r) => r.severity === "Low").length,
    };
  }, [risks]);

  const pieData = [
    { name: "Critical", value: counts.critical, color: SEVERITY_COLORS.Critical },
    { name: "High", value: counts.high, color: SEVERITY_COLORS.High },
    { name: "Medium", value: counts.medium, color: SEVERITY_COLORS.Medium },
    { name: "Low", value: counts.low, color: SEVERITY_COLORS.Low },
  ].filter((d) => d.value > 0);

  const categoryData = useMemo(() => {
    const map = {};
    risks.forEach((r) => {
      map[r.category] = (map[r.category] || 0) + r.score;
    });
    return Object.entries(map).map(([category, score]) => ({ category, score }));
  }, [risks]);

  const trendData = [
    { date: "Aug 15", score: Math.max(0, overallScore - 11) },
    { date: "Aug 18", score: Math.max(0, overallScore - 5) },
    { date: "Aug 21", score: overallScore },
  ];

  const status = overallScore >= 70 ? "CRITICAL" : overallScore >= 50 ? "HIGH" : overallScore >= 25 ? "MEDIUM" : "LOW";
  const statusColor = { CRITICAL: "text-red-600", HIGH: "text-orange-600", MEDIUM: "text-amber-600", LOW: "text-emerald-600" }[status];

  const alerts = risks.slice(0, 3);

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Good afternoon 👋</h1>
            <p className="text-ink-500 mt-1">
              Here's your current risk overview for <span className="font-semibold text-ink-700">{project.name}</span>.
            </p>
          </div>
          {!aiAvailable && (
            <span className="badge badge-medium">Demo/Fallback data — connect GEMINI_API_KEY for live AI</span>
          )}
        </div>

        {/* Overall score + status */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card p-6 lg:col-span-1 flex flex-col justify-between">
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-3">Overall Risk Score</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-extrabold text-ink-900">{overallScore}</span>
              <span className="text-ink-400 font-semibold mb-1.5">/ 100</span>
            </div>
            <p className={`text-sm font-bold ${statusColor}`}>Risk Status: {status}</p>
            <div className="w-full h-2 bg-ink-100 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${overallScore}%`,
                  background: overallScore >= 70 ? "#dc2626" : overallScore >= 50 ? "#ea580c" : overallScore >= 25 ? "#d97706" : "#16a34a",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            <StatCard label="Critical Risks" value={counts.critical} icon={AlertOctagon} tone="critical" />
            <StatCard label="High Risks" value={counts.high} icon={AlertTriangle} tone="high" />
            <StatCard label="Medium Risks" value={counts.medium} icon={Info} tone="medium" />
            <StatCard label="Low Risks" value={counts.low} icon={CheckCircle2} tone="low" />
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="font-semibold text-ink-800 mb-3 text-sm">Risk Distribution</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <p className="font-semibold text-ink-800 mb-3 text-sm">Risk Trend</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9aa3b5" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9aa3b5" domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#3d63f4" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <p className="font-semibold text-ink-800 mb-3 text-sm">Risk by Category (score)</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#9aa3b5" />
                <YAxis type="category" dataKey="category" width={80} tick={{ fontSize: 10 }} stroke="#9aa3b5" />
                <Tooltip />
                <Bar dataKey="score" fill="#3d63f4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Risk matrix */}
          <div className="card p-5 lg:col-span-1">
            <p className="font-semibold text-ink-800 mb-4 text-sm">Risk Matrix</p>
            <RiskMatrix risks={risks} />
          </div>

          {/* AI Agent alerts */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-ink-800 text-sm flex items-center gap-2">
                <ShieldAlert size={16} className="text-brand-600" /> AI Agent Alerts
              </p>
              <button className="btn-ghost text-xs" onClick={() => navigate("/agent")}>
                Open Agent <ArrowRight size={13} />
              </button>
            </div>
            <div className="space-y-3">
              {alerts.map((r) => (
                <div key={r._id} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-ink-50/60 border border-ink-100">
                  <div className="flex items-start gap-3">
                    {alertIcon(r.severity)}
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <RiskBadge severity={r.severity} size="sm" />
                        <span className="text-xs text-ink-400">{r.category}</span>
                      </div>
                      <p className="text-sm font-medium text-ink-800">{r.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="btn-ghost text-xs" onClick={() => navigate(`/risks/${r._id}`)}>
                      View Risk
                    </button>
                    <button className="btn-primary text-xs !px-3 !py-1.5" onClick={() => navigate("/actions")}>
                      Take Action
                    </button>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && <p className="text-sm text-ink-400">No active alerts.</p>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
