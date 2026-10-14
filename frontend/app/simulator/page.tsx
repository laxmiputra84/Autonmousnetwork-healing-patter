'use client';

import React, { useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { FaultType } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import confetti from 'canvas-confetti';
import {
  Flame,
  Zap,
  Play,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Terminal,
  Activity,
} from 'lucide-react';

const FAULT_OPTIONS: Array<{
  type: FaultType;
  label: string;
  description: string;
  mappedAction: string;
  severity: string;
}> = [
  {
    type: 'SERVICE_DOWN',
    label: 'SERVICE_DOWN',
    description: 'Process crash / segmentation fault causing instantaneous outage.',
    mappedAction: 'RESTART_SERVICE',
    severity: 'CRITICAL',
  },
  {
    type: 'CONFIG_ERROR',
    label: 'CONFIG_ERROR',
    description: 'BGP/OSPF policy syntax mismatch or route filter misconfiguration.',
    mappedAction: 'RESTORE_CONFIGURATION',
    severity: 'HIGH',
  },
  {
    type: 'HIGH_LATENCY',
    label: 'HIGH_LATENCY',
    description: 'Microburst buffer exhaustion & severe packet drop (>5%).',
    mappedAction: 'REROUTE_TRAFFIC',
    severity: 'HIGH',
  },
  {
    type: 'DEVICE_UNREACHABLE',
    label: 'DEVICE_UNREACHABLE',
    description: 'Keepalive telemetry timeout / control-plane deadlock.',
    mappedAction: 'DEVICE_RECOVERY',
    severity: 'CRITICAL',
  },
];

export default function FaultSimulatorPage() {
  const {
    devices,
    injectFault,
    simulatorState,
    advanceSimulationStep,
    resetSimulation,
    triggerAutonomousHeal,
  } = useNetwork();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    devices.length > 0 ? devices[0].id : ''
  );
  const [selectedFaultType, setSelectedFaultType] = useState<FaultType>('SERVICE_DOWN');

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || devices[0];
  const [selectedService, setSelectedService] = useState<string>(
    selectedDevice?.services?.[0] || 'BGP-Routing'
  );

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    const dev = devices.find((d) => d.id === deviceId);
    if (dev && dev.services.length > 0) {
      setSelectedService(dev.services[0]);
    }
  };

  const handleCreateFault = () => {
    const alarmId = injectFault(selectedDeviceId, selectedService, selectedFaultType);
  };

  const handleSimulateRecovery = () => {
    if (simulatorState.activeFaultId) {
      triggerAutonomousHeal(simulatorState.activeFaultId);
    } else {
      // If no fault is currently active, inject one and immediately start recovery
      const alarmId = injectFault(selectedDeviceId, selectedService, selectedFaultType);
      setTimeout(() => {
        triggerAutonomousHeal(alarmId);
      }, 500);
    }
  };

  // Trigger celebration on recovery complete
  React.useEffect(() => {
    if (simulatorState.currentStepIndex === 5) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#8b5cf6'],
        });
      } catch (e) {
        // ignore if not supported in SSR
      }
    }
  }, [simulatorState.currentStepIndex]);

  const steps = [
    { title: 'Create Fault', status: 'INJECT', desc: 'Simulate telemetry breakdown' },
    { title: 'Alarm OPEN', status: 'OPEN', desc: 'NOC alert ingested' },
    { title: 'ANALYZING', status: 'ANALYZING', desc: 'RCA & Blast radius check' },
    { title: 'HEALING', status: 'HEALING', desc: 'Execute autonomous playbook' },
    { title: 'VERIFYING', status: 'VERIFYING', desc: 'Post-heal probe validation' },
    { title: 'RECOVERED', status: 'RECOVERED', desc: 'Telemetry normalized 100%' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-noc-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Flame className="h-6 w-6 text-rose-500 animate-pulse" />
            <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">
              Interactive Fault Injection & Healing Simulator
            </h1>
          </div>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Frontend-only state orchestration lab: Inject faults $\rightarrow$ Alarm Trigger $\rightarrow$ AI Diagnostic RCA $\rightarrow$ Zero-Touch Remediation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetSimulation}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Simulator</span>
          </button>
        </div>
      </div>

      {/* Simulator Step Progress Tracker */}
      <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 border-b border-noc-border/50 pb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 uppercase">
            <Activity className="h-4 w-4" />
            <span>Autonomous Closed-Loop State Machine</span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            Current Phase: <strong className="text-white">{steps[simulatorState.currentStepIndex]?.title}</strong>
          </span>
        </div>

        {/* Step Circles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((step, idx) => {
            const isCompleted = simulatorState.currentStepIndex > idx;
            const isCurrent = simulatorState.currentStepIndex === idx;

            return (
              <div
                key={step.title}
                className={`rounded-xl border p-3 font-mono transition-all duration-300 ${
                  isCurrent
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
                    : 'border-noc-border bg-noc-cardLighter/20 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold">STEP 0{idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  ) : null}
                </div>
                <div className={`text-xs font-bold ${isCurrent ? 'text-cyan-300' : isCompleted ? 'text-white' : 'text-slate-400'}`}>
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-tight">{step.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fault Parameters Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl">
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-noc-border/50 pb-3 flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-400" />
              <span>1. Target Network Node & Service</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Select Device:</label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className="w-full rounded-lg border border-noc-borderLighter bg-noc-bg p-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                >
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.ip})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Select Service/Protocol:</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full rounded-lg border border-noc-borderLighter bg-noc-bg p-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                >
                  {selectedDevice?.services.map((svc) => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Fault Type Selection */}
          <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl">
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-noc-border/50 pb-3 flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-500" />
              <span>2. Select Fault Scenario</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FAULT_OPTIONS.map((f) => {
                const isSelected = selectedFaultType === f.type;

                return (
                  <div
                    key={f.type}
                    onClick={() => setSelectedFaultType(f.type)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                      isSelected
                        ? 'border-rose-500/80 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        : 'border-noc-border bg-noc-cardLighter/20 hover:border-slate-600 hover:bg-noc-cardLighter/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-white">{f.label}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          f.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {f.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-mono mt-1">{f.description}</p>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-noc-border/40">
                      <span className="text-slate-400">Remediation:</span>
                      <span className="text-cyan-300 font-bold">{f.mappedAction}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-noc-border/50">
              <button
                onClick={handleCreateFault}
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 py-3 px-5 font-mono text-xs font-bold text-white shadow-xl shadow-rose-600/20 hover:from-rose-500 hover:to-amber-500 transition-all active:scale-95"
              >
                <Flame className="h-4 w-4" />
                <span>Inject Fault ({selectedFaultType})</span>
              </button>

              <button
                onClick={handleSimulateRecovery}
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 py-3 px-5 font-mono text-xs font-bold text-white shadow-xl shadow-cyan-600/20 hover:from-cyan-500 hover:to-emerald-500 transition-all active:scale-95"
              >
                <Zap className="h-4 w-4" />
                <span>Simulate Autonomous Recovery</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Telemetry & Simulation Logs Console */}
        <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-noc-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  Simulation Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Live Agent Loop</span>
            </div>

            {/* Live Terminal */}
            <div className="rounded-lg bg-black/80 p-3.5 font-mono text-[11px] text-slate-300 border border-noc-borderLighter/40 h-80 overflow-y-auto custom-scrollbar space-y-2">
              <div className="text-emerald-400 font-semibold border-b border-slate-800 pb-1">
                // NOC SYNTHETIC FAULT SIMULATION LOGS
              </div>

              {simulatorState.stepLogs.length === 0 ? (
                <div className="text-slate-500 py-8 text-center text-xs">
                  Awaiting trigger... Click "Inject Fault" or "Simulate Autonomous Recovery".
                </div>
              ) : (
                simulatorState.stepLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {log.includes('Fault injected') ? (
                      <span className="text-rose-400 font-bold">{log}</span>
                    ) : log.includes('RECOVERED') ? (
                      <span className="text-emerald-400 font-bold">{log}</span>
                    ) : log.includes('ALARM') ? (
                      <span className="text-amber-400 font-semibold">{log}</span>
                    ) : (
                      <span className="text-slate-300">{log}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-noc-border/50 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Zero Backend / Mock Engine</span>
            </div>
            <span>Auto Sync: Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
