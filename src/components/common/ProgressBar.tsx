import React from 'react';

export interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  glow?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = '#22c55e',
  height = 'md',
  showLabel = false,
  glow = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[height];

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-mono text-zinc-400">
          <span>Progress</span>
          <span className="font-bold text-zinc-200">{clamped.toFixed(1)}%</span>
        </div>
      )}

      <div className={`w-full ${heightClasses} rounded-full bg-zinc-800/80 overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${clamped}%`,
            backgroundColor: color,
            boxShadow: glow ? `0 0 10px ${color}` : undefined,
          }}
        />
      </div>
    </div>
  );
};
