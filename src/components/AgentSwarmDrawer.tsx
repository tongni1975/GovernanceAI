import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import { AgentId } from '../types/index.ts';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Cpu,
  AlertCircle,
  FileCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  Layers,
  Search,
} from 'lucide-react';

export const AgentSwarmDrawer: React.FC = () => {
  const {
    state,
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendAgentMessage,
    setActiveHitlModal,
  } = useProject();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentId | 'swarm'>('swarm');
  const [activeTab, setActiveTab] = useState<'chat' | 'swarm'>('chat');
  const [isSending, setIsSending] = useState(false);

  if (!isChatOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setInputMessage('');
    try {
      await sendAgentMessage(text, selectedAgent);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    { label: 'Triage stalled stories >48h', prompt: 'Detect stalled stories in current sprint and evaluate Definition of Done compliance.' },
    { label: 'Rebalance Devon Lee (Overloaded)', prompt: 'Devon Lee is overloaded with 48.5 hours. Propose rebalancing WBS-1.2.1 to Kenji Sato with HITL checkpoint.' },
    { label: 'Evaluate Release v2.4.0 ITIL Gate', prompt: 'Evaluate ITIL 5 Change Enablement risk score and release readiness for Release v2.4.0-rc2.' },
    { label: 'Spawn Retrospective & Rollover', prompt: 'Trigger automated Sprint Retrospective for Sprint 14 and rollover unresolved action items.' },
    { label: 'Explain EVM CPI/SPI Formulations', prompt: 'Explain the mathematical formulations for CPI, SPI, and EAC under PMBOK 7 standards.' },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[520px] bg-slate-900 border-l border-slate-700/80 shadow-2xl z-50 flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center">
              Autonomous Agent Swarm
              <span className="ml-2 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">
                5 ACTIVE
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Scrum • EVM • DevOps • RAG • Security Guardrail
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab Selector */}
          <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${activeTab === 'chat' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Copilot Chat
            </button>
            <button
              onClick={() => setActiveTab('swarm')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${activeTab === 'swarm' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Swarm Fleet
            </button>
          </div>

          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
          {/* Agent persona selector bar */}
          <div className="p-2 border-b border-slate-800 bg-slate-900/60 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-500 font-mono text-[10px] uppercase ml-1">Target:</span>
            <button
              onClick={() => setSelectedAgent('swarm')}
              className={`px-2 py-1 rounded-md whitespace-nowrap transition ${selectedAgent === 'swarm' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              ✨ Full Swarm
            </button>
            <button
              onClick={() => setSelectedAgent('scrum_orchestrator')}
              className={`px-2 py-1 rounded-md whitespace-nowrap transition ${selectedAgent === 'scrum_orchestrator' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              ⚡ Scrum Lead
            </button>
            <button
              onClick={() => setSelectedAgent('evm_financial')}
              className={`px-2 py-1 rounded-md whitespace-nowrap transition ${selectedAgent === 'evm_financial' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              💰 EVM Finance
            </button>
            <button
              onClick={() => setSelectedAgent('devops_itil')}
              className={`px-2 py-1 rounded-md whitespace-nowrap transition ${selectedAgent === 'devops_itil' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              🚀 DevOps/ITIL
            </button>
            <button
              onClick={() => setSelectedAgent('rag_specialist')}
              className={`px-2 py-1 rounded-md whitespace-nowrap transition ${selectedAgent === 'rag_specialist' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              📚 RAG SME
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2.5 bg-slate-950/40 border-b border-slate-800 overflow-x-auto flex space-x-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.prompt)}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center space-x-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                <span>{qp.label}</span>
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-cyan-400 mx-auto flex items-center justify-center mb-3">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Autonomous Multi-Agent Swarm Standing By
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Ask any agent to run EVM telemetry, audit Definition of Done checklists, inspect stalled stories, or evaluate ITIL 5 release gates.
                </p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-1">
                    {msg.sender === 'user' ? (
                      <span className="font-semibold text-slate-300">You</span>
                    ) : (
                      <>
                        <span className="font-semibold text-cyan-400">
                          {msg.agentName || 'Swarm Orchestrator'}
                        </span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-[92%] rounded-xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-none'
                        : msg.sender === 'system'
                        ? 'bg-slate-950 border border-slate-800 text-slate-200 w-full'
                        : 'bg-slate-800/90 border border-slate-700 text-slate-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    {/* Tool Invocations Telemetry */}
                    {msg.toolInvocations && msg.toolInvocations.length > 0 && (
                      <div className="mb-2.5 pb-2 border-b border-slate-700/60 space-y-1.5">
                        <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center">
                          <Cpu className="w-3 h-3 text-cyan-400 mr-1" />
                          Autonomous Tool Execution:
                        </div>
                        {msg.toolInvocations.map((t, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950/70 p-2 rounded border border-slate-700 font-mono text-[11px]"
                          >
                            <div className="flex items-center justify-between text-cyan-300 font-semibold">
                              <span>⚙️ {t.toolName}()</span>
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded ${
                                  t.status === 'HITL_BLOCKED'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                }`}
                              >
                                {t.status}
                              </span>
                            </div>
                            <div className="text-slate-400 text-[10px] mt-1 truncate">
                              Input: {JSON.stringify(t.params)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Markdown rendering with paragraphs and bold */}
                    <div className="whitespace-pre-wrap space-y-2 font-sans">
                      {msg.content}
                    </div>

                    {/* HITL Block Action Button */}
                    {msg.hitlActionId && (
                      <div className="mt-3 p-2.5 bg-amber-950/50 border border-amber-700/60 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-amber-300 text-xs">
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Requires Delivery Manager Sign-Off</span>
                        </div>
                        <button
                          onClick={() => {
                            const hitl = state?.hitlQueue.find((h) => h.id === msg.hitlActionId);
                            if (hitl) setActiveHitlModal(hitl);
                          }}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition shadow"
                        >
                          Review Checkpoint
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isSending && (
              <div className="flex items-center space-x-2 text-xs text-cyan-400 animate-pulse p-2">
                <Bot className="w-4 h-4 animate-spin" />
                <span>Agent Swarm synthesizing project state & reasoning...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-800 bg-slate-950">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${selectedAgent === 'swarm' ? 'the Agent Swarm' : selectedAgent}...`}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Swarm Fleet Status Tab */
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs">
            <h4 className="font-semibold text-white flex items-center mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5" />
              Deterministic Multi-Agent State Machine
            </h4>
            <p className="text-slate-400 text-[11px]">
              Orchestrated with LangGraph/Workflow state transitions, structured tool contracts, and non-bypassable Human-in-the-Loop checkpoints.
            </p>
          </div>

          {state?.agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-2.5 hover:border-slate-600 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-600"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center">
                      {agent.name}
                      <span className="ml-2 text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                        {agent.frameworkBadge}
                      </span>
                    </h5>
                    <p className="text-[10px] text-cyan-400 font-medium">{agent.title}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    agent.status === 'ALERTING'
                      ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                      : agent.status === 'MONITORING'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">
                {agent.operationalScope}
              </p>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 flex items-center">
                  <Clock className="w-3 h-3 text-slate-500 mr-1" />
                  {agent.lastActivity}
                </span>

                <button
                  onClick={() => {
                    setSelectedAgent(agent.id);
                    setActiveTab('chat');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center"
                >
                  Engage <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
