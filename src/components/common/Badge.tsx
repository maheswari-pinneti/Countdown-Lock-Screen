import React from 'react';
import { Icon, IconName } from './Icon';

export interface BadgeProps {
  label: string;
  variant?: 'emerald' | 'amber' | 'cyan' | 'red' | 'purple' | 'zinc' | 'indigo' | 'rose';
  icon?: IconName | string;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'emerald',
  icon,
  size = 'md',
  className = '',
  style,
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/25 text-amber-300',
    cyan: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300',
    red: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
    rose: 'bg-rose-500/10 border-rose-500/25 text-rose-300',
    purple: 'bg-purple-500/10 border-purple-500/25 text-purple-300',
    indigo: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-300',
    zinc: 'bg-slate-800/80 border-slate-700/80 text-slate-300',
  }[variant];

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${variantStyles} ${sizeStyles} ${className}`}
      style={style}
    >
      {icon && <Icon name={icon} className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
    </span>
  );
};
