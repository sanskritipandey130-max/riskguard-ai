import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { isAIAvailable } from "./services/geminiService.js";

import projectsRouter from "./routes/projects.js";
import risksRouter from "./routes/risks.js";
import actionsRouter from "./routes/actions.js";
import analyzeRouter from "./routes/analyze.js";
import agentRouter from "./routes/agent.js";
import simulateRouter from "./routes/simulate.js";
import reportRouter from "./routes/report.js";
import historyRouter from "./routes/history.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN.split(",").map((s) => s.trim()) }));
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    aiAvailable: isAIAvailable(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/projects", projectsRouter);
app.use("/api/risks", risksRouter);
app.use("/api/actions", actionsRouter);
app.use("/api/analyze-risk", analyzeRouter);
app.use("/api/agent", agentRouter);
app.use("/api/simulate", simulateRouter);
app.use("/api/report", reportRouter);
app.use("/api/history", historyRouter);

app.use(notFound);
app.use(errorHandler);

connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`\nRiskGuard AI backend running on http://localhost:${PORT}`);
    console.log(`AI (Gemini) available: ${isAIAvailable() ? "YES" : "NO — using deterministic fallback"}`);
  });
});
