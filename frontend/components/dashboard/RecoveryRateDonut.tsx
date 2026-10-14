'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle, Zap } from 'lucide-react';
import { useNetwork } from '@/context/NetworkContext';

export const RecoveryRateDonut: React.FC = () => {
  const { recoveryHistory, healingActions } = useNetwork();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = recoveryHistory.length;
  const successCount = recoveryHistory.filter((r) => r.result === 'SUCCESS').length;
  const failedCount = total - successCount;

  const data = [
    { name: 'Autonomous Success', value: Math.max(1, successCount), color: '#10b981' },
    { name: 'Failed / Manual', value: failedCount, color: '#f43f5e' },
  ];

  const successRate = total > 0 ? ((successCount / total) * 100).toFixed(1) : '100.0';

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500">
        Loading Recovery Metrics...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div className="border-b border-noc-border/50 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-emerald-400" />
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Autonomous Recovery Rate
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          AI SLA 98%+
        </span>
      </div>

      <div className="relative my-2 flex h-44 items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={54}
              outerRadius={72}
              paddingAngle={4}
              dataKey="value"
              stroke="#0f172a"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: '#fff',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white font-mono tracking-tight">
            {successRate}%
          </span>
          <span className="text-[10px] uppercase font-mono text-slate-400">Success Rate</span>
        </div>
      </div>

      <div className="space-y-2 border-t border-noc-border/50 pt-3 text-xs font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Autonomous Closed:</span>
          </div>
          <span className="font-bold text-white">{successCount} incidents</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle className="h-3 w-3 text-cyan-400" />
            <span>Avg MTTR (Recovery):</span>
          </div>
          <span className="font-bold text-cyan-400">68 seconds</span>
        </div>
      </div>
    </div>
  );
};
