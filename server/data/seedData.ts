import crypto from 'crypto';
import { ProjectState, AuditLedgerEntry } from '../../src/types/index.ts';

function createHash(data: string, prevHash: string): string {
  return crypto
    .createHash('sha256')
    .update(prevHash + data)
    .digest('hex');
}

const genesisPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';
const h1 = createHash('SYSTEM_INIT_GENESIS_BLOCK', genesisPrevHash);
const h2 = createHash('BASELINE_BUDGET_LOCKED_750000_USD', h1);
const h3 = createHash('RBAC_ROLES_PROVISIONED_ADMIN_PM_SM_DEV_AUDIT', h2);

export const initialSecurityLedger: AuditLedgerEntry[] = [
  {
    id: 'sec-001',
    timestamp: '2026-10-15T08:00:00Z',
    ledgerType: 'SECURITY_AUDIT',
    action: 'GENESIS_SECURITY_BLOCK',
    userId: 'usr-001',
    userName: 'Elena Rostova',
    userRole: 'ADMIN',
    resource: 'LEDGER_CORE',
    details: 'Dual-ledger immutable cryptographic chain initiated. SHA-256 merkle roots locked.',
    ipAddress: '10.240.0.12',
    previousHash: genesisPrevHash,
    hash: h1,
    isImmutableChainVerified: true,
  },
  {
    id: 'sec-002',
    timestamp: '2026-10-15T09:30:00Z',
    ledgerType: 'SECURITY_AUDIT',
    action: 'BUDGET_BASELINE_ESTABLISHED',
    userId: 'usr-002',
    userName: 'Marcus Vance',
    userRole: 'DELIVERY_MANAGER',
    resource: 'PROJECT_FINANCIAL_BASELINE',
    details: 'Project BAC (Budget at Completion) locked at $750,000 USD for FY26 Phase 1.',
    ipAddress: '10.240.0.15',
    previousHash: h1,
    hash: h2,
    isImmutableChainVerified: true,
  },
  {
    id: 'sec-003',
    timestamp: '2026-10-16T11:00:00Z',
    ledgerType: 'SECURITY_AUDIT',
    action: 'RBAC_SECURITY_MATRIX_DEPLOYED',
    userId: 'usr-001',
    userName: 'Elena Rostova',
    userRole: 'ADMIN',
    resource: 'IDENTITY_ACCESS_MGMT',
    details: 'Role-Based Access Control matrix verified: Admin, Delivery Manager, Scrum Master, Developer, Auditor.',
    ipAddress: '10.240.0.12',
    previousHash: h2,
    hash: h3,
    isImmutableChainVerified: true,
  },
];

export const initialOperationalLedger: AuditLedgerEntry[] = [
  {
    id: 'op-001',
    timestamp: '2026-11-05T08:15:20Z',
    ledgerType: 'OPERATIONAL',
    action: 'USER_LOGIN',
    userId: 'usr-002',
    userName: 'Marcus Vance',
    userRole: 'DELIVERY_MANAGER',
    resource: 'AUTH_GATEWAY',
    details: 'MFA authenticated via FIDO2 token from Enterprise SSO.',
    ipAddress: '192.168.10.45',
  },
  {
    id: 'op-002',
    timestamp: '2026-11-05T14:22:10Z',
    ledgerType: 'OPERATIONAL',
    action: 'TIMESHEET_LOGGED',
    userId: 'usr-004',
    userName: 'Devon Lee',
    userRole: 'DEVELOPER',
    resource: 'TIMESHEET_WBS_1.2.3',
    details: 'Logged 7.5 hours under Code Review & Mutual TLS diagnostics.',
    ipAddress: '192.168.10.92',
  },
  {
    id: 'op-003',
    timestamp: '2026-11-05T16:45:00Z',
    ledgerType: 'OPERATIONAL',
    action: 'TELEMETRY_EXPORT_INITIATED',
    userId: 'usr-005',
    userName: 'Sophia Sterling',
    userRole: 'AUDITOR',
    resource: 'EXCEL_EVM_TELEMETRY',
    details: 'Requested multi-tab signed financial & EVM workbook extract.',
    ipAddress: '192.168.10.110',
  },
];

export const initialProjectState: ProjectState = {
  id: 'proj-alpha-001',
  name: 'Project Alpha: Cloud Core Banking Modernization',
  code: 'CORE-BANK-V2',
  description: 'Enterprise migration of legacy transaction core to cloud-native microservices with zero-trust security, real-time settlement, and ITIL 5 value stream automation.',
  currentSprint: 'Sprint 14: Settlement Engine & HSM Gateways',
  sprintEndDate: '2026-11-12',
  baselineBudget: 750000,
  allocatedBudget: 750000,
  users: [
    {
      id: 'usr-001',
      name: 'Elena Rostova',
      email: 'elena.rostova@enterprise.bank',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      title: 'VP Enterprise Delivery & Governance',
      weeklyCapacityHours: 40,
      hourlyRate: 195,
    },
    {
      id: 'usr-002',
      name: 'Marcus Vance',
      email: 'marcus.vance@enterprise.bank',
      role: 'DELIVERY_MANAGER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Principal Delivery Lead (PMP, ITIL Master)',
      weeklyCapacityHours: 40,
      hourlyRate: 165,
    },
    {
      id: 'usr-003',
      name: 'Aisha Al-Mansoor',
      email: 'aisha.m@enterprise.bank',
      role: 'SCRUM_MASTER',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      title: 'Lead Agile Coach & Scrum Master',
      weeklyCapacityHours: 40,
      hourlyRate: 140,
    },
    {
      id: 'usr-004',
      name: 'Devon Lee',
      email: 'devon.lee@enterprise.bank',
      role: 'DEVELOPER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: 'Senior Distributed Systems Engineer',
      weeklyCapacityHours: 40,
      hourlyRate: 130,
    },
    {
      id: 'usr-005',
      name: 'Sophia Sterling',
      email: 'sophia.sterling@kpmg-audit.partner',
      role: 'AUDITOR',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      title: 'External GRC & Financial Audit Specialist',
      weeklyCapacityHours: 40,
      hourlyRate: 175,
    },
    {
      id: 'usr-006',
      name: 'Kenji Sato',
      email: 'kenji.sato@enterprise.bank',
      role: 'DEVELOPER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      title: 'DevOps & Site Reliability Engineer',
      weeklyCapacityHours: 40,
      hourlyRate: 135,
    },
  ],
  wbs: [
    {
      id: 'wbs-1.0',
      parentId: null,
      code: '1.0',
      title: 'Initiative: Cloud Core Banking Platform',
      description: 'End-to-end modernization of transactional core ledger, security, and messaging.',
      level: 'INITIATIVE',
      stage: 'IN_PROGRESS',
      plannedHours: 2800,
      actualHours: 1950,
      startDate: '2026-08-01',
      endDate: '2027-02-28',
      baselineStartDate: '2026-08-01',
      baselineEndDate: '2027-02-15',
      progress: 68,
      isCriticalPath: true,
      dependencies: [],
      timeInCurrentStageHours: 240,
      dodChecklist: [
        { id: 'dod-1', text: 'Architecture Review Board (ARB) sign-off', completed: true },
        { id: 'dod-2', text: 'Financial compliance & PCI-DSS L1 audit passed', completed: false },
      ],
    },
    {
      id: 'wbs-1.1',
      parentId: 'wbs-1.0',
      code: '1.1',
      title: 'Epic: Zero-Trust Network & Service Mesh',
      description: 'Mutual TLS 1.3, Istio ingress security policies, and Hardware Security Module integration.',
      level: 'EPIC',
      stage: 'IN_PROGRESS',
      plannedHours: 920,
      actualHours: 710,
      startDate: '2026-08-15',
      endDate: '2026-11-20',
      baselineStartDate: '2026-08-15',
      baselineEndDate: '2026-11-10',
      progress: 74,
      isCriticalPath: true,
      dependencies: [],
      timeInCurrentStageHours: 120,
      dodChecklist: [
        { id: 'dod-1.1-1', text: 'Penetration testing without high/critical CVEs', completed: true },
        { id: 'dod-1.1-2', text: 'Key rotation drill verified with automated cron', completed: true },
      ],
    },
    {
      id: 'wbs-1.1.1',
      parentId: 'wbs-1.1',
      code: '1.1.1',
      title: 'Story: Hardware Security Module (HSM) PKCS#11 Driver',
      description: 'Implement low-latency cryptographic signing for high-value payment transactions.',
      level: 'STORY',
      assigneeId: 'usr-004',
      assigneeName: 'Devon Lee',
      stage: 'CODE_REVIEW',
      storyPoints: 8,
      plannedHours: 48,
      actualHours: 54,
      startDate: '2026-10-25',
      endDate: '2026-11-08',
      baselineStartDate: '2026-10-25',
      baselineEndDate: '2026-11-04',
      progress: 85,
      isCriticalPath: true,
      dependencies: [],
      timeInCurrentStageHours: 52, // Stalled! >48 hrs in Code Review
      isStalled: true,
      stalledReason: 'Story has spent 52 hours in Code Review awaiting cryptographic audit sign-off.',
      dodChecklist: [
        { id: 'dod-c1', text: 'Unit test coverage >= 90% (Current: 94.2%)', completed: true },
        { id: 'dod-c2', text: 'SonarQube clean scan with 0 blocker vulnerabilities', completed: true },
        { id: 'dod-c3', text: '2 Senior Peer Approvals in PR', completed: false },
        { id: 'dod-c4', text: 'Performance load test <= 12ms p99 latency', completed: true },
      ],
      releaseTag: 'v2.4.0-rc2',
    },
    {
      id: 'wbs-1.1.2',
      parentId: 'wbs-1.1',
      code: '1.1.2',
      title: 'Story: Automated Mutual TLS Cert Auto-Renewal',
      description: 'Cert-manager integration with Enterprise Vault CA for ephemeral 24-hour certs.',
      level: 'STORY',
      assigneeId: 'usr-006',
      assigneeName: 'Kenji Sato',
      stage: 'QA',
      storyPoints: 5,
      plannedHours: 36,
      actualHours: 32,
      startDate: '2026-10-28',
      endDate: '2026-11-07',
      baselineStartDate: '2026-10-28',
      baselineEndDate: '2026-11-07',
      progress: 90,
      isCriticalPath: false,
      dependencies: [{ targetId: 'wbs-1.1.1', type: 'SS' }],
      timeInCurrentStageHours: 18,
      isStalled: false,
      dodChecklist: [
        { id: 'dod-c5', text: 'Simulated expiry failover verified in staging', completed: true },
        { id: 'dod-c6', text: 'Rollback runbook signed off by SRE Lead', completed: true },
      ],
      releaseTag: 'v2.4.0-rc2',
    },
    {
      id: 'wbs-1.2',
      parentId: 'wbs-1.0',
      code: '1.2',
      title: 'Epic: Real-Time Event-Driven Ledger & Kafka',
      description: 'Distributed ledger ingestion pipeline supporting 15,000 TPS with exact-once semantics.',
      level: 'EPIC',
      stage: 'IN_PROGRESS',
      plannedHours: 1100,
      actualHours: 820,
      startDate: '2026-09-01',
      endDate: '2026-12-15',
      baselineStartDate: '2026-09-01',
      baselineEndDate: '2026-12-01',
      progress: 65,
      isCriticalPath: true,
      dependencies: [{ targetId: 'wbs-1.1', type: 'FS' }],
      timeInCurrentStageHours: 180,
      dodChecklist: [
        { id: 'dod-1.2-1', text: 'Chaos engineering network partition survival test', completed: false },
        { id: 'dod-1.2-2', text: 'Dual-entry audit ledger consistency validator passed', completed: true },
      ],
    },
    {
      id: 'wbs-1.2.1',
      parentId: 'wbs-1.2',
      code: '1.2.1',
      title: 'Story: Settlement Stream Idempotency Broker',
      description: 'Deduplication cache with Redis Cluster preventing duplicate debit/credit settlements.',
      level: 'STORY',
      assigneeId: 'usr-004',
      assigneeName: 'Devon Lee',
      stage: 'IN_PROGRESS',
      storyPoints: 13,
      plannedHours: 72,
      actualHours: 42,
      startDate: '2026-11-01',
      endDate: '2026-11-18',
      baselineStartDate: '2026-11-01',
      baselineEndDate: '2026-11-15',
      progress: 55,
      isCriticalPath: true,
      dependencies: [{ targetId: 'wbs-1.1.1', type: 'FS' }],
      timeInCurrentStageHours: 28,
      isStalled: false,
      dodChecklist: [
        { id: 'dod-c7', text: 'High throughput bench test @ 20k TPS', completed: false },
        { id: 'dod-c8', text: 'Zero data loss during broker restart', completed: true },
      ],
    },
    {
      id: 'wbs-1.2.2',
      parentId: 'wbs-1.2',
      code: '1.2.2',
      title: 'Task: Multi-Region Kafka Topic Replication',
      description: 'MirrorMaker 2 active-active replication between us-east and us-central regions.',
      level: 'TASK',
      assigneeId: 'usr-006',
      assigneeName: 'Kenji Sato',
      stage: 'DONE',
      storyPoints: 5,
      plannedHours: 30,
      actualHours: 28,
      startDate: '2026-10-18',
      endDate: '2026-10-31',
      baselineStartDate: '2026-10-18',
      baselineEndDate: '2026-10-30',
      progress: 100,
      isCriticalPath: false,
      dependencies: [],
      timeInCurrentStageHours: 96,
      isStalled: false,
      dodChecklist: [
        { id: 'dod-c9', text: 'Replication lag benchmarked < 50ms', completed: true },
        { id: 'dod-c10', text: 'Prometheus alert rules provisioned & paged test', completed: true },
      ],
    },
    {
      id: 'wbs-1.3',
      parentId: 'wbs-1.0',
      code: '1.3',
      title: 'Epic: ITIL 5 Value Stream Automation & Change Gate',
      description: 'Continuous delivery pipeline gates with automated risk assessment and audit telemetry.',
      level: 'EPIC',
      stage: 'READY',
      plannedHours: 480,
      actualHours: 190,
      startDate: '2026-11-05',
      endDate: '2027-01-15',
      baselineStartDate: '2026-11-01',
      baselineEndDate: '2026-12-31',
      progress: 40,
      isCriticalPath: false,
      dependencies: [{ targetId: 'wbs-1.2', type: 'SS' }],
      timeInCurrentStageHours: 40,
      dodChecklist: [
        { id: 'dod-1.3-1', text: 'Automated Change Advisory Board (CAB) validation rule set', completed: true },
        { id: 'dod-1.3-2', text: 'Real-time DORA metrics dashboard deployed', completed: true },
      ],
    },
    {
      id: 'wbs-1.3.1',
      parentId: 'wbs-1.3',
      code: '1.3.1',
      title: 'Story: Release Gate Change Risk Evaluator',
      description: 'AI-assisted ITIL 5 risk scoring based on code churn, test coverage, and incident history.',
      level: 'STORY',
      assigneeId: 'usr-002',
      assigneeName: 'Marcus Vance',
      stage: 'READY',
      storyPoints: 5,
      plannedHours: 35,
      actualHours: 12,
      startDate: '2026-11-06',
      endDate: '2026-11-16',
      baselineStartDate: '2026-11-06',
      baselineEndDate: '2026-11-16',
      progress: 30,
      isCriticalPath: false,
      dependencies: [],
      timeInCurrentStageHours: 16,
      isStalled: false,
      dodChecklist: [
        { id: 'dod-c11', text: 'Risk model accuracy tested against past 50 releases', completed: false },
        { id: 'dod-c12', text: 'Emergency rollback workflow verified', completed: false },
      ],
    },
    {
      id: 'wbs-1.3.2',
      parentId: 'wbs-1.3',
      code: '1.3.2',
      title: 'Story: Retrospective Action Item Backlog Rollover',
      description: 'Autonomous Scrum agent tool rolling unfulfilled retro items into upcoming sprint.',
      level: 'STORY',
      assigneeId: 'usr-003',
      assigneeName: 'Aisha Al-Mansoor',
      stage: 'IN_PROGRESS',
      storyPoints: 3,
      plannedHours: 24,
      actualHours: 18,
      startDate: '2026-11-03',
      endDate: '2026-11-10',
      baselineStartDate: '2026-11-03',
      baselineEndDate: '2026-11-10',
      progress: 70,
      isCriticalPath: false,
      dependencies: [],
      timeInCurrentStageHours: 24,
      isStalled: false,
      dodChecklist: [
        { id: 'dod-c13', text: 'One-click rollover with audit trace', completed: true },
        { id: 'dod-c14', text: 'Sprint capacity verification before rollover', completed: true },
      ],
    },
  ],
  evm: {
    pv: 420000, // Planned Value
    ev: 385000, // Earned Value
    ac: 410000, // Actual Cost
    bac: 750000, // Budget at Completion
    sv: -35000, // Schedule Variance (EV - PV) => Delay
    cv: -25000, // Cost Variance (EV - AC) => Over budget
    spi: 0.916, // EV / PV < 1.0 (behind schedule)
    cpi: 0.939, // EV / AC < 1.0 (cost inefficiency)
    eac: 798722, // BAC / CPI => $48.7k projected overrun
    vac: -48722, // BAC - EAC
    tcpi: 1.073, // To complete on original budget, need 1.073 CPI
    burnRateWeekly: 34500,
    projectedOverrun: 48722,
    statusHealth: 'AT_RISK',
  },
  dora: {
    deploymentFrequency: {
      value: '2.8 / day',
      description: 'Average deployments per working day across staging & production.',
      rating: 'HIGH',
    },
    leadTimeForChanges: {
      hours: 18.5,
      rating: 'HIGH',
    },
    changeFailureRate: {
      percentage: 4.2,
      rating: 'ELITE',
    },
    timeToRestoreService: {
      hours: 0.65, // ~39 mins
      rating: 'ELITE',
    },
    recentReleases: [
      {
        id: 'rel-2.4.0',
        version: 'v2.4.0-rc2',
        deployedAt: '2026-11-04T14:30:00Z',
        leadTimeHours: 16.2,
        status: 'SUCCESS',
        incidentLevel: 'NONE',
        changeRiskScore: 28,
        wbsIdReference: 'wbs-1.1.1',
        approvedBy: 'Marcus Vance',
      },
      {
        id: 'rel-2.3.4',
        version: 'v2.3.4',
        deployedAt: '2026-10-29T10:00:00Z',
        leadTimeHours: 21.0,
        status: 'FAILED',
        incidentLevel: 'P2',
        timeToRestoreMinutes: 42,
        changeRiskScore: 68,
        wbsIdReference: 'wbs-1.2.1',
        approvedBy: 'Elena Rostova',
      },
      {
        id: 'rel-2.3.3',
        version: 'v2.3.3',
        deployedAt: '2026-10-24T18:15:00Z',
        leadTimeHours: 14.8,
        status: 'SUCCESS',
        incidentLevel: 'NONE',
        changeRiskScore: 19,
        approvedBy: 'Marcus Vance',
      },
      {
        id: 'rel-2.3.2',
        version: 'v2.3.2',
        deployedAt: '2026-10-18T09:40:00Z',
        leadTimeHours: 19.4,
        status: 'SUCCESS',
        incidentLevel: 'NONE',
        changeRiskScore: 22,
        approvedBy: 'Marcus Vance',
      },
    ],
  },
  timesheets: [
    {
      id: 'ts-101',
      memberId: 'usr-004',
      memberName: 'Devon Lee',
      date: '2026-11-05',
      wbsId: 'wbs-1.1.1',
      wbsCode: '1.1.1',
      wbsTitle: 'HSM PKCS#11 Driver & Peer Review',
      category: 'REVIEW',
      hours: 7.5,
      hourlyRate: 130,
      totalCost: 975,
      status: 'APPROVED',
      notes: 'Addressed cryptographic padding feedback from senior security peer.',
      approvedBy: 'Marcus Vance',
    },
    {
      id: 'ts-102',
      memberId: 'usr-004',
      memberName: 'Devon Lee',
      date: '2026-11-04',
      wbsId: 'wbs-1.2.1',
      wbsCode: '1.2.1',
      wbsTitle: 'Settlement Stream Idempotency Broker',
      category: 'DEVELOPMENT',
      hours: 8.0,
      hourlyRate: 130,
      totalCost: 1040,
      status: 'SUBMITTED',
      notes: 'Implemented Redis cluster hash slot sharding and idempotency keys.',
    },
    {
      id: 'ts-103',
      memberId: 'usr-006',
      memberName: 'Kenji Sato',
      date: '2026-11-05',
      wbsId: 'wbs-1.1.2',
      wbsCode: '1.1.2',
      wbsTitle: 'Automated Mutual TLS Cert Auto-Renewal',
      category: 'OPS',
      hours: 8.0,
      hourlyRate: 135,
      totalCost: 1080,
      status: 'APPROVED',
      notes: 'Executed automated expiry drill in staging cluster with zero downtime.',
      approvedBy: 'Marcus Vance',
    },
    {
      id: 'ts-104',
      memberId: 'usr-003',
      memberName: 'Aisha Al-Mansoor',
      date: '2026-11-04',
      wbsId: 'wbs-1.3.2',
      wbsCode: '1.3.2',
      wbsTitle: 'Retrospective Action Item Backlog Rollover',
      category: 'GOVERNANCE',
      hours: 6.0,
      hourlyRate: 140,
      totalCost: 840,
      status: 'APPROVED',
      notes: 'Facilitated Sprint 13 Retrospective synthesis & rolled 2 technical debt items.',
      approvedBy: 'Marcus Vance',
    },
    {
      id: 'ts-105',
      memberId: 'usr-002',
      memberName: 'Marcus Vance',
      date: '2026-11-05',
      wbsId: 'wbs-1.3.1',
      wbsCode: '1.3.1',
      wbsTitle: 'Release Gate Change Risk Evaluator',
      category: 'GOVERNANCE',
      hours: 7.0,
      hourlyRate: 165,
      totalCost: 1155,
      status: 'APPROVED',
      notes: 'Evaluated Release v2.4.0 change enablement compliance against ITIL 5 SVC.',
      approvedBy: 'Elena Rostova',
    },
    {
      id: 'ts-106',
      memberId: 'usr-004',
      memberName: 'Devon Lee',
      date: '2026-11-03',
      wbsId: 'wbs-1.1.1',
      wbsCode: '1.1.1',
      wbsTitle: 'HSM Cryptographic Key Verification Benchmarks',
      category: 'DEVELOPMENT',
      hours: 9.5, // Overtime alert
      hourlyRate: 130,
      totalCost: 1235,
      status: 'APPROVED',
      notes: 'Deep profiling of RSA-4096 vs Ed25519 signatures under load.',
      approvedBy: 'Marcus Vance',
    },
  ],
  expenses: [
    {
      id: 'exp-201',
      memberId: 'usr-006',
      memberName: 'Kenji Sato',
      date: '2026-11-02',
      category: 'CLOUD_INFRA',
      description: 'Google Cloud Platform Bare Metal HSM Dedicated Instance - Oct Invoice',
      amount: 14250,
      currency: 'USD',
      billable: true,
      receiptName: 'gcp-dedicated-hsm-oct26.pdf',
      status: 'APPROVED',
      approver: 'Elena Rostova',
    },
    {
      id: 'exp-202',
      memberId: 'usr-002',
      memberName: 'Marcus Vance',
      date: '2026-11-03',
      category: 'SAAS_LICENSING',
      description: 'SonarQube Enterprise Compliance & Static Analysis 1-Year Node License',
      amount: 8500,
      currency: 'USD',
      billable: false,
      receiptName: 'sonarqube-enterprise-fy26.pdf',
      status: 'APPROVED',
      approver: 'Elena Rostova',
    },
    {
      id: 'exp-203',
      memberId: 'usr-004',
      memberName: 'Devon Lee',
      date: '2026-11-04',
      category: 'CONSULTING',
      description: 'Third-party FIPS 140-3 Cryptographic Implementation Review (1st Installment)',
      amount: 22000,
      currency: 'USD',
      billable: true,
      receiptName: 'cryptoconsult-fips140-invoice-101.pdf',
      status: 'PENDING',
    },
  ],
  retrospectives: [
    {
      id: 'retro-sprint-13',
      sprintName: 'Sprint 13: Core Mesh & Vault Integration',
      date: '2026-10-30',
      template: 'STOP_START_CONTINUE',
      status: 'CONCLUDED',
      columns: [
        {
          id: 'col-stop',
          title: 'Stop Doing',
          color: 'red',
          cards: [
            {
              id: 'rc-1',
              author: 'Kenji Sato',
              text: 'Stop creating manual TLS certificates in staging before automating the cert-manager CRDs.',
              votes: 6,
            },
            {
              id: 'rc-2',
              author: 'Devon Lee',
              text: 'Stop bunching PR reviews on the final Thursday afternoon of the sprint.',
              votes: 8,
            },
          ],
        },
        {
          id: 'col-start',
          title: 'Start Doing',
          color: 'emerald',
          cards: [
            {
              id: 'rc-3',
              author: 'Aisha Al-Mansoor',
              text: 'Start enforcing a strict 24-hour SLA on Code Review before the Orchestrator flags it as stalled.',
              votes: 11,
            },
            {
              id: 'rc-4',
              author: 'Elena Rostova',
              text: 'Start pre-validating Change Advisory Board (CAB) risk scores 48 hours prior to release cuts.',
              votes: 7,
            },
          ],
        },
        {
          id: 'col-continue',
          title: 'Continue Doing',
          color: 'blue',
          cards: [
            {
              id: 'rc-5',
              author: 'Devon Lee',
              text: 'Continue automated load test benchmarking directly inside CI runners before PR merges.',
              votes: 9,
            },
          ],
        },
      ],
      actionItems: [
        {
          id: 'act-01',
          title: 'Configure automated Slack & UI alert when PR review exceeds 24 hours in Code Review',
          owner: 'Devon Lee',
          status: 'COMPLETED',
          targetSprint: 'Sprint 14',
          createdFromRetroId: 'retro-sprint-13',
        },
        {
          id: 'act-02',
          title: 'Implement automated rollback test container for Istio mesh upgrades (P1 Post-Incident Action)',
          owner: 'Kenji Sato',
          status: 'OPEN', // Unresolved item ready for rollover!
          targetSprint: 'Sprint 14',
          createdFromRetroId: 'retro-sprint-13',
        },
        {
          id: 'act-03',
          title: 'Publish team SOP runbook on FIPS 140-3 crypto driver debugging in staging cluster',
          owner: 'Aisha Al-Mansoor',
          status: 'IN_PROGRESS',
          targetSprint: 'Sprint 14',
          createdFromRetroId: 'retro-sprint-13',
        },
      ],
      aiSentimentSummary: 'Team morale is resilient (76% positive sentiment), but recurring friction in peer code review bottlenecks is causing end-of-sprint delivery crunches. Action item 02 requires prompt rollover.',
      metricsSnapshot: {
        completedPoints: 42,
        plannedPoints: 48,
        stalledHoursTotal: 64,
        cfr: 3.8,
      },
    },
    {
      id: 'retro-sprint-14-draft',
      sprintName: 'Sprint 14: Settlement Engine & HSM Gateways (Active)',
      date: '2026-11-05',
      template: 'FOUR_LS',
      status: 'ACTIVE',
      columns: [
        {
          id: 'col-liked',
          title: 'Liked',
          color: 'emerald',
          cards: [
            { id: 'rc-14-1', author: 'Kenji Sato', text: 'Zero downtime achieved during Kafka topic cross-region replication.', votes: 5 },
          ],
        },
        {
          id: 'col-learned',
          title: 'Learned',
          color: 'blue',
          cards: [
            { id: 'rc-14-2', author: 'Devon Lee', text: 'Hardware Security Module PKCS#11 calls require dedicated thread pools to avoid event loop blocking.', votes: 4 },
          ],
        },
        {
          id: 'col-lacked',
          title: 'Lacked',
          color: 'amber',
          cards: [
            { id: 'rc-14-3', author: 'Devon Lee', text: 'Lacked dedicated cryptographic review capacity, leading to WBS 1.1.1 being stalled for 52 hours.', votes: 9 },
          ],
        },
        {
          id: 'col-longed',
          title: 'Longed For',
          color: 'purple',
          cards: [
            { id: 'rc-14-4', author: 'Aisha Al-Mansoor', text: 'Automated agentic rebalancing of team member story points before sprint commitment.', votes: 8 },
          ],
        },
      ],
      actionItems: [],
      aiSentimentSummary: 'Sprint 14 live telemetry highlights high technical accomplishments on Kafka replication, tempered by stalled story blocker on HSM Driver. Automated retro trigger suggested.',
    },
  ],
  knowledgeBase: [
    {
      id: 'kb-evm-01',
      title: 'EVM Predictive Controls: CPI, SPI & Estimate at Completion (EAC)',
      framework: 'PMBOK',
      tags: ['EVM', 'CPI', 'SPI', 'EAC', 'Budget Baseline', 'Earned Value'],
      summary: 'Comprehensive mathematical formulations and project control mechanisms for Earned Value Management in agile-predictive hybrid programs.',
      keyPrinciples: [
        'CPI = EV / AC (Cost Performance Index: >1.0 under budget, <1.0 over budget)',
        'SPI = EV / PV (Schedule Performance Index: >1.0 ahead of schedule, <1.0 behind schedule)',
        'EAC = BAC / CPI (Estimate at Completion assuming current cost efficiency continues)',
        'TCPI = (BAC - EV) / (BAC - AC) (Required cost performance to complete within original budget)',
      ],
      fullGuideMarkdown: `### Earned Value Management (EVM) in Hybrid Delivery

Earned Value Management provides objective telemetry combining scope, schedule, and cost. In hybrid enterprise delivery (Agile iterations within governed capital budgets), story point velocity converts to Planned Value (PV) and Earned Value (EV).

#### Key Metric Derivations:
1. **Planned Value (PV)**: Authorized budget assigned to scheduled work.
2. **Earned Value (EV)**: Measure of work performed expressed in authorized budget terms.
3. **Actual Cost (AC)**: Realized cost incurred in accomplishing work.
4. **Cost Variance (CV = EV - AC)**: Negative indicates financial overrun.
5. **Schedule Variance (SV = EV - PV)**: Negative indicates timeline delay.
6. **Estimate at Completion (EAC = BAC / CPI)**: Forecasted total project cost at closure.

When CPI drops below 0.95 or SPI drops below 0.92, project governance mandates an automated anomaly escalation and formal rebalancing review.`,
      videoUrl: 'https://www.youtube.com/embed/fD3qg1z1x6E',
      videoTitle: 'EVM Masterclass: Calculating CPI, SPI, and Forecasting EAC',
      chapters: [
        { time: '00:00', seconds: 0, title: 'Introduction to Triple Constraint Telemetry' },
        { time: '02:40', seconds: 160, title: 'Formula Derivations: SV, CV, SPI, CPI' },
        { time: '06:15', seconds: 375, title: 'Forecasting Final Budget: EAC & TCPI' },
        { time: '10:50', seconds: 650, title: 'Integrating EVM into Jira/Agile Story Points' },
      ],
      deepLinks: [
        { label: 'View Project EVM Financial Matrix', viewTarget: 'financials' },
        { label: 'Download Itemized Excel Telemetry', viewTarget: 'export' },
      ],
    },
    {
      id: 'kb-scrum-02',
      title: 'Scrum Ceremony Cadence, Definition of Done & Stalled Story Triage',
      framework: 'SCRUM_AGILE',
      tags: ['Scrum', 'Definition of Done', 'WIP Limits', 'Cycle Time', 'Retrospectives'],
      summary: 'Standardized operational procedures for maintaining sprint velocity, enforcing strict DoD verification, and mitigating bottleneck queues.',
      keyPrinciples: [
        'Definition of Done (DoD) is a non-negotiable quality gate: tests, peer reviews, security scans, and documentation.',
        'WIP Limits enforce flow by preventing multitasking and early batching.',
        'Stalled Story Alert threshold: Any story residing >48 hours in Code Review or QA triggers automated Scrum Orchestrator intervention.',
        'Action items from Retrospectives must have single assigned owners and rollover priority in the next sprint backlog.',
      ],
      fullGuideMarkdown: `### Agile Flow & Definition of Done (DoD)

High-performing enterprise teams maintain flow by setting explicit WIP limits on middle columns (Code Review and QA). 

#### Definition of Done Standard:
- Unit test coverage meeting minimum thresholds (typically >= 85%)
- Static security analysis (SonarQube) with zero blocker or high severity issues
- Minimum of 2 approved peer code reviews
- Performance and latency verification against SLAs
- Automated rollback script and release runbook updated

#### Stalled Story Remediation:
When an item spends >48 hours in Code Review:
1. Orchestrator detects bottleneck.
2. Scrum Master is alerted to pair-review or rebalance review duties.
3. If blocked by external dependencies (e.g. security sign-off), story is escalated to Delivery Manager.`,
      videoUrl: 'https://www.youtube.com/embed/XU0llRltyFM',
      videoTitle: 'Agile Delivery at Scale: Kanban Flow, WIP Limits & DoD',
      chapters: [
        { time: '00:00', seconds: 0, title: 'Why Stories Stall: Queueing Theory in Software' },
        { time: '03:10', seconds: 190, title: 'Implementing Strict WIP Limits' },
        { time: '07:20', seconds: 440, title: 'Enforcing Definition of Done Checklists' },
        { time: '12:00', seconds: 720, title: 'Action Item Rollover Architecture' },
      ],
      deepLinks: [
        { label: 'Open Agile Delivery Board', viewTarget: 'kanban' },
        { label: 'Inspect Active Retrospective', viewTarget: 'retrospective' },
      ],
    },
    {
      id: 'kb-dora-03',
      title: 'DORA Engineering Metrics: Elite Benchmarks & Continual Improvement',
      framework: 'DEVOPS_DORA',
      tags: ['DORA', 'DevOps', 'Deployment Frequency', 'Lead Time', 'CFR', 'MTTR'],
      summary: 'Empirically proven DevOps Research and Assessment (DORA) metrics that differentiate elite engineering delivery organizations from low performers.',
      keyPrinciples: [
        'Deployment Frequency: Elite teams deploy multiple times per day on-demand.',
        'Lead Time for Changes: Time from code commit to code running successfully in production (<1 day for Elite).',
        'Change Failure Rate (CFR): Percentage of deployments causing a degradation or outage requiring remediations (<5% for Elite).',
        'Time to Restore Service (MTTR): Time required to remediate an incident or rollback (<1 hour for Elite).',
      ],
      fullGuideMarkdown: `### DORA Four Key Metrics Guide

Decades of DevOps research demonstrate that speed and stability move together. Elite teams do not compromise reliability for release velocity.

#### Classification Thresholds:
- **Deployment Frequency**: Elite (Multiple deploys/day) | High (Once/day - Once/week) | Medium (Once/week - Once/month) | Low (< Once/month)
- **Lead Time for Changes**: Elite (<1 day) | High (1 day - 1 week) | Medium (1 week - 1 month) | Low (>1 month)
- **Change Failure Rate**: Elite (0 - 5%) | High (6 - 15%) | Medium (16 - 30%) | Low (>30%)
- **Time to Restore Service**: Elite (<1 hour) | High (<1 day) | Medium (<1 week) | Low (>1 week)

When Change Failure Rate trends above 5%, the DevOps Governance Agent mandates heightened automated pre-flight testing and lower change risk thresholds before release gates open.`,
      videoUrl: 'https://www.youtube.com/embed/0ymX0n091_8',
      videoTitle: 'Google Cloud DORA: Accelerating Software Delivery with Reliability',
      chapters: [
        { time: '00:00', seconds: 0, title: 'The Science of DevOps Performance' },
        { time: '04:15', seconds: 255, title: 'Calculating Lead Time from Commit to Prod' },
        { time: '08:40', seconds: 520, title: 'Tracking Incident MTTR with Automated Telemetry' },
        { time: '13:10', seconds: 790, title: 'Balancing Speed vs. Stability' },
      ],
      deepLinks: [
        { label: 'View DevOps & ITIL 5 Dashboard', viewTarget: 'devops' },
        { label: 'Evaluate Production Release Gate', viewTarget: 'release-gate' },
      ],
    },
    {
      id: 'kb-itil-04',
      title: 'ITIL 5 Service Value System: Continual Improvement & Change Enablement',
      framework: 'ITIL5_SVC',
      tags: ['ITIL 5', 'Service Value Chain', 'Change Enablement', 'Risk Assessment', 'PIR'],
      summary: 'Modern ITIL 5 framework for guiding value streams, continuous service improvement, Post-Incident Reviews (PIR), and automated Change Advisory gates.',
      keyPrinciples: [
        'Service Value Chain (SVC): Plan, Improve, Engage, Design & Transition, Obtain/Build, Deliver & Support.',
        'Change Enablement replaces bureaucratic CABs with automated risk scoring and policy-as-code.',
        'Post-Incident Review (PIR) for P1/P2 incidents must tie directly into backlog items and Retrospective agendas.',
        'Continual Improvement Register (CIR) tracks optimization opportunities across all value streams.',
      ],
      fullGuideMarkdown: `### ITIL 5 Value Streams in Modern Cloud Delivery

ITIL 5 modernizes IT service management to harmonize with DevOps, Agile, and Cloud-native operations.

#### Automated Change Enablement:
Traditional Change Advisory Boards (CAB) create high batch sizes and lead times. ITIL 5 recommends:
1. **Standard Changes**: Pre-approved, automated deployments with low risk score (<30).
2. **Normal Changes**: Assessed dynamically by risk models (evaluating code churn, test coverage, previous rollback history).
3. **Emergency Changes**: Rapid path with retroactive documentation and mandatory Post-Incident Review.

#### Post-Incident Review (PIR) Protocol:
Every P1/P2 incident must generate:
- Root Cause Analysis (RCA) within 72 hours
- Timeline reconstruction with exact timestamps
- Action items directly fed into the Sprint Retrospective backlog to prevent regression.`,
      videoUrl: 'https://www.youtube.com/embed/5aL3e1Q7f80',
      videoTitle: 'ITIL 4/5 Value Streams & Continual Service Improvement in Agile Enterprises',
      chapters: [
        { time: '00:00', seconds: 0, title: 'The Service Value System (SVS) Architecture' },
        { time: '03:45', seconds: 225, title: 'Transforming Change Management into Change Enablement' },
        { time: '08:10', seconds: 490, title: 'Post-Incident Review (PIR) Runbook Execution' },
      ],
      deepLinks: [
        { label: 'Check Change Enablement Gate', viewTarget: 'devops' },
      ],
    },
    {
      id: 'kb-audit-05',
      title: 'Enterprise Dual-Ledger Architecture & Cryptographic Audit Trails',
      framework: 'GRC_AUDIT',
      tags: ['Audit', 'Dual-Ledger', 'SHA-256', 'Immutability', 'HITL', 'RBAC', 'Compliance'],
      summary: 'Architectural blueprint for immutable, cryptographically chained security logs paired with high-throughput operational event recording.',
      keyPrinciples: [
        'Dual-Ledger Separation: Fast operational telemetry separated from immutable, append-only security logs.',
        'Cryptographic Chaining: Each security ledger block references the SHA-256 digest of the previous block, preventing retroactive tampering.',
        'Human-in-the-Loop (HITL) Enforcement: Sensitive mutations (baseline shifts, task reallocations, restricted exports) require explicit role authorization before commitment.',
        'Proof of Audit Integrity: Verifiable mathematical proof from genesis block to current head.',
      ],
      fullGuideMarkdown: `### Immutable Dual-Ledger Architecture

Enterprise GRC (Governance, Risk, and Compliance) mandates non-repudiation and unalterable records for regulatory audits (e.g., SOX, SOC 2 Type II, FedRAMP).

#### Structure:
1. **Operational Ledger**: Logs logins, page views, query requests, and routine updates.
2. **Security Audit Ledger**: Append-only blockchain-style linked list:
   \`\`\`
   Block_N = Hash( Prev_Hash + Timestamp + Action + Actor + Payload_Digest )
   \`\`\`
Any attempt to alter historical records breaks the hash verification sequence across all downstream blocks.

#### Human-in-the-Loop (HITL) Checkpoints:
Agentic AI systems must never mutate enterprise baseline budgets or override production gates autonomously. The Security Guardrail Agent enforces HITL queues where designated roles must review and sign off.`,
      videoUrl: 'https://www.youtube.com/embed/bBC-nXj3Ng4',
      videoTitle: 'Cryptographic Hashing, Merkle Trees & Immutable Audit Systems Explained',
      chapters: [
        { time: '00:00', seconds: 0, title: 'Principles of Cryptographic Hash Chaining' },
        { time: '05:00', seconds: 300, title: 'Dual-Ledger Design for High-Throughput Enterprises' },
        { time: '09:30', seconds: 570, title: 'HITL Checkpoints for Autonomous Systems' },
      ],
      deepLinks: [
        { label: 'Inspect Dual-Ledger & Verify Hashes', viewTarget: 'audit' },
      ],
    },
  ],
  hitlQueue: [
    {
      id: 'hitl-001',
      timestamp: '2026-11-05T20:10:00Z',
      agentId: 'evm_financial',
      agentName: 'Resource & EVM Financial Agent',
      actionType: 'REALLOCATE_TASK',
      title: 'Rebalance Overloaded Senior Engineer (Devon Lee)',
      description: 'Devon Lee has 21 story points assigned across HSM Driver and Settlement Broker with 48.5 logged hours this week (overload >40h limit). Propose reallocating Story 1.2.1 (Settlement Stream Idempotency Broker, 13 pts) to Kenji Sato.',
      payload: {
        taskId: 'wbs-1.2.1',
        fromUser: 'Devon Lee',
        toUser: 'Kenji Sato',
        storyPoints: 13,
      },
      requiredRole: 'DELIVERY_MANAGER',
      status: 'PENDING',
    },
    {
      id: 'hitl-002',
      timestamp: '2026-11-05T21:40:00Z',
      agentId: 'devops_itil',
      agentName: 'DevOps & ITIL 5 Governance Agent',
      actionType: 'OVERRIDE_PROD_GATE',
      title: 'Override Production Release Gate for Release v2.4.0-rc2',
      description: 'Release candidate v2.4.0-rc2 contains stalled story WBS-1.1.1 awaiting 2nd peer review. Change risk score is 28 (within standard limit <30), but DoD checklist is incomplete (3/4 passed). Require Delivery Manager or Admin approval to gate.',
      payload: {
        releaseId: 'rel-2.4.0',
        version: 'v2.4.0-rc2',
        riskScore: 28,
        missingDoD: '2 Senior Peer Approvals in PR',
      },
      requiredRole: 'ADMIN',
      status: 'PENDING',
    },
  ],
  operationalLedger: initialOperationalLedger,
  securityLedger: initialSecurityLedger,
  agents: [
    {
      id: 'scrum_orchestrator',
      name: 'Scrum & Delivery Orchestrator',
      title: 'Autonomous Cadence & Flow Agent',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      frameworkBadge: 'Scrum / Kanban / XP',
      operationalScope: 'Sprint burn-down, stalled stories detection (>48h), Definition of Done validation, retrospective spawning & action item rollover.',
      status: 'ALERTING',
      lastActivity: 'Detected 1 stalled story (WBS-1.1.1 in Code Review for 52h). Retrospective rollover trigger standing by.',
      activeAnomaliesCount: 1,
    },
    {
      id: 'evm_financial',
      name: 'Resource & EVM Financial Agent',
      title: 'Earned Value & Capacity Controller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      frameworkBadge: 'PMBOK 7 / EVM',
      operationalScope: 'Planned vs Earned Value computation (CPI 0.939, SPI 0.916, EAC $798k), capacity overload alerts, automated multi-tab Excel telemetry exports.',
      status: 'ALERTING',
      lastActivity: 'Calculated projected budget overrun of +$48,722. Rebalance suggestion queued for Devon Lee.',
      activeAnomaliesCount: 2,
    },
    {
      id: 'devops_itil',
      name: 'DevOps & ITIL 5 Governance Agent',
      title: 'Service Value & DORA Controller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      frameworkBadge: 'DORA / ITIL 5 SVS',
      operationalScope: 'DORA telemetry (2.8 deploys/day, 18.5h lead time, 4.2% CFR), automated Change Enablement risk evaluation, P1/P2 post-incident review (PIR) linkage.',
      status: 'MONITORING',
      lastActivity: 'Evaluated Release v2.4.0 change risk score: 28/100. Pending HITL sign-off due to incomplete DoD.',
      activeAnomaliesCount: 1,
    },
    {
      id: 'rag_specialist',
      name: 'Conversational Knowledge & RAG Specialist',
      title: 'Enterprise Framework SME',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      frameworkBadge: 'PMBOK / Prince2 / ITIL / GRC',
      operationalScope: 'Semantic search over delivery playbooks, standards, video chapter transcripts, bottleneck advice (WIP limits, story slicing, root cause templates).',
      status: 'IDLE',
      lastActivity: 'Indexed 5 comprehensive framework guides and verified semantic vector similarities.',
      activeAnomaliesCount: 0,
    },
    {
      id: 'security_guardrail',
      name: 'Security & Audit Guardrail Agent',
      title: 'Deterministic RBAC & HITL Enforcer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      frameworkBadge: 'Zero-Trust / SHA-256 / HITL',
      operationalScope: 'Strict RBAC validation, Human-in-the-Loop approval queues for mutations, cryptographic chaining of security audit blocks, export sanitization.',
      status: 'MONITORING',
      lastActivity: 'Validated dual-ledger cryptographic integrity. 2 HITL actions pending review.',
      activeAnomaliesCount: 0,
    },
  ],
};
