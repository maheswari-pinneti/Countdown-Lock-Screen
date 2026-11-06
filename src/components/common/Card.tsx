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
    default: 'bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-xl',
    glass: 'bg-zinc-950/60 border border-white/10 backdrop-blur-2xl shadow-2xl',
    terminal: 'bg-stone-950 border border-amber-500/30 font-mono shadow-[0_0_20px_rgba(255,153,0,0.1)]',
    outline: 'bg-transparent border border-zinc-800',
  }[variant];

  const glowStyle = hoverGlow && accentColor
    ? {
        boxShadow: `0 0 25px ${accentColor}15`,
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
          className="absolute inset-x-8 top-0 h-1 rounded-t-full opacity-70"
          style={{ backgroundColor: accentColor }}
        />
      )}
      {children}
    </div>
  );
};

