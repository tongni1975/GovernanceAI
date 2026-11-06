import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext.tsx';
import { Header } from './components/Header.tsx';
import { AgentSwarmDrawer } from './components/AgentSwarmDrawer.tsx';
import { HitlModal } from './components/HitlModal.tsx';
import { WbsGanttModule } from './components/modules/WbsGanttModule.tsx';
import { AgileBoardModule } from './components/modules/AgileBoardModule.tsx';
import { FinancialsModule } from './components/modules/FinancialsModule.tsx';
import { DevOpsModule } from './components/modules/DevOpsModule.tsx';
import { RetrospectivesModule } from './components/modules/RetrospectivesModule.tsx';
import { KnowledgeHubModule } from './components/modules/KnowledgeHubModule.tsx';
import { AuditLedgerModule } from './components/modules/AuditLedgerModule.tsx';
import {
  ListTree,
  Kanban,
  DollarSign,
  Rocket,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  Bot,
  Sparkles,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { selectedTab, setSelectedTab, loading, isChatOpen, setIsChatOpen } = useProject();

  const navigationTabs = [
    { id: 'wbs', label: 'Scope & WBS', icon: ListTree, badge: '5 Levels' },
    { id: 'kanban', label: 'Agile Delivery Board', icon: Kanban, badge: 'DoD Gate' },
    { id: 'financials', label: 'EVM & Capacity', icon: DollarSign, badge: 'CPI 0.939' },
    { id: 'devops', label: 'DevOps & ITIL 5', icon: Rocket, badge: 'DORA High' },
    { id: 'retrospective', label: 'Retrospectives', icon: RotateCcw, badge: 'Rollover' },
    { id: 'knowledge', label: 'Knowledge Hub & RAG', icon: BookOpen, badge: 'PMBOK' },
    { id: 'audit', label: 'Dual-Ledger Audit', icon: ShieldCheck, badge: 'SHA-256' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center animate-pulse mb-4 shadow-lg shadow-cyan-500/20">
          <Bot className="w-6 h-6 text-white animate-spin" />
        </div>
        <h2 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300">
          NexusGovernance AI • Initializing Multi-Agent Swarm
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Loading EVM baselines, DORA metrics, and cryptographic audit ledgers...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Header />

      {/* Navigation Sub-Header */}
      <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2 sticky top-[85px] z-30 shadow-md">
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs scrollbar-none">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-cyan-950 text-cyan-300' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Primary Workspace View */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1720px] w-full mx-auto">
        {selectedTab === 'wbs' && <WbsGanttModule />}
        {selectedTab === 'kanban' && <AgileBoardModule />}
        {selectedTab === 'financials' && <FinancialsModule />}
        {selectedTab === 'devops' && <DevOpsModule />}
        {selectedTab === 'retrospective' && <RetrospectivesModule />}
        {selectedTab === 'knowledge' && <KnowledgeHubModule />}
        {selectedTab === 'audit' && <AuditLedgerModule />}
      </main>

      {/* Floating Agent Copilot Button if drawer is closed */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 p-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-2xl shadow-cyan-500/40 border border-cyan-400/40 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 z-40"
        >
          <Bot className="w-5 h-5 text-cyan-200" />
          <span className="text-xs font-bold pr-1">Agent Swarm Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Floating Modals & Drawers */}
      <AgentSwarmDrawer />
      <HitlModal />
    </div>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <MainLayout />
    </ProjectProvider>
  );
}
