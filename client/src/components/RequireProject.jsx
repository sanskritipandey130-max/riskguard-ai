import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useProject } from "../context/ProjectContext.jsx";
import Layout from "./Layout.jsx";

export default function RequireProject({ children }) {
  const { project, loadDemo, loading } = useProject();
  const navigate = useNavigate();

  if (!project) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-2rem)] text-center px-6">
          <div className="p-4 rounded-2xl bg-brand-50 text-brand-600 mb-4">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold text-ink-900 mb-2">No active project yet</h2>
          <p className="text-sm text-ink-500 max-w-sm mb-6">
            Run a Risk Assessment on your business data, or load the NovaCart demo dataset to see
            RiskGuard AI in action instantly.
          </p>
          <div className="flex gap-3">
            <button className="btn-primary" disabled={loading} onClick={async () => {
              const data = await loadDemo();
              navigate("/dashboard");
            }}>
              {loading ? "Loading demo..." : "Load Demo Data"}
            </button>
            <button className="btn-secondary" onClick={() => navigate("/assessment")}>
              Start Risk Assessment
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  return children;
}
