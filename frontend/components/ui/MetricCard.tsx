import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
  subtext?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  iconColor = 'text-cyan-400',
  badge,
  subtext,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-noc-border bg-noc-card/90 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-noc-cyan/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] group">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-noc-cyan/30 to-transparent group-hover:via-noc-cyan transition-all duration-500" />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">{value}</h3>
            {badge && (
              <span className="rounded bg-noc-cardLighter px-2 py-0.5 text-[11px] font-mono text-cyan-300 border border-cyan-500/20">
                {badge}
              </span>
            )}
          </div>
          
          {(change || subtext) && (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {change && (
                <span
                  className={`font-mono font-medium ${
                    trend === 'up'
                      ? 'text-emerald-400'
                      : trend === 'down'
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {change}
                </span>
              )}
              {subtext && <span className="text-slate-500">{subtext}</span>}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-noc-borderLighter/40 bg-noc-cardLighter/60 p-3 shadow-inner">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
