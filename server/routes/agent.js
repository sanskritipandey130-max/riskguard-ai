import { Router } from "express";
import { ProjectStore, RiskStore } from "../services/store.js";
import { askAgent } from "../services/geminiService.js";

const router = Router();

// POST /api/agent  { projectId, question }
router.post("/", async (req, res, next) => {
  try {
    const { projectId, question } = req.body;
    if (!projectId || !question) {
      return res.status(400).json({ error: "projectId and question are required" });
    }
    const project = await ProjectStore.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const risks = await RiskStore.findByProject(projectId);
    const { answer, source } = await askAgent(project, risks, question);

    res.json({ answer, source });
  } catch (err) {
    next(err);
  }
});

export default router;
