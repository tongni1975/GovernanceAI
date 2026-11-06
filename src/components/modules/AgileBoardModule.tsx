import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext.tsx';
import { WbsItem, WbsStage } from '../../types/index.ts';
import {
  Kanban,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Bot,
} from 'lucide-react';

interface ColumnDef {
  stage: WbsStage;
  label: string;
  wipLimit?: number;
  color: string;
}

export const AgileBoardModule: React.FC = () => {
  const { state, updateWbsStage, toggleDodItem, sendAgentMessage, setIsChatOpen } = useProject();
  const [openDodId, setOpenDodId] = useState<string | null>('wbs-1.1.1'); // Default open stalled story DoD
  const [alertError, setAlertError] = useState<string | null>(null);

  const columns: ColumnDef[] = [
    { stage: 'BACKLOG', label: 'Sprint Backlog', color: 'slate' },
    { stage: 'READY', label: 'Ready for Dev', wipLimit: 4, color: 'indigo' },
    { stage: 'IN_PROGRESS', label: 'In Progress', wipLimit: 3, color: 'blue' },
    { stage: 'CODE_REVIEW', label: 'Code Review', wipLimit: 2, color: 'amber' },
    { stage: 'QA', label: 'QA / Verification', wipLimit: 2, color: 'cyan' },
    { stage: 'DONE', label: 'Definition of Done', color: 'emerald' },
  ];

  const stageOrder: WbsStage[] = ['BACKLOG', 'READY', 'IN_PROGRESS', 'CODE_REVIEW', 'QA', 'DONE'];

  const handleStageShift = async (item: WbsItem, direction: 'forward' | 'backward') => {
    const currentIndex = stageOrder.indexOf(item.stage);
    const targetIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex < 0 || targetIndex >= stageOrder.length) return;

    const nextStage = stageOrder[targetIndex];
    setAlertError(null);

    const res = await updateWbsStage(item.id, nextStage);
    if (!res.success && res.error) {
      setAlertError(res.error);
    }
  };

  const storiesAndTasks = state?.wbs.filter((i) => i.level === 'STORY' || i.level === 'TASK') || [];

  return (
    <div className="space-y-4">
      {/* Top Banner Alert if any DoD gate error */}
      {alertError && (
        <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl flex items-center justify-between text-xs text-red-200 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{alertError}</span>
          </div>
          <button
            onClick={() => setAlertError(null)}
            className="text-red-400 hover:text-white font-mono text-xs px-2 py-0.5 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Control / Cadence Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center">
              Agile Delivery Board • {state?.currentSprint || 'Sprint 14'}
            </h2>
            <p className="text-xs text-slate-400">
              WIP Limits enforcement, cycle-time telemetry, and non-negotiable Definition of Done quality gates.
            </p>
          </div>
        </div>

        {/* Stalled stories notice */}
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => {
              sendAgentMessage('Analyze the stalled HSM PKCS#11 story and recommend unblocking strategies.', 'scrum_orchestrator');
              setIsChatOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-semibold transition"
          >
            <Bot className="w-3.5 h-3.5 text-red-400" />
            <span>1 Stalled Story (&gt;48h in Review)</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {columns.map((col) => {
          const colItems = storiesAndTasks.filter((item) => item.stage === col.stage);
          const isWipBreached = col.wipLimit !== undefined && colItems.length > col.wipLimit;

          return (
            <div
              key={col.stage}
              className={`bg-slate-900 border rounded-xl flex flex-col min-h-[580px] shadow-md ${
                isWipBreached ? 'border-amber-700/80 ring-1 ring-amber-600/30' : 'border-slate-800'
              }`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-800 bg-slate-950/70 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white">{col.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {colItems.length}
                  </span>
                </div>

                {col.wipLimit && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isWipBreached
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'text-slate-500'
                    }`}
                  >
                    WIP: {col.wipLimit} {isWipBreached ? '⚠️ BREACH' : ''}
                  </span>
                )}
              </div>

              {/* Cards Container */}
              <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto">
                {colItems.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-lg text-slate-600 text-xs">
                    No items in {col.label}
                  </div>
                ) : (
                  colItems.map((item) => {
                    const isDodOpen = openDodId === item.id;
                    const completedDod = item.dodChecklist.filter((d) => d.completed).length;
                    const totalDod = item.dodChecklist.length;

                    return (
                      <div
                        key={item.id}
                        className={`bg-slate-800/90 border rounded-xl p-3 shadow-md transition-all hover:border-slate-600 ${
                          item.isStalled
                            ? 'border-red-600/90 ring-1 ring-red-600/40 bg-red-950/10'
                            : 'border-slate-700'
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                          <span className="font-bold text-cyan-400">{item.code}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-semibold border border-slate-700">
                            {item.storyPoints ? `${item.storyPoints} pts` : 'TASK'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-white leading-snug mb-1">
                          {item.title}
                        </h4>

                        {/* Stalled Alert Banner */}
                        {item.isStalled && (
                          <div className="my-2 p-2 rounded-lg bg-red-950 border border-red-800 text-[10px] text-red-200 space-y-1">
                            <div className="flex items-center font-bold text-red-300">
                              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-400 shrink-0" />
                              <span>STALLED IN {item.stage} ({item.timeInCurrentStageHours}h)</span>
                            </div>
                            <p className="text-[10px] text-red-300/90">
                              {item.stalledReason}
                            </p>
                          </div>
                        )}

                        {/* Assignee & Stage Hours */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/60 mt-2">
                          <div className="flex items-center space-x-1.5 truncate">
                            <User className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="text-slate-300 truncate">{item.assigneeName || 'Unassigned'}</span>
                          </div>
                          <span className="font-mono text-[10px] flex items-center text-slate-400 shrink-0">
                            <Clock className="w-2.5 h-2.5 mr-1 text-slate-500" />
                            {item.timeInCurrentStageHours}h in stage
                          </span>
                        </div>

                        {/* Definition of Done (DoD) Accordion */}
                        <div className="mt-2.5 pt-2 border-t border-slate-700/60">
                          <button
                            onClick={() => setOpenDodId(isDodOpen ? null : item.id)}
                            className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 hover:text-white"
                          >
                            <span className="flex items-center">
                              <ShieldCheck className="w-3 h-3 text-emerald-400 mr-1" />
                              Definition of Done ({completedDod}/{totalDod})
                            </span>
                            {isDodOpen ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          {isDodOpen && (
                            <div className="mt-2 space-y-1.5 bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-[11px]">
                              {item.dodChecklist.map((dod) => (
                                <label
                                  key={dod.id}
                                  className="flex items-start space-x-2 cursor-pointer hover:text-white transition"
                                >
                                  <input
                                    type="checkbox"
                                    checked={dod.completed}
                                    onChange={(e) => toggleDodItem(item.id, dod.id, e.target.checked)}
                                    className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900"
                                  />
                                  <span className={dod.completed ? 'text-slate-400 line-through' : 'text-slate-200'}>
                                    {dod.text}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Move Stage Controls */}
                        <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleStageShift(item, 'backward')}
                            disabled={item.stage === 'BACKLOG'}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20"
                            title="Move back one stage"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {item.stage}
                          </span>

                          <button
                            onClick={() => handleStageShift(item, 'forward')}
                            disabled={item.stage === 'DONE'}
                            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-700 hover:bg-cyan-600 text-slate-200 hover:text-white font-mono text-[10px] transition disabled:opacity-20"
                            title="Advance stage"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
