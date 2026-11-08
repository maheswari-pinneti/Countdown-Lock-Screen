import React from 'react';
import { CustomIconProps } from './SimpleIcons';

// The Noun Project Style Icons (Minimalist Geometric Symbols)

export const NounTarget: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" className={className} {...props}>
    <circle cx="50" cy="50" r="42" />
    <circle cx="50" cy="50" r="28" />
    <circle cx="50" cy="50" r="14" fill="currentColor" />
    <line x1="50" y1="2" x2="50" y2="16" strokeLinecap="round" />
    <line x1="50" y1="84" x2="50" y2="98" strokeLinecap="round" />
    <line x1="2" y1="50" x2="16" y2="50" strokeLinecap="round" />
    <line x1="84" y1="50" x2="98" y2="50" strokeLinecap="round" />
  </svg>
);

export const NounMountain: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polygon points="50,15 15,85 85,85" />
    <polygon points="72,45 52,85 92,85" />
    <polyline points="40,36 50,46 60,36" />
  </svg>
);

export const NounGrowth: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="12" y1="88" x2="88" y2="88" />
    <line x1="12" y1="88" x2="12" y2="12" />
    <polyline points="24,68 44,48 60,62 84,24" />
    <polyline points="68,24 84,24 84,40" />
  </svg>
);

export const NounBalance: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="50" y1="12" x2="50" y2="88" />
    <line x1="30" y1="88" x2="70" y2="88" />
    <line x1="18" y1="28" x2="82" y2="28" />
    <polygon points="18,28 8,62 28,62" fill="currentColor" fillOpacity="0.2" />
    <polygon points="82,28 72,62 92,62" fill="currentColor" fillOpacity="0.2" />
    <circle cx="50" cy="18" r="6" fill="currentColor" />
  </svg>
);
