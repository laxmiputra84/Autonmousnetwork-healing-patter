import React from 'react';
import { DeviceStatus, AlarmStatus } from '@/types';

export type StatusBadgeType = 
  | DeviceStatus 
  | AlarmStatus 
  | 'SUCCESS' 
  | 'FAILED' 
  | 'IN_PROGRESS' 
  | 'QUEUED' 
  | 'VERIFYING' 
  | 'PASSED' 
  | 'WARNING'
  | 'COMPLETED'
  | 'MITIGATING'
  | 'RESOLVED'
  | string;

interface StatusBadgeProps {
  status: StatusBadgeType;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showDot = true }) => {
  const getStyle = () => {
    switch (status) {
      case 'ONLINE':
      case 'RECOVERED':
      case 'SUCCESS':
      case 'PASSED':
      case 'COMPLETED':
      case 'RESOLVED':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
        };
      case 'HEALING':
      case 'IN_PROGRESS':
      case 'RECOVERING':
      case 'VERIFYING':
      case 'MITIGATING':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 animate-pulse',
          dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
        };
      case 'ANALYZING':
      case 'QUEUED':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          dot: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]',
        };
      case 'DEGRADED':
      case 'WARNING':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
        };
      case 'OFFLINE':
      case 'OPEN':
      case 'FAILED':
      case 'ESCALATED':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          dot: 'bg-slate-400',
        };
    }
  };

  const style = getStyle();
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${style.bg} ${sizeClasses} backdrop-blur-sm tracking-wide uppercase font-mono`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
      {status}
    </span>
  );
};
