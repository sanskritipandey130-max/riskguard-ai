import { Router } from "express";
import { HistoryStore } from "../services/store.js";

const router = Router();

// GET /api/history?projectId=...
router.get("/", async (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ error: "projectId query param required" });
    const history = await HistoryStore.findByProject(projectId);
    res.json({ history });
  } catch (err) {
    next(err);
  }
});

export default router;
