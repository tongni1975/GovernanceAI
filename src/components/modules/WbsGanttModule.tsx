import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext.tsx';
import { WbsItem, WbsLevel, WbsStage } from '../../types/index.ts';
import {
  ListTree,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Zap,
  Filter,
} from 'lucide-react';

export const WbsGanttModule: React.FC = () => {
  const { state, updateWbsStage } = useProject();
  const [viewMode, setViewMode] = useState<'wbs' | 'gantt'>('wbs');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'wbs-1.0': true,
    'wbs-1.1': true,
    'wbs-1.2': true,
    'wbs-1.3': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const items = state?.wbs || [];

  const filteredItems = items.filter((item) => {
    if (levelFilter === 'ALL') return true;
    return item.level === levelFilter;
  });

  // Level badge coloring
  const getLevelBadge = (level: WbsLevel) => {
    switch (level) {
      case 'INITIATIVE':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'EPIC':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'FEATURE':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'STORY':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'TASK':
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Stage badge coloring
  const getStageBadge = (stage: WbsStage) => {
    switch (stage) {
      case 'DONE':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'QA':
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      case 'CODE_REVIEW':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'IN_PROGRESS':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'READY':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'BACKLOG':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  // Gantt timeline reference dates (Aug 2026 to Feb 2027)
  const ganttStart = new Date('2026-08-01').getTime();
  const ganttEnd = new Date('2027-02-28').getTime();
  const totalDuration = ganttEnd - ganttStart;

  const calculateGanttPosition = (startStr: string, endStr: string) => {
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    const leftPct = Math.max(0, Math.min(100, ((start - ganttStart) / totalDuration) * 100));
    const widthPct = Math.max(2, Math.min(100 - leftPct, ((end - start) / totalDuration) * 100));
    return { leftPct, widthPct };
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400">
            <ListTree className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center">
              Scope, WBS & Critical Path Schedule Engine
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 5-level hierarchy, finish-to-start dependencies, and baseline variance.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('wbs')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition ${viewMode === 'wbs' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Hierarchical WBS</span>
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition ${viewMode === 'gantt' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Gantt & Critical Path</span>
            </button>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Levels</option>
              <option value="INITIATIVE">Initiative</option>
              <option value="EPIC">Epic</option>
              <option value="STORY">Story</option>
              <option value="TASK">Task</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View Container */}
      {viewMode === 'wbs' ? (
        /* WBS Table Hierarchy */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">WBS Code & Hierarchy</th>
                  <th className="py-3 px-3">Level</th>
                  <th className="py-3 px-3">Assignee</th>
                  <th className="py-3 px-3">Stage</th>
                  <th className="py-3 px-3">Points</th>
                  <th className="py-3 px-3">Planned / Actual</th>
                  <th className="py-3 px-3">Progress</th>
                  <th className="py-3 px-3">Critical Path</th>
                  <th className="py-3 px-4 text-right">DoD & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {filteredItems.map((item) => {
                  const hasChildren = items.some((i) => i.parentId === item.id);
                  const isExpanded = expandedNodes[item.id] !== false;
                  const indentPixels = item.level === 'INITIATIVE' ? 0 : item.level === 'EPIC' ? 16 : item.level === 'FEATURE' ? 32 : 48;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/60 transition ${item.isStalled ? 'bg-red-950/20' : ''}`}
                    >
                      {/* Code & Title */}
                      <td className="py-3 px-4">
                        <div
                          className="flex items-center space-x-2"
                          style={{ paddingLeft: `${indentPixels}px` }}
                        >
                          {hasChildren ? (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                          ) : (
                            <span className="w-4" />
                          )}
                          <span className="font-mono text-cyan-400 font-bold">{item.code}</span>
                          <div>
                            <span className="font-semibold text-white">{item.title}</span>
                            {item.isStalled && (
                              <div className="flex items-center text-[10px] text-red-400 font-mono mt-0.5">
                                <AlertTriangle className="w-3 h-3 mr-1 shrink-0" />
                                <span>{item.stalledReason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Level */}
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getLevelBadge(item.level)}`}>
                          {item.level}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="py-3 px-3">
                        {item.assigneeName ? (
                          <div className="flex items-center space-x-1.5 text-slate-200">
                            <User className="w-3 h-3 text-cyan-400" />
                            <span className="truncate max-w-[120px]">{item.assigneeName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Stage */}
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStageBadge(item.stage)}`}>
                          {item.stage}
                        </span>
                      </td>

                      {/* Points */}
                      <td className="py-3 px-3 font-mono font-semibold text-slate-200">
                        {item.storyPoints ? `${item.storyPoints} pts` : '-'}
                      </td>

                      {/* Hours */}
                      <td className="py-3 px-3 font-mono text-xs">
                        <span className="text-white font-bold">{item.actualHours}h</span>
                        <span className="text-slate-500"> / {item.plannedHours}h</span>
                      </td>

                      {/* Progress */}
                      <td className="py-3 px-3">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-slate-300">{item.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.progress >= 100
                                  ? 'bg-emerald-500'
                                  : item.isStalled
                                  ? 'bg-red-500'
                                  : 'bg-cyan-500'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Critical Path */}
                      <td className="py-3 px-3">
                        {item.isCriticalPath ? (
                          <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                            <Zap className="w-3 h-3 text-amber-400 mr-1" />
                            CRITICAL
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Actions & DoD Check */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-[10px] font-mono text-slate-400">
                            DoD: {item.dodChecklist.filter((d) => d.completed).length}/{item.dodChecklist.length}
                          </span>
                          {item.stage !== 'DONE' && (
                            <button
                              onClick={() => updateWbsStage(item.id, 'DONE')}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 border border-slate-700 text-[10px] font-mono transition"
                              title="Transition to DONE (Enforces Definition of Done checklist)"
                            >
                              Sign Off →
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visual Gantt Timeline with Critical Path */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Gantt Timeline Schedule (Aug 2026 - Feb 2027)
              </h3>
              <p className="text-[11px] text-slate-400">
                Critical path items highlighted with amber borders. Baseline schedule vs Actual progress bars.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="flex items-center text-amber-400">
                <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-400 mr-1.5" />
                Critical Path
              </span>
              <span className="flex items-center text-cyan-400">
                <span className="w-3 h-3 rounded bg-cyan-600 mr-1.5" />
                Standard Schedule
              </span>
              <span className="flex items-center text-red-400">
                <span className="w-3 h-3 rounded bg-red-600 mr-1.5" />
                Stalled (&gt;48h)
              </span>
            </div>
          </div>

          {/* Timeline Months Header */}
          <div className="relative pt-6">
            <div className="grid grid-cols-7 border-b border-slate-800 text-[11px] font-mono text-slate-400 pb-2">
              <div className="border-l border-slate-800 pl-2">Aug 2026</div>
              <div className="border-l border-slate-800 pl-2">Sep 2026</div>
              <div className="border-l border-slate-800 pl-2">Oct 2026</div>
              <div className="border-l border-slate-800 pl-2 text-cyan-400 font-bold">Nov 2026 (Today)</div>
              <div className="border-l border-slate-800 pl-2">Dec 2026</div>
              <div className="border-l border-slate-800 pl-2">Jan 2027</div>
              <div className="border-l border-slate-800 pl-2">Feb 2027</div>
            </div>

            {/* Today Marker Line (Nov 5, 2026) */}
            <div
              className="absolute top-12 bottom-0 w-0.5 bg-red-500/80 z-20 pointer-events-none"
              style={{ left: '46%' }}
            >
              <span className="absolute -top-5 -left-8 text-[9px] font-mono font-bold bg-red-600 text-white px-1.5 py-0.5 rounded shadow">
                TODAY
              </span>
            </div>

            {/* Gantt Bars List */}
            <div className="space-y-3 pt-3">
              {filteredItems.map((item) => {
                const { leftPct, widthPct } = calculateGanttPosition(item.startDate, item.endDate);

                return (
                  <div key={item.id} className="group relative">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-cyan-400 font-bold">{item.code}</span>
                        <span className="font-semibold text-white truncate max-w-xs">{item.title}</span>
                        {item.dependencies.length > 0 && (
                          <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                            Dep: {item.dependencies.map((d) => `${d.targetId.replace('wbs-', '')} (${d.type})`).join(', ')}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.startDate} → {item.endDate}
                      </span>
                    </div>

                    {/* Timeline Track */}
                    <div className="h-6 w-full bg-slate-950 rounded-lg relative overflow-hidden border border-slate-800/80">
                      {/* Grid Guide Lines */}
                      <div className="absolute inset-0 grid grid-cols-7 pointer-events-none divide-x divide-slate-800/30" />

                      {/* Task Bar */}
                      <div
                        className={`absolute top-1 bottom-1 rounded-md transition-all flex items-center px-2 text-[10px] font-mono text-white truncate shadow ${
                          item.isCriticalPath
                            ? 'bg-amber-600/90 border border-amber-300'
                            : item.isStalled
                            ? 'bg-red-600 border border-red-400'
                            : 'bg-indigo-600/80 border border-indigo-400'
                        }`}
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                        }}
                      >
                        {/* Progress Fill inside task bar */}
                        <div
                          className="absolute inset-y-0 left-0 bg-white/20"
                          style={{ width: `${item.progress}%` }}
                        />
                        <span className="relative z-10 truncate font-semibold">
                          {item.progress}% • {item.assigneeName || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
