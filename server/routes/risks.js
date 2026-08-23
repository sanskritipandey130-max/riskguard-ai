import { Router } from "express";
import { RiskStore } from "../services/store.js";

const router = Router();

// GET /api/risks?projectId=...
router.get("/", async (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ error: "projectId query param required" });
    const risks = await RiskStore.findByProject(projectId);
    res.json({ risks });
  } catch (err) {
    next(err);
  }
});

// GET /api/risks/:id
router.get("/:id", async (req, res, next) => {
  try {
    const risk = await RiskStore.findById(req.params.id);
    if (!risk) return res.status(404).json({ error: "Risk not found" });
    res.json({ risk });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/risks/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const risk = await RiskStore.update(req.params.id, req.body);
    if (!risk) return res.status(404).json({ error: "Risk not found" });
    res.json({ risk });
  } catch (err) {
    next(err);
  }
});

export default router;
