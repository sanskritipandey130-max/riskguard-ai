import React, { useState } from "react";
import { SlidersHorizontal, Play, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import Layout from "../components/Layout.jsx";
import RequireProject from "../components/RequireProject.jsx";
import RiskBadge from "../components/RiskBadge.jsx";
import { useProject } from "../context/ProjectContext.jsx";
import { api } from "../services/api.js";

function Slider({ label, value, onChange, min, max, step = 1, suffix = "" }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-ink-600 mb-1.5">
        <span>{label}</span>
        <span className="text-brand-600">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600"
      />
    </div>
  );
}

export default function WhatIfSimulator() {
  return (
    <RequireProject>
      <SimulatorInner />
    </RequireProject>
  );
}

function SimulatorInner() {
  const { project } = useProject();
  const [revenueGrowth, setRevenueGrowth] = useState(project.revenueGrowth ?? 5);
  const [expenseGrowth, setExpenseGrowth] = useState(project.expenseGrowth ?? 10);
  const [customerChurn, setCustomerChurn] = useState(project.customerChurn ?? 8);
  const [cashReserve, setCashReserve] = useState(project.cashReserve ?? 500000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const simulate = async () => {
    setLoading(true);
    try {
      const data = await api.simulate(project._id, {
        revenueGrowth,
        expenseGrowth,
        customerChurn,
        cashReserve,
      });
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-ink-900 mb-1 flex items-center gap-2">
          <SlidersHorizontal className="text-brand-600" size={22} /> What-If Simulator
        </h1>
        <p className="text-ink-500 mb-6">Adjust key variables and see how your risk score changes.</p>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6 space-y-6">
            <Slider label="Revenue Growth" value={revenueGrowth} onChange={setRevenueGrowth} min={-20} max={50} suffix="%" />
            <Slider label="Expense Growth" value={expenseGrowth} onChange={setExpenseGrowth} min={-20} max={50} suffix="%" />
            <Slider label="Customer Churn" value={customerChurn} onChange={setCustomerChurn} min={0} max={30} suffix="%" />
            <Slider
              label="Cash Reserve (₹)"
              value={cashReserve}
              onChange={setCashReserve}
              min={0}
              max={5000000}
              step={50000}
            />
            <button className="btn-primary w-full" onClick={simulate} disabled={loading}>
              <Play size={16} /> {loading ? "Simulating..." : "Simulate"}
            </button>
          </div>

          <div className="card p-6">
            {!result ? (
              <div className="h-full flex items-center justify-center text-center text-sm text-ink-400 py-16">
                Adjust the sliders and click Simulate to see the projected impact.
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-around mb-5">
                  <div className="text-center">
                    <p className="text-xs text-ink-500 font-semibold uppercase mb-1">Current Risk</p>
                    <p className="text-3xl font-extrabold text-ink-900">{result.currentScore}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    {result.delta >= 0 ? (
                      <TrendingUp className="text-red-500" size={22} />
                    ) : (
                      <TrendingDown className="text-emerald-500" size={22} />
                    )}
                    <span className={`text-xs font-bold ${result.delta >= 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {result.delta >= 0 ? "+" : ""}
                      {result.delta}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-ink-500 font-semibold uppercase mb-1">Projected Risk</p>
                    <p className="text-3xl font-extrabold text-brand-600">{result.projectedScore}</p>
                  </div>
                </div>

                <div className={`rounded-xl p-3 mb-4 text-sm ${result.delta >= 0 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {result.delta >= 0 ? "⚠️" : "✅"} Risk {result.delta >= 0 ? "increased" : "decreased"} by {Math.abs(result.delta)} points.
                </div>

                <p className="text-sm text-ink-600 leading-relaxed mb-4">{result.explanation}</p>

                {result.newRisks?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-ink-500 uppercase mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={13} /> New Critical/High Risks
                    </p>
                    <div className="space-y-2">
                      {result.newRisks.map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-ink-50">
                          <span className="text-sm font-medium text-ink-800">{r.name}</span>
                          <RiskBadge severity={r.severity} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
