import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import RiskBadge from "./RiskBadge.jsx";

export default function RiskCard({ risk }) {
  const navigate = useNavigate();
  return (
    <div className="card p-5 hover:shadow-elevated transition cursor-pointer" onClick={() => navigate(`/risks/${risk._id}`)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wide mb-1">{risk.category}</p>
          <h3 className="font-bold text-ink-900 leading-snug">{risk.name}</h3>
        </div>
        <RiskBadge severity={risk.severity} />
      </div>
      <p className="text-sm text-ink-600 line-clamp-2 mb-4">{risk.explanation}</p>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-ink-500">
          <span className="flex items-center gap-1">
            <TrendingUp size={13} /> {risk.probabilityPercent}% probability
          </span>
          <span>Score {risk.score}/25</span>
        </div>
        <span className="flex items-center gap-1 text-brand-600 font-semibold">
          Details <ArrowUpRight size={14} />
        </span>
      </div>
    </div>
  );
}
