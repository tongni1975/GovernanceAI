import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext.tsx';
import {
  GitCommit,
  Rocket,
  ShieldAlert,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const DevOpsModule: React.FC = () => {
  const { state, sendAgentMessage, setIsChatOpen, setActiveHitlModal } = useProject();
  const [selectedReleaseVersion, setSelectedReleaseVersion] = useState('v2.4.0-rc2');

  const dora = state?.dora || {
    deploymentFrequency: { value: '2.8 / day', rating: 'HIGH', description: 'Average deployments per working day' },
    leadTimeForChanges: { hours: 18.5, rating: 'HIGH' },
    changeFailureRate: { percentage: 4.2, rating: 'ELITE' },
    timeToRestoreService: { hours: 0.65, rating: 'ELITE' },
    recentReleases: [],
  };

  const stalledDependencies = state?.wbs.filter((w) => w.releaseTag === selectedReleaseVersion && w.isStalled) || [];

  return (
    <div className="space-y-4">
      {/* Control / Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-950 border border-purple-800 text-purple-400">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center">
              DevOps DORA Engineering Metrics & ITIL 5 Change Enablement
            </h2>
            <p className="text-xs text-slate-400">
              Value stream telemetry, automated Change Advisory gates, and Post-Incident Review (PIR) linkage.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sendAgentMessage('Evaluate ITIL 5 Change Enablement risk score and release gate for Release v2.4.0-rc2.', 'devops_itil');
            setIsChatOpen(true);
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask DevOps Agent to Audit Gate</span>
        </button>
      </div>

      {/* DORA 4 Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Deployment Frequency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono uppercase">Deployment Frequency</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
              {dora.deploymentFrequency.rating}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-center">
            <Rocket className="w-5 h-5 text-cyan-400 mr-2" />
            {dora.deploymentFrequency.value}
          </div>
          <p className="text-[11px] text-slate-400">
            High deployment cadence into staging and production microservices mesh.
          </p>
        </div>

        {/* Lead Time for Changes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono uppercase">Lead Time for Changes</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
              {dora.leadTimeForChanges.rating}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-center">
            <Clock className="w-5 h-5 text-indigo-400 mr-2" />
            {dora.leadTimeForChanges.hours} hours
          </div>
          <p className="text-[11px] text-slate-400">
            Commit-to-production pipeline duration across automated test suites.
          </p>
        </div>

        {/* Change Failure Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono uppercase">Change Failure Rate</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              {dora.changeFailureRate.rating} (&lt;5%)
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mr-2" />
            {dora.changeFailureRate.percentage}%
          </div>
          <p className="text-[11px] text-slate-400">
            Elite reliability tier. Low proportion of releases requiring rollback or hotfixes.
          </p>
        </div>

        {/* Time to Restore Service (MTTR) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono uppercase">Time to Restore Service</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              {dora.timeToRestoreService.rating} (&lt;1h)
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center">
            <RotateCcw className="w-5 h-5 text-emerald-400 mr-2" />
            ~39 minutes ({dora.timeToRestoreService.hours}h)
          </div>
          <p className="text-[11px] text-slate-400">
            Rapid service recovery enabled by automated blue/green canary rollback runbooks.
          </p>
        </div>
      </div>

      {/* ITIL 5 Change Enablement Release Gate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Release Candidate Gate Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              ITIL 5 Production Release Gate
            </h3>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
              SERVICE VALUE STREAM
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Target Release Candidate:</label>
              <select
                value={selectedReleaseVersion}
                onChange={(e) => setSelectedReleaseVersion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="v2.4.0-rc2">v2.4.0-rc2 (Core Mesh & HSM Driver)</option>
                <option value="v2.3.4">v2.3.4 (Past Release - P2 Incident PIR)</option>
                <option value="v2.3.3">v2.3.3 (Clean Release)</option>
              </select>
            </div>

            {/* Risk Score Indicator */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Change Risk Score:</span>
                <span className="font-bold text-emerald-400">28 / 100 (Standard &lt;35)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }} />
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                Risk model parameters: Churn: 840 LOC • Test Coverage: 94.2% • Rollback Readiness: Automated.
              </p>
            </div>

            {/* Blockers check */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-300">Pre-Flight Governance Gates:</span>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center text-emerald-400 space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>SonarQube scan: 0 Blocker, 0 High Vulnerabilities</span>
                </div>
                <div className="flex items-center text-emerald-400 space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Automated Unit & Integration Tests: 94.2% Passed</span>
                </div>
                <div className="flex items-center text-amber-400 space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Dependency: WBS-1.1.1 awaiting 2nd Peer Review sign-off</span>
                </div>
              </div>
            </div>

            {/* Gate Sign-Off Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const hitl = state?.hitlQueue.find((h) => h.id === 'hitl-002');
                  if (hitl) {
                    setActiveHitlModal(hitl);
                  } else {
                    alert('HITL approval for release v2.4.0 already resolved or staged.');
                  }
                }}
                className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold transition flex items-center justify-center space-x-1.5 shadow"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Conditional Gate • Request HITL Sign-Off</span>
              </button>
            </div>
          </div>
        </div>

        {/* Release History & Post-Incident Reviews (PIR) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider">
              Recent Deployment Events & Incident Telemetry
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              DORA Continual Improvement Register
            </span>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {dora.recentReleases.map((rel) => (
              <div
                key={rel.id}
                className={`p-3.5 rounded-xl border space-y-2 transition ${
                  rel.incidentLevel === 'P1' || rel.incidentLevel === 'P2'
                    ? 'bg-red-950/20 border-red-800/80'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-cyan-400 text-xs">{rel.version}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        rel.status === 'SUCCESS'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      {rel.status}
                    </span>
                    {rel.incidentLevel && rel.incidentLevel !== 'NONE' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900 text-white font-bold animate-pulse">
                        ⚠️ {rel.incidentLevel} INCIDENT
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    Lead Time: {rel.leadTimeHours}h • Risk: {rel.changeRiskScore}/100
                  </span>
                </div>

                {/* Incident PIR Details if Failed */}
                {rel.incidentLevel && rel.incidentLevel !== 'NONE' && (
                  <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-800/60 text-xs text-red-200 space-y-1">
                    <p className="font-bold text-red-300">
                      Post-Incident Review (PIR) Summary • Resolved in {rel.timeToRestoreMinutes} mins
                    </p>
                    <p className="text-[11px] text-red-300/80">
                      Root cause: Distributed Redis cluster hash slot migration caused temporary connection pool exhaustion on WBS-1.2.1.
                      Remediation action rolled into Sprint Retrospective agenda.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <span>Deployed: {new Date(rel.deployedAt).toLocaleString()}</span>
                  <span>Approved By: <strong className="text-slate-300">{rel.approvedBy || 'System Gate'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
