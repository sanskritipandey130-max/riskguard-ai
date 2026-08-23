import React from "react";

export default function StatCard({ label, value, icon: Icon, tone = "default", sub }) {
  const toneMap = {
    default: "text-ink-900 bg-ink-50",
    critical: "text-red-600 bg-red-50",
    high: "text-orange-600 bg-orange-50",
    medium: "text-amber-600 bg-amber-50",
    low: "text-emerald-600 bg-emerald-50",
    brand: "text-brand-600 bg-brand-50",
  };
  return (
    <div className="card p-5 flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">{label}</p>
        <p className="text-2xl font-bold text-ink-900">{value}</p>
        {sub && <p className="text-xs text-ink-500 mt-1">{sub}</p>}
      </div>
      {Icon && (
        <div className={`p-2.5 rounded-xl ${toneMap[tone]}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}
