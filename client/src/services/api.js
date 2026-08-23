const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  health: () => request("/health"),

  loadDemoProject: () => request("/projects/demo", { method: "POST" }),
  createProject: (project) => request("/projects", { method: "POST", body: JSON.stringify(project) }),
  getProject: (id) => request(`/projects/${id}`),

  analyzeRisk: (payload) => request("/analyze-risk", { method: "POST", body: JSON.stringify(payload) }),

  getRisks: (projectId) => request(`/risks?projectId=${projectId}`),
  getRisk: (id) => request(`/risks/${id}`),
  updateRisk: (id, data) => request(`/risks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  getActions: (projectId) => request(`/actions?projectId=${projectId}`),
  createAction: (data) => request("/actions", { method: "POST", body: JSON.stringify(data) }),
  updateAction: (id, data) => request(`/actions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  askAgent: (projectId, question) =>
    request("/agent", { method: "POST", body: JSON.stringify({ projectId, question }) }),

  simulate: (projectId, changes) =>
    request("/simulate", { method: "POST", body: JSON.stringify({ projectId, changes }) }),

  generateReport: (projectId) => request("/report", { method: "POST", body: JSON.stringify({ projectId }) }),

  getHistory: (projectId) => request(`/history?projectId=${projectId}`),
};
