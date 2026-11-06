export type Role =
  | 'ADMIN'
  | 'DELIVERY_MANAGER'
  | 'SCRUM_MASTER'
  | 'DEVELOPER'
  | 'AUDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  title: string;
  weeklyCapacityHours: number;
  hourlyRate: number;
}

export type WbsLevel = 'INITIATIVE' | 'EPIC' | 'FEATURE' | 'STORY' | 'TASK';
export type WbsStage = 'BACKLOG' | 'READY' | 'IN_PROGRESS' | 'CODE_REVIEW' | 'QA' | 'DONE';
export type DependencyType = 'FS' | 'SS' | 'FF' | 'SF';

export interface WbsDependency {
  targetId: string;
  type: DependencyType;
}

export interface DodItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface WbsItem {
  id: string;
  parentId: string | null;
  code: string;
  title: string;
  description: string;
  level: WbsLevel;
  assigneeId?: string;
  assigneeName?: string;
  stage: WbsStage;
  storyPoints?: number;
  plannedHours: number;
  actualHours: number;
  startDate: string;
  endDate: string;
  baselineStartDate: string;
  baselineEndDate: string;
  progress: number; // 0 - 100
  isCriticalPath?: boolean;
  dependencies: WbsDependency[];
  timeInCurrentStageHours: number;
  isStalled?: boolean; // e.g. >48 hours in Code Review or QA
  stalledReason?: string;
  dodChecklist: DodItem[];
  releaseTag?: string;
}

export interface EvmMetrics {
  pv: number; // Planned Value
  ev: number; // Earned Value
  ac: number; // Actual Cost
  bac: number; // Budget at Completion
  sv: number; // Schedule Variance (EV - PV)
  cv: number; // Cost Variance (EV - AC)
  spi: number; // Schedule Performance Index (EV / PV)
  cpi: number; // Cost Performance Index (EV / AC)
  eac: number; // Estimate at Completion (BAC / CPI)
  vac: number; // Variance at Completion (BAC - EAC)
  tcpi: number; // To-Complete Performance Index
  burnRateWeekly: number; // weekly average spend
  projectedOverrun: number;
  statusHealth: 'EXCELLENT' | 'ON_TRACK' | 'AT_RISK' | 'CRITICAL';
}

export type DoraRating = 'ELITE' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface DoraRelease {
  id: string;
  version: string;
  deployedAt: string;
  leadTimeHours: number;
  status: 'SUCCESS' | 'FAILED' | 'ROLLED_BACK';
  incidentLevel?: 'P1' | 'P2' | 'NONE';
  timeToRestoreMinutes?: number;
  wbsIdReference?: string;
  changeRiskScore: number; // 0 - 100
  approvedBy?: string;
}

export interface DoraMetrics {
  deploymentFrequency: {
    value: string;
    description: string;
    rating: DoraRating;
  };
  leadTimeForChanges: {
    hours: number;
    rating: DoraRating;
  };
  changeFailureRate: {
    percentage: number;
    rating: DoraRating;
  };
  timeToRestoreService: {
    hours: number;
    rating: DoraRating;
  };
  recentReleases: DoraRelease[];
}

export interface TimesheetEntry {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  wbsId: string;
  wbsTitle: string;
  wbsCode: string;
  category: 'DEVELOPMENT' | 'REVIEW' | 'OPS' | 'GOVERNANCE';
  hours: number;
  hourlyRate: number;
  totalCost: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  notes: string;
  approvedBy?: string;
}

export interface ExpenseEntry {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  category: 'CLOUD_INFRA' | 'SAAS_LICENSING' | 'HARDWARE' | 'CONSULTING' | 'TRAVEL';
  description: string;
  amount: number;
  currency: string;
  billable: boolean;
  receiptName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approver?: string;
}

export type RetroTemplate = 'STOP_START_CONTINUE' | 'FOUR_LS' | 'MAD_SAD_GLAD';

export interface RetroCard {
  id: string;
  author: string;
  text: string;
  votes: number;
  category?: string;
}

export interface RetroColumn {
  id: string;
  title: string;
  color: string;
  cards: RetroCard[];
}

export interface RetroActionItem {
  id: string;
  title: string;
  owner: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'ROLLED_OVER';
  targetSprint: string;
  createdFromRetroId: string;
}

export interface Retrospective {
  id: string;
  sprintName: string;
  date: string;
  template: RetroTemplate;
  status: 'ACTIVE' | 'CONCLUDED';
  columns: RetroColumn[];
  actionItems: RetroActionItem[];
  aiSentimentSummary?: string;
  metricsSnapshot?: {
    completedPoints: number;
    plannedPoints: number;
    stalledHoursTotal: number;
    cfr: number;
  };
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  framework: 'PMBOK' | 'SCRUM_AGILE' | 'DEVOPS_DORA' | 'ITIL5_SVC' | 'GRC_AUDIT';
  tags: string[];
  summary: string;
  keyPrinciples: string[];
  fullGuideMarkdown: string;
  videoUrl?: string;
  videoTitle?: string;
  chapters?: { time: string; seconds: number; title: string }[];
  deepLinks?: { label: string; viewTarget: string }[];
}

export interface AuditLedgerEntry {
  id: string;
  timestamp: string;
  ledgerType: 'OPERATIONAL' | 'SECURITY_AUDIT';
  action: string;
  userId: string;
  userName: string;
  userRole: Role;
  resource: string;
  details: string;
  ipAddress: string;
  previousHash?: string;
  hash?: string;
  isImmutableChainVerified?: boolean;
}

export interface HitlPendingAction {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  actionType:
    | 'REALLOCATE_TASK'
    | 'CHANGE_BUDGET_BASELINE'
    | 'OVERRIDE_PROD_GATE'
    | 'EXPORT_RESTRICTED_DATA';
  title: string;
  description: string;
  payload: any;
  requiredRole: Role;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export type AgentId =
  | 'scrum_orchestrator'
  | 'evm_financial'
  | 'devops_itil'
  | 'rag_specialist'
  | 'security_guardrail';

export interface AgentPersona {
  id: AgentId;
  name: string;
  title: string;
  avatar: string;
  frameworkBadge: string;
  operationalScope: string;
  status: 'IDLE' | 'MONITORING' | 'ANALYZING' | 'EXECUTING' | 'ALERTING';
  lastActivity: string;
  activeAnomaliesCount: number;
}

export interface AgentChatMessage {
  id: string;
  timestamp: string;
  sender: 'user' | 'agent' | 'system';
  agentId?: AgentId;
  agentName?: string;
  content: string;
  toolInvocations?: {
    toolName: string;
    params: any;
    result: any;
    status: 'SUCCESS' | 'HITL_BLOCKED' | 'ERROR';
  }[];
  hitlActionId?: string;
}

export interface ProjectState {
  id: string;
  name: string;
  code: string;
  description: string;
  currentSprint: string;
  sprintEndDate: string;
  baselineBudget: number;
  allocatedBudget: number;
  users: User[];
  wbs: WbsItem[];
  evm: EvmMetrics;
  dora: DoraMetrics;
  timesheets: TimesheetEntry[];
  expenses: ExpenseEntry[];
  retrospectives: Retrospective[];
  knowledgeBase: KnowledgeArticle[];
  operationalLedger: AuditLedgerEntry[];
  securityLedger: AuditLedgerEntry[];
  hitlQueue: HitlPendingAction[];
  agents: AgentPersona[];
}
