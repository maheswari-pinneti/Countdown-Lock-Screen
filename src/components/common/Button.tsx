import React from 'react';
import { Icon, IconName } from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: IconName | string;
  iconRight?: IconName | string;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5',
  }[size];

  const variantClasses = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700',
    outline: 'bg-transparent hover:bg-white/5 text-zinc-200 border border-zinc-700 hover:border-zinc-500',
    ghost: 'bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : iconLeft ? (
        <Icon name={iconLeft} className="w-4 h-4 shrink-0" />
      ) : null}

      <span>{children}</span>

      {!isLoading && iconRight && (
        <Icon name={iconRight} className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
};
