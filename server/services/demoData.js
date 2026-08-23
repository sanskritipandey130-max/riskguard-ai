/**
 * NovaCart — realistic demo company used for "Load Demo Data" and to
 * guarantee the judge demo always has something impressive to show.
 */
export const novaCartDemoProject = {
  name: "NovaCart",
  industry: "E-commerce",
  companySize: "42 employees",
  location: "Bengaluru, India",
  projectType: "D2C retail platform",

  revenue: 1000000, // ₹10,00,000 / month
  monthlyExpenses: 850000, // ₹8,50,000 / month
  cashReserve: 1800000, // ₹18,00,000
  revenueGrowth: 5, // %
  expenseGrowth: 18, // %
  outstandingPayments: 310000,

  employees: 42,
  suppliers: 8,
  projectDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  operationalDependencies: "Single logistics partner for last-mile delivery",
  criticalProcesses: "Order fulfillment, payment gateway, inventory sync",
  completionPercent: 55,

  customers: 12500,
  largestCustomerPercentage: 32,
  customerChurn: 7.2,
  customerGrowth: 4,

  usesCloud: true,
  mfaEnabled: false,
  dataBackup: true,
  securityTraining: false,
  thirdPartyIntegrations: true,

  marketGrowth: 14,
  competitionLevel: "High",
  customerDemand: "Medium",
  marketVolatility: "Medium",

  isDemo: true,
};
