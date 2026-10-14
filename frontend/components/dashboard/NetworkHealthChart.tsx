'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { NETWORK_HEALTH_CHART_DATA } from '@/data/recovery';
import { Activity, ShieldCheck } from 'lucide-react';

export const NetworkHealthChart: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500">
        Loading Network Telemetry Stream...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-noc-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Network Health & Latency Telemetry
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Health Index (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="text-slate-400">Avg Latency (ms)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={NETWORK_HEALTH_CHART_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              domain={[0, 105]}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey="healthScore"
              name="Health Score"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#healthGradient)"
            />
            <Area
              type="monotone"
              dataKey="latency"
              name="Latency (ms)"
              stroke="#f43f5e"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#latencyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-noc-border/50 pt-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Real-time Telemetry Polling Rate: 1000ms</span>
        </div>
        <span>Global SLA: 99.98%</span>
      </div>
    </div>
  );
};
