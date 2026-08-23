import React from "react";

const cls = {
  Low: "badge-low",
  Medium: "badge-medium",
  High: "badge-high",
  Critical: "badge-critical",
};

const dot = {
  Low: "bg-emerald-500",
  Medium: "bg-amber-500",
  High: "bg-orange-500",
  Critical: "bg-red-500",
};

export default function RiskBadge({ severity, size = "md" }) {
  return (
    <span className={`badge ${cls[severity] || "badge-medium"} ${size === "sm" ? "text-[10px] px-2 py-0.5" : ""}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[severity] || "bg-ink-400"}`} />
      {severity}
    </span>
  );
}
