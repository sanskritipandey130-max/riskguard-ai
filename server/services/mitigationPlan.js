/**
 * Deterministic 30-day mitigation plan generator.
 * Builds a realistic, data-grounded day-by-day plan from the top risks,
 * organized into the 4 phases requested by the product spec.
 */
export function generateMitigationPlan(risks) {
  const top = risks.slice(0, 5);
  const byCategory = (cat) => risks.find((r) => r.category === cat);

  const plan = {
    phase1: { label: "Day 1-7 — Immediate Actions", days: [] },
    phase2: { label: "Day 8-14 — Risk Reduction Actions", days: [] },
    phase3: { label: "Day 15-21 — Monitoring & Optimization", days: [] },
    phase4: { label: "Day 22-30 — Long-Term Prevention", days: [] },
  };

  const financial = byCategory("Financial");
  const customer = byCategory("Customer");
  const cyber = byCategory("Cybersecurity");
  const supply = byCategory("Supply Chain");
  const project = byCategory("Project/Deadline");

  if (financial) {
    plan.phase1.days.push({ day: 1, task: `Review top expense categories driving "${financial.name}"`, riskName: financial.name });
    plan.phase1.days.push({ day: 3, task: "Contact outstanding customers for overdue collections", riskName: financial.name });
    plan.phase2.days.push({ day: 8, task: `Implement 3 of the recommended actions for "${financial.name}"`, riskName: financial.name });
    plan.phase2.days.push({ day: 10, task: "Renegotiate top vendor/supplier contracts for better terms", riskName: financial.name });
    plan.phase3.days.push({ day: 18, task: "Review week-over-week cash-flow trend vs. plan", riskName: financial.name });
    plan.phase4.days.push({ day: 30, task: "Recalculate financial risk score and compare to baseline", riskName: financial.name });
  }

  if (customer) {
    plan.phase1.days.push({ day: 2, task: `Run a retention outreach for accounts at churn risk ("${customer.name}")`, riskName: customer.name });
    plan.phase2.days.push({ day: 11, task: "Launch win-back campaign for recently churned customers", riskName: customer.name });
    plan.phase3.days.push({ day: 19, task: "Review customer concentration % after diversification efforts", riskName: customer.name });
  }

  if (cyber) {
    plan.phase1.days.push({ day: 1, task: `Enable MFA / close the highest-severity item under "${cyber.name}"`, riskName: cyber.name });
    plan.phase2.days.push({ day: 12, task: "Complete a security training session for all staff", riskName: cyber.name });
    plan.phase4.days.push({ day: 25, task: "Run a follow-up security audit / penetration check", riskName: cyber.name });
  }

  if (supply) {
    plan.phase2.days.push({ day: 9, task: `Begin onboarding a backup supplier to reduce "${supply.name}"`, riskName: supply.name });
    plan.phase3.days.push({ day: 20, task: "Finalize backup supplier agreement / safety stock policy", riskName: supply.name });
  }

  if (project) {
    plan.phase1.days.push({ day: 1, task: `Re-scope critical path tasks for "${project.name}"`, riskName: project.name });
    plan.phase2.days.push({ day: 13, task: "Reallocate resources to unblock the critical path", riskName: project.name });
  }

  // Always include monitoring + automation steps regardless of specific risks
  plan.phase2.days.push({ day: 14, task: "Implement automated payment/status reminders where applicable" });
  plan.phase3.days.push({ day: 21, task: "Full risk re-scan: compare current scores to Day 1 baseline" });
  plan.phase4.days.push({ day: 28, task: "Document lessons learned and update internal risk playbook" });
  plan.phase4.days.push({ day: 30, task: "Recalculate overall risk score and set next 30-day targets" });

  // Sort each phase by day
  Object.values(plan).forEach((p) => p.days.sort((a, b) => a.day - b.day));

  return { generatedFrom: top.map((r) => r.name), plan };
}
