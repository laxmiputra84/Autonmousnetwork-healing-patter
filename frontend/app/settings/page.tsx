'use client';

import React from 'react';
import { useNetwork } from '@/context/NetworkContext';
import {
  Settings,
  Moon,
  Sun,
  Volume2,
  RefreshCw,
  Zap,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Cpu,
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetAllToFactory, addToast } = useNetwork();

  const handleSavePreferences = () => {
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Dashboard telemetry & preferences updated successfully.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-noc-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Settings className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">
              Platform & NOC Preferences
            </h1>
          </div>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Configure telemetry polling frequencies, audio alerts, visual themes and autonomous policy engine.
          </p>
        </div>

        <button
          onClick={handleSavePreferences}
          className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-mono font-bold text-white shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Section 1: Visual Theme */}
        <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl">
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-noc-border/50 pb-3 flex items-center gap-2">
            <Moon className="h-4 w-4 text-cyan-400" />
            <span>NOC Visual Theme</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'dark', title: 'Deep Cyber Dark', desc: 'Default high-contrast NOC midnight palette' },
              { id: 'cyberpunk', title: 'Cyberpunk Neon', desc: 'Vibrant neon cyan & amber accents' },
              { id: 'light', title: 'Minimal Slate', desc: 'Clean slate interface' },
            ].map((themeOpt) => {
              const isSelected = settings.theme === themeOpt.id;

              return (
                <button
                  key={themeOpt.id}
                  onClick={() => updateSettings({ theme: themeOpt.id as any })}
                  className={`text-left rounded-xl p-4 border transition-all duration-200 ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'border-noc-border bg-noc-cardLighter/20 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-white">{themeOpt.title}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">{themeOpt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Telemetry & Polling Rates */}
        <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl">
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-noc-border/50 pb-3 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-cyan-400" />
            <span>Telemetry Ingestion & Polling Rates</span>
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between py-2 border-b border-noc-border/40">
              <div>
                <div className="text-white font-bold">Auto Telemetry Refresh</div>
                <div className="text-slate-400 text-[11px]">Continuously poll device status in background</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoRefresh}
                  onChange={(e) => updateSettings({ autoRefresh: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-noc-border/40">
              <div>
                <div className="text-white font-bold">Polling Interval</div>
                <div className="text-slate-400 text-[11px]">Frequency of synthetic telemetry stream checks</div>
              </div>
              <select
                value={settings.refreshIntervalSeconds}
                onChange={(e) => updateSettings({ refreshIntervalSeconds: Number(e.target.value) })}
                className="rounded-lg border border-noc-borderLighter bg-noc-bg p-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value={1}>1 second (Ultra-Fast)</option>
                <option value={5}>5 seconds (Standard NOC)</option>
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Autonomous Orchestration & Alerts */}
        <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl">
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-noc-border/50 pb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span>Autonomous Orchestration & Audio Alerting</span>
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between py-2 border-b border-noc-border/40">
              <div>
                <div className="text-white font-bold">Sound Alert System</div>
                <div className="text-slate-400 text-[11px]">Play audio indicators on CRITICAL fault ingestion</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundAlerts}
                  onChange={(e) => updateSettings({ soundAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-noc-border/40">
              <div>
                <div className="text-white font-bold">Autonomous Zero-Touch Execution</div>
                <div className="text-slate-400 text-[11px]">Allow AI agent to execute playbooks automatically without human approval</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autonomousAutoExecute}
                  onChange={(e) => updateSettings({ autonomousAutoExecute: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Data Reset */}
        <div className="rounded-xl border border-rose-500/30 bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl">
          <h3 className="font-mono text-sm font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-rose-500" />
            <span>Factory Reset Mock Environment</span>
          </h3>
          <p className="text-xs font-mono text-slate-400 mb-4">
            Reset all simulated devices, injected alarms, in-progress healing jobs, and recovery history back to initial pristine mock state.
          </p>

          <button
            onClick={resetAllToFactory}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-mono font-bold text-rose-300 hover:bg-rose-500/20 transition-all active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset All Telemetry to Factory State</span>
          </button>
        </div>
      </div>
    </div>
  );
}
