'use client';

import React, { useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { RecoveryRecord } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  History,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function RecoveryHistoryPage() {
  const { recoveryHistory, addToast } = useNetwork();
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('ALL');

  const filteredHistory = recoveryHistory.filter((rec) => {
    const matchesSearch =
      rec.incidentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.rootCause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.healingAction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.verificationMessage.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesResult = resultFilter === 'ALL' || rec.result === resultFilter;

    return matchesSearch && matchesResult;
  });

  const avgMttr =
    recoveryHistory.length > 0
      ? Math.round(
          recoveryHistory.reduce((acc, r) => acc + r.mttrSeconds, 0) / recoveryHistory.length
        )
      : 0;

  const totalSuccess = recoveryHistory.filter((r) => r.result === 'SUCCESS').length;

  const handleExportCSV = () => {
    const headers = [
      'Incident ID',
      'Device',
      'Fault Type',
      'Root Cause',
      'Healing Action',
      'Result',
      'Verification Message',
      'MTTR (Seconds)',
      'Date',
    ];
    const rows = filteredHistory.map((r) => [
      r.incidentId,
      `"${r.deviceName}"`,
      r.faultType,
      `"${r.rootCause.replace(/"/g, '""')}"`,
      r.healingAction,
      r.result,
      `"${r.verificationMessage.replace(/"/g, '""')}"`,
      r.mttrSeconds,
      r.date,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `anhp_recovery_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'CSV Export Generated',
      message: 'Recovery audit logs downloaded successfully.',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-noc-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <History className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">
              Autonomous Recovery History & Audit Trail
            </h1>
          </div>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Immutable post-incident verification logs, MTTR telemetry and self-healing performance index.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-lg border border-noc-borderLighter bg-noc-card px-4 py-2 text-xs font-mono font-medium text-slate-200 hover:border-cyan-500/50 hover:text-white transition-all active:scale-95 shadow-lg"
        >
          <Download className="h-4 w-4 text-cyan-400" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* KPI Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-noc-border bg-noc-card/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>Average MTTR (Recovery)</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">{avgMttr} seconds</div>
          <p className="text-[11px] font-mono text-emerald-400 mt-1">92% faster than manual NOC triage</p>
        </div>

        <div className="rounded-xl border border-noc-border bg-noc-card/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Autonomous Closed Rate</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {recoveryHistory.length > 0
              ? `${((totalSuccess / recoveryHistory.length) * 100).toFixed(1)}%`
              : '100%'}
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-1">{totalSuccess} verified self-healed incidents</p>
        </div>

        <div className="rounded-xl border border-noc-border bg-noc-card/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <span>Synthetic Probe Pass Rate</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">100.0%</div>
          <p className="text-[11px] font-mono text-purple-300 mt-1">Post-remediation verified nominal</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="rounded-xl border border-noc-border bg-noc-card/90 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search incident ID, device, healing action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-noc-borderLighter bg-noc-bg/80 pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-400">Result:</span>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="rounded-lg border border-noc-borderLighter bg-noc-bg/80 px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Results</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-hidden rounded-xl border border-noc-border bg-noc-card/90 shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-noc-border text-slate-400 bg-noc-cardLighter/40 uppercase">
                <th className="p-4 font-semibold">Incident ID</th>
                <th className="p-4 font-semibold">Device</th>
                <th className="p-4 font-semibold">Root Cause</th>
                <th className="p-4 font-semibold">Healing Action</th>
                <th className="p-4 font-semibold">Result</th>
                <th className="p-4 font-semibold">Verification Message</th>
                <th className="p-4 font-semibold">MTTR</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noc-border/40">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No recovery records found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-noc-cardLighter/40 transition-colors duration-150"
                  >
                    <td className="p-4 font-bold text-cyan-400">{rec.incidentId}</td>
                    <td className="p-4 font-medium text-white">{rec.deviceName}</td>
                    <td className="p-4 text-slate-300 max-w-[200px] truncate" title={rec.rootCause}>
                      {rec.rootCause}
                    </td>
                    <td className="p-4">
                      <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-xs font-bold text-cyan-300">
                        {rec.healingAction}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={rec.result} size="sm" />
                    </td>
                    <td className="p-4 text-slate-300 max-w-[260px] truncate" title={rec.verificationMessage}>
                      {rec.verificationMessage}
                    </td>
                    <td className="p-4 font-bold text-emerald-400">{rec.mttrSeconds}s</td>
                    <td className="p-4 text-slate-400">{rec.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
