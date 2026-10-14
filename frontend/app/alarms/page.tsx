'use client';

import React, { useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { Alarm, AlarmSeverity, AlarmStatus } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { AlarmDetailModal } from '@/components/alarms/AlarmDetailModal';
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Zap,
  CheckCircle2,
  Clock,
  Play,
} from 'lucide-react';

export default function AlarmsPage() {
  const { alarms, triggerAutonomousHeal } = useNetwork();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAlarms = alarms.filter((alarm) => {
    const matchesSearch =
      alarm.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alarm.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alarm.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alarm.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || alarm.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || alarm.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleOpenDetails = (alarm: Alarm) => {
    setSelectedAlarm(alarm);
    setIsModalOpen(true);
  };

  const severityCounts = {
    CRITICAL: alarms.filter((a) => a.severity === 'CRITICAL' && a.status === 'OPEN').length,
    HIGH: alarms.filter((a) => a.severity === 'HIGH' && a.status === 'OPEN').length,
    MEDIUM: alarms.filter((a) => a.severity === 'MEDIUM' && a.status === 'OPEN').length,
    LOW: alarms.filter((a) => a.severity === 'LOW' && a.status === 'OPEN').length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-noc-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">
              Alarm Management & Active Incidents
            </h1>
          </div>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Real-time telemetry threshold triggers, event aggregation & autonomous triage.
          </p>
        </div>

        {/* Severity Count Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-rose-300">
            CRITICAL OPEN: <span className="font-bold">{severityCounts.CRITICAL}</span>
          </div>
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-orange-300">
            HIGH OPEN: <span className="font-bold">{severityCounts.HIGH}</span>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-300">
            MEDIUM: <span className="font-bold">{severityCounts.MEDIUM}</span>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-300">
            LOW: <span className="font-bold">{severityCounts.LOW}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="rounded-xl border border-noc-border bg-noc-card/90 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search alarm ID, device, service, error..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-noc-borderLighter bg-noc-bg/80 pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-noc-borderLighter bg-noc-bg/80 px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="ANALYZING">Analyzing</option>
                <option value="HEALING">Healing</option>
                <option value="RECOVERED">Recovered</option>
                <option value="FAILED">Failed</option>
                <option value="ESCALATED">Escalated</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="rounded-lg border border-noc-borderLighter bg-noc-bg/80 px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Alarms Table */}
      <div className="overflow-hidden rounded-xl border border-noc-border bg-noc-card/90 shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-noc-border text-slate-400 bg-noc-cardLighter/40 uppercase">
                <th className="p-4 font-semibold">Alarm ID</th>
                <th className="p-4 font-semibold">Device</th>
                <th className="p-4 font-semibold">Service</th>
                <th className="p-4 font-semibold">Severity</th>
                <th className="p-4 font-semibold">Message</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Created At</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noc-border/40">
              {filteredAlarms.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No alarms matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlarms.map((alarm) => (
                  <tr
                    key={alarm.id}
                    className="hover:bg-noc-cardLighter/40 transition-colors duration-150"
                  >
                    <td className="p-4 font-bold text-cyan-400">{alarm.id}</td>
                    <td className="p-4 font-medium text-white">{alarm.deviceName}</td>
                    <td className="p-4 text-slate-300">
                      <span className="rounded bg-slate-800 px-2 py-0.5 border border-slate-700">
                        {alarm.service}
                      </span>
                    </td>
                    <td className="p-4">
                      <SeverityBadge severity={alarm.severity} size="sm" />
                    </td>
                    <td className="p-4">
                      <p className="truncate max-w-[280px] text-slate-300" title={alarm.message}>
                        {alarm.message}
                      </p>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={alarm.status} size="sm" />
                    </td>
                    <td className="p-4 text-slate-400">{alarm.createdAt.replace('T', ' ').substring(0, 19)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {alarm.status === 'OPEN' && (
                          <button
                            onClick={() => triggerAutonomousHeal(alarm.id)}
                            className="inline-flex items-center gap-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 text-xs font-bold transition-all active:scale-95"
                          >
                            <Play className="h-3 w-3 fill-cyan-300" />
                            <span>Heal</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenDetails(alarm)}
                          className="inline-flex items-center gap-1 rounded border border-noc-borderLighter bg-noc-cardLighter px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-white transition-all active:scale-95"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alarm Detail Modal */}
      <AlarmDetailModal
        alarm={selectedAlarm}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
