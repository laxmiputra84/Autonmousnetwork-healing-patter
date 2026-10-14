'use client';

import React, { useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { RcaPipelineVisualizer } from '@/components/rca/RcaPipelineVisualizer';
import {
  GitPullRequest,
  Search,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';

export default function RcaPage() {
  const { rcaCases } = useNetwork();
  const [selectedRcaId, setSelectedRcaId] = useState<string>(
    rcaCases.length > 0 ? rcaCases[0].id : ''
  );

  const activeRcaCase = rcaCases.find((r) => r.id === selectedRcaId) || rcaCases[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-noc-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <GitPullRequest className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">
              Root Cause Analysis (RCA) Engine
            </h1>
          </div>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Autonomous heuristic diagnostic graph: Alarm Ingestion $\rightarrow$ Event Analysis $\rightarrow$ Health Check $\rightarrow$ Root Cause $\rightarrow$ Action
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Total Analyzed Cases:</span>
          <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-cyan-300 font-bold">
            {rcaCases.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: RCA Case Selector List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Diagnostic Incidents
          </h3>

          <div className="space-y-2">
            {rcaCases.map((c) => {
              const isSelected = activeRcaCase && activeRcaCase.id === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedRcaId(c.id)}
                  className={`w-full text-left rounded-xl p-3.5 border transition-all duration-200 ${
                    isSelected
                      ? 'border-cyan-500/80 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'border-noc-border bg-noc-card/70 hover:border-slate-600 hover:bg-noc-cardLighter/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-white">{c.id}</span>
                    <SeverityBadge severity={c.severity} size="sm" showIcon={false} />
                  </div>
                  <p className="font-mono text-xs text-cyan-300 font-semibold truncate">{c.deviceName}</p>
                  <p className="font-mono text-[11px] text-slate-400 truncate mt-0.5">{c.service}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono pt-2 border-t border-noc-border/40">
                    <span className="text-slate-400">{c.faultType}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Pipeline Flow */}
        <div className="lg:col-span-3">
          {activeRcaCase ? (
            <RcaPipelineVisualizer rcaCase={activeRcaCase} />
          ) : (
            <div className="rounded-xl border border-noc-border bg-noc-card/90 p-12 text-center text-slate-400 font-mono text-xs">
              No RCA cases available. Inject a fault via Fault Simulator to see real-time root cause analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
