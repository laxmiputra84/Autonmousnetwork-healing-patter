'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Server,
  AlertTriangle,
  GitPullRequest,
  Zap,
  History,
  Flame,
  Settings,
  ShieldCheck,
  Radio,
  Cpu,
} from 'lucide-react';
import { useNetwork } from '@/context/NetworkContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  badgeType?: 'danger' | 'warning' | 'info' | 'success';
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { alarms, healingActions, simulatorState } = useNetwork();

  const openAlarmsCount = alarms.filter((a) => a.status === 'OPEN' || a.status === 'ANALYZING').length;
  const inProgressHealingCount = healingActions.filter((h) => h.status === 'IN_PROGRESS' || h.status === 'QUEUED').length;

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: Activity },
    { name: 'Devices', href: '/devices', icon: Server },
    {
      name: 'Alarms',
      href: '/alarms',
      icon: AlertTriangle,
      badgeCount: openAlarmsCount > 0 ? openAlarmsCount : undefined,
      badgeType: 'danger',
    },
    { name: 'Root Cause Analysis', href: '/rca', icon: GitPullRequest },
    {
      name: 'Healing Actions',
      href: '/healing',
      icon: Zap,
      badgeCount: inProgressHealingCount > 0 ? inProgressHealingCount : undefined,
      badgeType: 'info',
    },
    { name: 'Recovery History', href: '/recovery', icon: History },
    {
      name: 'Fault Simulator',
      href: '/simulator',
      icon: Flame,
      badgeCount: simulatorState.isSimulating ? 1 : undefined,
      badgeType: 'warning',
    },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-noc-border bg-noc-bg/95 backdrop-blur-2xl flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 border-b border-noc-border px-6 py-5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 shadow-lg shadow-cyan-500/20">
            <Radio className="h-5 w-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white font-mono uppercase">
              AUTONOMOUS
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-cyan-400 font-semibold">
              NETWORK HEALING
            </p>
          </div>
        </div>

        {/* System Status Pill */}
        <div className="mx-4 my-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-mono font-medium text-emerald-300">AI AGENT: ACTIVE</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400/80">99.9% Uptime</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-inner'
                    : 'text-slate-400 hover:bg-noc-cardLighter/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badgeCount !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-mono ${
                      item.badgeType === 'danger'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                        : item.badgeType === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : item.badgeType === 'info'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer telemetry status */}
      <div className="border-t border-noc-border p-4 bg-noc-card/40">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>NOC CORE ENGINE</span>
          </div>
          <span className="text-emerald-400">ONLINE</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-1.5 rounded-full w-[88%] animate-pulse" />
        </div>
        <p className="mt-2 text-[10px] font-mono text-slate-500 text-center">
          Autonomous Network Healing v2.4.0
        </p>
      </div>
    </aside>
  );
};
