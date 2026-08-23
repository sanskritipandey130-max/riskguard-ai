import { Router } from "express";
import { ProjectStore, RiskStore } from "../services/store.js";
import { runRiskRules, computeOverallScore } from "../services/riskEngine.js";
import { explainSimulation } from "../services/geminiService.js";

const router = Router();

// POST /api/simulate  { projectId, changes: { revenueGrowth, expenseGrowth, customerChurn, cashReserve, ... } }
router.post("/", async (req, res, next) => {
  try {
    const { projectId, changes } = req.body;
    if (!projectId || !changes) {
      return res.status(400).json({ error: "projectId and changes are required" });
    }
    const project = await ProjectStore.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const currentRisks = await RiskStore.findByProject(projectId);
    const currentScore = computeOverallScore(currentRisks);

    const simulatedProject = { ...project, ...changes };
    const projectedRisks = runRiskRules(simulatedProject);
    const projectedScore = computeOverallScore(projectedRisks);

    const changedFields = Object.keys(changes);
    const { explanation, source } = await explainSimulation(
      simulatedProject,
      currentScore,
      projectedScore,
      changedFields
    );

    // Identify newly-appearing critical/high risks
    const currentNames = new Set(currentRisks.map((r) => r.name));
    const newRisks = projectedRisks.filter(
      (r) => !currentNames.has(r.name) && (r.severity === "Critical" || r.severity === "High")
    );

    res.json({
      currentScore,
      projectedScore,
      delta: projectedScore - currentScore,
      projectedRisks,
      newRisks,
      explanation,
      source,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
