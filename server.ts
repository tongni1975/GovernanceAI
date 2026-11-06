import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { initialProjectState } from './server/data/seedData.ts';
import { ProjectState, AuditLedgerEntry, Role, WbsStage } from './src/types/index.ts';
import { generateEnterpriseExcelWorkbook } from './server/services/excelService.ts';
import { processAgentMessage, runAutonomousSwarmScan } from './server/agents/orchestrator.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory canonical program state
let projectState: ProjectState = JSON.parse(JSON.stringify(initialProjectState));

// Helper: Log operational event
function logOperational(action: string, resource: string, details: string, req: Request, role: Role = 'DELIVERY_MANAGER', name: string = 'Marcus Vance') {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const entry: AuditLedgerEntry = {
    id: `op-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ledgerType: 'OPERATIONAL',
    action,
    userId: 'usr-session',
    userName: name,
    userRole: role,
    resource,
    details,
    ipAddress: ip,
  };
  projectState.operationalLedger.unshift(entry);
}

// Helper: Append to security audit ledger with SHA-256 hash chaining
function appendSecurityBlock(action: string, resource: string, details: string, req: Request, role: Role, name: string) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const lastBlock = projectState.securityLedger[projectState.securityLedger.length - 1];
  const prevHash = lastBlock?.hash || '0000000000000000000000000000000000000000000000000000000000000000';
  const timestamp = new Date().toISOString();
  const payload = `${prevHash}|${timestamp}|${action}|${resource}|${details}`;
  const hash = crypto.createHash('sha256').update(payload).digest('hex');

  const block: AuditLedgerEntry = {
    id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    ledgerType: 'SECURITY_AUDIT',
    action,
    userId: 'usr-security-actor',
    userName: name,
    userRole: role,
    resource,
    details,
    ipAddress: ip,
    previousHash: prevHash,
    hash,
    isImmutableChainVerified: true,
  };

  projectState.securityLedger.push(block);
  return block;
}

// Recompute EVM dynamically
function recalculateEvm() {
  const totalPlannedHours = projectState.wbs.reduce((acc, curr) => acc + (curr.plannedHours || 0), 0);
  const totalActualHours = projectState.wbs.reduce((acc, curr) => acc + (curr.actualHours || 0), 0);
  
  // Approximate progress weighted
  const completedProgressRatio = projectState.wbs.reduce((acc, curr) => acc + (curr.progress * (curr.plannedHours || 10)), 0) / (totalPlannedHours * 100 || 1);
  
  const bac = projectState.baselineBudget;
  const ev = Math.round(bac * Math.min(completedProgressRatio, 0.95));
  const timesheetCost = projectState.timesheets.reduce((acc, ts) => acc + ts.totalCost, 0);
  const expenseCost = projectState.expenses.filter(e => e.status === 'APPROVED').reduce((acc, exp) => acc + exp.amount, 0);
  const ac = 350000 + timesheetCost + expenseCost; // Base direct costs + items
  const pv = 420000;

  const sv = ev - pv;
  const cv = ev - ac;
  const spi = Number((ev / (pv || 1)).toFixed(3));
  const cpi = Number((ev / (ac || 1)).toFixed(3));
  const eac = Math.round(cpi > 0 ? bac / cpi : bac);
  const vac = bac - eac;
  const tcpi = Number(((bac - ev) / Math.max(bac - ac, 1)).toFixed(3));

  projectState.evm = {
    pv,
    ev,
    ac,
    bac,
    sv,
    cv,
    spi,
    cpi,
    eac,
    vac,
    tcpi,
    burnRateWeekly: 34500,
    projectedOverrun: Math.max(0, eac - bac),
    statusHealth: cpi < 0.92 || spi < 0.9 ? 'CRITICAL' : cpi < 0.98 || spi < 0.95 ? 'AT_RISK' : 'ON_TRACK',
  };
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Full state sync
app.get('/api/state', (req: Request, res: Response) => {
  res.json(projectState);
});

// Update WBS Stage (with Definition of Done enforcement)
app.patch('/api/wbs/:id/stage', (req: Request, res: Response) => {
  const { id } = req.params;
  const { stage, userRole, userName } = req.body as { stage: WbsStage; userRole: Role; userName: string };
  const item = projectState.wbs.find((w) => w.id === id);

  if (!item) {
    res.status(404).json({ error: 'WBS item not found' });
    return;
  }

  // Definition of Done verification for DONE stage
  if (stage === 'DONE') {
    const incompleteDod = item.dodChecklist.filter((d) => !d.completed);
    if (incompleteDod.length > 0) {
      res.status(400).json({
        error: 'Definition of Done gate failed',
        message: `Cannot transition ${item.code} to DONE. ${incompleteDod.length} checklist item(s) incomplete: "${incompleteDod[0].text}"`,
        incompleteDod,
      });
      return;
    }
    item.progress = 100;
  } else if (stage === 'IN_PROGRESS') {
    item.progress = Math.max(item.progress, 30);
  } else if (stage === 'CODE_REVIEW') {
    item.progress = Math.max(item.progress, 75);
  } else if (stage === 'QA') {
    item.progress = Math.max(item.progress, 85);
  }

  const oldStage = item.stage;
  item.stage = stage;
  item.timeInCurrentStageHours = 0; // Reset stage timer
  item.isStalled = false;
  item.stalledReason = undefined;

  logOperational(
    'STAGE_TRANSITION',
    `WBS_${item.code}`,
    `Transitioned from ${oldStage} -> ${stage}`,
    req,
    userRole || 'DELIVERY_MANAGER',
    userName || 'Delivery Lead'
  );

  recalculateEvm();
  res.json({ item, evm: projectState.evm });
});

// Toggle DoD Item
app.patch('/api/wbs/:id/dod/:dodId', (req: Request, res: Response) => {
  const { id, dodId } = req.params;
  const { completed, userRole, userName } = req.body;
  const item = projectState.wbs.find((w) => w.id === id);
  if (!item) {
    res.status(404).json({ error: 'WBS item not found' });
    return;
  }

  const dod = item.dodChecklist.find((d) => d.id === dodId);
  if (!dod) {
    res.status(404).json({ error: 'DoD item not found' });
    return;
  }

  dod.completed = completed;
  logOperational(
    'DOD_VERIFICATION',
    `WBS_${item.code}`,
    `Marked DoD criterion "${dod.text}" as ${completed ? 'VERIFIED' : 'PENDING'}`,
    req,
    userRole,
    userName
  );

  res.json({ item });
});

// Add Timesheet Entry
app.post('/api/timesheets', (req: Request, res: Response) => {
  const { memberId, date, wbsId, category, hours, notes, userRole, userName } = req.body;
  const user = projectState.users.find((u) => u.id === memberId) || projectState.users[0];
  const wbs = projectState.wbs.find((w) => w.id === wbsId) || projectState.wbs[0];

  const parsedHours = parseFloat(hours) || 1;
  const hourlyRate = user.hourlyRate || 130;
  const totalCost = Math.round(parsedHours * hourlyRate);

  const entry = {
    id: `ts-${Date.now()}`,
    memberId: user.id,
    memberName: user.name,
    date: date || new Date().toISOString().split('T')[0],
    wbsId: wbs.id,
    wbsCode: wbs.code,
    wbsTitle: wbs.title,
    category: category || 'DEVELOPMENT',
    hours: parsedHours,
    hourlyRate,
    totalCost,
    status: 'SUBMITTED' as const,
    notes: notes || '',
  };

  projectState.timesheets.unshift(entry);
  wbs.actualHours += parsedHours;

  logOperational(
    'TIMESHEET_ENTRY_CREATED',
    `TS_${entry.id}`,
    `Logged ${parsedHours} hours ($${totalCost}) on ${wbs.code}`,
    req,
    userRole,
    userName
  );

  recalculateEvm();
  res.json({ entry, evm: projectState.evm });
});

// Approve Timesheet
app.patch('/api/timesheets/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userRole, userName } = req.body;
  const ts = projectState.timesheets.find((t) => t.id === id);
  if (!ts) {
    res.status(404).json({ error: 'Timesheet entry not found' });
    return;
  }

  ts.status = 'APPROVED';
  ts.approvedBy = userName || 'Delivery Lead';

  logOperational(
    'TIMESHEET_APPROVED',
    `TS_${ts.id}`,
    `Approved ${ts.hours}h for ${ts.memberName}`,
    req,
    userRole,
    userName
  );

  res.json({ entry: ts });
});

// Add Expense Entry
app.post('/api/expenses', (req: Request, res: Response) => {
  const { memberId, category, description, amount, billable, receiptName, userRole, userName } = req.body;
  const user = projectState.users.find((u) => u.id === memberId) || projectState.users[0];

  const entry = {
    id: `exp-${Date.now()}`,
    memberId: user.id,
    memberName: user.name,
    date: new Date().toISOString().split('T')[0],
    category: category || 'CLOUD_INFRA',
    description: description || 'Project operational expense',
    amount: parseFloat(amount) || 0,
    currency: 'USD',
    billable: Boolean(billable),
    receiptName: receiptName || 'invoice-receipt.pdf',
    status: 'PENDING' as const,
  };

  projectState.expenses.unshift(entry);
  logOperational('EXPENSE_SUBMITTED', `EXP_${entry.id}`, `Submitted $${entry.amount} (${entry.category})`, req, userRole, userName);

  res.json({ entry });
});

// Approve Expense Entry
app.patch('/api/expenses/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userRole, userName } = req.body;
  const exp = projectState.expenses.find((e) => e.id === id);
  if (!exp) {
    res.status(404).json({ error: 'Expense not found' });
    return;
  }

  exp.status = 'APPROVED';
  exp.approver = userName || 'Elena Rostova';

  logOperational('EXPENSE_APPROVED', `EXP_${exp.id}`, `Approved $${exp.amount} for ${exp.description}`, req, userRole, userName);
  recalculateEvm();
  res.json({ entry: exp, evm: projectState.evm });
});

// Retrospective Card Vote
app.post('/api/retrospectives/:id/cards/:cardId/vote', (req: Request, res: Response) => {
  const { id, cardId } = req.params;
  const retro = projectState.retrospectives.find((r) => r.id === id);
  if (!retro) {
    res.status(404).json({ error: 'Retrospective not found' });
    return;
  }

  for (const col of retro.columns) {
    const card = col.cards.find((c) => c.id === cardId);
    if (card) {
      card.votes += 1;
      res.json({ card });
      return;
    }
  }

  res.status(404).json({ error: 'Card not found' });
});

// Add Retrospective Card
app.post('/api/retrospectives/:id/cards', (req: Request, res: Response) => {
  const { id } = req.params;
  const { columnId, text, author } = req.body;
  const retro = projectState.retrospectives.find((r) => r.id === id);
  if (!retro) {
    res.status(404).json({ error: 'Retrospective not found' });
    return;
  }

  const column = retro.columns.find((c) => c.id === columnId);
  if (!column) {
    res.status(404).json({ error: 'Column not found' });
    return;
  }

  const newCard = {
    id: `rc-${Date.now()}`,
    author: author || 'Team Member',
    text,
    votes: 1,
  };
  column.cards.push(newCard);

  res.json({ card: newCard });
});

// Rollover Action Item to Upcoming Backlog
app.post('/api/retrospectives/:id/action-items/:actId/rollover', (req: Request, res: Response) => {
  const { id, actId } = req.params;
  const { userRole, userName } = req.body;
  const retro = projectState.retrospectives.find((r) => r.id === id);
  if (!retro) {
    res.status(404).json({ error: 'Retrospective not found' });
    return;
  }

  const item = retro.actionItems.find((a) => a.id === actId);
  if (!item) {
    res.status(404).json({ error: 'Action item not found' });
    return;
  }

  item.status = 'ROLLED_OVER';
  item.targetSprint = 'Sprint 15 (Next)';

  // Insert as technical debt story into WBS
  const newWbsCode = `1.3.${projectState.wbs.length + 1}`;
  const newWbsItem = {
    id: `wbs-retro-${Date.now()}`,
    parentId: 'wbs-1.3',
    code: newWbsCode,
    title: `[Retro Debt Rollover] ${item.title}`,
    description: `Automated backlog insertion from Retrospective ${retro.sprintName}. Owner: ${item.owner}`,
    level: 'STORY' as const,
    assigneeName: item.owner,
    stage: 'BACKLOG' as const,
    storyPoints: 3,
    plannedHours: 16,
    actualHours: 0,
    startDate: '2026-11-13',
    endDate: '2026-11-20',
    baselineStartDate: '2026-11-13',
    baselineEndDate: '2026-11-20',
    progress: 0,
    dependencies: [],
    timeInCurrentStageHours: 0,
    dodChecklist: [
      { id: `dod-${Date.now()}-1`, text: 'Root cause verified resolved', completed: false },
      { id: `dod-${Date.now()}-2`, text: 'Automated test prevention suite integrated', completed: false },
    ],
  };

  projectState.wbs.push(newWbsItem);

  logOperational(
    'ACTION_ITEM_ROLLED_OVER',
    `RETRO_${retro.id}`,
    `Rolled action item "${item.title}" into WBS story ${newWbsCode}`,
    req,
    userRole,
    userName
  );

  res.json({ actionItem: item, newWbsItem });
});

// Resolve HITL (Human-in-the-Loop) Checkpoint
app.post('/api/hitl/:id/resolve', (req: Request, res: Response) => {
  const { id } = req.params;
  const { decision, userRole, userName, resolutionNote } = req.body as {
    decision: 'APPROVED' | 'REJECTED';
    userRole: Role;
    userName: string;
    resolutionNote?: string;
  };

  const action = projectState.hitlQueue.find((h) => h.id === id);
  if (!action) {
    res.status(404).json({ error: 'HITL action not found' });
    return;
  }

  // RBAC validation: Check if role is authorized
  const authorizedRoles: Role[] = ['ADMIN', 'DELIVERY_MANAGER'];
  if (!authorizedRoles.includes(userRole)) {
    res.status(403).json({
      error: 'Permission Denied',
      message: `Role "${userRole}" is not authorized to sign off on "${action.actionType}". Requires Delivery Manager or Admin.`,
    });
    return;
  }

  action.status = decision;
  action.resolvedBy = userName || 'Marcus Vance';
  action.resolvedAt = new Date().toISOString();
  action.resolutionNote = resolutionNote || `Signed off by ${userRole} via Human-in-the-Loop checkpoint.`;

  // Commit mutation if APPROVED
  if (decision === 'APPROVED') {
    if (action.actionType === 'REALLOCATE_TASK') {
      const task = projectState.wbs.find((w) => w.id === action.payload.taskId);
      if (task) {
        task.assigneeId = action.payload.toUserId;
        task.assigneeName = action.payload.toUserName;
      }
    } else if (action.actionType === 'OVERRIDE_PROD_GATE') {
      const release = projectState.dora.recentReleases.find((r) => r.version === action.payload.version);
      if (release) {
        release.approvedBy = userName;
      }
    }

    // Append cryptographic security block for sensitive mutation
    appendSecurityBlock(
      `HITL_${action.actionType}_APPROVED`,
      `HITL_${action.id}`,
      `Mutation approved and executed by ${userName} (${userRole}): ${action.description}`,
      req,
      userRole,
      userName
    );
  } else {
    appendSecurityBlock(
      `HITL_${action.actionType}_REJECTED`,
      `HITL_${action.id}`,
      `Mutation rejected by ${userName} (${userRole}). Note: ${resolutionNote || 'None'}`,
      req,
      userRole,
      userName
    );
  }

  res.json({ action, projectState });
});

// Autonomous Swarm Scan
app.post('/api/agents/scan', async (req: Request, res: Response) => {
  try {
    const scanResults = await runAutonomousSwarmScan(projectState);
    logOperational('SWARM_SCAN_EXECUTED', 'MULTI_AGENT_FRAMEWORK', 'Autonomous multi-agent scan across Scrum, EVM, DORA, and Security.', req);
    res.json(scanResults);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Interactive Agent Chat
app.post('/api/agents/chat', async (req: Request, res: Response) => {
  try {
    const { message, agentId, userRole, userName } = req.body;
    const reply = await processAgentMessage(
      message,
      agentId || 'swarm',
      projectState,
      userRole || 'DELIVERY_MANAGER',
      userName || 'Marcus Vance'
    );
    res.json(reply);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Security Ledger Cryptographic Chain
app.get('/api/audit/verify', (req: Request, res: Response) => {
  const blocks = projectState.securityLedger;
  let isValid = true;
  let brokenIndex = -1;

  for (let i = 1; i < blocks.length; i++) {
    const current = blocks[i];
    const prev = blocks[i - 1];

    if (current.previousHash !== prev.hash) {
      isValid = false;
      brokenIndex = i;
      break;
    }
  }

  res.json({
    isValid,
    totalBlocks: blocks.length,
    headHash: blocks[blocks.length - 1]?.hash,
    genesisHash: blocks[0]?.hash,
    brokenIndex,
    verifiedAt: new Date().toISOString(),
  });
});

// Server-side Multi-Sheet Excel Telemetry Export
app.get('/api/export-excel', async (req: Request, res: Response) => {
  try {
    const userRole = (req.query.role as Role) || 'AUDITOR';
    const userName = (req.query.user as string) || 'Sophia Sterling';

    logOperational(
      'EXCEL_EXPORT_DOWNLOADED',
      'EXCEL_TELEMETRY_ENGINE',
      `Full 3-tab EVM, timesheet & expense telemetry workbook generated and downloaded.`,
      req,
      userRole,
      userName
    );

    appendSecurityBlock(
      'AUDIT_TELEMETRY_EXPORT',
      'EXCEL_FINANCIAL_RECORDS',
      `Exported sanitized financial ledger extract. Generated by ${userName} (${userRole}).`,
      req,
      userRole,
      userName
    );

    const buffer = await generateEnterpriseExcelWorkbook(projectState);

    const filename = `NexusGovernance_Audit_Extract_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (err: any) {
    console.error('Error generating Excel workbook:', err);
    res.status(500).json({ error: 'Failed to generate Excel extract' });
  }
});

// -------------------------------------------------------------
// Vite Dev Server / Static Hosting
// -------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise Delivery Governance Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
