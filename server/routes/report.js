import { Router } from "express";
import { ProjectStore, RiskStore, HistoryStore } from "../services/store.js";
import { computeOverallScore } from "../services/riskEngine.js";
import { generateReportSummary } from "../services/geminiService.js";
import { generateMitigationPlan } from "../services/mitigationPlan.js";

const router = Router();

// POST /api/report  { projectId }
router.post("/", async (req, res, next) => {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: "projectId is required" });

    const project = await ProjectStore.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const risks = await RiskStore.findByProject(projectId);
    const overallScore = computeOverallScore(risks);
    const history = await HistoryStore.findByProject(projectId);

    const { summary, source } = await generateReportSummary(project, risks, overallScore);
    const { plan } = generateMitigationPlan(risks);

    res.json({
      project,
      overallScore,
      topRisks: risks.slice(0, 5),
      criticalRisks: risks.filter((r) => r.severity === "Critical"),
      trend: history,
      mitigationPlan: plan,
      summary,
      source,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
