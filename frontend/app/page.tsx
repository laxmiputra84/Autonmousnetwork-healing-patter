'use client';

import React from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { NetworkHealthChart } from '@/components/dashboard/NetworkHealthChart';
import { RecoveryRateDonut } from '@/components/dashboard/RecoveryRateDonut';
import { DeviceHealthMatrix } from '@/components/dashboard/DeviceHealthMatrix';
import {
  Server,
  AlertTriangle,
  Zap,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Flame,
  Clock,
  Play,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    devices,
    alarms,
    healingActions,
    recoveryHistory,
    triggerAutonomousHeal,
  } = useNetwork();

  // Metrics computation
  const totalDevices = devices.length;
  const activeAlarms = alarms.filter(
    (a) => a.status === 'OPEN' || a.status === 'ANALYZING'
  ).length;
  const healingInProgress = healingActions.filter(
    (h) => h.status === 'IN_PROGRESS' || h.status === 'QUEUED'
  ).length;
  const totalRecovered = recoveryHistory.filter((r) => r.result === 'SUCCESS').length;
  const totalFailed = recoveryHistory.filter((r) => r.result === 'FAILED').length;

  const recentAlarms = alarms.slice(0, 5);
  const recentActions = healingActions.slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner with Live Operational Mode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-noc-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">
              NOC Command & Control Center
            </h1>
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-mono font-semibold text-cyan-400">
              AUTONOMOUS MODE
            </span>
          </div>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Real-time telemetry aggregation, AI anomaly correlation & zero-touch self-healing orchestrator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/simulator"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 px-4 py-2 text-xs font-mono font-bold text-white shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-amber-500 transition-all active:scale-95"
          >
            <Flame className="h-4 w-4" />
            <span>Launch Fault Simulator</span>
          </Link>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Devices"
          value={totalDevices}
          subtext="100% telemetry synced"
          icon={Server}
          iconColor="text-cyan-400"
          badge="FABRIC"
        />

        <MetricCard
          title="Active Alarms"
          value={activeAlarms}
          change={activeAlarms > 0 ? `+${activeAlarms} requiring action` : 'Clean telemetry'}
          trend={activeAlarms > 0 ? 'down' : 'up'}
          icon={AlertTriangle}
          iconColor={activeAlarms > 0 ? 'text-rose-400' : 'text-slate-400'}
        />

        <MetricCard
          title="Healing in Progress"
          value={healingInProgress}
          change={healingInProgress > 0 ? 'Remediating...' : 'Idle state'}
          trend={healingInProgress > 0 ? 'up' : 'neutral'}
          icon={Zap}
          iconColor="text-cyan-400"
          badge="ORCHESTRATOR"
        />

        <MetricCard
          title="Recovered (Self-Healed)"
          value={totalRecovered}
          change="+100% automated"
          trend="up"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
        />

        <MetricCard
          title="Failed Incidents"
          value={totalFailed}
          subtext="Zero fallback manual escalations"
          icon={XCircle}
          iconColor={totalFailed > 0 ? 'text-rose-400' : 'text-slate-500'}
        />
      </div>

      {/* Row 2: Network Health Chart & Recovery Success Rate Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NetworkHealthChart />
        </div>
        <div>
          <RecoveryRateDonut />
        </div>
      </div>

      {/* Row 3: Active Alarms Table & Recent Healing Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alarms Table (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between border-b border-noc-border/50 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                Live Active Alarms & Incident Triage
              </h3>
            </div>
            <Link
              href="/alarms"
              className="inline-flex items-center gap-1 font-mono text-xs text-cyan-400 hover:text-cyan-300"
            >
              All Alarms ({alarms.length}) <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-noc-border text-slate-400 uppercase">
                  <th className="pb-3 font-semibold">Alarm ID</th>
                  <th className="pb-3 font-semibold">Device / Service</th>
                  <th className="pb-3 font-semibold">Severity</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Autonomous Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-noc-border/40">
                {recentAlarms.map((alarm) => (
                  <tr
                    key={alarm.id}
                    className="hover:bg-noc-cardLighter/40 transition-colors duration-150"
                  >
                    <td className="py-3 font-bold text-cyan-400">
                      <Link href={`/alarms?id=${alarm.id}`} className="hover:underline">
                        {alarm.id}
                      </Link>
                    </td>
                    <td className="py-3">
                      <div className="text-white font-medium truncate max-w-[180px]">
                        {alarm.deviceName}
                      </div>
                      <div className="text-slate-400 text-[11px]">{alarm.service}</div>
                    </td>
                    <td className="py-3">
                      <SeverityBadge severity={alarm.severity} size="sm" />
                    </td>
                    <td className="py-3">
                      <StatusBadge status={alarm.status} size="sm" />
                    </td>
                    <td className="py-3 text-right">
                      {alarm.status === 'OPEN' ? (
                        <button
                          onClick={() => triggerAutonomousHeal(alarm.id)}
                          className="inline-flex items-center gap-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 text-[11px] font-bold transition-all active:scale-95"
                        >
                          <Play className="h-3 w-3 fill-cyan-300" />
                          <span>Heal Now</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Auto Orchestrated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Healing Actions Stream (1 col) */}
        <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-noc-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  Recent Healing Actions
                </h3>
              </div>
              <Link
                href="/healing"
                className="font-mono text-xs text-cyan-400 hover:text-cyan-300"
              >
                View Flow <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentActions.map((action) => (
                <div
                  key={action.id}
                  className="rounded-lg border border-noc-borderLighter/60 bg-noc-cardLighter/30 p-3"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-cyan-300">
                      {action.action}
                    </span>
                    <StatusBadge status={action.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-300 truncate font-mono">{action.deviceName}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{action.rootCause}</p>
                  
                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${action.progressPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-noc-border/50 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1 text-emerald-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Mean MTTR: 68s</span>
            </div>
            <span>Auto Closed: 100%</span>
          </div>
        </div>
      </div>

      {/* Row 4: Network Fabric Device Status Matrix */}
      <div>
        <DeviceHealthMatrix />
      </div>
    </div>
  );
}
