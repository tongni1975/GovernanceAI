import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext.tsx';
import { RetroTemplate } from '../../types/index.ts';
import {
  RotateCcw,
  Sparkles,
  ThumbsUp,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Bot,
  Layers,
} from 'lucide-react';

export const RetrospectivesModule: React.FC = () => {
  const {
    state,
    voteRetroCard,
    addRetroCard,
    rolloverActionItem,
    sendAgentMessage,
    setIsChatOpen,
  } = useProject();

  const retros = state?.retrospectives || [];
  const [selectedRetroId, setSelectedRetroId] = useState<string>(retros[0]?.id || '');
  const [newCardText, setNewCardText] = useState('');
  const [targetColumnId, setTargetColumnId] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  const activeRetro = retros.find((r) => r.id === selectedRetroId) || retros[0];

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardText.trim() || !targetColumnId || !activeRetro) return;
    await addRetroCard(activeRetro.id, targetColumnId, newCardText);
    setNewCardText('');
    setIsAddingCard(false);
  };

  // Find unresolved action items across retrospectives to demonstrate the Rollover Engine
  const unresolvedActionItems = retros
    .flatMap((r) => r.actionItems)
    .filter((a) => a.status === 'OPEN' || a.status === 'IN_PROGRESS');

  return (
    <div className="space-y-4">
      {/* Header / Cadence Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center">
              Automated Sprint Retrospectives & Cadence Rollover
            </h2>
            <p className="text-xs text-slate-400">
              Trigger-based ceremony synthesis, multi-template boards, sentiment trends, and action item debt rollover.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Retro Selector */}
          <select
            value={selectedRetroId}
            onChange={(e) => setSelectedRetroId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-cyan-500"
          >
            {retros.map((r) => (
              <option key={r.id} value={r.id}>
                {r.sprintName} ({r.template})
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              sendAgentMessage('Trigger automated Sprint Retrospective board with telemetry snapshot and roll over unresolved action items.', 'scrum_orchestrator');
              setIsChatOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Spawn Automated Retro</span>
          </button>
        </div>
      </div>

      {activeRetro && (
        <div className="space-y-4">
          {/* AI Sentiment & Telemetry Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-start space-x-3 max-w-3xl">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">
                  Scrum Orchestrator Synthesis • {activeRetro.sprintName}
                </p>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                  {activeRetro.aiSentimentSummary}
                </p>
              </div>
            </div>

            {activeRetro.metricsSnapshot && (
              <div className="flex items-center space-x-3 text-xs font-mono bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">VELOCITY:</span>
                  <span className="text-cyan-400 font-bold">
                    {activeRetro.metricsSnapshot.completedPoints}/{activeRetro.metricsSnapshot.plannedPoints} pts
                  </span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-slate-500 text-[10px] block">STALLED HOURS:</span>
                  <span className="text-red-400 font-bold">
                    {activeRetro.metricsSnapshot.stalledHoursTotal}h
                  </span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-slate-500 text-[10px] block">CHANGE FAIL RATE:</span>
                  <span className="text-emerald-400 font-bold">
                    {activeRetro.metricsSnapshot.cfr}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Notes Columns */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${activeRetro.columns.length} gap-4`}>
            {activeRetro.columns.map((col) => (
              <div
                key={col.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col min-h-[420px] shadow-md"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{col.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {col.cards.length}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setTargetColumnId(col.id);
                      setIsAddingCard(true);
                    }}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                    title={`Add card to ${col.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {col.cards.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-lg text-slate-600 text-xs">
                      No cards submitted yet
                    </div>
                  ) : (
                    col.cards.map((card) => (
                      <div
                        key={card.id}
                        className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3 space-y-2 shadow transition"
                      >
                        <p className="text-xs text-slate-200 leading-snug">
                          {card.text}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-300">{card.author}</span>

                          <button
                            onClick={() => voteRetroCard(activeRetro.id, card.id)}
                            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 hover:text-cyan-400 text-slate-300 border border-slate-700 font-mono transition"
                          >
                            <ThumbsUp className="w-3 h-3 text-cyan-400" />
                            <span>{card.votes}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Item Rollover Engine Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                  <Layers className="w-4 h-4 text-cyan-400 mr-1.5" />
                  Retrospective Action Item Rollover Engine
                </h3>
                <p className="text-[11px] text-slate-400">
                  Flags unresolved continuous improvement tasks from previous retrospectives and enables one-click injection into the upcoming sprint backlog.
                </p>
              </div>

              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                {unresolvedActionItems.length} UNRESOLVED ITEMS
              </span>
            </div>

            <div className="space-y-2.5">
              {unresolvedActionItems.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  All retrospective action items are completed.
                </p>
              ) : (
                unresolvedActionItems.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{act.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          {act.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Owner: <strong className="text-slate-300">{act.owner}</strong> • Created in: {act.createdFromRetroId}
                      </p>
                    </div>

                    <button
                      onClick={() => rolloverActionItem(activeRetro.id, act.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow"
                    >
                      <span>Rollover to Next Sprint WBS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {isAddingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-3 shadow-2xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Submit Retrospective Feedback Card
            </h4>

            <form onSubmit={handleCreateCard} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Feedback Description:</label>
                <textarea
                  rows={3}
                  value={newCardText}
                  onChange={(e) => setNewCardText(e.target.value)}
                  placeholder="e.g. Ensure all cryptographic code reviews have designated pairing windows..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCard(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow"
                >
                  Post Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
