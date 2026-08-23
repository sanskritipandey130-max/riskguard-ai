import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Bot,
  ListChecks,
  History,
  FileText,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/assessment", label: "Risk Assessment", icon: ClipboardList },
  { to: "/agent", label: "AI Risk Agent", icon: Bot },
  { to: "/simulator", label: "What-If Simulator", icon: SlidersHorizontal },
  { to: "/actions", label: "Action Center", icon: ListChecks },
  { to: "/history", label: "Risk History", icon: History },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-ink-100 bg-white flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-ink-100">
        <div className="p-1.5 rounded-lg bg-brand-600 text-white">
          <ShieldCheck size={18} />
        </div>
        <div>
          <p className="font-bold text-ink-900 leading-none text-sm">RiskGuard AI</p>
          <p className="text-[10px] text-ink-400 mt-0.5">Risk Intelligence Platform</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-ink-100">
        <div className="card p-3 bg-ink-50/60 border-ink-100">
          <p className="text-[11px] text-ink-500 leading-relaxed">
            RiskGuard AI provides AI-generated risk insights for decision support and does not
            replace professional financial, legal, compliance, or cybersecurity advice.
          </p>
        </div>
      </div>
    </aside>
  );
}
