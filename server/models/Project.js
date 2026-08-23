import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    industry: String,
    companySize: String,
    location: String,
    projectType: String,

    // Financial
    revenue: Number,
    monthlyExpenses: Number,
    cashReserve: Number,
    revenueGrowth: Number, // percent
    expenseGrowth: Number, // percent
    outstandingPayments: Number,

    // Operations
    employees: Number,
    suppliers: Number,
    projectDeadline: Date,
    operationalDependencies: String,
    criticalProcesses: String,
    completionPercent: Number,

    // Customers
    customers: Number,
    largestCustomerPercentage: Number,
    customerChurn: Number,
    customerGrowth: Number,

    // Security
    usesCloud: Boolean,
    mfaEnabled: Boolean,
    dataBackup: Boolean,
    securityTraining: Boolean,
    thirdPartyIntegrations: Boolean,

    // Market
    marketGrowth: Number,
    competitionLevel: String, // Low | Medium | High
    customerDemand: String, // Low | Medium | High
    marketVolatility: String, // Low | Medium | High

    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
