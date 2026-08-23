/**
 * RiskGuard AI — Deterministic Risk Rules Engine
 * ------------------------------------------------
 * This module implements the reliable, explainable baseline layer of the
 * hybrid architecture:
 *
 *   User Data -> Risk Rules Engine -> AI Analysis Layer -> Risk Scoring
 *             -> AI Risk Agent -> Action Recommendations -> Monitoring
 *
 * Every rule below is fully deterministic (no AI call). The AI layer
 * (geminiService.js) is used ONLY to explain/prioritize/recommend on top
 * of what these rules already found, or to enrich analysis further. This
 * guarantees the product still works — and still detects real risks —
 * even if the Gemini API key is missing or the API is down.
 */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function severityFromScore(score) {
  if (score >= 16) return "Critical";
  if (score >= 11) return "High";
  if (score >= 6) return "Medium";
  return "Low";
}

function makeRisk({
  name,
  category,
  probability,
  impact,
  explanation,
  earlyWarnings,
  recommendations,
  priority = 3,
}) {
  probability = clamp(Math.round(probability), 1, 5);
  impact = clamp(Math.round(impact), 1, 5);
  const score = probability * impact;
  return {
    name,
    category,
    probability,
    probabilityPercent: Math.round((probability / 5) * 100),
    impact,
    score,
    severity: severityFromScore(score),
    explanation,
    earlyWarnings,
    recommendations,
    priority,
    status: "Open",
    source: "rules",
  };
}

/**
 * Runs all deterministic rules against a project's data and returns an
 * array of detected risks. Rules that don't have enough data simply
 * don't fire (no hallucinated risks).
 */
export function runRiskRules(project) {
  const risks = [];

  const {
    revenue,
    monthlyExpenses,
    cashReserve,
    revenueGrowth,
    expenseGrowth,
    outstandingPayments,
    employees,
    suppliers,
    projectDeadline,
    completionPercent,
    customers,
    largestCustomerPercentage,
    customerChurn,
    customerGrowth,
    usesCloud,
    mfaEnabled,
    dataBackup,
    securityTraining,
    thirdPartyIntegrations,
    marketGrowth,
    competitionLevel,
    customerDemand,
    marketVolatility,
  } = project;

  // 1. Cash Flow / Financial Risk — expense growth outpaces revenue growth
  if (typeof expenseGrowth === "number" && typeof revenueGrowth === "number") {
    const gap = expenseGrowth - revenueGrowth;
    if (gap > 0) {
      const probability = clamp(2 + Math.round(gap / 4), 1, 5);
      const margin = revenue ? ((revenue - monthlyExpenses) / revenue) * 100 : null;
      const impact = clamp(3 + (gap > 10 ? 2 : gap > 5 ? 1 : 0), 1, 5);
      risks.push(
        makeRisk({
          name: "Cash Flow Risk",
          category: "Financial",
          probability,
          impact,
          explanation:
            `Expenses are growing ${expenseGrowth}% per month while revenue is growing ` +
            `only ${revenueGrowth}%, a gap of ${gap.toFixed(1)} points. ` +
            (margin !== null
              ? `At the current pace, operating margin (currently ~${margin.toFixed(
                  1
                )}%) will keep shrinking, reducing available cash reserves.`
              : `If this trend continues, available cash reserves may decline rapidly.`),
          earlyWarnings: [
            "Increasing monthly expenses",
            "Declining operating margin",
            "Increasing unpaid invoices",
          ],
          recommendations: [
            "Review the top 3-5 recurring expense categories",
            "Reduce non-essential / discretionary spending",
            "Improve the customer payment collection cycle",
            "Maintain a minimum emergency cash reserve",
          ],
          priority: 1,
        })
      );
    }
  }

  // 2. Liquidity Risk — cash reserve < 3x monthly expenses
  if (typeof cashReserve === "number" && typeof monthlyExpenses === "number" && monthlyExpenses > 0) {
    const runwayMonths = cashReserve / monthlyExpenses;
    if (runwayMonths < 3) {
      risks.push(
        makeRisk({
          name: "Liquidity Risk",
          category: "Financial",
          probability: runwayMonths < 1.5 ? 5 : 4,
          impact: 5,
          explanation:
            `Current cash reserve (₹${cashReserve.toLocaleString("en-IN")}) covers only ` +
            `${runwayMonths.toFixed(1)} months of expenses (₹${monthlyExpenses.toLocaleString(
              "en-IN"
            )}/month). A healthy buffer is generally 3+ months of runway.`,
          earlyWarnings: [
            "Runway below 3 months",
            "Reliance on short-term inflows to cover fixed costs",
          ],
          recommendations: [
            "Build cash reserve toward at least 3x monthly expenses",
            "Delay non-critical capital expenditure",
            "Explore short-term credit lines as a safety net",
          ],
          priority: 1,
        })
      );
    }
  }

  // 3. Outstanding Payments Risk
  if (typeof outstandingPayments === "number" && typeof revenue === "number" && revenue > 0) {
    const ratio = outstandingPayments / revenue;
    if (ratio > 0.25) {
      risks.push(
        makeRisk({
          name: "Receivables / Collection Risk",
          category: "Financial",
          probability: clamp(2 + Math.round(ratio * 5), 1, 5),
          impact: 3,
          explanation:
            `Outstanding payments (₹${outstandingPayments.toLocaleString("en-IN")}) equal ` +
            `${Math.round(ratio * 100)}% of monthly revenue, tying up cash that could otherwise ` +
            `fund operations.`,
          earlyWarnings: ["Rising days-sales-outstanding (DSO)", "Repeated late payers"],
          recommendations: [
            "Send automated payment reminders",
            "Offer small early-payment discounts",
            "Enforce stricter credit terms for repeat late payers",
          ],
          priority: 2,
        })
      );
    }
  }

  // 4. Customer Concentration Risk
  if (typeof largestCustomerPercentage === "number" && largestCustomerPercentage > 25) {
    risks.push(
      makeRisk({
        name: "Customer Concentration Risk",
        category: "Customer",
        probability: clamp(2 + Math.round((largestCustomerPercentage - 25) / 10), 1, 5),
        impact: clamp(3 + (largestCustomerPercentage > 40 ? 2 : 1), 1, 5),
        explanation:
          `Your largest customer accounts for ${largestCustomerPercentage}% of revenue. ` +
          `Losing this single customer would materially damage revenue and could destabilize cash flow.`,
        earlyWarnings: [
          "Reduced order frequency from top customer",
          "Delayed responses / renewal hesitancy",
          "Competitor activity around key account",
        ],
        recommendations: [
          "Actively diversify the customer base",
          "Strengthen the relationship with the top account via a success plan",
          "Set a target cap (e.g. <20%) for any single customer's revenue share",
        ],
        priority: 2,
      })
    );
  }

  // 5. Customer Churn Risk
  if (typeof customerChurn === "number" && customerChurn > 8) {
    risks.push(
      makeRisk({
        name: "Customer Churn Risk",
        category: "Customer",
        probability: clamp(2 + Math.round((customerChurn - 8) / 3), 1, 5),
        impact: 4,
        explanation:
          `Monthly customer churn is ${customerChurn}%, above the healthy threshold of ~5-8% ` +
          `for most business models. Sustained churn at this level compounds into significant ` +
          `revenue loss over a year.`,
        earlyWarnings: [
          "Declining engagement / usage metrics",
          "Increase in support complaints",
          "Falling Net Promoter Score",
        ],
        recommendations: [
          "Run exit surveys to identify churn drivers",
          "Launch a targeted retention/win-back campaign",
          "Improve onboarding for at-risk customer segments",
        ],
        priority: 2,
      })
    );
  }

  // 6. Supply Chain Dependency Risk
  if (typeof suppliers === "number" && suppliers <= 2) {
    risks.push(
      makeRisk({
        name: "Supply Chain Dependency Risk",
        category: "Supply Chain",
        probability: suppliers <= 1 ? 5 : 4,
        impact: 4,
        explanation:
          `You currently rely on only ${suppliers} supplier${suppliers === 1 ? "" : "s"}. ` +
          `A disruption at a single vendor (delay, price hike, insolvency) could halt operations ` +
          `with little to no backup.`,
        earlyWarnings: [
          "Vendor delivery delays",
          "Sudden price increases from supplier",
          "Supplier communication going quiet",
        ],
        recommendations: [
          "Onboard at least one backup supplier per critical input",
          "Negotiate buffer-stock or safety-stock agreements",
          "Diversify sourcing geographically where possible",
        ],
        priority: 2,
      })
    );
  }

  // 7. Project Delay Risk
  if (projectDeadline) {
    const deadline = new Date(projectDeadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    const completion = typeof completionPercent === "number" ? completionPercent : null;
    if (daysLeft >= 0 && daysLeft <= 30 && completion !== null && completion < 70) {
      risks.push(
        makeRisk({
          name: "Project Delay Risk",
          category: "Project/Deadline",
          probability: clamp(5 - Math.round(completion / 25), 1, 5),
          impact: 4,
          explanation:
            `The project deadline is ${daysLeft} day(s) away but only ${completion}% is complete. ` +
            `At the current pace, on-time delivery is unlikely without corrective action.`,
          earlyWarnings: [
            "Slipping sprint/milestone velocity",
            "Increasing number of open blockers",
            "Team overtime rising without proportional progress",
          ],
          recommendations: [
            "Re-scope to a minimum viable deliverable if needed",
            "Reallocate resources to the critical path",
            "Communicate a revised timeline to stakeholders early",
          ],
          priority: 1,
        })
      );
    }
  }

  // 8. Cybersecurity Risk — MFA disabled
  if (mfaEnabled === false) {
    risks.push(
      makeRisk({
        name: "Cybersecurity Risk — MFA Disabled",
        category: "Cybersecurity",
        probability: 4,
        impact: 5,
        explanation:
          `Multi-factor authentication (MFA) is not enabled. Accounts protected only by passwords ` +
          `are significantly more vulnerable to credential-stuffing and phishing attacks` +
          (thirdPartyIntegrations ? `, and this risk is amplified by active third-party integrations.` : `.`),
        earlyWarnings: [
          "Unusual login attempts / locations",
          "Password reuse across systems",
          "Phishing attempts reported by staff",
        ],
        recommendations: [
          "Enable MFA on all critical systems immediately",
          "Enforce a password manager and rotation policy",
          "Run a phishing-awareness training session",
        ],
        priority: 1,
      })
    );
  }

  // 9. Cybersecurity Risk — no backups
  if (dataBackup === false) {
    risks.push(
      makeRisk({
        name: "Data Loss Risk — No Backups",
        category: "Cybersecurity",
        probability: 3,
        impact: 5,
        explanation:
          `No regular data backup process is in place. A ransomware incident, hardware failure, ` +
          `or accidental deletion could cause irrecoverable data loss.`,
        earlyWarnings: ["No backup logs / verification", "Single point of storage failure"],
        recommendations: [
          "Implement automated daily backups with offsite/cloud redundancy",
          "Test backup restoration quarterly",
          "Document a disaster-recovery runbook",
        ],
        priority: 2,
      })
    );
  }

  // 10. Compliance/Training Risk
  if (securityTraining === false) {
    risks.push(
      makeRisk({
        name: "Compliance Risk — Security Training Gap",
        category: "Compliance",
        probability: 3,
        impact: 3,
        explanation:
          `Staff have not completed security/compliance training. This raises the likelihood of ` +
          `policy violations, data-handling mistakes, and regulatory exposure.`,
        earlyWarnings: ["Repeated policy violations", "Audit findings", "Untracked data handling"],
        recommendations: [
          "Roll out mandatory security & compliance training",
          "Introduce periodic compliance audits",
          "Document data-handling policies clearly",
        ],
        priority: 3,
      })
    );
  }

  // 11. Market Risk — high volatility / high competition / low demand
  if (marketVolatility === "High" || competitionLevel === "High" || customerDemand === "Low") {
    const factors = [];
    if (marketVolatility === "High") factors.push("high market volatility");
    if (competitionLevel === "High") factors.push("intense competition");
    if (customerDemand === "Low") factors.push("weakening customer demand");
    risks.push(
      makeRisk({
        name: "Market Risk",
        category: "Market",
        probability: clamp(2 + factors.length, 1, 5),
        impact: clamp(2 + factors.length, 1, 5),
        explanation:
          `Market conditions show ${factors.join(", ")}. ` +
          `Combined, these increase the chance of stalled growth or margin compression` +
          (typeof marketGrowth === "number" ? ` in a market growing at ${marketGrowth}% annually.` : `.`),
        earlyWarnings: [
          "Slowing sales pipeline / lead volume",
          "Price pressure from competitors",
          "Customer feedback citing better alternatives",
        ],
        recommendations: [
          "Differentiate via product or service innovation",
          "Reassess pricing strategy against competitors",
          "Diversify go-to-market channels",
        ],
        priority: 3,
      })
    );
  }

  // 12. Operational Risk — many employees but very few suppliers/critical process notes
  if (typeof employees === "number" && employees > 0 && typeof customers === "number" && customers > 0) {
    const customersPerEmployee = customers / employees;
    if (customersPerEmployee > 400) {
      risks.push(
        makeRisk({
          name: "Operational Capacity Risk",
          category: "Operational",
          probability: 3,
          impact: 3,
          explanation:
            `You are supporting ~${Math.round(
              customersPerEmployee
            )} customers per employee. Without scalable processes or automation, ` +
            `service quality and response times are likely to degrade as you grow.`,
          earlyWarnings: [
            "Rising support ticket backlog",
            "Falling customer satisfaction scores",
            "Team burnout / high overtime",
          ],
          recommendations: [
            "Automate repetitive operational workflows",
            "Hire or reallocate staff to high-load functions",
            "Introduce self-service support options",
          ],
          priority: 3,
        })
      );
    }
  }

  // Sort by score desc, then priority asc
  risks.sort((a, b) => b.score - a.score || a.priority - b.priority);
  return risks;
}

/**
 * Aggregate an overall 0-100 risk score for a project from its individual
 * risks. Weighted toward the most severe risks so a single Critical risk
 * meaningfully moves the overall number, mirroring how real risk platforms
 * behave.
 */
export function computeOverallScore(risks) {
  if (!risks || risks.length === 0) return 0;
  const weights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const maxPossible = risks.length * 4 * 25; // theoretical ceiling
  const weighted = risks.reduce((sum, r) => sum + weights[r.severity] * r.score, 0);
  const normalized = Math.round((weighted / maxPossible) * 100);
  // Blend with a simple average-score-based baseline so overall score
  // still feels intuitive relative to individual risk scores (1-25 scale).
  const avgScore = risks.reduce((s, r) => s + r.score, 0) / risks.length;
  const avgBased = Math.round((avgScore / 25) * 100);
  return clamp(Math.round(normalized * 0.6 + avgBased * 0.4), 0, 100);
}

export function summarizeCounts(risks) {
  return {
    critical: risks.filter((r) => r.severity === "Critical").length,
    high: risks.filter((r) => r.severity === "High").length,
    medium: risks.filter((r) => r.severity === "Medium").length,
    low: risks.filter((r) => r.severity === "Low").length,
  };
}

export function categoryBreakdown(risks) {
  const cats = [
    "Financial",
    "Operational",
    "Market",
    "Cybersecurity",
    "Compliance",
    "Customer",
    "Supply Chain",
    "Project/Deadline",
  ];
  const out = {};
  cats.forEach((c) => {
    out[c] = risks.filter((r) => r.category === c).reduce((s, r) => s + r.score, 0);
  });
  return out;
}

export { severityFromScore };
