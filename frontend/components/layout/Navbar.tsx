'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  RefreshCw,
  Flame,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Server,
} from 'lucide-react';
import { useNetwork } from '@/context/NetworkContext';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const {
    alarms,
    settings,
    updateSettings,
    resetAllToFactory,
    backendConnected,
    backendLoading,
    syncFromBackend,
  } = useNetwork();
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toUTCString().replace('GMT', 'UTC') + ' | ' + now.toLocaleTimeString()
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const openAlarms = alarms.filter((a) => a.status === 'OPEN' || a.status === 'ANALYZING');
  const criticalCount = alarms.filter((a) => a.severity === 'CRITICAL' && a.status === 'OPEN').length;

  const handleRefreshClick = () => {
    syncFromBackend();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-noc-border bg-noc-bg/80 px-6 backdrop-blur-xl">
      {/* Left: Ticker & Live Clock */}
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 font-mono text-xs text-slate-400 md:flex">
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-slate-300 font-semibold">{timeString || 'NOC CLOCK SYNCHRONIZING...'}</span>
        </div>

        {/* Live Backend Connection Indicator */}
        <div
          title={backendConnected ? 'Connected to live Spring Boot REST backend on http://localhost:8080' : 'Backend offline - operating in local simulated mode'}
          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono transition-all ${
            backendConnected
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
          }`}
        >
          <span className="relative flex h-2 w-2">
            {backendConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                backendConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </span>
          <Server className="h-3 w-3" />
          <span className="font-semibold">
            {backendConnected ? 'API: SPRING BOOT (8080)' : 'API: SIMULATED MODE'}
          </span>
        </div>

        {/* Live Autonomous Ticker */}
        <div className="hidden xl:flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-mono">
          <span className="text-slate-400">Pipeline:</span>
          <span className="text-cyan-300 font-semibold">Zero-Touch Autonomous</span>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Fault Simulator Quick Trigger Button */}
        <Link
          href="/simulator"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 px-3.5 py-1.5 text-xs font-mono font-bold text-white shadow-lg shadow-rose-600/20 hover:from-rose-500 hover:to-amber-500 transition-all active:scale-95"
        >
          <Flame className="h-4 w-4 animate-bounce" />
          <span>FAULT SIMULATOR</span>
        </Link>

        {/* Auto Refresh Toggle / Backend Sync */}
        <button
          onClick={handleRefreshClick}
          title="Sync Telemetry from Spring Boot"
          className="rounded-lg border border-noc-borderLighter bg-noc-card p-2 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${backendLoading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Audio Alerts Toggle */}
        <button
          onClick={() => updateSettings({ soundAlerts: !settings.soundAlerts })}
          title={settings.soundAlerts ? 'Audio Alerts Enabled' : 'Audio Alerts Muted'}
          className="rounded-lg border border-noc-borderLighter bg-noc-card p-2 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
        >
          {settings.soundAlerts ? (
            <Volume2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <VolumeX className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {/* Quick Reset State Button */}
        <button
          onClick={resetAllToFactory}
          title="Reset All Telemetry to Nominal Baseline"
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Reset System</span>
        </button>

        {/* Alarm Bell Button */}
        <Link
          href="/alarms"
          className="relative rounded-lg border border-noc-borderLighter bg-noc-card p-2 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
        >
          <Bell className="h-4 w-4" />
          {openAlarms.length > 0 && (
            <span
              className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white font-mono ${
                criticalCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
              }`}
            >
              {openAlarms.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
