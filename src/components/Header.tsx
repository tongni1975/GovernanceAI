import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import { Role } from '../types/index.ts';
import {
  ShieldAlert,
  FileSpreadsheet,
  Bot,
  Sparkles,
  ChevronDown,
  Bell,
  Activity,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    state,
    currentUser,
    currentUserRole,
    setCurrentUserRole,
    runSwarmScan,
    downloadExcel,
    setIsChatOpen,
    isChatOpen,
    setActiveHitlModal,
  } = useProject();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const pendingHitlCount = state?.hitlQueue.filter((h) => h.status === 'PENDING').length || 0;

  const roles: { role: Role; label: string; desc: string; icon: string }[] = [
    {
      role: 'ADMIN',
      label: 'Admin (Elena Rostova)',
      desc: 'VP Enterprise Delivery - Full system governance & baseline lock',
      icon: '🛡️',
    },
    {
      role: 'DELIVERY_MANAGER',
      label: 'Delivery Manager (Marcus Vance)',
      desc: 'Principal Delivery Lead - HITL sign-offs & EVM controls',
      icon: '📊',
    },
    {
      role: 'SCRUM_MASTER',
      label: 'Scrum Master (Aisha Al-Mansoor)',
      desc: 'Lead Agile Coach - Flow triage, retrospectives & rollover',
      icon: '⚡',
    },
    {
      role: 'DEVELOPER',
      label: 'Developer / SRE (Devon Lee)',
      desc: 'Senior Systems Engineer - Story execution & timesheet logging',
      icon: '💻',
    },
    {
      role: 'AUDITOR',
      label: 'External Auditor (Sophia Sterling)',
      desc: 'GRC Partner - Read-only SHA-256 chain verification & export',
      icon: '🔍',
    },
  ];

  const handleScan = async () => {
    setIsScanning(true);
    try {
      await runSwarmScan();
      setIsChatOpen(true);
    } finally {
      setIsScanning(false);
    }
  };

  const cpi = state?.evm.cpi || 0.939;
  const spi = state?.evm.spi || 0.916;
  const cfr = state?.dora.changeFailureRate.percentage || 4.2;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top Banner Ticker */}
      <div className="bg-slate-950/80 px-4 py-1 border-b border-slate-800/60 text-xs flex flex-wrap items-center justify-between text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-emerald-400 font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
            SWARM STATUS: ACTIVE
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-300">
            PROJECT: <span className="text-white font-semibold">{state?.code || 'CORE-BANK-V2'}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            SPRINT: <span className="text-cyan-400 font-medium">{state?.currentSprint || 'Sprint 14'}</span>
          </span>
        </div>

        {/* Live EVM & DORA metrics ticker */}
        <div className="flex items-center space-x-4 font-mono">
          <div className="flex items-center space-x-1" title="Cost Performance Index (CPI) < 1.0 indicates cost overrun">
            <span className="text-slate-400">CPI:</span>
            <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${cpi < 0.95 ? 'bg-red-950 text-red-400 border border-red-800/60' : 'bg-emerald-950 text-emerald-400'}`}>
              {cpi.toFixed(3)}
            </span>
          </div>

          <div className="flex items-center space-x-1" title="Schedule Performance Index (SPI) < 1.0 indicates schedule lag">
            <span className="text-slate-400">SPI:</span>
            <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${spi < 0.95 ? 'bg-amber-950 text-amber-400 border border-amber-800/60' : 'bg-emerald-950 text-emerald-400'}`}>
              {spi.toFixed(3)}
            </span>
          </div>

          <div className="flex items-center space-x-1" title="DORA Change Failure Rate < 5% is ELITE">
            <span className="text-slate-400">CFR:</span>
            <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              {cfr}% (ELITE)
            </span>
          </div>

          <span className="text-slate-600">|</span>
          <span className="text-slate-400 flex items-center">
            <Activity className="w-3.5 h-3.5 text-cyan-400 mr-1" />
            Dual-Ledger: <span className="text-emerald-400 ml-1 font-semibold">Chained (SHA-256)</span>
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand and Project Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center">
                  NexusGovernance <span className="ml-1 text-cyan-400 text-sm font-mono px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50">AI</span>
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  ITIL 5 • PMP • DORA
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                {state?.name || 'Project Alpha: Cloud Core Banking Modernization'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center space-x-3">
          {/* Autonomous Swarm Scan Button */}
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all border border-cyan-400/30 active:scale-95 disabled:opacity-50"
            title="Trigger all 5 agents to audit sprint health, EVM, DORA, and security"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : 'text-cyan-200'}`} />
            <span>{isScanning ? 'Swarm Auditing...' : 'Run Swarm Scan'}</span>
          </button>

          {/* Excel Export Button */}
          <button
            onClick={downloadExcel}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs font-semibold transition-all shadow-sm"
            title="Download multi-tab sanitized Excel telemetry (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export .xlsx</span>
          </button>

          {/* HITL Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => {
                const firstPending = state?.hitlQueue.find((h) => h.status === 'PENDING');
                if (firstPending) {
                  setActiveHitlModal(firstPending);
                } else {
                  alert('No pending Human-in-the-Loop checkpoints at this time.');
                }
              }}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Human-in-the-Loop Pending Approvals"
            >
              <Bell className="w-4 h-4" />
              {pendingHitlCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce">
                  {pendingHitlCount}
                </span>
              )}
            </button>
          </div>

          {/* RBAC Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-cyan-500/50"
              />
              <div className="text-left">
                <div className="text-[11px] font-semibold text-white leading-tight flex items-center">
                  <span>{currentUser.name}</span>
                </div>
                <div className="text-[10px] text-cyan-400 font-mono">
                  Role: {currentUserRole}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Switch Role (RBAC Simulation)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Test permissions, HITL thresholds, and audit visibility.
                    </p>
                  </div>

                  <div className="py-1">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          setCurrentUserRole(r.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-start space-x-2.5 hover:bg-slate-800/80 transition ${currentUserRole === r.role ? 'bg-cyan-950/40 border-l-2 border-cyan-400' : ''}`}
                      >
                        <span className="text-lg">{r.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">
                              {r.label}
                            </span>
                            {currentUserRole === r.role && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                            {r.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Toggle Agent Copilot Drawer */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${isChatOpen ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-750'}`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Agent Swarm</span>
          </button>
        </div>
      </div>
    </header>
  );
};
