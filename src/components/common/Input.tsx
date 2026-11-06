import React from 'react';
import { Icon, IconName } from './Icon';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: IconName | string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-300">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-zinc-500 pointer-events-none">
            <Icon name={icon} className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          className={`w-full rounded-xl bg-black/60 border text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:outline-none ${
            icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } py-2.5 ${
            error
              ? 'border-red-500 focus:border-red-400'
              : 'border-zinc-700/80 focus:border-emerald-500'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-[11px] text-red-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-zinc-500">{helperText}</p>
      ) : null}
    </div>
  );
};
