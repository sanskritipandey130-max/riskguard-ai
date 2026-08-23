import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RiskAssessment from "./pages/RiskAssessment.jsx";
import AIAgent from "./pages/AIAgent.jsx";
import RiskDetails from "./pages/RiskDetails.jsx";
import ActionCenter from "./pages/ActionCenter.jsx";
import RiskHistory from "./pages/RiskHistory.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import WhatIfSimulator from "./pages/WhatIfSimulator.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessment" element={<RiskAssessment />} />
      <Route path="/agent" element={<AIAgent />} />
      <Route path="/risks/:id" element={<RiskDetails />} />
      <Route path="/actions" element={<ActionCenter />} />
      <Route path="/history" element={<RiskHistory />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/simulator" element={<WhatIfSimulator />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
