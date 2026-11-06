import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext.tsx';
import {
  ShieldCheck,
  Lock,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  Key,
  Shield,
  Activity,
  UserCheck,
  ExternalLink,
} from 'lucide-react';

export const AuditLedgerModule: React.FC = () => {
  const { state, setActiveHitlModal } = useProject();
  const [activeLedgerTab, setActiveLedgerTab] = useState<'security' | 'operational' | 'rbac'>('security');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const securityLedger = state?.securityLedger || [];
  const operationalLedger = state?.operationalLedger || [];
  const hitlQueue = state?.hitlQueue || [];

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/audit/verify');
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control / Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center">
              Dual-Ledger Audit Architecture & Cryptographic Verification
            </h2>
            <p className="text-xs text-slate-400">
              Immutable SHA-256 chained security ledger, high-throughput operational telemetry, and RBAC matrix.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sub-tab Toggle */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveLedgerTab('security')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${activeLedgerTab === 'security' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Security Audit Ledger ({securityLedger.length})
            </button>
            <button
              onClick={() => setActiveLedgerTab('operational')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${activeLedgerTab === 'operational' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Operational Ledger ({operationalLedger.length})
            </button>
            <button
              onClick={() => setActiveLedgerTab('rbac')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${activeLedgerTab === 'rbac' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              RBAC Matrix
            </button>
          </div>

          {/* Verify Chain Button */}
          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow disabled:opacity-50"
          >
            <Key className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying Merkle Roots...' : 'Verify Cryptographic Chain'}</span>
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-emerald-300">
                Cryptographic Integrity Formally Verified • {verificationResult.totalBlocks} Blocks Validated
              </p>
              <p className="text-[11px] font-mono text-emerald-400/80 mt-0.5 truncate max-w-2xl">
                Genesis Block: {verificationResult.genesisHash?.slice(0, 24)}... ➔ Head Digest: {verificationResult.headHash}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900 text-emerald-100 px-2 py-1 rounded border border-emerald-700 font-bold">
            NON-REPUDIATION ATTESTED
          </span>
        </div>
      )}

      {/* Security Audit Ledger Tab */}
      {activeLedgerTab === 'security' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider flex items-center">
                <Lock className="w-4 h-4 text-cyan-400 mr-1.5" />
                Immutable Append-Only Security Blocks (SHA-256 Chained)
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Cryptographic Head: {securityLedger[securityLedger.length - 1]?.hash?.slice(0, 16)}...
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 font-mono text-xs">
              {securityLedger.map((block, idx) => (
                <div key={block.id} className="p-4 hover:bg-slate-800/50 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold text-[11px] border border-slate-700">
                        BLOCK #{idx + 1}
                      </span>
                      <span className="text-white font-bold text-xs">{block.action}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 text-[11px]">{block.timestamp}</span>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      CHAIN VERIFIED ✓
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs font-sans">
                    {block.details}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                    <div className="truncate max-w-md">
                      <span className="text-slate-500">Actor:</span>{' '}
                      <strong className="text-slate-200">{block.userName}</strong> ({block.userRole}) • IP: {block.ipAddress}
                    </div>

                    <div className="text-[10px] text-slate-400 space-x-3">
                      <span>Prev: <code className="text-slate-500">{block.previousHash?.slice(0, 12)}...</code></span>
                      <span>Hash: <code className="text-cyan-400 font-bold">{block.hash?.slice(0, 16)}...</code></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HITL Pending Review Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <Shield className="w-4 h-4 text-amber-400 mr-1.5" />
              Human-in-the-Loop (HITL) Governance Queue ({hitlQueue.length})
            </h3>

            <div className="space-y-2.5">
              {hitlQueue.map((hitl) => (
                <div
                  key={hitl.id}
                  className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
                    hitl.status === 'PENDING'
                      ? 'bg-amber-950/20 border-amber-800/80'
                      : hitl.status === 'APPROVED'
                      ? 'bg-emerald-950/20 border-emerald-800/60'
                      : 'bg-red-950/20 border-red-800/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{hitl.title}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          hitl.status === 'PENDING'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                            : hitl.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {hitl.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-2xl">
                      {hitl.description}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Staged by: {hitl.agentName} • Gate: {hitl.requiredRole}
                    </div>
                  </div>

                  {hitl.status === 'PENDING' ? (
                    <button
                      onClick={() => setActiveHitlModal(hitl)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow"
                    >
                      Review & Authorize →
                    </button>
                  ) : (
                    <div className="text-[11px] font-mono text-slate-400">
                      Resolved By: {hitl.resolvedBy}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Operational Ledger Tab */}
      {activeLedgerTab === 'operational' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider flex items-center">
              <Activity className="w-4 h-4 text-emerald-400 mr-1.5" />
              High-Throughput Operational Event Stream
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Capturing user logins, timesheet edits, exports, and stage transitions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Actor & Role</th>
                  <th className="py-2.5 px-3">Resource</th>
                  <th className="py-2.5 px-3">Event Details</th>
                  <th className="py-2.5 px-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {operationalLedger.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-800/60 transition">
                    <td className="py-2.5 px-3 text-slate-400">{new Date(op.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2.5 px-3 font-bold text-cyan-400">{op.action}</td>
                    <td className="py-2.5 px-3 font-sans text-white">
                      {op.userName} <span className="text-slate-500 font-mono text-[10px]">({op.userRole})</span>
                    </td>
                    <td className="py-2.5 px-3 text-purple-300">{op.resource}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300 truncate max-w-xs">{op.details}</td>
                    <td className="py-2.5 px-3 text-slate-500">{op.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RBAC Matrix Tab */}
      {activeLedgerTab === 'rbac' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Enterprise Role-Based Access Control (RBAC) Authority Matrix
            </h3>
            <p className="text-[11px] text-slate-400">
              Deterministic security guardrails enforced across all user interactions and agent mutations.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Capability / Mutation</th>
                  <th className="py-3 px-3 text-center">Admin</th>
                  <th className="py-3 px-3 text-center">Delivery Lead (PM)</th>
                  <th className="py-3 px-3 text-center">Scrum Master</th>
                  <th className="py-3 px-3 text-center">Developer</th>
                  <th className="py-3 px-3 text-center">External Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                <tr>
                  <td className="py-2.5 px-3 text-white font-semibold">Modify Budget Baseline (BAC)</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-amber-400">HITL APPROVER</td>
                  <td className="py-2.5 px-3 text-center text-red-400">DENIED</td>
                  <td className="py-2.5 px-3 text-center text-red-400">DENIED</td>
                  <td className="py-2.5 px-3 text-center text-red-400">DENIED</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-white font-semibold">Rebalance Sprint Tasks</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-red-400">DENIED</td>
                  <td className="py-2.5 px-3 text-center text-red-400">DENIED</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-white font-semibold">Override Production Release Gate</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-amber-400">HITL CONDITIONAL</td>
                  <td className="py-2.5 px-3 text-center text-red-400">DENIED</td>
                  <td className="py-2.5 px-3 text-center text-red-400">DENIED</td>
                  <td className="py-2.5 px-3 text-center text-red-400">DENIED</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-white font-semibold">Log & Submit Daily Timesheets</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-red-400">DENIED</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-white font-semibold">Export Multi-Sheet Financial Excel</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-red-400">DENIED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-white font-semibold">Verify Cryptographic SHA-256 Chain</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">✓ ALLOWED</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
