import React from 'react';
import { AlarmSeverity } from '@/types';
import { ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SeverityBadgeProps {
  severity: AlarmSeverity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true,
}) => {
  const getConfig = () => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          icon: ShieldAlert,
          iconColor: 'text-rose-400',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/15 border-orange-500/40 text-orange-300',
          icon: AlertTriangle,
          iconColor: 'text-orange-400',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          icon: AlertCircle,
          iconColor: 'text-amber-400',
        };
      case 'LOW':
        return {
          bg: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
          icon: Info,
          iconColor: 'text-blue-400',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border ${config.bg} ${sizeClasses} font-mono tracking-wider uppercase backdrop-blur-md`}
    >
      {showIcon && <Icon className={`${iconSizes} ${config.iconColor}`} />}
      {severity}
    </span>
  );
};
