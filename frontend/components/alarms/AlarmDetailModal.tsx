'use client';

import React from 'react';
import { Alarm } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import {
  AlertTriangle,
  Server,
  Zap,
  GitPullRequest,
  Clock,
  Activity,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useNetwork } from '@/context/NetworkContext';
import Link from 'next/link';

interface AlarmDetailModalProps {
  alarm: Alarm | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AlarmDetailModal: React.FC<AlarmDetailModalProps> = ({
  alarm,
  isOpen,
  onClose,
}) => {
  const { triggerAutonomousHeal, dismissAlarm } = useNetwork();

  if (!alarm) return null;

  const handleHeal = () => {
    triggerAutonomousHeal(alarm.id);
    onClose();
  };

  const handleDismiss = () => {
    dismissAlarm(alarm.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Alarm Incident: ${alarm.id}`}
      subtitle={`Triggered on ${alarm.deviceName} [${alarm.service}]`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Status & Severity Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-noc-borderLighter/60 bg-noc-cardLighter/40 p-4">
          <div className="flex items-center gap-3">
            <SeverityBadge severity={alarm.severity} size="md" />
            <StatusBadge status={alarm.status} size="md" />
          </div>

          <div className="flex items-center gap-2">
            {alarm.status === 'OPEN' && (
              <button
                onClick={handleHeal}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-3.5 py-1.5 text-xs font-mono font-bold text-white shadow-lg shadow-cyan-600/20 hover:from-cyan-500 hover:to-blue-500 transition-all active:scale-95"
              >
                <Zap className="h-4 w-4" />
                <span>Trigger Autonomous Heal</span>
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-mono text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>

        {/* Message description */}
        <div className="rounded-lg border border-noc-border bg-noc-card/80 p-4">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase mb-1">
            Telemetry Trigger Message
          </h4>
          <p className="text-sm font-mono text-rose-300 font-semibold">{alarm.message}</p>
        </div>

        {/* Root Cause & Recommended Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-noc-border p-4 bg-noc-card/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-2">
              <GitPullRequest className="h-4 w-4 text-purple-400" />
              <span className="font-bold text-white uppercase">Identified Root Cause</span>
            </div>
            <p className="text-xs font-mono text-slate-300">
              {alarm.rootCause || 'AI Correlation engine matching anomalous patterns...'}
            </p>
          </div>

          <div className="rounded-lg border border-noc-border p-4 bg-noc-card/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-white uppercase">Autonomous Action</span>
            </div>
            <span className="inline-block rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 text-xs font-mono font-bold text-cyan-300">
              {alarm.recommendedAction || 'RESTART_SERVICE'}
            </span>
          </div>
        </div>

        {/* Snapshot metrics */}
        {alarm.metricsSnapshot && (
          <div className="rounded-lg border border-noc-border p-4 bg-noc-card/60">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase mb-3">
              Telemetry Snapshot at Incident Time
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-noc-cardLighter/40 border border-noc-border">
                <span className="text-slate-400">Latency:</span>
                <p className="text-white font-bold mt-0.5">{alarm.metricsSnapshot.latencyMs} ms</p>
              </div>
              <div className="p-2.5 rounded bg-noc-cardLighter/40 border border-noc-border">
                <span className="text-slate-400">Packet Loss:</span>
                <p className="text-white font-bold mt-0.5">{alarm.metricsSnapshot.packetLossPct}%</p>
              </div>
              <div className="p-2.5 rounded bg-noc-cardLighter/40 border border-noc-border">
                <span className="text-slate-400">CPU Load:</span>
                <p className="text-white font-bold mt-0.5">{alarm.metricsSnapshot.cpuPct}%</p>
              </div>
              <div className="p-2.5 rounded bg-noc-cardLighter/40 border border-noc-border">
                <span className="text-slate-400">Memory Load:</span>
                <p className="text-white font-bold mt-0.5">{alarm.metricsSnapshot.memoryPct}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Link to RCA Deep Dive */}
        <div className="flex items-center justify-between border-t border-noc-border pt-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Detected: {alarm.createdAt}</span>
          </div>
          <Link
            href={`/rca?alarmId=${alarm.id}`}
            onClick={onClose}
            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Open Full Root Cause Analysis Flow →
          </Link>
        </div>
      </div>
    </Modal>
  );
};
