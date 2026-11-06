import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext.tsx';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Receipt,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Users,
  Plus,
  Bot,
  ArrowRight,
} from 'lucide-react';

export const FinancialsModule: React.FC = () => {
  const {
    state,
    currentUser,
    currentUserRole,
    logTimesheet,
    approveTimesheet,
    submitExpense,
    approveExpense,
    downloadExcel,
    sendAgentMessage,
    setIsChatOpen,
  } = useProject();

  const [activeTab, setActiveTab] = useState<'evm' | 'capacity' | 'timesheet' | 'expenses'>('evm');

  // Timesheet Form State
  const [tsWbsId, setTsWbsId] = useState(state?.wbs[2]?.id || '');
  const [tsCategory, setTsCategory] = useState<'DEVELOPMENT' | 'REVIEW' | 'OPS' | 'GOVERNANCE'>('DEVELOPMENT');
  const [tsHours, setTsHours] = useState('8');
  const [tsNotes, setTsNotes] = useState('');

  // Expense Form State
  const [expCategory, setExpCategory] = useState<'CLOUD_INFRA' | 'SAAS_LICENSING' | 'HARDWARE' | 'CONSULTING' | 'TRAVEL'>('CLOUD_INFRA');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('1500');
  const [expBillable, setExpBillable] = useState(true);

  const evm = state?.evm || {
    pv: 420000,
    ev: 385000,
    ac: 410000,
    bac: 750000,
    sv: -35000,
    cv: -25000,
    spi: 0.916,
    cpi: 0.939,
    eac: 798722,
    vac: -48722,
    tcpi: 1.073,
    burnRateWeekly: 34500,
    projectedOverrun: 48722,
    statusHealth: 'AT_RISK',
  };

  const handleAddTimesheet = async (e: React.FormEvent) => {
    e.preventDefault();
    await logTimesheet({
      memberId: currentUser.id,
      wbsId: tsWbsId,
      category: tsCategory,
      hours: parseFloat(tsHours),
      notes: tsNotes,
    });
    setTsNotes('');
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitExpense({
      memberId: currentUser.id,
      category: expCategory,
      description: expDesc,
      amount: parseFloat(expAmount),
      billable: expBillable,
      receiptName: 'cloud-invoice-receipt.pdf',
    });
    setExpDesc('');
  };

  // Team Capacity metrics calculation
  const users = state?.users || [];
  const timesheets = state?.timesheets || [];
  const wbsItems = state?.wbs || [];

  const teamCapacityData = users.map((u) => {
    const userHours = timesheets
      .filter((t) => t.memberId === u.id)
      .reduce((acc, curr) => acc + curr.hours, 0);
    const assignedPoints = wbsItems
      .filter((w) => w.assigneeId === u.id && w.stage !== 'DONE')
      .reduce((acc, curr) => acc + (curr.storyPoints || 0), 0);
    const isOverloaded = userHours > 40 || assignedPoints >= 20;

    return {
      user: u,
      loggedHours: userHours,
      assignedPoints,
      isOverloaded,
      loadPercentage: Math.round((userHours / 40) * 100),
    };
  });

  return (
    <div className="space-y-4">
      {/* Module Navigation & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-950 border border-amber-800 text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center">
              Predictive EVM Controls, Capacity & Financial Ledger
            </h2>
            <p className="text-xs text-slate-400">
              PMBOK 7 EVM indices, capacity heatmaps, itemized timesheets, and formula-sanitized Excel telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sub-tab navigation */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('evm')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'evm' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              EVM Dashboard
            </button>
            <button
              onClick={() => setActiveTab('capacity')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'capacity' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Capacity Matrix
            </button>
            <button
              onClick={() => setActiveTab('timesheet')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'timesheet' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Timesheet Logger
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'expenses' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Expense Ledger
            </button>
          </div>

          <button
            onClick={downloadExcel}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow"
            title="Download multi-tab Excel telemetry (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download .xlsx</span>
          </button>
        </div>
      </div>

      {/* EVM Dashboard Sub-Tab */}
      {activeTab === 'evm' && (
        <div className="space-y-4">
          {/* High-level Status Alert Banner */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-amber-300">
                  EVM Telemetry Alert: Cost Inefficiency (CPI: {evm.cpi}) & Schedule Lag (SPI: {evm.spi})
                </p>
                <p className="text-amber-200/80 text-[11px]">
                  Actual cost ($410,000) exceeds earned value ($385,000) by $25,000. Forecasted total budget at completion (EAC) is{' '}
                  <span className="font-bold text-white">${evm.eac.toLocaleString()}</span> (+$48,722 over original $750k baseline).
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sendAgentMessage('Run EVM diagnostic and calculate required TCPI velocity to meet budget.', 'evm_financial');
                setIsChatOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow"
            >
              Ask Financial Agent →
            </button>
          </div>

          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {/* BAC */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-400">Budget at Completion (BAC)</div>
              <div className="text-lg font-bold font-mono text-white">${evm.bac.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">Authorized Program Baseline</div>
            </div>

            {/* Planned Value */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-400">Planned Value (PV)</div>
              <div className="text-lg font-bold font-mono text-cyan-400">${evm.pv.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">Scheduled baseline to date</div>
            </div>

            {/* Earned Value */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-400">Earned Value (EV)</div>
              <div className="text-lg font-bold font-mono text-emerald-400">${evm.ev.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">Completed work authorized $</div>
            </div>

            {/* Actual Cost */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-400">Actual Cost (AC)</div>
              <div className="text-lg font-bold font-mono text-red-400">${evm.ac.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">Realized direct program cost</div>
            </div>

            {/* CPI */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-400">Cost Index (CPI = EV/AC)</div>
              <div className="text-lg font-bold font-mono text-amber-400">{evm.cpi}</div>
              <div className="text-[10px] text-red-400 font-semibold">Cost Overrun (&lt;1.0)</div>
            </div>

            {/* SPI */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-400">Schedule Index (SPI = EV/PV)</div>
              <div className="text-lg font-bold font-mono text-amber-400">{evm.spi}</div>
              <div className="text-[10px] text-amber-400 font-semibold">Behind Schedule (&lt;1.0)</div>
            </div>
          </div>

          {/* Secondary Forecasting Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* EAC Forecast */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Estimate at Completion (EAC)
                </span>
                <span className="text-[10px] font-mono text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                  +$48.7k OVERRUN
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                ${evm.eac.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Formula: <code className="text-cyan-300 font-mono">BAC / CPI</code>. Assumes current cost burn rate and efficiency continues until completion.
              </p>
            </div>

            {/* Variances */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Variances (CV & SV)
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400">Cost Variance (CV):</span>
                  <div className="text-base font-bold text-red-400">-${Math.abs(evm.cv).toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Schedule Var (SV):</span>
                  <div className="text-base font-bold text-amber-400">-${Math.abs(evm.sv).toLocaleString()}</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Negative variances indicate unfavorable financial burn and milestone slippage.
              </p>
            </div>

            {/* TCPI */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                To-Complete Performance (TCPI)
              </span>
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {evm.tcpi}
              </div>
              <p className="text-[11px] text-slate-400">
                Team efficiency must increase to 1.073 CPI for all remaining work to hit original $750,000 target budget without contingency injection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Capacity & Workload Heatmap Sub-Tab */}
      {activeTab === 'capacity' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Weekly Team Capacity & Story Point Allocation
                </h3>
                <p className="text-[11px] text-slate-400">
                  Standard baseline: 40 hours/week. Overloads trigger automated agentic rebalance proposals.
                </p>
              </div>

              <button
                onClick={() => {
                  sendAgentMessage('Propose capacity rebalancing for overloaded Devon Lee.', 'evm_financial');
                  setIsChatOpen(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Trigger Agent Rebalance</span>
              </button>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {teamCapacityData.map((item) => (
                <div
                  key={item.user.id}
                  className={`bg-slate-950 border rounded-xl p-3.5 space-y-3 ${
                    item.isOverloaded
                      ? 'border-red-600/80 ring-1 ring-red-600/40 bg-red-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.user.name}</h4>
                        <p className="text-[10px] text-slate-400">{item.user.title}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        item.isOverloaded
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {item.isOverloaded ? 'OVERLOAD (>40h)' : 'NORMAL LOAD'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Weekly Logged:</span>
                      <span className={item.isOverloaded ? 'text-red-400 font-bold' : 'text-slate-200'}>
                        {item.loggedHours}h / 40h ({item.loadPercentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.isOverloaded ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, item.loadPercentage)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800 text-slate-400">
                    <span>Active Points: <strong className="text-white">{item.assignedPoints} pts</strong></span>
                    <span>Rate: <strong className="text-cyan-400">${item.user.hourlyRate}/h</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timesheet Logger Sub-Tab */}
      {activeTab === 'timesheet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Timesheet Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Log Daily / Weekly Timesheet
            </h3>

            <form onSubmit={handleAddTimesheet} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target WBS Task:</label>
                <select
                  value={tsWbsId}
                  onChange={(e) => setTsWbsId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {state?.wbs.filter((w) => w.level === 'STORY' || w.level === 'TASK').map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code}: {w.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Category:</label>
                  <select
                    value={tsCategory}
                    onChange={(e: any) => setTsCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="DEVELOPMENT">Development</option>
                    <option value="REVIEW">Code Review</option>
                    <option value="OPS">Ops & SRE</option>
                    <option value="GOVERNANCE">Governance</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Hours Logged:</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="16"
                    value={tsHours}
                    onChange={(e) => setTsHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Audit Notes / Commit Ref:</label>
                <textarea
                  rows={2}
                  value={tsNotes}
                  onChange={(e) => setTsNotes(e.target.value)}
                  placeholder="e.g. Profiling PKCS#11 crypto padding under 15k TPS load..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow"
              >
                Log Entry (${Math.round(parseFloat(tsHours || '0') * currentUser.hourlyRate)} Cost)
              </button>
            </form>
          </div>

          {/* Timesheets List */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider">Itemized Timesheet Records</span>
              <span className="text-slate-400 font-mono text-[11px]">
                Total: {state?.timesheets.length} entries
              </span>
            </div>

            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">WBS Task</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Hours</th>
                    <th className="py-2.5 px-3">Cost</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {state?.timesheets.map((ts) => (
                    <tr key={ts.id} className="hover:bg-slate-800/60 transition">
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-400">{ts.date}</td>
                      <td className="py-2 px-3 font-semibold text-white">{ts.memberName}</td>
                      <td className="py-2 px-3 truncate max-w-[160px] text-cyan-300">
                        {ts.wbsCode}: {ts.wbsTitle}
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {ts.category}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-white">{ts.hours}h</td>
                      <td className="py-2 px-3 font-mono text-emerald-400">${ts.totalCost}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            ts.status === 'APPROVED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {ts.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        {ts.status === 'SUBMITTED' && (
                          <button
                            onClick={() => approveTimesheet(ts.id)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 text-[10px] font-mono border border-slate-700 transition"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expense Ledger Sub-Tab */}
      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Expense Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Log Procurement / Project Expense
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Expense Category:</label>
                <select
                  value={expCategory}
                  onChange={(e: any) => setExpCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="CLOUD_INFRA">Cloud Infrastructure (GCP / Bare Metal)</option>
                  <option value="SAAS_LICENSING">SaaS Licensing (SonarQube, Vault)</option>
                  <option value="CONSULTING">FIPS 140-3 Security Consulting</option>
                  <option value="HARDWARE">HSM Dedicated Hardware</option>
                  <option value="TRAVEL">Delivery Leadership Travel</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Description:</label>
                <input
                  type="text"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="e.g. Dedicated HSM bare-metal instance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Amount ($ USD):</label>
                  <input
                    type="number"
                    min="1"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expBillable}
                      onChange={(e) => setExpBillable(e.target.checked)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-950"
                    />
                    <span>Billable to Client</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow"
              >
                Submit Expense for Approval
              </button>
            </form>
          </div>

          {/* Expenses List */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider">Expense & Procurement Ledger</span>
              <span className="text-slate-400 font-mono text-[11px]">
                Total: {state?.expenses.length} invoices
              </span>
            </div>

            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Billable</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Approval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {state?.expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-800/60 transition">
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-400">{exp.date}</td>
                      <td className="py-2 px-3 font-mono text-cyan-300 text-[10px]">{exp.category}</td>
                      <td className="py-2 px-3 font-medium text-white truncate max-w-[180px]">
                        {exp.description}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-emerald-400">
                        ${exp.amount.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        {exp.billable ? 'YES' : 'NO'}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            exp.status === 'APPROVED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        {exp.status === 'PENDING' && (
                          <button
                            onClick={() => approveExpense(exp.id)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 text-[10px] font-mono border border-slate-700 transition"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
