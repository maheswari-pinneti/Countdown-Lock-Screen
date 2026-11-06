import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
  icon?: string;
  description?: string;
}

export interface DropdownProps<T = string> {
  label?: string;
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Dropdown<T = string>({
  label,
  options,
  value,
  onChange,
  className = '',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-zinc-300">{label}</label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-black/60 border border-zinc-700/80 hover:border-zinc-500 text-xs sm:text-sm text-zinc-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {selected?.icon && <Icon name={selected.icon} className="w-4 h-4 text-emerald-400" />}
          <span className="font-medium">{selected?.label}</span>
        </div>
        <Icon name="ChevronDown" className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1.5 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-1.5 max-h-60 overflow-y-auto animate-fadeIn">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-colors ${
                  isSelected
                    ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                    : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {option.icon && <Icon name={option.icon} className="w-4 h-4" />}
                  <div>
                    <div>{option.label}</div>
                    {option.description && (
                      <div className="text-[10px] text-zinc-500 font-normal">{option.description}</div>
                    )}
                  </div>
                </div>
                {isSelected && <Icon name="Check" className="w-4 h-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

