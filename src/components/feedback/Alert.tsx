import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  className = '',
}) => {
  const styles = {
    info: {
      bg: 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300',
      icon: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-950/30 border-amber-500/30 text-amber-300',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    },
    error: {
      bg: 'bg-red-950/30 border-red-500/30 text-red-300',
      icon: <XCircle className="w-4 h-4 text-red-400 shrink-0" />,
    },
  }[type];

  return (
    <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${styles.bg} ${className}`}>
      <div className="mt-0.5">{styles.icon}</div>
      <div className="space-y-0.5">
        {title && <span className="font-bold block text-white">{title}</span>}
        <span>{message}</span>
      </div>
    </div>
  );
};

