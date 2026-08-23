import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api } from "../services/api.js";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [project, setProject] = useState(null);
  const [risks, setRisks] = useState([]);
  const [overallScore, setOverallScore] = useState(0);
  const [actions, setActions] = useState([]);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Restore last active project from localStorage-free session (in-memory only)
    api.health().then((h) => setAiAvailable(h.aiAvailable)).catch(() => {});
  }, []);

  const refreshRisks = useCallback(async (projectId) => {
    const { risks } = await api.getRisks(projectId);
    setRisks(risks);
    return risks;
  }, []);

  const refreshActions = useCallback(async (projectId) => {
    const { actions } = await api.getActions(projectId);
    setActions(actions);
    return actions;
  }, []);

  const loadDemo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.loadDemoProject();
      setProject(data.project);
      setRisks(data.risks);
      setOverallScore(data.overallScore);
      await refreshActions(data.project._id);
      return data;
    } finally {
      setLoading(false);
    }
  }, [refreshActions]);

  const runAnalysis = useCallback(async (payload) => {
    setLoading(true);
    try {
      const data = await api.analyzeRisk(payload);
      setProject(data.project);
      setRisks(data.risks);
      setOverallScore(data.overallScore);
      await refreshActions(data.project._id);
      return data;
    } finally {
      setLoading(false);
    }
  }, [refreshActions]);

  const value = {
    project,
    setProject,
    risks,
    setRisks,
    overallScore,
    setOverallScore,
    actions,
    setActions,
    aiAvailable,
    loading,
    loadDemo,
    runAnalysis,
    refreshRisks,
    refreshActions,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}
