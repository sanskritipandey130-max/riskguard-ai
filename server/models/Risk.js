import mongoose from "mongoose";

const RiskSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Financial",
        "Operational",
        "Market",
        "Cybersecurity",
        "Compliance",
        "Customer",
        "Supply Chain",
        "Project/Deadline",
      ],
      required: true,
    },
    probability: { type: Number, min: 1, max: 5, required: true }, // 1-5
    probabilityPercent: Number, // display %
    impact: { type: Number, min: 1, max: 5, required: true }, // 1-5
    score: { type: Number, min: 1, max: 25, required: true },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },
    explanation: String,
    earlyWarnings: [String],
    recommendations: [String],
    priority: { type: Number, default: 3 }, // 1 highest
    status: {
      type: String,
      enum: ["Open", "Monitoring", "Mitigating", "Resolved"],
      default: "Open",
    },
    source: { type: String, enum: ["rules", "ai", "hybrid"], default: "hybrid" },
  },
  { timestamps: true }
);

export default mongoose.model("Risk", RiskSchema);
