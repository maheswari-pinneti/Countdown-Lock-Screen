import React from 'react';
import { Icon, IconName } from '../common/Icon';
import { Button } from '../common/Button';

export interface EmptyStateProps {
  icon?: IconName | string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'Layers',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-8 md:p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
        <Icon name={icon} className="w-7 h-7" />
      </div>

      <div className="max-w-sm space-y-1">
        <h4 className="text-base font-bold text-white">{title}</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

