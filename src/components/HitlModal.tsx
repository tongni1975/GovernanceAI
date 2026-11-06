import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Lock,
  ArrowRight,
  X,
} from 'lucide-react';

export const HitlModal: React.FC = () => {
  const {
    activeHitlModal,
    setActiveHitlModal,
    currentUserRole,
    currentUser,
    resolveHitl,
  } = useProject();

  const [resolutionNote, setResolutionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeHitlModal) return null;

  const isAuthorized =
    currentUserRole === 'ADMIN' ||
    (currentUserRole === 'DELIVERY_MANAGER' && activeHitlModal.requiredRole !== 'ADMIN');

  const handleDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    setIsSubmitting(true);
    try {
      await resolveHitl(activeHitlModal.id, decision, resolutionNote);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-amber-950/60 border-b border-amber-800/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-900/80 border border-amber-700 text-amber-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-900 text-amber-200 border border-amber-700">
                  HITL CHECKPOINT • {activeHitlModal.actionType}
                </span>
                <span className="text-xs text-amber-400 font-mono">
                  ID: {activeHitlModal.id}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {activeHitlModal.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setActiveHitlModal(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          {/* Agent Staging Details */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Initiating Agent:</span>
              <span className="font-semibold text-cyan-400">
                {activeHitlModal.agentName}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Governance Gate:</span>
              <span className="font-semibold text-amber-400">
                Requires {activeHitlModal.requiredRole} Authorization
              </span>
            </div>
            <p className="text-slate-300 pt-1 border-t border-slate-800/80 leading-relaxed">
              {activeHitlModal.description}
            </p>
          </div>

          {/* Mutation Payload Preview */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Proposed Mutation State:
            </label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-cyan-300 overflow-x-auto">
              <pre>{JSON.stringify(activeHitlModal.payload, null, 2)}</pre>
            </div>
          </div>

          {/* Authorization Check */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between ${
              isAuthorized
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-red-950/40 border-red-800/60 text-red-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {isAuthorized ? (
                <UserCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <Lock className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p className="font-semibold">
                  {isAuthorized
                    ? `Authorized as ${currentUserRole} (${currentUser.name})`
                    : `Unauthorized Role: ${currentUserRole}`}
                </p>
                <p className="text-[11px] opacity-80">
                  {isAuthorized
                    ? 'Your role possesses explicit cryptographic signing authority for this action.'
                    : `Switch your active role in the header to ${activeHitlModal.requiredRole} to sign off.`}
                </p>
              </div>
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300">
              Governance Audit Note (recorded to immutable security ledger):
            </label>
            <textarea
              rows={2}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="e.g. Approved following review of team capacity heatmap and Sprint 14 velocity targets."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={() => setActiveHitlModal(null)}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition"
          >
            Dismiss
          </button>

          <button
            onClick={() => handleDecision('REJECTED')}
            disabled={!isAuthorized || isSubmitting}
            className="px-4 py-2 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-700 font-medium transition disabled:opacity-40 flex items-center space-x-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Mutation</span>
          </button>

          <button
            onClick={() => handleDecision('APPROVED')}
            disabled={!isAuthorized || isSubmitting}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-600/30 disabled:opacity-40 flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Signing Block...' : 'Approve & Commit Block'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
