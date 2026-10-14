'use client';

import React, { useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { NetworkDevice, DeviceStatus } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DeviceDetailModal } from '@/components/devices/DeviceDetailModal';
import {
  Server,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Activity,
  Cpu,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';

export default function DevicesPage() {
  const { devices } = useNetwork();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered devices
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || device.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || device.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenDetails = (device: NetworkDevice) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const statusCounts = {
    ONLINE: devices.filter((d) => d.status === 'ONLINE').length,
    DEGRADED: devices.filter((d) => d.status === 'DEGRADED').length,
    OFFLINE: devices.filter((d) => d.status === 'OFFLINE').length,
    RECOVERING: devices.filter((d) => d.status === 'RECOVERING').length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-noc-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Server className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">
              Network Devices & Inventory
            </h1>
          </div>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Enterprise fabric nodes, edge routers, 5G gNodeB cells & telemetry stream monitors.
          </p>
        </div>

        {/* Status Count Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
            ONLINE: <span className="font-bold">{statusCounts.ONLINE}</span>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-300">
            DEGRADED: <span className="font-bold">{statusCounts.DEGRADED}</span>
          </div>
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-rose-300">
            OFFLINE: <span className="font-bold">{statusCounts.OFFLINE}</span>
          </div>
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-300">
            RECOVERING: <span className="font-bold">{statusCounts.RECOVERING}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-noc-border bg-noc-card/90 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by device ID, name, IP, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-noc-borderLighter bg-noc-bg/80 pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-noc-borderLighter bg-noc-bg/80 px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ONLINE">Online</option>
                <option value="DEGRADED">Degraded</option>
                <option value="OFFLINE">Offline</option>
                <option value="RECOVERING">Recovering</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-noc-borderLighter bg-noc-bg/80 px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="ALL">All Types</option>
                <option value="CORE_ROUTER">Core Router</option>
                <option value="EDGE_SWITCH">Edge Switch</option>
                <option value="CELLULAR_GNODEB">5G gNodeB</option>
                <option value="FIREWALL">Firewall</option>
                <option value="DATA_CENTER_GATEWAY">DC Gateway</option>
                <option value="LOAD_BALANCER">Load Balancer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="overflow-hidden rounded-xl border border-noc-border bg-noc-card/90 shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-noc-border text-slate-400 bg-noc-cardLighter/40 uppercase">
                <th className="p-4 font-semibold">Device ID</th>
                <th className="p-4 font-semibold">Device Name</th>
                <th className="p-4 font-semibold">IP Address</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">CPU / Latency</th>
                <th className="p-4 font-semibold">Active Alarms</th>
                <th className="p-4 font-semibold">Last Seen</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noc-border/40">
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No network devices matched the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr
                    key={device.id}
                    className="hover:bg-noc-cardLighter/40 transition-colors duration-150"
                  >
                    <td className="p-4 font-bold text-cyan-400">{device.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{device.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {device.location}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{device.ip}</td>
                    <td className="p-4">
                      <StatusBadge status={device.status} size="sm" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={device.cpuUsage > 80 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {device.cpuUsage}% CPU
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className={device.latencyMs > 50 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {device.latencyMs}ms
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {device.activeAlarmsCount > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[11px] font-bold text-rose-300">
                          {device.activeAlarmsCount} Active
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">0 Alarms</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">{device.lastSeen}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenDetails(device)}
                        className="inline-flex items-center gap-1 rounded border border-noc-borderLighter bg-noc-cardLighter px-2.5 py-1 text-xs text-cyan-300 hover:border-cyan-500/50 hover:text-white transition-all active:scale-95"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device Details Modal */}
      <DeviceDetailModal
        device={selectedDevice}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
