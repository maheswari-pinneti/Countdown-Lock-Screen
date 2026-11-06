import React from 'react';
import { Icon, IconName } from './Icon';

export interface BadgeProps {
  label: string;
  variant?: 'emerald' | 'amber' | 'cyan' | 'red' | 'purple' | 'zinc';
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
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    zinc: 'bg-zinc-800 border-zinc-700 text-zinc-300',
  }[variant];

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full border ${variantStyles} ${sizeStyles} ${className}`}
      style={style}
    >
      {icon && <Icon name={icon} className="w-3 h-3 shrink-0" />}
      <span>{label}</span>
    </span>
  );
};
