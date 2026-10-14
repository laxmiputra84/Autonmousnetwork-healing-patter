'use client';

import React, { useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { HealingAction, HealingActionType } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Zap,
  Terminal,
  Clock,
  CheckCircle2,
  Server,
  Play,
  RotateCcw,
  Search,
  Filter,
} from 'lucide-react';

export default function HealingActionsPage() {
  const { healingActions } = useNetwork();
  const [selectedActionId, setSelectedActionId] = useState<string | null>(
    healingActions.length > 0 ? healingActions[0].id : null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredActions = healingActions.filter((action) => {
    const matchesSearch =
      action.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.rootCause.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || action.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeSelectedAction = healingActions.find((a) => a.id === selectedActionId) || healingActions[0];

  const inProgressCount = healingActions.filter((a) => a.status === 'IN_PROGRESS' || a.status === 'QUEUED').length;
  const successCount = healingActions.filter((a) => a.status === 'SUCCESS').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-noc-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Zap className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">
              Autonomous Healing Orchestrator
            </h1>
          </div>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Real-time playbook execution engine: RESTART_SERVICE, RESTORE_CONFIGURATION, REROUTE_TRAFFIC, DEVICE_RECOVERY.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-300">
            IN PROGRESS: <span className="font-bold">{inProgressCount}</span>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
            SUCCESSFUL: <span className="font-bold">{successCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="rounded-xl border border-noc-border bg-noc-card/90 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search action ID, device, playbook, root cause..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-noc-borderLighter bg-noc-bg/80 pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-400">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-noc-borderLighter bg-noc-bg/80 px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUCCESS">Success</option>
              <option value="QUEUED">Queued</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table & Execution Console Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table (2 cols) */}
        <div className="lg:col-span-2 overflow-hidden rounded-xl border border-noc-border bg-noc-card/90 shadow-xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-noc-border text-slate-400 bg-noc-cardLighter/40 uppercase">
                  <th className="p-4 font-semibold">Action ID</th>
                  <th className="p-4 font-semibold">Alarm ID</th>
                  <th className="p-4 font-semibold">Device</th>
                  <th className="p-4 font-semibold">Healing Action</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Started / Completed</th>
                  <th className="p-4 font-semibold text-right">Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-noc-border/40">
                {filteredActions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No healing actions recorded.
                    </td>
                  </tr>
                ) : (
                  filteredActions.map((action) => {
                    const isSelected = activeSelectedAction && activeSelectedAction.id === action.id;

                    return (
                      <tr
                        key={action.id}
                        onClick={() => setSelectedActionId(action.id)}
                        className={`cursor-pointer transition-colors duration-150 ${
                          isSelected
                            ? 'bg-cyan-500/10 border-l-2 border-cyan-400'
                            : 'hover:bg-noc-cardLighter/40'
                        }`}
                      >
                        <td className="p-4 font-bold text-cyan-400">{action.id}</td>
                        <td className="p-4 text-slate-400">{action.alarmId}</td>
                        <td className="p-4 font-medium text-white">{action.deviceName}</td>
                        <td className="p-4">
                          <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-xs font-bold text-cyan-300">
                            {action.action}
                          </span>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={action.status} size="sm" />
                        </td>
                        <td className="p-4 text-slate-400">
                          <div>{action.startedAt.replace('T', ' ').substring(0, 19)}</div>
                          {action.completedAt && (
                            <div className="text-emerald-400 text-[10px]">
                              Done: {action.completedAt.replace('T', ' ').substring(11, 19)}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedActionId(action.id)}
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs"
                          >
                            <Terminal className="h-3.5 w-3.5" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Playbook Execution Log Console (1 col) */}
        <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-noc-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  Remediation Console
                </h3>
              </div>
              {activeSelectedAction && (
                <StatusBadge status={activeSelectedAction.status} size="sm" />
              )}
            </div>

            {activeSelectedAction ? (
              <div className="space-y-4">
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-white font-bold">{activeSelectedAction.action}</div>
                  <div className="text-slate-400 text-[11px] truncate">
                    Target: {activeSelectedAction.deviceName}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Root Cause: {activeSelectedAction.rootCause}
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Playbook Progress</span>
                    <span className="text-cyan-400 font-bold">{activeSelectedAction.progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${activeSelectedAction.progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Console Log Stream */}
                <div className="rounded-lg bg-black/70 p-3 font-mono text-[11px] text-slate-300 border border-noc-borderLighter/40 h-64 overflow-y-auto custom-scrollbar space-y-2">
                  <div className="text-emerald-400 font-semibold border-b border-slate-800 pb-1">
                    --- AUTONOMOUS PLAYBOOK ORCHESTRATION LOGS ---
                  </div>
                  {activeSelectedAction.logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-slate-500 text-[10px] shrink-0">[{log.timestamp}]</span>
                      <span
                        className={
                          log.level === 'SUCCESS'
                            ? 'text-emerald-400 font-semibold'
                            : log.level === 'ACTION'
                            ? 'text-cyan-400'
                            : log.level === 'WARN'
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }
                      >
                        {log.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 font-mono text-xs">
                Select an action to view playbook logs.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-noc-border/50 text-slate-400 text-[11px] font-mono flex items-center justify-between">
            <span>Execution Mode: Zero-Touch</span>
            <span className="text-cyan-400 font-semibold">Verification: Passing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
