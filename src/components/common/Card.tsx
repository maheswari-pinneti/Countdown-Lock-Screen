import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'terminal' | 'outline';
  accentColor?: string;
  hoverGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  accentColor,
  hoverGlow = false,
  className = '',
  style,
  ...props
}) => {
  const baseClasses = 'relative rounded-3xl p-6 transition-all duration-300';

  const variantClasses = {
    default: 'bg-slate-900/70 dark:bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-md',
    glass: 'bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-xl',
    terminal: 'bg-slate-900/90 border border-indigo-500/30 shadow-md',
    outline: 'bg-transparent border border-slate-800',
  }[variant];

  const glowStyle = hoverGlow && accentColor
    ? {
        boxShadow: `0 8px 30px -8px ${accentColor}25`,
      }
    : {};

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{
        ...glowStyle,
        ...style,
      }}
      {...props}
    >
      {accentColor && (
        <div
          className="absolute inset-x-8 top-0 h-1 rounded-t-full opacity-80"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
      )}
      {children}
    </div>
  );
};
