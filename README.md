# RiskGuard AI

**Detect risks. Predict impact. Take action.**

An AI-powered risk management platform for businesses, startups, and projects. RiskGuard AI
detects potential risks from real business signals, explains why they exist, scores their
severity and probability, and drives an AI Risk Agent that recommends and tracks mitigation
actions — continuously.

---

## 1. Problem Statement

Most businesses discover risk only after it becomes a crisis: a cash-flow crunch, a churned
whale customer, a single-supplier disruption, a missed deadline. There's rarely a system that
proactively watches the numbers, explains *why* something is dangerous, and tells you exactly
what to do next.

## 2. Solution

RiskGuard AI ingests structured business data (financials, operations, customers, security,
market conditions) and runs it through a **hybrid detection pipeline**:

```
User Data
   ↓
Risk Rules Engine        (deterministic, explainable, always-on baseline)
   ↓
AI Analysis Layer        (Gemini — enriches explanations & recommendations)
   ↓
Risk Scoring             (Probability × Impact, 1–25, mapped to Low/Med/High/Critical)
   ↓
AI Risk Agent            (Monitor → Detect → Analyze → Prioritize → Recommend → Act → Monitor)
   ↓
Action Recommendations   (Action Center + 30-day mitigation plan)
   ↓
Monitoring & Feedback    (Risk History, trend charts, What-If Simulator)
```

The **rules engine is authoritative for numbers** (probability, impact, score) — it never
hallucinates. The **AI layer only sharpens explanations, recommendations, and conversation** —
and every AI feature has a deterministic, clearly-labelled fallback so the product still works
end-to-end even with no API key configured (essential for a live demo with unreliable wifi).

## 3. Key Features

- **8 risk categories**: Financial, Operational, Market, Cybersecurity, Compliance, Customer,
  Supply Chain, Project/Deadline
- **Transparent scoring**: Risk Score = Probability (1–5) × Impact (1–5) → 1–25 → severity band
- **Visual 5×5 risk matrix** plotting every detected risk
- **AI Risk Agent** — grounded conversational agent that only reasons from *your* actual data
  (not a generic chatbot), plus a live "Monitor → Detect → Analyze → Prioritize → Recommend →
  Act" activity timeline
- **Action Center** with status tracking (Pending / In Progress / Completed / Dismissed)
- **What-If Simulator** — drag sliders on revenue growth, expense growth, churn, cash reserve
  and see the projected risk score change with an AI-generated explanation
- **30-Day AI Mitigation Plan** — auto-generated, phased (Days 1–7 / 8–14 / 15–21 / 22–30),
  interactive with checkboxes
- **AI Risk Report generator** — executive summary, top risks, trend, full mitigation plan,
  printable to PDF from the browser
- **Demo Mode** — one-click "Load Demo Data" populates a realistic company (**NovaCart**,
  e-commerce) and runs a full analysis instantly, for live judge demos
- **Risk History** with category filters and a trend chart

## 4. Risk Scoring Methodology

```
Risk Score = Probability (1-5) × Impact (1-5)   → range 1-25

1-5   = Low
6-10  = Medium
11-15 = High
16-25 = Critical
```

The Dashboard's **Overall Risk Score (0-100)** is a severity-weighted, normalized aggregate of
all individual risk scores (see `computeOverallScore` in `server/services/riskEngine.js`), so a
single Critical risk moves the number meaningfully — the same way a real risk platform behaves.

### Deterministic rule examples (`server/services/riskEngine.js`)

| Condition | Risk raised |
|---|---|
| Expense growth > revenue growth | Cash Flow Risk (Financial) |
| Cash reserve < 3× monthly expenses | Liquidity Risk (Financial) |
| Outstanding payments > 25% of revenue | Receivables Risk (Financial) |
| Top customer > 25% of revenue | Customer Concentration Risk |
| Customer churn > 8% | Customer Churn Risk |
| Suppliers ≤ 2 | Supply Chain Dependency Risk |
| Deadline ≤ 30 days & completion < 70% | Project Delay Risk |
| MFA disabled | Cybersecurity Risk |
| No data backups | Data Loss Risk |
| No security training | Compliance Risk |
| High volatility / competition / low demand | Market Risk |
| High customers-per-employee ratio | Operational Capacity Risk |

The AI layer (`server/services/geminiService.js`) then rewrites the `explanation` and
`recommendations` fields to be sharper and more specific — but never touches probability,
impact, score, or severity, so the numbers stay trustworthy and reproducible.

## 5. Tech Stack

**Frontend:** React 18 + Vite + Tailwind CSS + Recharts + Lucide React + React Router
**Backend:** Node.js + Express
**Database:** MongoDB (Mongoose) — falls back to an in-memory store automatically if no
`MONGODB_URI` is configured, so the app runs with zero external dependencies for a demo
**AI:** Google Gemini API (`gemini-1.5-flash` by default), called only from the backend

## 6. Project Structure

```
riskguard-ai/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/          # Sidebar, Layout, RiskCard, RiskMatrix, RiskBadge, StatCard...
│   │   ├── pages/                # Landing, Dashboard, RiskAssessment, AIAgent, RiskDetails,
│   │   │                         # ActionCenter, RiskHistory, Reports, WhatIfSimulator, Settings
│   │   ├── context/              # ProjectContext (active project/risks/actions state)
│   │   ├── services/api.js       # Typed fetch wrapper around the backend REST API
│   │   └── App.jsx / main.jsx
│   └── package.json
└── server/                      # Node/Express backend
    ├── models/                   # Project, Risk, Action, RiskHistory (Mongoose schemas)
    ├── services/
    │   ├── riskEngine.js          # Deterministic rules engine + scoring math
    │   ├── geminiService.js       # Gemini API calls with graceful fallback
    │   ├── mitigationPlan.js      # 30-day plan generator
    │   ├── demoData.js            # NovaCart demo dataset
    │   └── store.js               # Mongo-or-in-memory unified data layer
    ├── routes/                   # projects, risks, actions, analyze, agent, simulate, report, history
    ├── middleware/errorHandler.js
    ├── config/db.js
    └── server.js
```

## 7. API Documentation

Base URL: `http://localhost:5000/api`

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Server + AI availability status |
| GET | `/projects` | List all projects |
| POST | `/projects` | Create a project |
| GET | `/projects/:id` | Get a project |
| POST | `/projects/demo` | Load the NovaCart demo project + run analysis |
| POST | `/analyze-risk` | `{ projectId }` or `{ project: {...} }` — runs rules engine + AI enrichment, persists risks, seeds Action Center |
| GET | `/risks?projectId=` | List risks for a project |
| GET | `/risks/:id` | Get a single risk |
| PATCH | `/risks/:id` | Update a risk (e.g. status) |
| GET | `/actions?projectId=` | List actions for a project |
| POST | `/actions` | Create an action |
| PATCH | `/actions/:id` | Update an action's status |
| POST | `/agent` | `{ projectId, question }` — ask the AI Risk Agent |
| POST | `/simulate` | `{ projectId, changes }` — What-If simulation |
| POST | `/report` | `{ projectId }` — generate the executive report + 30-day plan |
| GET | `/history?projectId=` | Risk score history/trend snapshots |

All AI-touching routes (`/analyze-risk`, `/agent`, `/simulate`, `/report`) return a `source`
field (`"ai" | "fallback" | "hybrid"`) so the frontend can show when it's using live AI vs.
deterministic fallback data.

## 8. Environment Variables

**`server/.env`** (copy from `server/.env.example`):

```
MONGODB_URI=mongodb://localhost:27017/riskguard   # optional — falls back to in-memory store
GEMINI_API_KEY=                                     # optional — falls back to deterministic AI
GEMINI_MODEL=gemini-1.5-flash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

**`client/.env`** (copy from `client/.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

Get a Gemini API key at https://aistudio.google.com/app/apikey — never commit it, never put it
in frontend code (it's only ever read on the backend).

## 9. Installation & Running Locally

```bash
# 1. Clone / unzip the project, then in two terminals:

# Terminal 1 — backend
cd server
cp .env.example .env      # then fill in MONGODB_URI / GEMINI_API_KEY if you have them
npm install
npm run dev                # or: npm start

# Terminal 2 — frontend
cd client
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**. Click **"View Demo"** or **"Load Demo Data"** to instantly see
a full risk analysis for the NovaCart sample company — no API keys required.

## 10. How to Use Demo Mode

The Landing page and the empty-state screens both expose a **"Load Demo Data" / "View Demo"**
button. This calls `POST /api/projects/demo`, which creates the NovaCart demo project (₹10L
revenue, 18% expense growth, 32% customer concentration, MFA disabled, etc.), instantly runs the
full rules engine, and populates the Dashboard, Risk Matrix, and Action Center — ideal for a
3–5 minute judge walkthrough (see the suggested demo flow in the buildathon brief).

## 11. Deployment

**Frontend (Vercel)**
1. Push `client/` to a GitHub repo (or the whole monorepo with `client` as the root directory).
2. Import the repo in Vercel, set the root directory to `client`.
3. Add environment variable `VITE_API_URL` pointing to your deployed backend, e.g.
   `https://your-backend.onrender.com/api`.
4. Deploy — Vercel auto-detects the Vite build (`npm run build`, output `dist/`).

**Backend (Render or Railway)**
1. Push `server/` (or the monorepo with `server` as the root/start directory).
2. Create a new Web Service, root directory `server`, build command `npm install`, start
   command `npm start`.
3. Add environment variables: `MONGODB_URI`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `PORT` (Render
   sets this automatically), `CLIENT_ORIGIN` (your Vercel URL).
4. Deploy.

**Database (MongoDB Atlas)**
1. Create a free cluster at https://www.mongodb.com/atlas.
2. Create a database user + allow-list your backend's IP (or `0.0.0.0/0` for a hackathon demo).
3. Copy the connection string into `MONGODB_URI` on your backend host.
4. If you skip this step entirely, RiskGuard AI still runs fully functional on its in-memory
   store — data just won't persist across server restarts.

## 12. Future Improvements

- Multi-user authentication & organizations (multi-tenant projects)
- Document upload with real PDF/CSV parsing feeding directly into the rules engine
- Scheduled/cron-based re-analysis for true continuous monitoring
- Slack/email alerting when a risk crosses a severity threshold
- Per-risk historical score charts (not just the overall trend)
- Configurable custom rules per industry

## 13. Disclaimer

RiskGuard AI provides AI-generated risk insights for decision support and does not replace
professional financial, legal, compliance, or cybersecurity advice.
