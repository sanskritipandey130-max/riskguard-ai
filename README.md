# 🛡️ RiskGuard AI

> **Detect risks. Predict impact. Take action.**

RiskGuard AI is an AI-powered risk management platform for businesses, startups, and projects. It detects potential risks from real business signals, explains why they exist, scores their severity and probability, and drives an AI Risk Agent that recommends and tracks mitigation actions.

---

## 🚀 Why RiskGuard AI?

Most businesses discover risk only after it becomes a crisis:

- Cash-flow problems
- Customer churn
- Supplier dependency
- Cybersecurity gaps
- Missed deadlines
- Market uncertainty
- Operational capacity issues

RiskGuard AI changes this from **reactive risk management** to **proactive decision support**.

Instead of simply telling a business that something is wrong, RiskGuard AI answers:

**What is the risk? → How serious is it? → Why is it happening? → What should we do next?**

---

## 🎯 Problem Statement

Traditional risk management is often manual, reactive, and difficult to monitor continuously.

Teams may have spreadsheets, dashboards, or reports, but they still need to manually interpret business signals and decide what action to take.

RiskGuard AI provides a centralized platform that:

1. Detects risks automatically
2. Explains the cause of each risk
3. Calculates probability and impact
4. Prioritizes risks visually
5. Generates mitigation actions
6. Simulates possible future scenarios
7. Tracks risk history and actions

---

## 💡 Solution

RiskGuard AI uses a **hybrid detection pipeline** that combines deterministic business rules with AI-generated explanations and recommendations.

```text
                    USER / BUSINESS DATA
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Risk Rules Engine  │
                 │ Deterministic Rules  │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    AI Analysis       │
                 │   Google Gemini      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    Risk Scoring      │
                 │ Probability × Impact │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    AI Risk Agent     │
                 │ Monitor → Detect →   │
                 │ Analyze → Prioritize │
                 │ → Recommend → Act   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    Action Center     │
                 │ 30-Day Mitigation   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ History & Simulator  │
                 └──────────────────────┘
```

### 🔑 Important Design Principle

The **rules engine is authoritative for numbers** such as probability, impact, score, and severity.

The AI layer is responsible for making explanations, recommendations, and conversational responses more useful.

This separation makes the risk calculations **deterministic, explainable, and reproducible**, while still using AI where it adds the most value.

If the Gemini API is unavailable, RiskGuard AI can use deterministic fallback behavior so the core experience continues to work.

---

# ✨ Key Features

## 1. 📊 Risk Dashboard

A centralized dashboard provides an overview of:

- Overall risk score
- Total detected risks
- Critical and high-priority risks
- Risk categories
- Recent activity
- Risk trends

---

## 2. ⚠️ 8 Risk Categories

RiskGuard AI currently evaluates risks across:

| Category | Example Risk |
|---|---|
| 💰 Financial | Cash flow and liquidity |
| ⚙️ Operational | Capacity and execution |
| 📈 Market | Competition, volatility, demand |
| 🔐 Cybersecurity | MFA and security controls |
| ⚖️ Compliance | Security training and compliance gaps |
| 👥 Customer | Churn and customer concentration |
| 🚚 Supply Chain | Supplier dependency |
| 📅 Project / Deadline | Delays and incomplete work |

---

# 📐 Risk Scoring Methodology

RiskGuard AI uses a transparent 5×5 risk scoring system.

```text
Risk Score = Probability × Impact
```

Both values range from **1 to 5**.

```text
Probability: 1 → 5
Impact:      1 → 5

Maximum Risk Score = 25
```

### Severity Bands

| Score | Severity |
|---:|---|
| 1–5 | 🟢 Low |
| 6–10 | 🟡 Medium |
| 11–15 | 🟠 High |
| 16–25 | 🔴 Critical |

The dashboard also calculates an overall normalized risk score using the individual risks.

---

# 🎯 Deterministic Risk Rules

The rules engine evaluates business signals using transparent conditions.

| Business Signal | Risk Detected |
|---|---|
| Expense growth > revenue growth | Cash Flow Risk |
| Cash reserve < 3× monthly expenses | Liquidity Risk |
| Outstanding payments > 25% of revenue | Receivables Risk |
| Top customer > 25% of revenue | Customer Concentration Risk |
| Customer churn > 8% | Customer Churn Risk |
| Suppliers ≤ 2 | Supply Chain Dependency Risk |
| Deadline ≤ 30 days & completion < 70% | Project Delay Risk |
| MFA disabled | Cybersecurity Risk |
| No data backups | Data Loss Risk |
| No security training | Compliance Risk |
| High volatility / competition / low demand | Market Risk |
| High customers-per-employee ratio | Operational Capacity Risk |

---

# 🤖 AI Risk Agent

The AI Risk Agent is designed specifically around the project's actual business data rather than behaving like a generic chatbot.

It follows a structured workflow:

```text
Monitor
   ↓
Detect
   ↓
Analyze
   ↓
Prioritize
   ↓
Recommend
   ↓
Act
   ↓
Monitor
```

The agent can help users understand:

- Why a risk exists
- Which risks deserve attention first
- What actions should be taken
- What could happen under different scenarios
- How to reduce exposure

---

# 🧠 AI-Powered Analysis

Google Gemini is used from the backend to enrich:

- Risk explanations
- Recommendations
- AI Agent responses
- What-If explanations
- Executive reports
- Mitigation planning

The AI does **not** determine the core numerical risk score.

This hybrid approach gives RiskGuard AI:

**Deterministic numbers + AI intelligence**

---

# 🎬 Demo Mode

RiskGuard AI includes a one-click demo experience using a realistic sample company called **NovaCart**, an e-commerce business.

Click:

> **Load Demo Data**

or

> **View Demo**

The application automatically:

1. Creates the NovaCart demo project
2. Loads realistic business signals
3. Runs the risk engine
4. Detects risks
5. Calculates risk scores
6. Generates recommendations
7. Populates the dashboard
8. Populates the risk matrix
9. Populates the Action Center

This makes the application suitable for a **3–5 minute live demonstration**.

---

# 📊 Risk Matrix

RiskGuard AI provides a visual **5×5 risk matrix**.

It plots detected risks according to:

- Probability
- Impact

This helps users immediately identify the risks that require the most attention.

---

# ✅ Action Center

The Action Center converts risk insights into actionable tasks.

Actions can be tracked through:

- Pending
- In Progress
- Completed
- Dismissed

This turns risk management from a passive report into an execution workflow.

---

# 📅 30-Day AI Mitigation Plan

RiskGuard AI can generate a phased 30-day mitigation plan.

```text
Days 1–7
Immediate risk containment

Days 8–14
Short-term corrective actions

Days 15–21
Process and operational improvements

Days 22–30
Longer-term stabilization
```

The plan is interactive and can be tracked through checkboxes.

---

# 🔮 What-If Simulator

The What-If Simulator allows users to change business assumptions and observe how risk exposure changes.

Example variables include:

- Revenue growth
- Expense growth
- Customer churn
- Cash reserve

The system then projects how the risk score may change and provides an explanation.

This helps teams evaluate:

> **"What happens if our business conditions change?"**

---

# 📄 AI Risk Report

RiskGuard AI can generate an executive-style risk report containing:

- Executive summary
- Top risks
- Risk trends
- Risk analysis
- Mitigation recommendations
- 30-day mitigation plan

The report can be printed to PDF directly from the browser.

---

# 📈 Risk History

Risk History allows users to monitor changes over time.

It includes:

- Risk score history
- Trend visualization
- Category filtering
- Historical snapshots

This makes it easier to understand whether risk exposure is improving or getting worse.

---

# 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 | User interface |
| Build Tool | Vite | Fast frontend development and production builds |
| Styling | Tailwind CSS | Responsive UI styling |
| Charts | Recharts | Risk charts and visualizations |
| Icons | Lucide React | Interface icons |
| Routing | React Router | Frontend navigation |
| Backend | Node.js | Server runtime |
| API | Express.js | REST API |
| Database | MongoDB | Persistent application data |
| ODM | Mongoose | MongoDB data modeling |
| AI | Google Gemini API | AI explanations and recommendations |
| Deployment | Vercel | Frontend hosting |
| Backend Hosting | Render | Backend API hosting |
| Database Hosting | MongoDB Atlas | Cloud database |
| Version Control | Git + GitHub | Source control and collaboration |

---

# 🏗️ Project Architecture

```text
riskguard-ai/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── server/
    ├── models/
    │   ├── Project
    │   ├── Risk
    │   ├── Action
    │   └── RiskHistory
    │
    ├── services/
    │   ├── riskEngine.js
    │   ├── geminiService.js
    │   ├── mitigationPlan.js
    │   ├── demoData.js
    │   └── store.js
    │
    ├── routes/
    │   ├── projects.js
    │   ├── risks.js
    │   ├── actions.js
    │   ├── analyze.js
    │   ├── agent.js
    │   ├── simulate.js
    │   ├── report.js
    │   └── history.js
    │
    ├── middleware/
    │   └── errorHandler.js
    │
    ├── config/
    │   └── db.js
    │
    └── server.js
```

---

# 🔄 Data Flow

```text
Business Signals
       ↓
Risk Rules Engine
       ↓
Risk Detection
       ↓
Probability + Impact
       ↓
Risk Score
       ↓
Severity Classification
       ↓
Gemini AI Enrichment
       ↓
Recommendations
       ↓
AI Risk Agent
       ↓
Action Center
       ↓
Risk History
```

---

# 🔌 API Documentation

### Base URL

For local development:

```text
http://localhost:5000/api
```

For production, use the deployed Render backend URL configured through `VITE_API_URL`.

### Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Server and AI availability |
| GET | `/projects` | List projects |
| POST | `/projects` | Create a project |
| GET | `/projects/:id` | Get a project |
| POST | `/projects/demo` | Load NovaCart demo |
| POST | `/analyze-risk` | Run risk analysis |
| GET | `/risks?projectId=` | List project risks |
| GET | `/risks/:id` | Get a specific risk |
| PATCH | `/risks/:id` | Update a risk |
| GET | `/actions?projectId=` | List project actions |
| POST | `/actions` | Create an action |
| PATCH | `/actions/:id` | Update action status |
| POST | `/agent` | Ask the AI Risk Agent |
| POST | `/simulate` | Run What-If simulation |
| POST | `/report` | Generate executive report |
| GET | `/history?projectId=` | Get risk history |

AI-related endpoints return a `source` field indicating whether the response came from:

```text
ai
fallback
hybrid
```

---

# 🔐 Environment Variables

## Backend

Create:

```text
server/.env
```

Example:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

## Frontend

Create:

```text
client/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

### ⚠️ Security

Never commit:

```text
.env
```

to GitHub.

Never expose the Gemini API key in frontend code.

API keys should remain on the backend.

---

# 💻 Installation

## 1. Clone the repository

```bash
git clone https://github.com/sanskritipandey130-max/riskguard-ai.git
cd riskguard-ai
```

---

## 2. Install backend dependencies

```bash
cd server
npm install
```

Create your `.env` file using the environment variables above.

Start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

---

## 3. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Running the Demo

After starting both frontend and backend:

1. Open the frontend
2. Click **View Demo** or **Load Demo Data**
3. Select the NovaCart demo
4. Explore the Dashboard
5. Open the Risk Matrix
6. Review individual risks
7. Open the AI Risk Agent
8. Check the Action Center
9. Try the What-If Simulator
10. Generate the Risk Report

No external AI API key is required for the deterministic fallback experience.

---

# ☁️ Deployment

RiskGuard AI is designed as a full-stack application.

```text
                 GitHub
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       Vercel               Render
     Frontend              Backend
          │                   │
          │                   ▼
          │             MongoDB Atlas
          │
          └────── REST API ────┘
```

---

## 🌐 Frontend — Vercel

Recommended configuration:

```text
Root Directory: client
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Add:

```env
VITE_API_URL=https://YOUR-BACKEND-URL/api
```

Deploy the frontend.

---

## 🖥️ Backend — Render

Recommended configuration:

```text
Root Directory: server
Build Command: npm install
Start Command: node server.js
```

Add environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
CLIENT_ORIGIN=https://YOUR-VERCEL-URL
```

Render provides the production `PORT` automatically.

---

# 🍃 MongoDB Atlas

MongoDB Atlas can be used for persistent cloud storage.

Basic setup:

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Configure network access
4. Copy the MongoDB connection string
5. Add it as `MONGODB_URI` in the backend environment variables

If MongoDB is not configured, the application can use its in-memory fallback store.

That means the core demo can still run, although data will not persist across server restarts.

---

# 🛡️ Security & Reliability

RiskGuard AI follows several principles:

### Deterministic risk calculations

Probability, impact, score, and severity are calculated by the rules engine rather than generated freely by AI.

### Backend-only AI API access

The Gemini API key is used only on the backend.

### Environment-based configuration

Secrets and deployment-specific values are stored through environment variables.

### Graceful AI fallback

If AI is unavailable, deterministic fallback responses keep the core application functional.

### Explainability

Risk rules are explicit and inspectable rather than being completely opaque.

---

# 🎯 Example Use Cases

RiskGuard AI can be adapted for:

### 🏪 Startups

Monitor financial health, customer churn, supplier dependency, and operational risks.

### 🛒 E-commerce

Identify customer concentration, payment issues, churn, supply chain risks, and market threats.

### 📦 Operations

Monitor capacity, suppliers, deadlines, and operational bottlenecks.

### 💻 Technology Teams

Track cybersecurity, compliance, project delays, and operational risks.

### 📊 Business Management

Give decision-makers a centralized view of current risks and recommended actions.

---

# 🏆 Buildathon Value Proposition

RiskGuard AI demonstrates how AI can be used beyond a simple chatbot.

The platform combines:

- Structured business data
- Deterministic business logic
- AI-powered reasoning
- Risk scoring
- Scenario simulation
- Action generation
- Historical monitoring
- Executive reporting

The result is an **AI-powered decision-support system** that helps businesses move from:

```text
Reactive
   ↓
Identify problem
   ↓
Analyze manually
   ↓
Decide
   ↓
Act
```

to:

```text
Proactive
   ↓
Detect
   ↓
Analyze
   ↓
Prioritize
   ↓
Recommend
   ↓
Act
   ↓
Monitor
```

---

# 🎥 Suggested Demo Flow

For a short buildathon presentation:

### 1. Landing Page

Introduce RiskGuard AI and the problem it solves.

### 2. Load Demo

Click **Load Demo Data**.

### 3. Dashboard

Show:

- Overall risk score
- Detected risks
- Severity
- Risk categories

### 4. Risk Matrix

Show how risks are prioritized visually.

### 5. Risk Details

Open a high or critical risk and explain:

- Why it was detected
- Probability
- Impact
- Score
- Recommended action

### 6. AI Risk Agent

Ask the agent a question about the project's risks.

### 7. Action Center

Show how recommendations become trackable actions.

### 8. What-If Simulator

Change business conditions and show the projected risk impact.

### 9. Report

Generate the executive risk report.

---

# 📸 Screenshots

Add your production screenshots here before final submission:

```text
docs/
├── dashboard.png
├── risk-matrix.png
├── ai-agent.png
├── action-center.png
├── simulator.png
└── report.png
```

Then add them to this README using:

```md
![Dashboard](docs/dashboard.png)
```

---

# 📁 Important Files

| File | Purpose |
|---|---|
| `client/src/services/api.js` | Frontend API communication |
| `server/services/riskEngine.js` | Deterministic risk detection and scoring |
| `server/services/geminiService.js` | Gemini AI integration |
| `server/services/mitigationPlan.js` | 30-day mitigation plan |
| `server/services/demoData.js` | NovaCart demo data |
| `server/services/store.js` | MongoDB/in-memory data layer |
| `server/config/db.js` | MongoDB connection |
| `server/server.js` | Express server entry point |

---

# 🔮 Future Improvements

Potential future versions could include:

- Multi-user authentication
- Organization and team accounts
- Multi-tenant projects
- Document upload and automated data extraction
- PDF/CSV business-data ingestion
- Scheduled risk re-analysis
- Continuous monitoring
- Slack and email alerts
- Custom industry-specific rules
- Per-risk historical charts
- Advanced predictive forecasting
- External business system integrations
- Automated risk threshold alerts

---

# 🧩 Design Philosophy

RiskGuard AI is built around three principles:

### 1. Explainability

Users should understand why a risk was detected.

### 2. Actionability

A risk insight should lead to a concrete next step.

### 3. Reliability

AI should enhance the system without becoming the sole source of truth for numerical risk calculations.

---

# ⚠️ Disclaimer

RiskGuard AI provides AI-generated risk insights for decision support.

It does not replace professional:

- Financial advice
- Legal advice
- Compliance advice
- Cybersecurity advice
- Business consulting

Users should independently validate important decisions.

---

# 👩‍💻 Project

**RiskGuard AI**

Built as an AI-powered risk management platform demonstrating the combination of:

**AI + Business Intelligence + Risk Analytics + Decision Support**

---

# ⭐ If you find this project interesting

Consider giving the repository a ⭐ on GitHub.

---

## 📜 License

This project is provided for educational, demonstration, and buildathon purposes.
