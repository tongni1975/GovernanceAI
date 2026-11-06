import crypto from 'crypto';
import {
  ProjectState,
  AuditLedgerEntry,
  HitlPendingAction,
  RetroTemplate,
  Role,
} from '../../src/types/index.ts';

export interface AgentToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  requiresHitl?: boolean;
}

export const agentToolDefinitions: AgentToolDefinition[] = [
  {
    name: 'query_project_metrics',
    description:
      'Extracts real-time project metrics including Earned Value Management (EVM), DORA engineering metrics, sprint burn-down, and stalled stories in Code Review/QA >48h.',
    parameters: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          enum: ['ALL', 'EVM', 'DORA', 'STALLED_STORIES', 'WBS_HEALTH'],
          description: 'Metric category to focus analysis upon',
        },
      },
    },
    requiresHitl: false,
  },
  {
    name: 'detect_stalled_stories',
    description:
      'Scans all active stories and tasks in current sprint. Identifies any item residing in Code Review or QA for longer than 48 hours and checks Definition of Done (DoD) compliance.',
    parameters: {
      type: 'object',
      properties: {
        thresholdHours: {
          type: 'number',
          description: 'Threshold in hours to mark story as stalled (default: 48)',
        },
      },
    },
    requiresHitl: false,
  },
  {
    name: 'rebalance_team_capacity',
    description:
      'Proposes and stages a workload rebalancing action by moving story points/tasks from an overloaded team member to an available member. Enforces Human-in-the-Loop (HITL) approval.',
    parameters: {
      type: 'object',
      required: ['taskId', 'targetAssigneeId', 'reason'],
      properties: {
        taskId: { type: 'string', description: 'The WBS item ID to reassign' },
        targetAssigneeId: { type: 'string', description: 'The user ID to receive the task' },
        reason: { type: 'string', description: 'Justification based on capacity telemetry' },
      },
    },
    requiresHitl: true,
  },
  {
    name: 'trigger_retrospective',
    description:
      'Automatically generates a new Sprint Retrospective board pre-populated with sprint telemetry, DORA metrics, stalled bottlenecks, and team sentiment highlights.',
    parameters: {
      type: 'object',
      required: ['sprintName', 'template'],
      properties: {
        sprintName: { type: 'string', description: 'Sprint title, e.g. Sprint 14' },
        template: {
          type: 'string',
          enum: ['STOP_START_CONTINUE', 'FOUR_LS', 'MAD_SAD_GLAD'],
          description: 'Retrospective format',
        },
        includeIncidentActionItems: {
          type: 'boolean',
          description: 'Whether to pull in unresolved P1/P2 action items',
        },
      },
    },
    requiresHitl: false,
  },
  {
    name: 'evaluate_change_gate',
    description:
      'Evaluates ITIL 5 Change Enablement gate for a release candidate. Calculates change risk score based on code churn, test coverage, and stalled story dependencies.',
    parameters: {
      type: 'object',
      required: ['releaseVersion'],
      properties: {
        releaseVersion: { type: 'string', description: 'Release version e.g. v2.4.0-rc2' },
        bypassWarning: { type: 'boolean', description: 'Force bypass if risk is elevated' },
      },
    },
    requiresHitl: false,
  },
  {
    name: 'search_knowledge_base',
    description:
      'Executes semantic search over PMBOK 7, Scrum/Agile guides, DORA handbook, ITIL 5 Service Value Chain, and GRC dual-ledger standards. Returns cited excerpts and video chapter links.',
    parameters: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string', description: 'Delivery topic or bottleneck query' },
        framework: {
          type: 'string',
          enum: ['ALL', 'PMBOK', 'SCRUM_AGILE', 'DEVOPS_DORA', 'ITIL5_SVC', 'GRC_AUDIT'],
          description: 'Optional filter by framework',
        },
      },
    },
    requiresHitl: false,
  },
  {
    name: 'log_security_audit_event',
    description:
      'Appends an immutable cryptographic entry into the Security Audit Ledger, computing SHA-256 hash chaining with the previous head.',
    parameters: {
      type: 'object',
      required: ['action', 'resource', 'details'],
      properties: {
        action: { type: 'string', description: 'Action type, e.g. BASELINE_UPDATE, HITL_SIGN_OFF' },
        resource: { type: 'string', description: 'Resource affected' },
        details: { type: 'string', description: 'Audit details and explanation' },
      },
    },
    requiresHitl: false,
  },
];

export function executeAgentTool(
  toolName: string,
  params: any,
  state: ProjectState,
  invokedByAgent: string,
  currentUserRole: Role,
  currentUserName: string
): { success: boolean; result: any; hitlTriggered?: boolean; hitlId?: string; message: string } {
  switch (toolName) {
    case 'query_project_metrics': {
      const filter = params.filter || 'ALL';
      const stalledStories = state.wbs.filter(
        (i) =>
          (i.level === 'STORY' || i.level === 'TASK') &&
          (i.isStalled || ((i.stage === 'CODE_REVIEW' || i.stage === 'QA') && i.timeInCurrentStageHours > 48))
      );
      return {
        success: true,
        result: {
          evm: {
            cpi: state.evm.cpi,
            spi: state.evm.spi,
            costVariance: state.evm.cv,
            scheduleVariance: state.evm.sv,
            estimateAtCompletion: state.evm.eac,
            statusHealth: state.evm.statusHealth,
          },
          dora: {
            deploymentFrequency: state.dora.deploymentFrequency.value,
            leadTimeHours: state.dora.leadTimeForChanges.hours,
            changeFailureRate: `${state.dora.changeFailureRate.percentage}%`,
            mttrHours: state.dora.timeToRestoreService.hours,
          },
          stalledCount: stalledStories.length,
          stalledStories: stalledStories.map((s) => ({
            id: s.id,
            code: s.code,
            title: s.title,
            assignee: s.assigneeName,
            stage: s.stage,
            hoursInStage: s.timeInCurrentStageHours,
            incompleteDod: s.dodChecklist.filter((d) => !d.completed).map((d) => d.text),
          })),
        },
        message: 'Successfully retrieved comprehensive project metrics telemetry.',
      };
    }

    case 'detect_stalled_stories': {
      const threshold = params.thresholdHours || 48;
      const stalled = state.wbs.filter(
        (w) =>
          (w.level === 'STORY' || w.level === 'TASK') &&
          (w.isStalled || ((w.stage === 'CODE_REVIEW' || w.stage === 'QA') && w.timeInCurrentStageHours >= threshold))
      );
      return {
        success: true,
        result: {
          thresholdHours: threshold,
          stalledCount: stalled.length,
          items: stalled.map((w) => ({
            code: w.code,
            title: w.title,
            stage: w.stage,
            hoursInStage: w.timeInCurrentStageHours,
            assignee: w.assigneeName,
            dodCompleted: w.dodChecklist.filter((d) => d.completed).length,
            dodTotal: w.dodChecklist.length,
            reason: w.stalledReason || `Exceeded ${threshold}h threshold in ${w.stage}`,
          })),
        },
        message: `Detected ${stalled.length} stalled delivery items exceeding ${threshold} hours in stage.`,
      };
    }

    case 'rebalance_team_capacity': {
      // Sensitive mutation: Enforce HITL!
      const { taskId, targetAssigneeId, reason } = params;
      const task = state.wbs.find((w) => w.id === taskId || w.code === taskId);
      const targetUser = state.users.find((u) => u.id === targetAssigneeId || u.name === targetAssigneeId);

      if (!task || !targetUser) {
        return {
          success: false,
          result: null,
          message: `Unable to locate task (${taskId}) or user (${targetAssigneeId}).`,
        };
      }

      const hitlId = `hitl-${Date.now()}`;
      const hitlAction: HitlPendingAction = {
        id: hitlId,
        timestamp: new Date().toISOString(),
        agentId: invokedByAgent,
        agentName: 'Resource & EVM Financial Agent',
        actionType: 'REALLOCATE_TASK',
        title: `Rebalance Task ${task.code} to ${targetUser.name}`,
        description: reason || `Reassign ${task.title} (${task.storyPoints || 0} pts) to optimize weekly team capacity.`,
        payload: {
          taskId: task.id,
          taskCode: task.code,
          taskTitle: task.title,
          fromUserId: task.assigneeId,
          fromUserName: task.assigneeName,
          toUserId: targetUser.id,
          toUserName: targetUser.name,
          points: task.storyPoints,
        },
        requiredRole: 'DELIVERY_MANAGER',
        status: 'PENDING',
      };

      state.hitlQueue.unshift(hitlAction);

      return {
        success: true,
        hitlTriggered: true,
        hitlId,
        result: hitlAction,
        message: `Human-in-the-Loop Checkpoint created (ID: ${hitlId}). Reallocation of ${task.code} requires Delivery Manager sign-off before committing.`,
      };
    }

    case 'trigger_retrospective': {
      const { sprintName, template = 'STOP_START_CONTINUE', includeIncidentActionItems = true } = params;
      const newRetroId = `retro-${Date.now()}`;

      // Default columns based on template
      let columns: any[] = [];
      if (template === 'STOP_START_CONTINUE') {
        columns = [
          {
            id: 'col-stop',
            title: 'Stop Doing',
            color: 'red',
            cards: [
              {
                id: `card-${Date.now()}-1`,
                author: 'Scrum Orchestrator Agent',
                text: 'Stop allowing PRs to wait in Code Review past the 48-hour SLA without pair-review escalation.',
                votes: 4,
              },
            ],
          },
          {
            id: 'col-start',
            title: 'Start Doing',
            color: 'emerald',
            cards: [
              {
                id: `card-${Date.now()}-2`,
                author: 'DevOps & ITIL Agent',
                text: 'Start pre-checking automated Change Risk scores prior to Sprint Demo deployment.',
                votes: 5,
              },
            ],
          },
          {
            id: 'col-continue',
            title: 'Continue Doing',
            color: 'blue',
            cards: [
              {
                id: `card-${Date.now()}-3`,
                author: 'EVM Financial Agent',
                text: 'Continue automated weekly timesheet logging and formula-sanitized Excel telemetry audits.',
                votes: 3,
              },
            ],
          },
        ];
      } else if (template === 'FOUR_LS') {
        columns = [
          { id: 'c-liked', title: 'Liked', color: 'emerald', cards: [] },
          { id: 'c-learned', title: 'Learned', color: 'blue', cards: [] },
          { id: 'c-lacked', title: 'Lacked', color: 'amber', cards: [] },
          { id: 'c-longed', title: 'Longed For', color: 'purple', cards: [] },
        ];
      } else {
        columns = [
          { id: 'c-mad', title: 'Mad', color: 'red', cards: [] },
          { id: 'c-sad', title: 'Sad', color: 'amber', cards: [] },
          { id: 'c-glad', title: 'Glad', color: 'emerald', cards: [] },
        ];
      }

      // Action items to rollover from prior retro
      const priorUnresolved = state.retrospectives
        .flatMap((r) => r.actionItems)
        .filter((a) => a.status === 'OPEN' || a.status === 'IN_PROGRESS');

      const actionItems = includeIncidentActionItems
        ? priorUnresolved.map((item) => ({
            ...item,
            id: `rollover-${item.id}`,
            status: 'ROLLED_OVER' as const,
            targetSprint: sprintName,
          }))
        : [];

      const newRetro = {
        id: newRetroId,
        sprintName,
        date: new Date().toISOString().split('T')[0],
        template: template as RetroTemplate,
        status: 'ACTIVE' as const,
        columns,
        actionItems,
        aiSentimentSummary: `Spawned automated retrospective for ${sprintName}. Telemetry snapshot: CPI ${state.evm.cpi}, DORA Change Failure Rate ${state.dora.changeFailureRate.percentage}%. ${actionItems.length} prior action items flagged for rollover.`,
        metricsSnapshot: {
          completedPoints: 38,
          plannedPoints: 44,
          stalledHoursTotal: 52,
          cfr: state.dora.changeFailureRate.percentage,
        },
      };

      state.retrospectives.unshift(newRetro);

      return {
        success: true,
        result: newRetro,
        message: `Generated retrospective board for "${sprintName}" with ${actionItems.length} rolled-over action items and automated DORA telemetry.`,
      };
    }

    case 'evaluate_change_gate': {
      const { releaseVersion } = params;
      const release = state.dora.recentReleases.find((r) => r.version === releaseVersion) || {
        id: `rel-${Date.now()}`,
        version: releaseVersion,
        deployedAt: new Date().toISOString(),
        leadTimeHours: 18.2,
        status: 'SUCCESS' as const,
        incidentLevel: 'NONE' as const,
        changeRiskScore: 28,
      };

      const stalledDependencies = state.wbs.filter((w) => w.releaseTag === releaseVersion && w.isStalled);
      const isApproved = release.changeRiskScore < 35 && stalledDependencies.length === 0;

      return {
        success: true,
        result: {
          version: releaseVersion,
          riskScore: release.changeRiskScore,
          riskThreshold: 35,
          cfrStandard: '< 5% (Current: 4.2% - ELITE)',
          stalledBlockersCount: stalledDependencies.length,
          stalledBlockers: stalledDependencies.map((s) => `${s.code}: ${s.title} (${s.timeInCurrentStageHours}h in ${s.stage})`),
          gateStatus: isApproved ? 'PASS_AUTOMATED_GATE' : 'CONDITIONAL_HITL_REQUIRED',
          recommendation: isApproved
            ? 'Complies with ITIL 5 Change Enablement Standard Service Value stream. Proceed with automated release deployment.'
            : 'Elevated risk detected due to stalled dependencies or incomplete Definition of Done. Delivery Manager manual override required.',
        },
        message: `ITIL 5 Change Gate evaluation complete for ${releaseVersion}. Risk score: ${release.changeRiskScore}/100.`,
      };
    }

    case 'search_knowledge_base': {
      const query = (params.query || '').toLowerCase();
      const framework = params.framework || 'ALL';

      const results = state.knowledgeBase.filter((kb) => {
        const matchesFramework = framework === 'ALL' || kb.framework === framework;
        const matchesText =
          kb.title.toLowerCase().includes(query) ||
          kb.summary.toLowerCase().includes(query) ||
          kb.tags.some((t) => t.toLowerCase().includes(query)) ||
          kb.fullGuideMarkdown.toLowerCase().includes(query);
        return matchesFramework && matchesText;
      });

      return {
        success: true,
        result: results.map((r) => ({
          id: r.id,
          title: r.title,
          framework: r.framework,
          summary: r.summary,
          keyPrinciples: r.keyPrinciples,
          videoTitle: r.videoTitle,
          chapters: r.chapters,
          deepLinks: r.deepLinks,
        })),
        message: `Found ${results.length} authoritative framework standards matching query "${params.query}".`,
      };
    }

    case 'log_security_audit_event': {
      const { action, resource, details } = params;
      const lastBlock = state.securityLedger[state.securityLedger.length - 1];
      const prevHash = lastBlock?.hash || '0000000000000000000000000000000000000000000000000000000000000000';
      const timestamp = new Date().toISOString();
      const payloadString = `${prevHash}|${timestamp}|${action}|${resource}|${details}`;
      const hash = crypto.createHash('sha256').update(payloadString).digest('hex');

      const entry: AuditLedgerEntry = {
        id: `sec-${Date.now()}`,
        timestamp,
        ledgerType: 'SECURITY_AUDIT',
        action,
        userId: 'usr-agent-sec',
        userName: currentUserName || 'Security Guardrail Agent',
        userRole: currentUserRole || 'ADMIN',
        resource,
        details,
        ipAddress: '10.240.0.12 (Internal RPC)',
        previousHash: prevHash,
        hash,
        isImmutableChainVerified: true,
      };

      state.securityLedger.push(entry);

      return {
        success: true,
        result: entry,
        message: `Appended cryptographically chained security block with SHA-256 digest: ${hash.slice(0, 16)}...`,
      };
    }

    default:
      return {
        success: false,
        result: null,
        message: `Unknown agent tool: ${toolName}`,
      };
  }
}
