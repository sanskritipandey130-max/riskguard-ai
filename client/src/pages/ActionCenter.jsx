import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, XCircle, ListTodo, PlayCircle } from "lucide-react";
import Layout from "../components/Layout.jsx";
import RequireProject from "../components/RequireProject.jsx";
import { useProject } from "../context/ProjectContext.jsx";
import { api } from "../services/api.js";

const priorityColor = {
  Critical: "badge-critical",
  High: "badge-high",
  Medium: "badge-medium",
  Low: "badge-low",
};

export default function ActionCenter() {
  return (
    <RequireProject>
      <ActionCenterInner />
    </RequireProject>
  );
}

function ActionCenterInner() {
  const { project, actions, refreshActions } = useProject();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    refreshActions(project._id);
  }, [project._id]);

  const updateStatus = async (id, status) => {
    await api.updateAction(id, { status });
    await refreshActions(project._id);
  };

  const stats = useMemo(
    () => ({
      total: actions.length,
      completed: actions.filter((a) => a.status === "Completed").length,
      inProgress: actions.filter((a) => a.status === "In Progress").length,
      overdue: actions.filter((a) => a.status !== "Completed" && a.dueInDays <= 3).length,
    }),
    [actions]
  );

  const filtered = filter === "All" ? actions : actions.filter((a) => a.status === filter);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-ink-900 mb-1">Action Center</h1>
        <p className="text-ink-500 mb-6">Manage mitigation actions recommended by RiskGuard AI.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Actions", value: stats.total, icon: ListTodo, tone: "brand" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, tone: "low" },
            { label: "In Progress", value: stats.inProgress, icon: PlayCircle, tone: "medium" },
            { label: "Overdue", value: stats.overdue, icon: Clock, tone: "critical" },
          ].map((s) => (
            <div key={s.label} className="card p-4">
              <div className="flex items-center gap-2 mb-2 text-ink-500">
                <s.icon size={15} />
                <span className="text-xs font-semibold uppercase">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-ink-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          {["All", "Pending", "In Progress", "Completed", "Dismissed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                filter === f ? "bg-brand-600 text-white border-brand-600" : "border-ink-200 text-ink-600 hover:bg-ink-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a._id} className="card p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge ${priorityColor[a.priority] || "badge-medium"} text-[10px]`}>{a.priority}</span>
                  {a.relatedRiskName && <span className="text-xs text-ink-400">Related: {a.relatedRiskName}</span>}
                </div>
                <p className="font-semibold text-ink-800 text-sm">{a.title}</p>
                <p className="text-xs text-ink-500 mt-0.5">Due in {a.dueInDays} days · Status: {a.status}</p>
              </div>
              <div className="flex gap-2">
                {a.status !== "In Progress" && a.status !== "Completed" && (
                  <button className="btn-secondary text-xs !px-3 !py-1.5" onClick={() => updateStatus(a._id, "In Progress")}>
                    Start
                  </button>
                )}
                {a.status !== "Completed" && (
                  <button className="btn-primary text-xs !px-3 !py-1.5" onClick={() => updateStatus(a._id, "Completed")}>
                    Complete
                  </button>
                )}
                {a.status !== "Dismissed" && a.status !== "Completed" && (
                  <button className="btn-ghost text-xs" onClick={() => updateStatus(a._id, "Dismissed")}>
                    <XCircle size={14} /> Dismiss
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-ink-400 text-center py-10">No actions in this view.</p>}
        </div>
      </div>
    </Layout>
  );
}
