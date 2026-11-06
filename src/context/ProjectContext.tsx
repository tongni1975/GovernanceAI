import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ProjectState,
  User,
  Role,
  WbsStage,
  AgentChatMessage,
  AgentId,
  HitlPendingAction,
} from '../types/index.ts';

interface ProjectContextType {
  state: ProjectState | null;
  loading: boolean;
  currentUser: User;
  currentUserRole: Role;
  setCurrentUserRole: (role: Role) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  // Actions
  updateWbsStage: (wbsId: string, stage: WbsStage) => Promise<{ success: boolean; error?: string }>;
  toggleDodItem: (wbsId: string, dodId: string, completed: boolean) => Promise<void>;
  logTimesheet: (data: any) => Promise<void>;
  approveTimesheet: (id: string) => Promise<void>;
  submitExpense: (data: any) => Promise<void>;
  approveExpense: (id: string) => Promise<void>;
  voteRetroCard: (retroId: string, cardId: string) => Promise<void>;
  addRetroCard: (retroId: string, columnId: string, text: string) => Promise<void>;
  rolloverActionItem: (retroId: string, actId: string) => Promise<void>;
  resolveHitl: (hitlId: string, decision: 'APPROVED' | 'REJECTED', note?: string) => Promise<void>;
  runSwarmScan: () => Promise<any>;
  sendAgentMessage: (message: string, agentId?: AgentId | 'swarm') => Promise<AgentChatMessage>;
  chatMessages: AgentChatMessage[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  activeHitlModal: HitlPendingAction | null;
  setActiveHitlModal: (action: HitlPendingAction | null) => void;
  downloadExcel: () => void;
  refreshState: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProjectState | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<Role>('DELIVERY_MANAGER');
  const [selectedTab, setSelectedTab] = useState('wbs');
  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeHitlModal, setActiveHitlModal] = useState<HitlPendingAction | null>(null);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data: ProjectState = await res.json();
        setState(data);
      }
    } catch (err) {
      console.error('Failed to load project state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Sync active user based on selected role
  const currentUser: User = state?.users.find((u) => u.role === currentUserRole) || {
    id: 'usr-default',
    name: 'Marcus Vance',
    email: 'marcus.vance@enterprise.bank',
    role: currentUserRole,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Principal Delivery Lead (PMP, ITIL Master)',
    weeklyCapacityHours: 40,
    hourlyRate: 165,
  };

  const updateWbsStage = async (wbsId: string, stage: WbsStage): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/wbs/${wbsId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage,
          userRole: currentUserRole,
          userName: currentUser.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || data.error };
      }

      await fetchState();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const toggleDodItem = async (wbsId: string, dodId: string, completed: boolean) => {
    try {
      await fetch(`/api/wbs/${wbsId}/dod/${dodId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed,
          userRole: currentUserRole,
          userName: currentUser.name,
        }),
      });
      await fetchState();
    } catch (err) {
      console.error('Failed to update DoD:', err);
    }
  };

  const logTimesheet = async (entryData: any) => {
    try {
      await fetch('/api/timesheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...entryData,
          userRole: currentUserRole,
          userName: currentUser.name,
        }),
      });
      await fetchState();
    } catch (err) {
      console.error('Failed to log timesheet:', err);
    }
  };

  const approveTimesheet = async (id: string) => {
    try {
      await fetch(`/api/timesheets/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userRole: currentUserRole,
          userName: currentUser.name,
        }),
      });
      await fetchState();
    } catch (err) {
      console.error('Failed to approve timesheet:', err);
    }
  };

  const submitExpense = async (data: any) => {
    try {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userRole: currentUserRole,
          userName: currentUser.name,
        }),
      });
      await fetchState();
    } catch (err) {
      console.error('Failed to submit expense:', err);
    }
  };

  const approveExpense = async (id: string) => {
    try {
      await fetch(`/api/expenses/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userRole: currentUserRole,
          userName: currentUser.name,
        }),
      });
      await fetchState();
    } catch (err) {
      console.error('Failed to approve expense:', err);
    }
  };

  const voteRetroCard = async (retroId: string, cardId: string) => {
    try {
      await fetch(`/api/retrospectives/${retroId}/cards/${cardId}/vote`, {
        method: 'POST',
      });
      await fetchState();
    } catch (err) {
      console.error('Failed to vote on retro card:', err);
    }
  };

  const addRetroCard = async (retroId: string, columnId: string, text: string) => {
    try {
      await fetch(`/api/retrospectives/${retroId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          columnId,
          text,
          author: currentUser.name,
        }),
      });
      await fetchState();
    } catch (err) {
      console.error('Failed to add retro card:', err);
    }
  };

  const rolloverActionItem = async (retroId: string, actId: string) => {
    try {
      await fetch(`/api/retrospectives/${retroId}/action-items/${actId}/rollover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userRole: currentUserRole,
          userName: currentUser.name,
        }),
      });
      await fetchState();
    } catch (err) {
      console.error('Failed to rollover action item:', err);
    }
  };

  const resolveHitl = async (hitlId: string, decision: 'APPROVED' | 'REJECTED', note?: string) => {
    try {
      const res = await fetch(`/api/hitl/${hitlId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          userRole: currentUserRole,
          userName: currentUser.name,
          resolutionNote: note,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(`Error: ${errData.message || errData.error}`);
        return;
      }

      await fetchState();
      setActiveHitlModal(null);
    } catch (err) {
      console.error('Failed to resolve HITL:', err);
    }
  };

  const runSwarmScan = async () => {
    try {
      const res = await fetch('/api/agents/scan', { method: 'POST' });
      const scan = await res.json();
      await fetchState();

      // Add summary message to chat
      const sysMsg: AgentChatMessage = {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sender: 'system',
        content: `### 🚀 Autonomous Multi-Agent Swarm Scan Executed
- **Scrum Orchestrator:** ${scan.scrumFindings.summary}
- **EVM Financial Agent:** ${scan.evmFindings.summary}
- **DevOps & ITIL 5 Agent:** ${scan.devopsFindings.doraSummary} ${scan.devopsFindings.gateRecommendation}
- **Security Guardrail:** ${scan.securityFindings.summary}

**Recommended Immediate Next Actions:**
${scan.recommendedActions.map((a: string) => `- ${a}`).join('\n')}`,
      };

      setChatMessages((prev) => [...prev, sysMsg]);
      return scan;
    } catch (err) {
      console.error('Failed to run swarm scan:', err);
    }
  };

  const sendAgentMessage = async (message: string, agentId: AgentId | 'swarm' = 'swarm'): Promise<AgentChatMessage> => {
    const userMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sender: 'user',
      content: message,
    };

    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          agentId,
          userRole: currentUserRole,
          userName: currentUser.name,
        }),
      });

      const reply: AgentChatMessage = await res.json();
      setChatMessages((prev) => [...prev, reply]);
      await fetchState(); // In case tools mutated state
      return reply;
    } catch (err: any) {
      const errorMsg: AgentChatMessage = {
        id: `err-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sender: 'system',
        content: `Failed to receive agent response: ${err.message}`,
      };
      setChatMessages((prev) => [...prev, errorMsg]);
      return errorMsg;
    }
  };

  const downloadExcel = () => {
    const url = `/api/export-excel?role=${currentUserRole}&user=${encodeURIComponent(currentUser.name)}`;
    window.location.href = url;
  };

  return (
    <ProjectContext.Provider
      value={{
        state,
        loading,
        currentUser,
        currentUserRole,
        setCurrentUserRole,
        selectedTab,
        setSelectedTab,
        updateWbsStage,
        toggleDodItem,
        logTimesheet,
        approveTimesheet,
        submitExpense,
        approveExpense,
        voteRetroCard,
        addRetroCard,
        rolloverActionItem,
        resolveHitl,
        runSwarmScan,
        sendAgentMessage,
        chatMessages,
        isChatOpen,
        setIsChatOpen,
        activeHitlModal,
        setActiveHitlModal,
        downloadExcel,
        refreshState: fetchState,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
