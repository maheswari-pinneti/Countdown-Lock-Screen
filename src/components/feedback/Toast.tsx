import React, { useEffect } from 'react';
import { Icon } from '../common/Icon';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/90',
      text: 'text-emerald-400',
      icon: 'CheckCircle2',
    },
    info: {
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/90',
      text: 'text-cyan-400',
      icon: 'Bell',
    },
    warning: {
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/90',
      text: 'text-amber-400',
      icon: 'AlertTriangle',
    },
    error: {
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/90',
      text: 'text-rose-400',
      icon: 'AlertCircle',
    },
  }[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl max-w-sm animate-slideUp ${typeConfig.bg} ${typeConfig.border}`}
    >
      <Icon name={typeConfig.icon} className={`w-5 h-5 flex-shrink-0 mt-0.5 ${typeConfig.text}`} />
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-white tracking-wide">{title}</h4>
        {message && <p className="text-[11px] text-zinc-300 mt-0.5 leading-snug">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <Icon name="X" className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

