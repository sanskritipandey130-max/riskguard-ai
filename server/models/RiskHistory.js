import mongoose from "mongoose";

const RiskHistorySchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    overallScore: { type: Number, required: true },
    critical: Number,
    high: Number,
    medium: Number,
    low: Number,
    breakdown: {
      Financial: Number,
      Operational: Number,
      Market: Number,
      Cybersecurity: Number,
      Compliance: Number,
      Customer: Number,
      "Supply Chain": Number,
      "Project/Deadline": Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RiskHistory", RiskHistorySchema);
