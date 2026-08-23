import { Router } from "express";
import { ProjectStore, RiskStore, HistoryStore } from "../services/store.js";
import { novaCartDemoProject } from "../services/demoData.js";
import { runRiskRules, computeOverallScore, summarizeCounts, categoryBreakdown } from "../services/riskEngine.js";

const router = Router();

// GET /api/projects
router.get("/", async (req, res, next) => {
  try {
    const projects = await ProjectStore.findAll();
    res.json({ projects });
  } catch (err) {
    next(err);
  }
});

// POST /api/projects  (create from assessment form)
router.post("/", async (req, res, next) => {
  try {
    const project = await ProjectStore.create(req.body);
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res, next) => {
  try {
    const project = await ProjectStore.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ project });
  } catch (err) {
    next(err);
  }
});

// POST /api/projects/demo -> creates NovaCart demo project + runs risk analysis immediately
router.post("/demo", async (req, res, next) => {
  try {
    const project = await ProjectStore.create(novaCartDemoProject);
    const ruleRisks = runRiskRules(project);
    const savedRisks = await RiskStore.createMany(project._id, ruleRisks);
    const overallScore = computeOverallScore(savedRisks);
    await HistoryStore.create({
      projectId: project._id,
      overallScore,
      ...summarizeCounts(savedRisks),
      breakdown: categoryBreakdown(savedRisks),
    });
    res.status(201).json({ project, risks: savedRisks, overallScore });
  } catch (err) {
    next(err);
  }
});

export default router;
