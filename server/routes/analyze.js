import { Router } from "express";
import { ProjectStore, RiskStore, ActionStore, HistoryStore } from "../services/store.js";
import { runRiskRules, computeOverallScore, summarizeCounts, categoryBreakdown } from "../services/riskEngine.js";
import { enrichRisksWithAI, isAIAvailable } from "../services/geminiService.js";

const router = Router();

// POST /api/analyze-risk  { projectId }  OR  { project: {...fields} } to create+analyze in one step
router.post("/", async (req, res, next) => {
  try {
    let { projectId, project: projectInput } = req.body;

    let project;
    if (projectId) {
      project = await ProjectStore.findById(projectId);
      if (!project) return res.status(404).json({ error: "Project not found" });
    } else if (projectInput) {
      project = await ProjectStore.create(projectInput);
    } else {
      return res.status(400).json({ error: "projectId or project data required" });
    }

    // 1. Deterministic rules engine (always runs, always reliable)
    const ruleRisks = runRiskRules(project);

    // 2. AI enrichment layer (explanations/recommendations only; falls back gracefully)
    const { risks: enrichedRisks, source } = await enrichRisksWithAI(project, ruleRisks);

    // 3. Persist
    await RiskStore.deleteByProject(project._id);
    const savedRisks = await RiskStore.createMany(project._id, enrichedRisks);

    // 4. Overall score + history snapshot
    const overallScore = computeOverallScore(savedRisks);
    const counts = summarizeCounts(savedRisks);
    await HistoryStore.create({
      projectId: project._id,
      overallScore,
      ...counts,
      breakdown: categoryBreakdown(savedRisks),
    });

    // 5. Auto-generate suggested actions from top risks (Action Center seed data)
    const topRisks = savedRisks.slice(0, 5);
    const actionDocs = topRisks.flatMap((r) =>
      (r.recommendations || []).slice(0, 2).map((rec, idx) => ({
        projectId: project._id,
        riskId: r._id,
        relatedRiskName: r.name,
        title: rec,
        description: `Suggested by RiskGuard AI in response to "${r.name}" (${r.severity}, score ${r.score}/25).`,
        priority: r.severity,
        dueInDays: idx === 0 ? 7 : 14,
        status: "Pending",
      }))
    );
    if (actionDocs.length) await ActionStore.createMany(actionDocs);

    res.json({
      project,
      risks: savedRisks,
      overallScore,
      counts,
      aiSource: source,
      aiAvailable: isAIAvailable(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
