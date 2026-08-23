import mongoose from "mongoose";

const ActionSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    riskId: { type: mongoose.Schema.Types.ObjectId, ref: "Risk" },
    relatedRiskName: String,
    title: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    dueInDays: { type: Number, default: 7 },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Dismissed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Action", ActionSchema);
