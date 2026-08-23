import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import Layout from "../components/Layout.jsx";
import { useProject } from "../context/ProjectContext.jsx";

const steps = ["Business", "Financial", "Operations", "Customers", "Security", "Market", "Review"];

const analysisSteps = [
  "Analyzing financial data...",
  "Checking operational dependencies...",
  "Evaluating customer concentration...",
  "Scanning risk indicators...",
  "Prioritizing risks...",
  "Generating mitigation strategies...",
];

const initialForm = {
  name: "",
  industry: "",
  companySize: "",
  location: "",
  projectType: "",

  revenue: "",
  monthlyExpenses: "",
  cashReserve: "",
  revenueGrowth: "",
  expenseGrowth: "",
  outstandingPayments: "",

  employees: "",
  suppliers: "",
  projectDeadline: "",
  operationalDependencies: "",
  criticalProcesses: "",
  completionPercent: "",

  customers: "",
  largestCustomerPercentage: "",
  customerChurn: "",
  customerGrowth: "",

  usesCloud: true,
  mfaEnabled: false,
  dataBackup: true,
  securityTraining: false,
  thirdPartyIntegrations: false,

  marketGrowth: "",
  competitionLevel: "Medium",
  customerDemand: "Medium",
  marketVolatility: "Medium",
};

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

export default function RiskAssessment() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisIdx, setAnalysisIdx] = useState(0);
  const { runAnalysis } = useProject();
  const navigate = useNavigate();

  const set = (key) => (e) => {
    const val = e?.target?.type === "checkbox" ? e.target.checked : e?.target?.value ?? e;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toNumber = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v));

  const runAI = async () => {
    setAnalyzing(true);
    setAnalysisIdx(0);
    const interval = setInterval(() => {
      setAnalysisIdx((i) => Math.min(i + 1, analysisSteps.length - 1));
    }, 550);

    const payload = {
      project: {
        ...form,
        revenue: toNumber(form.revenue),
        monthlyExpenses: toNumber(form.monthlyExpenses),
        cashReserve: toNumber(form.cashReserve),
        revenueGrowth: toNumber(form.revenueGrowth),
        expenseGrowth: toNumber(form.expenseGrowth),
        outstandingPayments: toNumber(form.outstandingPayments),
        employees: toNumber(form.employees),
        suppliers: toNumber(form.suppliers),
        completionPercent: toNumber(form.completionPercent),
        customers: toNumber(form.customers),
        largestCustomerPercentage: toNumber(form.largestCustomerPercentage),
        customerChurn: toNumber(form.customerChurn),
        customerGrowth: toNumber(form.customerGrowth),
        marketGrowth: toNumber(form.marketGrowth),
        projectDeadline: form.projectDeadline || undefined,
      },
    };

    try {
      await runAnalysis(payload);
      await new Promise((r) => setTimeout(r, 3400));
      clearInterval(interval);
      navigate("/dashboard");
    } catch (err) {
      clearInterval(interval);
      setAnalyzing(false);
      alert("Analysis failed: " + err.message);
    }
  };

  if (analyzing) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="card p-10 max-w-md w-full text-center">
            <Loader2 className="mx-auto text-brand-600 animate-spin mb-5" size={36} />
            <h2 className="font-bold text-ink-900 mb-6">Running AI Risk Analysis</h2>
            <div className="space-y-3 text-left">
              {analysisSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i < analysisIdx ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  ) : i === analysisIdx ? (
                    <Loader2 size={16} className="text-brand-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-ink-200 shrink-0" />
                  )}
                  <span className={`text-sm ${i <= analysisIdx ? "text-ink-800" : "text-ink-400"}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-ink-900 mb-1">Risk Assessment</h1>
        <p className="text-ink-500 mb-6">Tell RiskGuard AI about your business so it can detect real risks.</p>

        {/* Stepper */}
        <div className="flex items-center gap-1.5 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-brand-600" : "bg-ink-100"}`} />
              <p className={`text-[10px] mt-1.5 font-semibold ${i === step ? "text-brand-600" : "text-ink-400"}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="card p-6">
          {step === 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Business / Project Name">
                <input className="input" value={form.name} onChange={set("name")} placeholder="e.g. NovaCart" />
              </Field>
              <Field label="Industry">
                <input className="input" value={form.industry} onChange={set("industry")} placeholder="e.g. E-commerce" />
              </Field>
              <Field label="Company Size">
                <input className="input" value={form.companySize} onChange={set("companySize")} placeholder="e.g. 42 employees" />
              </Field>
              <Field label="Location">
                <input className="input" value={form.location} onChange={set("location")} placeholder="e.g. Bengaluru, India" />
              </Field>
              <Field label="Project Type">
                <input className="input" value={form.projectType} onChange={set("projectType")} placeholder="e.g. D2C retail platform" />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Monthly Revenue (₹)">
                <input type="number" className="input" value={form.revenue} onChange={set("revenue")} />
              </Field>
              <Field label="Monthly Expenses (₹)">
                <input type="number" className="input" value={form.monthlyExpenses} onChange={set("monthlyExpenses")} />
              </Field>
              <Field label="Cash Reserve (₹)">
                <input type="number" className="input" value={form.cashReserve} onChange={set("cashReserve")} />
              </Field>
              <Field label="Outstanding Payments (₹)">
                <input type="number" className="input" value={form.outstandingPayments} onChange={set("outstandingPayments")} />
              </Field>
              <Field label="Revenue Growth (% / month)">
                <input type="number" className="input" value={form.revenueGrowth} onChange={set("revenueGrowth")} />
              </Field>
              <Field label="Expense Growth (% / month)">
                <input type="number" className="input" value={form.expenseGrowth} onChange={set("expenseGrowth")} />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Number of Employees">
                <input type="number" className="input" value={form.employees} onChange={set("employees")} />
              </Field>
              <Field label="Number of Suppliers">
                <input type="number" className="input" value={form.suppliers} onChange={set("suppliers")} />
              </Field>
              <Field label="Project Deadline">
                <input type="date" className="input" value={form.projectDeadline} onChange={set("projectDeadline")} />
              </Field>
              <Field label="Completion (%)">
                <input type="number" className="input" value={form.completionPercent} onChange={set("completionPercent")} />
              </Field>
              <Field label="Operational Dependencies">
                <input className="input" value={form.operationalDependencies} onChange={set("operationalDependencies")} placeholder="e.g. single logistics partner" />
              </Field>
              <Field label="Critical Processes">
                <input className="input" value={form.criticalProcesses} onChange={set("criticalProcesses")} placeholder="e.g. order fulfillment" />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Number of Customers">
                <input type="number" className="input" value={form.customers} onChange={set("customers")} />
              </Field>
              <Field label="Largest Customer Revenue Share (%)">
                <input type="number" className="input" value={form.largestCustomerPercentage} onChange={set("largestCustomerPercentage")} />
              </Field>
              <Field label="Customer Churn (%/month)">
                <input type="number" className="input" value={form.customerChurn} onChange={set("customerChurn")} />
              </Field>
              <Field label="Customer Growth (%/month)">
                <input type="number" className="input" value={form.customerGrowth} onChange={set("customerGrowth")} />
              </Field>
            </div>
          )}

          {step === 4 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["usesCloud", "Uses Cloud Infrastructure?"],
                ["mfaEnabled", "MFA Enabled?"],
                ["dataBackup", "Regular Data Backup?"],
                ["securityTraining", "Security Training Completed?"],
                ["thirdPartyIntegrations", "Third-Party Integrations?"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-3.5 rounded-xl border border-ink-200">
                  <span className="text-sm font-medium text-ink-700">{label}</span>
                  <input type="checkbox" className="w-5 h-5 accent-brand-600" checked={form[key]} onChange={set(key)} />
                </label>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Market Growth (% / year)">
                <input type="number" className="input" value={form.marketGrowth} onChange={set("marketGrowth")} />
              </Field>
              <Field label="Competition Level">
                <select className="input" value={form.competitionLevel} onChange={set("competitionLevel")}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </Field>
              <Field label="Customer Demand">
                <select className="input" value={form.customerDemand} onChange={set("customerDemand")}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </Field>
              <Field label="Market Volatility">
                <select className="input" value={form.marketVolatility} onChange={set("marketVolatility")}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </Field>
            </div>
          )}

          {step === 6 && (
            <div className="text-center py-6">
              <Sparkles className="mx-auto text-brand-600 mb-4" size={32} />
              <h3 className="font-bold text-ink-900 mb-2">Ready to analyze {form.name || "your business"}</h3>
              <p className="text-sm text-ink-500 max-w-md mx-auto mb-6">
                RiskGuard AI will run its rules engine plus AI enrichment layer across all 8 risk
                categories using the data you provided.
              </p>
              <button className="btn-primary text-base px-6 py-3" onClick={runAI}>
                Run AI Risk Analysis <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {step < 6 && (
          <div className="flex justify-between mt-6">
            <button className="btn-secondary" onClick={back} disabled={step === 0}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={next}>
              Next <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
