# NexusGovernance AI — Enterprise Delivery Governance & Multi-Agent Swarm

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-gray?logo=express)](https://expressjs.com/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_API-3.8_Flash-orange?logo=google)](https://ai.google.dev/)
[![DORA Elite](https://img.shields.io/badge/DORA_Metrics-Elite_Tier-emerald)](#devops--itil-5-governance)
[![ITIL 5 Master](https://img.shields.io/badge/ITIL_5-Service_Value_System-purple)](#itil-5-change-enablement-gate)
[![PMBOK 7](https://img.shields.io/badge/PMBOK_7-Earned_Value_Management-amber)](#evm-predictive-controls)
[![Dual-Ledger Audit](https://img.shields.io/badge/Audit-SHA--256_Chained-cyan)](#dual-ledger-audit-architecture)

> **NexusGovernance AI** is a full-stack, enterprise-grade project delivery governance platform powered by an autonomous **Five-Agent AI Swarm**. It seamlessly integrates predictive Earned Value Management (EVM) controls, interactive Work Breakdown Structure (WBS) and Critical Path Gantt scheduling, Agile/Scrum ceremony cadence with Definition of Done (DoD) verification, DORA DevOps engineering metrics, ITIL 5 service value streams, automated multi-tab Excel telemetry exports, and an immutable SHA-256 cryptographically chained dual-ledger audit engine protected by deterministic Human-in-the-Loop (HITL) checkpoints.

---

## 🌟 Executive Architectural Overview

```
                                      ┌─────────────────────────────────────────────────────────┐
                                      │             NexusGovernance AI Orchestrator             │
                                      │        (State Transitions & Tool Invocations)           │
                                      └───────────────────────────┬─────────────────────────────┘
                                                                  │
              ┌───────────────────────────┬───────────────────────┼────────────────────────┬───────────────────────────┐
              ▼                           ▼                       ▼                        ▼                           ▼
   ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
   │  Scrum & Delivery     │   │  Resource & EVM       │   │  DevOps &     │   │  Conversational       │   │  Security & Audit     │
   │  Orchestrator Agent   │   │  Financial Agent      │   │  ITIL 5 Agent │   │  RAG Specialist Agent │   │  Guardrail Agent      │
   ├───────────────────────┤   ├───────────────────────┤   ├───────────────┤   ├───────────────────────┤   ├───────────────────────┤
   │ • Burn-down telemetry │   │ • CPI / SPI / EAC     │   │ • DORA 4 KPIs │   │ • PMBOK 7 & Prince2   │   │ • RBAC Enforcement   │
   │ • Stalled (>48h) scan │   │ • Capacity heatmap    │   │ • ITIL Gates  │   │ • Agile story slicing │   │ • HITL Checkpoints    │
   │ • DoD Verification   │   │ • Excel (.xlsx) engine│   │ • P1/P2 PIRs  │   │ • Video chapter RAG   │   │ • SHA-256 Chaining    │
   └───────────────────────┘   └───────────────────────┘   └───────────────┘   └───────────────────────┘   └───────────────────────┘
              │                           │                       │                        │                           │
              └───────────────────────────┴───────────────────────┼────────────────────────┴───────────────────────────┘
                                                                  ▼
                                      ┌─────────────────────────────────────────────────────────┐
                                      │           Enterprise Dual-Ledger Architecture           │
                                      │   ┌───────────────────────────┬─────────────────────┐   │
                                      │   │ Operational Event Ledger  │ Security Audit Head │   │
                                      │   │ (Logins, Timesheets, DLs) │ (Append-Only Hashes)│   │
                                      │   └───────────────────────────┴─────────────────────┘   │
                                      └─────────────────────────────────────────────────────────┘
```

---

## 🤖 The Multi-Agent Swarm

The system deploys five autonomous agent personas operating under deterministic state machines, structured tool definitions (`/server/agents/tools.ts`), and continuous background telemetry:

| Agent Persona | Framework Scope | Core Telemetry & Automated Responsibilities |
| :--- | :--- | :--- |
| **Scrum & Delivery Orchestrator** | Scrum / Kanban / XP | Monitors cycle times, detects stalled stories ($>48\text{h}$ in Code Review or QA), validates Definition of Done (DoD) criteria, and triggers retrospective boards with automated telemetry snapshots. |
| **Resource & EVM Financial Agent** | PMBOK 7 / EVM | Calculates $BAC$, $PV$, $EV$, $AC$, $SV$, $CV$, $CPI$ ($0.939$), $SPI$ ($0.916$), and $EAC$ ($+\$48.7\text{k}$ projected overrun). Alerts on weekly capacity overloads ($>40\text{h}$) and formats multi-tab Excel workbooks. |
| **DevOps & ITIL 5 Governance Agent** | DORA / ITIL 5 SVS | Monitors DORA metrics (Deployment Frequency, Lead Time, Change Failure Rate, MTTR), evaluates release gates using change risk scores ($<35$), and links $P1/P2$ incidents to WBS items with draft Post-Incident Reviews (PIR). |
| **Conversational RAG Specialist** | PMBOK / Prince2 / ITIL | Interactive domain expert providing contextual retrieval over indexed framework guides, video chapter transcripts, and bottleneck triage (e.g., SPIDR story slicing, WIP limits). |
| **Security & Audit Guardrail Agent** | Zero-Trust / SHA-256 | Validates RBAC across 5 roles, intercepts sensitive mutations into Human-in-the-Loop (HITL) queues, and appends cryptographically linked SHA-256 blocks to the Security Audit Ledger. |

---

## 🚀 Key Functional Modules

### 1. Scope, WBS & Critical Path Schedule Engine
- **Multi-Level Work Breakdown Structure (WBS)**: Hierarchical 5-level breakdown (*Initiative $\to$ Epic $\to$ Feature $\to$ Story $\to$ Task*).
- **Interactive Gantt & Critical Path Engine**: Visual Gantt chart supporting dependency links (*Finish-to-Start, Start-to-Start, Finish-to-Finish*), baseline vs. actual tracking, critical path calculations, and today-marker tracking.

### 2. Agile Delivery Board (Kanban / Scrum)
- **Six Delivery Stages**: *Backlog, Ready, In Progress, Code Review, QA / Verification, Done*.
- **WIP Limit Discipline**: Real-time warnings when Work-in-Progress thresholds on middle columns are breached.
- **Stalled Story Triage**: Highlights stories that exceed $48\text{ hours}$ in Code Review or QA with direct agent escalation.
- **Definition of Done (DoD) Gate**: Interactive checklist requiring unit test passing ($\ge 90\%$), SonarQube zero-blocker scans, peer reviews, and latency SLAs before cards can advance to *Done*.

### 3. Predictive EVM Financials, Capacity & Excel Engine
- **Predictive EVM Dashboard**: Computes $BAC$, $PV$, $EV$, $AC$, $SV$, $CV$, $SPI$, $CPI$, $EAC$, $VAC$, $TCPI$, and weekly burn rate.
- **Capacity & Workload Heatmap**: Visual matrix tracking individual hours against standard $40\text{h/week}$ baselines, highlighting overloaded engineers (e.g., Devon Lee at $48.5\text{h}$) with agent-assisted rebalancing.
- **Timesheet & Expense Logger**: Daily and weekly task-based logging with category tags (*Development, Review, Ops, Governance*) and procurement expense workflows with receipts and multi-tier approval.
- **Server-Side Multi-Tab Excel Telemetry Engine (`exceljs`)**:
  - *Tab 1: Financial & EVM Summary* (BAC, CPI, SPI, with native Excel `SUM` and `AVERAGE` formulas).
  - *Tab 2: Itemized Timesheet Records* (Member ID, date, WBS code, hours, rate, total cost).
  - *Tab 3: Approved & Pending Expense Ledger*.
  - Sanitization against formula injection exploits (CWE-1236).

### 4. DevOps & ITIL 5 Governance
- **DORA 4 Key Metrics Dashboard**:
  - *Deployment Frequency*: $2.8 / \text{day}$ (High Tier)
  - *Lead Time for Changes*: $18.5 \text{ hours}$ (High Tier)
  - *Change Failure Rate (CFR)*: $4.2\%$ (Elite Tier $< 5\%$)
  - *Time to Restore Service (MTTR)*: $39 \text{ minutes}$ (Elite Tier $< 1\text{h}$)
- **ITIL 5 Change Enablement Release Gate**: Risk scoring model ($28/100$) evaluating code churn, test coverage, and rollback readiness before gating production deployments.
- **Post-Incident Review (PIR) Linkage**: Connects production incidents ($P1/P2$) to WBS releases and feeds corrective action items into the retrospective backlog.

### 5. Automated Retrospectives & Cadence Rollover
- **Multi-Template Retrospective Boards**: Supports *Stop/Start/Continue*, *4Ls (Liked, Learned, Lacked, Longed For)*, and *Mad/Sad/Glad* templates with voting and AI sentiment synthesis.
- **Action Item Rollover Engine**: Automatically identifies unresolved continuous improvement items from prior retrospectives and rolls them directly into the upcoming sprint backlog as technical debt stories.

### 6. Multimedia Knowledge Hub & Live Resources
- **Curated Standards Library**: Structured guides on PMBOK 7, Scrum Guide 2020, DORA DevOps, ITIL 5 Service Value System, and GRC Dual-Ledger.
- **Embedded Multimedia**: Video tutorials with synchronized chapter transcripts and clickable timestamps.
- **Interactive RAG Query Interface**: Natural language search with cited excerpts and deep links to relevant project artifacts.

### 7. Enterprise Security, RBAC & Dual-Ledger Audit
- **Role-Based Access Control (RBAC)**: Five distinct roles supported with an active switcher:
  - 🛡️ **Admin** (Elena Rostova): Full system governance and budget baseline locking.
  - 📊 **Delivery Manager / PM** (Marcus Vance): HITL checkpoint approval and EVM controls.
  - ⚡ **Scrum Master** (Aisha Al-Mansoor): Flow management, retrospectives, and debt rollover.
  - 💻 **Developer / SRE** (Devon Lee): Task execution, DoD verification, and timesheet logging.
  - 🔍 **External Auditor** (Sophia Sterling): Read-only cryptographic chain audit and export access.
- **Dual-Ledger Audit Architecture**:
  - *Operational Ledger*: High-throughput logging of user logins, stage transitions, timesheet updates, and export downloads (with actor, IP, and timestamp).
  - *Security Audit Ledger (Append-Only)*: SHA-256 cryptographically chained hash blocks capturing RBAC modifications, baseline shifts, and agent tool executions.
- **Cryptographic Chain Verification Engine**: One-click mathematical verification walking from the Genesis block to the current head digest to guarantee non-repudiation and tamper detection.
- **Human-in-the-Loop (HITL) Checkpoints**: Intercepts sensitive agent proposals into a modal requiring explicit Delivery Manager or Admin approval before state mutation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion |
| **Backend** | Express 4.x, Node.js, TSX, Vite Server Middleware |
| **AI & Multi-Agent Swarm** | Google GenAI SDK (`@google/genai` v2.4.0), `gemini-3.8-flash` |
| **Telemetry & Reporting** | ExcelJS (Streaming `.xlsx` generation, native Excel formulas) |
| **Security & Cryptography** | Node.js `crypto` (SHA-256 Merkle chain digest computation) |

---

## 📂 Project Structure

```
├── server.ts                       # Express backend server with Vite middleware integration
├── server/
│   ├── agents/
│   │   ├── orchestrator.ts         # Multi-agent orchestrator & Gemini API integration
│   │   └── tools.ts                # Agent tool definitions (EVM, DoD, HITL, retro triggers)
│   ├── data/
│   │   └── seedData.ts             # Initial enterprise seed data (WBS, EVM, DORA, ledgers)
│   └── services/
│       └── excelService.ts         # Multi-sheet Excel workbook generator (ExcelJS)
├── src/
│   ├── App.tsx                     # Main application layout & module router
│   ├── main.tsx                    # React DOM entry point
│   ├── index.css                   # Tailwind CSS global styles
│   ├── types/
│   │   └── index.ts                # TypeScript domain models (EVM, DORA, WBS, HITL, RBAC)
│   ├── context/
│   │   └── ProjectContext.tsx      # Global state provider & API synchronization
│   └── components/
│       ├── Header.tsx              # KPI ticker, RBAC switcher, HITL bell & export triggers
│       ├── AgentSwarmDrawer.tsx    # Multi-agent copilot drawer & autonomous scan telemetry
│       ├── HitlModal.tsx           # Human-in-the-Loop review and authorization modal
│       └── modules/
│           ├── WbsGanttModule.tsx        # Scope hierarchy & Critical Path Gantt chart
│           ├── AgileBoardModule.tsx      # Kanban board with WIP limits & DoD gates
│           ├── FinancialsModule.tsx      # EVM dashboard, capacity heatmap & timesheet logger
│           ├── DevOpsModule.tsx          # DORA metrics & ITIL 5 change enablement gate
│           ├── RetrospectivesModule.tsx  # Multi-template retro board & rollover engine
│           ├── KnowledgeHubModule.tsx    # RAG search & embedded video player with transcripts
│           └── AuditLedgerModule.tsx     # Dual-ledger audit & cryptographic SHA-256 verifier
├── package.json                    # Project dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build and dev server configuration
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher

### 1. Clone the repository
```bash
git clone https://github.com/your-username/nexus-governance-ai.git
cd nexus-governance-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
# Optional: Gemini API key for dynamic LLM reasoning
# (The platform features complete deterministic fallback reasoning if omitted)
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm run start
```

---

## 🔒 Security & Compliance

1. **CWE-1236 (Excel Formula Injection) Mitigation**:
   - All cell values in server-generated `.xlsx` telemetry workbooks are automatically sanitized to prevent malicious spreadsheet formula execution (`=`, `+`, `-`, `@`).
2. **Non-Repudiation Dual-Ledger**:
   - Security audit logs are immutable and cryptographically chained via SHA-256 digests. Any retroactive alteration invalidates downstream blocks, detectable via the live cryptographic verification tool.
3. **Deterministic Human-in-the-Loop (HITL) Enforcement**:
   - The AI agents cannot mutate budget baselines or override production release gates autonomously. Sensitive operations are intercepted into a pending queue requiring authorized human sign-off.

---

## 📄 License
This project is licensed under the Apache 2.0 License.
