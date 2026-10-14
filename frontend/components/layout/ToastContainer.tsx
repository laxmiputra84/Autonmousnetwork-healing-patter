'use client';

import React from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNetwork();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />;
            case 'error':
              return <AlertOctagon className="h-5 w-5 text-rose-400 shrink-0" />;
            default:
              return <Info className="h-5 w-5 text-cyan-400 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-500/40 bg-noc-card/95 shadow-[0_0_20px_rgba(16,185,129,0.15)]';
            case 'warning':
              return 'border-amber-500/40 bg-noc-card/95 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
            case 'error':
              return 'border-rose-500/40 bg-noc-card/95 shadow-[0_0_20px_rgba(244,63,94,0.15)]';
            default:
              return 'border-cyan-500/40 bg-noc-card/95 shadow-[0_0_20px_rgba(6,182,212,0.15)]';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-right-5 fade-in ${getBorderColor()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white font-mono">{toast.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{toast.timestamp}</span>
              </div>
              <p className="mt-1 text-xs text-slate-300 break-words">{toast.message}</p>
              {toast.actionUrl && (
                <Link
                  href={toast.actionUrl}
                  onClick={() => removeToast(toast.id)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-mono font-medium text-cyan-400 hover:text-cyan-300"
                >
                  View Details <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
