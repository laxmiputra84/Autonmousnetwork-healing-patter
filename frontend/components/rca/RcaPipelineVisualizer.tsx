'use client';

import React from 'react';
import { RCACase } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import {
  AlertTriangle,
  Activity,
  CheckCircle2,
  GitPullRequest,
  Zap,
  ArrowDown,
  ShieldCheck,
  Cpu,
  Layers,
  FileText,
  Play,
} from 'lucide-react';
import { useNetwork } from '@/context/NetworkContext';

interface RcaPipelineVisualizerProps {
  rcaCase: RCACase;
}

export const RcaPipelineVisualizer: React.FC<RcaPipelineVisualizerProps> = ({ rcaCase }) => {
  const { triggerAutonomousHeal } = useNetwork();

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-noc-border bg-noc-card/90 p-5 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-bold text-cyan-400">{rcaCase.id}</span>
            <SeverityBadge severity={rcaCase.severity} size="sm" />
            <StatusBadge status={rcaCase.status} size="sm" />
          </div>
          <h2 className="mt-2 text-lg font-bold text-white font-mono">
            {rcaCase.deviceName} — {rcaCase.service}
          </h2>
        </div>

        <div>
          {rcaCase.status !== 'RESOLVED' && (
            <button
              onClick={() => triggerAutonomousHeal(rcaCase.alarmId)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-mono font-bold text-white shadow-lg shadow-cyan-600/25 hover:from-cyan-500 hover:to-blue-500 transition-all active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Execute {rcaCase.recommendedAction.actionType}</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Step Pipeline Flow */}
      <div className="space-y-4">
        {/* Step 1: Alarm */}
        <div className="relative rounded-xl border border-rose-500/30 bg-noc-card/90 p-5 shadow-lg backdrop-blur-xl group hover:border-rose-500/60 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                  STAGE 1 • ALARM TRIGGER
                </span>
                <h3 className="text-sm font-bold font-mono text-white mt-0.5">
                  {rcaCase.alarmTrigger.code}
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {rcaCase.alarmTrigger.detectedAt.replace('T', ' ').substring(0, 19)}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-3 border-t border-noc-border/50">
            <div>
              <span className="text-slate-400">Breached Rule:</span>
              <p className="text-rose-300 font-semibold">{rcaCase.alarmTrigger.metricThreshold}</p>
            </div>
            <div>
              <span className="text-slate-400">Actual Telemetry Drift:</span>
              <p className="text-slate-200">{rcaCase.alarmTrigger.actualMetric}</p>
            </div>
          </div>
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center -my-2">
          <div className="rounded-full bg-noc-border p-1 text-cyan-400 shadow-md">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* Step 2: Event Analysis */}
        <div className="relative rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-lg backdrop-blur-xl group hover:border-cyan-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-500/20 p-2 text-cyan-400 border border-cyan-500/30">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  STAGE 2 • CORRELATION & EVENT ANALYSIS
                </span>
                <h3 className="text-sm font-bold font-mono text-white mt-0.5">
                  Multi-Dimensional Log & Anomaly Cross-Correlation
                </h3>
              </div>
            </div>
            <div className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-xs font-mono font-bold text-cyan-300">
              Confidence {(rcaCase.eventAnalysis.confidenceScore * 100).toFixed(0)}%
            </div>
          </div>

          <div className="mt-3 space-y-2 pt-3 border-t border-noc-border/50 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span>Correlated Ingestion Events:</span>
              <span className="font-bold text-white">{rcaCase.eventAnalysis.correlatedEventsCount} concurrent telemetry anomalies</span>
            </div>
            <div className="rounded bg-noc-cardLighter/40 p-2.5 border border-noc-border text-slate-300 space-y-1">
              {rcaCase.eventAnalysis.logsSummary.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center -my-2">
          <div className="rounded-full bg-noc-border p-1 text-cyan-400 shadow-md">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* Step 3: Health Check */}
        <div className="relative rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-lg backdrop-blur-xl group hover:border-cyan-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400 border border-purple-500/30">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
                  STAGE 3 • HEALTH CHECK & SYNTHETIC DIAGNOSTICS
                </span>
                <h3 className="text-sm font-bold font-mono text-white mt-0.5">
                  Sub-System Deep Probing
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-noc-border/50">
            {rcaCase.healthCheckDiagnostics.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between rounded-lg bg-noc-cardLighter/40 p-3 border border-noc-border text-xs font-mono"
              >
                <div>
                  <div className="font-semibold text-white">{step.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{step.details}</div>
                </div>
                <StatusBadge status={step.status} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center -my-2">
          <div className="rounded-full bg-noc-border p-1 text-cyan-400 shadow-md">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* Step 4: Root Cause */}
        <div className="relative rounded-xl border border-amber-500/40 bg-noc-card/90 p-5 shadow-lg backdrop-blur-xl group hover:border-amber-500/60 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400 border border-amber-500/30">
                <GitPullRequest className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  STAGE 4 • IDENTIFIED ROOT CAUSE
                </span>
                <h3 className="text-sm font-bold font-mono text-white mt-0.5">
                  {rcaCase.rootCause.category}
                </h3>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-amber-300 font-bold">
                {rcaCase.rootCause.confidencePct}% Certainty
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-noc-border/50 text-xs font-mono">
            <p className="text-slate-200 text-sm font-medium">{rcaCase.rootCause.description}</p>
            <div className="mt-2 text-slate-400 text-[11px]">
              Blast Radius: <span className="text-amber-300 font-semibold">{rcaCase.rootCause.blastRadius}</span>
            </div>
          </div>
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center -my-2">
          <div className="rounded-full bg-noc-border p-1 text-cyan-400 shadow-md">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* Step 5: Recommended Action */}
        <div className="relative rounded-xl border border-emerald-500/40 bg-noc-card/90 p-5 shadow-lg backdrop-blur-xl group hover:border-emerald-500/60 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400 border border-emerald-500/30">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  STAGE 5 • RECOMMENDED AUTONOMOUS ACTION
                </span>
                <h3 className="text-sm font-bold font-mono text-emerald-300 mt-0.5">
                  {rcaCase.recommendedAction.actionType}
                </h3>
              </div>
            </div>
            <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs font-mono text-emerald-300 font-bold">
              EST. RECOVERY: {rcaCase.recommendedAction.estimatedRecoveryTimeSec}s
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-noc-border/50 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Automated Playbook: <strong className="text-white">{rcaCase.recommendedAction.playbookId}</strong></span>
              <span>Risk Profile: <strong className="text-emerald-400">{rcaCase.recommendedAction.riskScore} RISK</strong></span>
            </div>

            <div className="rounded bg-noc-cardLighter/40 p-3 border border-noc-border space-y-1.5">
              <div className="text-slate-400 font-semibold mb-1">Execution Playbook Steps:</div>
              {rcaCase.recommendedAction.executionSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
