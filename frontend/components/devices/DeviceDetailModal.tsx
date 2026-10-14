'use client';

import React from 'react';
import { NetworkDevice } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Server,
  Activity,
  Cpu,
  HardDrive,
  Thermometer,
  Wifi,
  Radio,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useNetwork } from '@/context/NetworkContext';

interface DeviceDetailModalProps {
  device: NetworkDevice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  device,
  isOpen,
  onClose,
}) => {
  const { updateDevice, addToast } = useNetwork();

  if (!device) return null;

  const handleReboot = () => {
    updateDevice({ id: device.id, status: 'RECOVERING' });
    addToast({
      type: 'info',
      title: 'Device Reboot Initiated',
      message: `${device.name} is performing a soft control-plane restart.`,
    });
    setTimeout(() => {
      updateDevice({ id: device.id, status: 'ONLINE', cpuUsage: 25, latencyMs: 3.8 });
      addToast({
        type: 'success',
        title: 'Device Online',
        message: `${device.name} reboot completed and telemetry verified nominal.`,
      });
    }, 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={device.name}
      subtitle={`Node ID: ${device.id} | Type: ${device.type} | Firmware: ${device.firmware}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Status Overview */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-noc-borderLighter/60 bg-noc-cardLighter/40 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2.5 border border-cyan-500/30">
              <Server className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white">{device.ip}</span>
                <StatusBadge status={device.status} size="sm" />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{device.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReboot}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-mono font-medium text-amber-300 hover:bg-amber-500/20 transition-all active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Diagnostic Soft Reset</span>
            </button>
          </div>
        </div>

        {/* 4 Telemetry Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-noc-border p-3 bg-noc-card/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>CPU Load</span>
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-white">{device.cpuUsage}%</div>
            <div className="mt-1.5 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div
                className={`h-1 rounded-full ${device.cpuUsage > 80 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                style={{ width: `${device.cpuUsage}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-noc-border p-3 bg-noc-card/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <HardDrive className="h-4 w-4 text-purple-400" />
              <span>Memory</span>
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-white">{device.memoryUsage}%</div>
            <div className="mt-1.5 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div
                className="h-1 rounded-full bg-purple-400"
                style={{ width: `${device.memoryUsage}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-noc-border p-3 bg-noc-card/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Latency</span>
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-white">{device.latencyMs} ms</div>
            <p className="text-[10px] font-mono text-slate-400 mt-1">Loss: {device.packetLossPct}%</p>
          </div>

          <div className="rounded-lg border border-noc-border p-3 bg-noc-card/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Thermometer className="h-4 w-4 text-amber-400" />
              <span>Core Temp</span>
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-white">{device.temperature}°C</div>
            <p className="text-[10px] font-mono text-emerald-400 mt-1">Thermal Normal</p>
          </div>
        </div>

        {/* Interfaces Table */}
        {device.interfaces && device.interfaces.length > 0 && (
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300 mb-2">
              Physical & Logical Interfaces
            </h4>
            <div className="overflow-x-auto rounded-lg border border-noc-border bg-noc-cardLighter/20">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-noc-border text-slate-400 bg-noc-cardLighter/40">
                    <th className="p-2.5">Port Name</th>
                    <th className="p-2.5">IP Subnet</th>
                    <th className="p-2.5">Line Speed</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">Ingress / Egress</th>
                    <th className="p-2.5 text-right">CRC Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-noc-border/30">
                  {device.interfaces.map((iface) => (
                    <tr key={iface.name} className="hover:bg-noc-cardLighter/50">
                      <td className="p-2.5 font-bold text-cyan-300">{iface.name}</td>
                      <td className="p-2.5 text-slate-300">{iface.ip}</td>
                      <td className="p-2.5 text-slate-400">{iface.speed}</td>
                      <td className="p-2.5">
                        <StatusBadge status={iface.status} size="sm" />
                      </td>
                      <td className="p-2.5 text-right text-slate-300">
                        {iface.trafficInMbps} / {iface.trafficOutMbps} Mbps
                      </td>
                      <td className="p-2.5 text-right font-semibold text-rose-400">
                        {iface.errors}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Active Services on Node */}
        <div>
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300 mb-2">
            Active Running Microservices & Protocols
          </h4>
          <div className="flex flex-wrap gap-2">
            {device.services.map((svc) => (
              <span
                key={svc}
                className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-mono text-cyan-300"
              >
                {svc}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Details */}
        <div className="flex items-center justify-between border-t border-noc-border pt-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Node Uptime: {device.uptime}</span>
          </div>
          <span>Last Telemetry Sync: {device.lastSeen}</span>
        </div>
      </div>
    </Modal>
  );
};
