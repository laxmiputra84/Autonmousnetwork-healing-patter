'use client';

import React from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Server, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const DeviceHealthMatrix: React.FC = () => {
  const { devices } = useNetwork();

  return (
    <div className="rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between border-b border-noc-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-cyan-400" />
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Network Fabric Device Status
          </h3>
        </div>
        <Link
          href="/devices"
          className="inline-flex items-center gap-1 font-mono text-xs text-cyan-400 hover:text-cyan-300"
        >
          View All ({devices.length}) <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {devices.map((device) => {
          return (
            <div
              key={device.id}
              className="rounded-lg border border-noc-borderLighter/60 bg-noc-cardLighter/40 p-3.5 hover:border-cyan-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-white truncate max-w-[140px]" title={device.name}>
                  {device.name}
                </span>
                <StatusBadge status={device.status} size="sm" />
              </div>

              <div className="space-y-1 text-[11px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>IP Address:</span>
                  <span className="text-slate-300">{device.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span>CPU Load:</span>
                  <span className={`${device.cpuUsage > 80 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                    {device.cpuUsage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className={`${device.latencyMs > 50 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                    {device.latencyMs} ms
                  </span>
                </div>
              </div>

              {/* Mini CPU Load bar */}
              <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-1 rounded-full ${
                    device.cpuUsage > 80
                      ? 'bg-rose-500'
                      : device.cpuUsage > 60
                      ? 'bg-amber-500'
                      : 'bg-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, device.cpuUsage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
