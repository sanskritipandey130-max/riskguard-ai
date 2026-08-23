/**
 * RiskGuard AI — Gemini AI Service
 * ---------------------------------
 * Thin wrapper around Google's Gemini API used to:
 *   1. Explain/enrich/prioritize risks already found by the rules engine
 *   2. Power the conversational AI Risk Agent (grounded in project data)
 *   3. Generate the 30-day mitigation plan narrative
 *   4. Generate executive report text
 *
 * IMPORTANT: This service NEVER blocks the product. If GEMINI_API_KEY is
 * missing, invalid, or the API call fails/times out for any reason, every
 * exported function falls back to deterministic, clearly-labelled demo
 * output built from the same project data. The frontend receives a
 * `source: "ai" | "fallback"` flag so it can be transparent with the user.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API_KEY;

function endpoint() {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;
}

async function callGemini(prompt, { json = false, timeoutMs = 15000 } = {}) {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1500,
          ...(json ? { responseMimeType: "application/json" } : {}),
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    if (!text) throw new Error("Gemini API returned empty response");
    return text;
  } finally {
    clearTimeout(timer);
  }
}

function safeParseJSON(text) {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function projectContextBlock(project) {
  return `
Business/project data (JSON):
${JSON.stringify(project, null, 2)}
`;
}

/**
 * Ask Gemini to explain, prioritize, and add recommendations on top of the
 * rule-detected risks. Falls back to returning the rule-based risks
 * untouched (they already contain explanations/recommendations) if the
 * AI call fails.
 */
export async function enrichRisksWithAI(project, ruleRisks) {
  if (!API_KEY) {
    return { risks: ruleRisks, source: "fallback" };
  }

  const prompt = `You are RiskGuard AI, a business risk analysis engine.
A deterministic rules engine has already detected the following risks for this project.
Do NOT invent new risks or new numeric scores. Your job is ONLY to refine the "explanation" and
"recommendations" fields to be sharper, more specific, and reference the actual numbers in the
project data. Keep probability, impact, score, severity, category, and name EXACTLY as given.
Return ONLY a JSON array with the same objects (same fields), improved explanations/recommendations.

${projectContextBlock(project)}

Detected risks (JSON):
${JSON.stringify(ruleRisks, null, 2)}
`;

  try {
    const text = await callGemini(prompt, { json: true });
    const parsed = safeParseJSON(text);
    if (!Array.isArray(parsed) || parsed.length !== ruleRisks.length) {
      return { risks: ruleRisks, source: "fallback" };
    }
    // Merge: keep numeric fields from rules engine (authoritative), take text from AI
    const merged = ruleRisks.map((r, i) => ({
      ...r,
      explanation: parsed[i]?.explanation || r.explanation,
      recommendations:
        Array.isArray(parsed[i]?.recommendations) && parsed[i].recommendations.length
          ? parsed[i].recommendations
          : r.recommendations,
      source: "hybrid",
    }));
    return { risks: merged, source: "ai" };
  } catch (err) {
    console.warn("[gemini] enrichRisksWithAI fallback:", err.message);
    return { risks: ruleRisks, source: "fallback" };
  }
}

/**
 * AI Risk Agent conversational answer, grounded in the project + risks.
 */
export async function askAgent(project, risks, question) {
  const fallbackAnswer = deterministicAgentAnswer(project, risks, question);
  if (!API_KEY) {
    return { answer: fallbackAnswer, source: "fallback" };
  }

  const prompt = `You are the RiskGuard AI Risk Agent. You ONLY answer using the project data and
risk list provided below — never invent numbers or facts that aren't present. If information is
missing, say so explicitly. Be specific: cite actual figures (revenue, expenses, churn %, etc.)
and actual risk names/scores from the data. Keep the answer under 180 words, structured with
short paragraphs or a short numbered list where useful.

${projectContextBlock(project)}

Current detected risks (JSON):
${JSON.stringify(risks, null, 2)}

User question: "${question}"
`;

  try {
    const text = await callGemini(prompt, { json: false });
    return { answer: text.trim(), source: "ai" };
  } catch (err) {
    console.warn("[gemini] askAgent fallback:", err.message);
    return { answer: fallbackAnswer, source: "fallback" };
  }
}

/**
 * Deterministic fallback for the agent chat — pattern matches common
 * question types and answers using the actual project/risk data so the
 * demo NEVER looks broken without an API key.
 */
function deterministicAgentAnswer(project, risks, question) {
  const q = question.toLowerCase();
  const top = risks[0];

  if (!risks.length) {
    return "I don't have any detected risks for this project yet. Run a Risk Assessment first so I can analyze your data.";
  }

  if (q.includes("biggest") || q.includes("worst") || q.includes("most severe")) {
    const topThree = risks.slice(0, 3);
    return (
      `Your biggest risks right now are: ` +
      topThree.map((r, i) => `${i + 1}) ${r.name} (score ${r.score}/25, ${r.severity})`).join(", ") +
      `. ${top.name} is the top priority because it has the highest combined probability (${top.probabilityPercent}%) and impact (${top.impact}/5).`
    );
  }

  if (q.includes("fix first") || q.includes("first") || q.includes("start")) {
    return `Start with "${top.name}" (${top.category}, score ${top.score}/25, ${top.severity}). ${top.explanation} Recommended first step: ${top.recommendations?.[0] || "review the details on the Risk Details page."}`;
  }

  if (q.includes("nothing") || q.includes("ignore")) {
    return `If left unaddressed, "${top.name}" is projected to keep compounding: ${top.explanation} Left unmanaged, this typically escalates the overall risk score and can cascade into related risks such as ${risks[1]?.name || "other financial/operational risks"}.`;
  }

  if (q.includes("30-day") || q.includes("30 day") || q.includes("plan")) {
    return `Based on your top risks (${risks.slice(0, 3).map((r) => r.name).join(", ")}), a 30-day plan should front-load immediate fixes for "${top.name}" in week 1, move to monitoring by week 3, and lock in preventive controls by day 30. See the Reports page for the full day-by-day plan.`;
  }

  if (q.includes("revenue")) {
    const revenueRelated = risks.filter((r) => ["Financial", "Customer", "Market"].includes(r.category));
    if (revenueRelated.length) {
      const r = revenueRelated[0];
      return `"${r.name}" is most likely to affect revenue: ${r.explanation}`;
    }
    return "No revenue-specific risk was detected in the current data.";
  }

  if (q.includes("why") && (q.includes("financial") || q.includes("cash"))) {
    const fin = risks.find((r) => r.category === "Financial");
    if (fin) return `${fin.name}: ${fin.explanation}`;
    return "No financial risk is currently flagged in your data.";
  }

  // Generic grounded fallback
  return `Based on your current data, your overall risk profile includes ${risks.length} detected risk(s), led by "${top.name}" (${top.severity}, score ${top.score}/25). ${top.explanation} Ask me things like "what should I fix first?" or "give me a 30-day plan" for more specific guidance.`;
}

/**
 * Generate a structured What-If simulation delta explanation.
 */
export async function explainSimulation(project, before, after, changedFields) {
  const fallback = `Overall risk moved from ${before} to ${after} (${
    after >= before ? "+" : ""
  }${after - before} points) after changing ${changedFields.join(", ")}. This reflects how those inputs feed directly into the Financial and Customer risk rules.`;

  if (!API_KEY) return { explanation: fallback, source: "fallback" };

  const prompt = `You are RiskGuard AI. A user ran a what-if simulation changing these fields: ${changedFields.join(
    ", "
  )}. Overall risk score moved from ${before}/100 to ${after}/100. Explain in 2-3 sentences, referencing the actual project numbers, why the score moved this way. Do not invent numbers not present in the data below.
${projectContextBlock(project)}`;

  try {
    const text = await callGemini(prompt, { json: false });
    return { explanation: text.trim(), source: "ai" };
  } catch (err) {
    console.warn("[gemini] explainSimulation fallback:", err.message);
    return { explanation: fallback, source: "fallback" };
  }
}

/**
 * Generate the executive report narrative (summary paragraph) on top of
 * the structured data the frontend already has.
 */
export async function generateReportSummary(project, risks, overallScore) {
  const top5 = risks.slice(0, 5);
  const fallback = `${project.name || "This project"} currently has an overall risk score of ${overallScore}/100. The leading risk is ${
    top5[0]?.name || "N/A"
  }, driven by ${top5[0]?.explanation?.slice(0, 140) || "insufficient data"}. Immediate focus should be placed on the ${
    risks.filter((r) => r.severity === "Critical").length
  } critical and ${risks.filter((r) => r.severity === "High").length} high-severity risks identified below before they compound.`;

  if (!API_KEY) return { summary: fallback, source: "fallback" };

  const prompt = `You are RiskGuard AI generating an executive summary for a business risk report.
Write 3-4 concise, professional sentences (no bullet points) summarizing overall risk posture,
referencing actual figures from the data below. Do not invent numbers.

${projectContextBlock(project)}

Overall risk score: ${overallScore}/100
Top risks (JSON): ${JSON.stringify(top5, null, 2)}
`;

  try {
    const text = await callGemini(prompt, { json: false });
    return { summary: text.trim(), source: "ai" };
  } catch (err) {
    console.warn("[gemini] generateReportSummary fallback:", err.message);
    return { summary: fallback, source: "fallback" };
  }
}

export function isAIAvailable() {
  return Boolean(API_KEY);
}
