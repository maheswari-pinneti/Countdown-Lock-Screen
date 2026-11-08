import React from 'react';
import { CustomIconProps } from './SimpleIcons';

// Flaticon Style Icons (Expressive Lifestyle, Wellness, Mood & Dreams)

export const FlaticonMeditation: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="32" cy="14" r="8" fill="currentColor" fillOpacity="0.15" />
    <path d="M32 24v16" />
    <path d="M18 36l14-6 14 6" />
    <path d="M12 48c4-6 12-8 20-8s16 2 20 8" />
    <path d="M8 52c8 4 16 4 24 4s16 0 24-4" />
    <circle cx="16" cy="36" r="3" fill="currentColor" />
    <circle cx="48" cy="36" r="3" fill="currentColor" />
  </svg>
);

export const FlaticonSleep: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M42 10a24 24 0 1 0 12 42 22 22 0 0 1-12-42z" fill="currentColor" fillOpacity="0.15" />
    <path d="M36 16h8l-8 10h8" />
    <path d="M46 8h6l-6 6h6" />
  </svg>
);

export const FlaticonExercise: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="8" y1="32" x2="56" y2="32" />
    <rect x="14" y="20" width="6" height="24" rx="2" fill="currentColor" fillOpacity="0.2" />
    <rect x="44" y="20" width="6" height="24" rx="2" fill="currentColor" fillOpacity="0.2" />
    <rect x="8" y="24" width="6" height="16" rx="2" />
    <rect x="50" y="24" width="6" height="16" rx="2" />
  </svg>
);

export const FlaticonAirplane: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M32 6L24 28H8l12 12-4 18 16-10 16 10-4-18 12-12H40L32 6z" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

export const FlaticonGratitude: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M32 54S12 42 12 24a12 12 0 0 1 20-8 12 12 0 0 1 20 8c0 18-20 30-20 30z" fill="currentColor" fillOpacity="0.15" />
    <line x1="32" y1="20" x2="32" y2="32" />
    <line x1="26" y1="26" x2="38" y2="26" />
  </svg>
);
