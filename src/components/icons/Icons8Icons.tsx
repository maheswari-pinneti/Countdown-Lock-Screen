import React from 'react';
import { CustomIconProps } from './SimpleIcons';

// Icons8 Style Icons (Modern Line & Fluid Glyphs for Career & Life)

export const Icons8Resume: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M37 42H11a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h18l11 11v22a3 3 0 0 1-3 3z" />
    <polyline points="29 6 29 17 40 17" />
    <circle cx="18" cy="22" r="4" fill="currentColor" fillOpacity="0.2" />
    <line x1="26" y1="20" x2="34" y2="20" />
    <line x1="26" y1="24" x2="32" y2="24" />
    <line x1="14" y1="32" x2="34" y2="32" />
    <line x1="14" y1="36" x2="28" y2="36" />
  </svg>
);

export const Icons8Interview: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="16" cy="14" r="6" />
    <path d="M8 34v-2c0-4.4 3.6-8 8-8h0c4.4 0 8 3.6 8 8v2" />
    <circle cx="32" cy="18" r="5" />
    <path d="M26 34v-1.5c0-3.6 2.9-6.5 6.5-6.5h0c3.6 0 6.5 2.9 6.5 6.5V34" />
    <line x1="4" y1="40" x2="44" y2="40" />
  </svg>
);

export const Icons8Contract: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M10 8h28v32H10z" />
    <line x1="16" y1="16" x2="32" y2="16" />
    <line x1="16" y1="22" x2="32" y2="22" />
    <line x1="16" y1="28" x2="24" y2="28" />
    <path d="M26 34c2-2 4-1 6 0s4-1 4-1" />
  </svg>
);

export const Icons8MoneyBag: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M24 14c8.8 0 16 6 16 17 0 8-7 11-16 11S8 39 8 31c0-11 7.2-17 16-17z" />
    <path d="M18 14l2-8h8l2 8" />
    <circle cx="24" cy="28" r="5" />
    <line x1="24" y1="21" x2="24" y2="35" />
  </svg>
);
