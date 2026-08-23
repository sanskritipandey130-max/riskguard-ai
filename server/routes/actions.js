import { Router } from "express";
import { ActionStore } from "../services/store.js";

const router = Router();

// GET /api/actions?projectId=...
router.get("/", async (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ error: "projectId query param required" });
    const actions = await ActionStore.findByProject(projectId);
    res.json({ actions });
  } catch (err) {
    next(err);
  }
});

// POST /api/actions
router.post("/", async (req, res, next) => {
  try {
    const action = await ActionStore.create(req.body);
    res.status(201).json({ action });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/actions/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const action = await ActionStore.update(req.params.id, req.body);
    if (!action) return res.status(404).json({ error: "Action not found" });
    res.json({ action });
  } catch (err) {
    next(err);
  }
});

export default router;
