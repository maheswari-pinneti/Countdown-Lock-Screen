import React from 'react';
import { CustomIconProps } from './SimpleIcons';

// Google Fonts & Material Symbols (Clean Material Glyph Geometry)

export const MaterialWork: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
  </svg>
);

export const MaterialSchedule: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

export const MaterialVerified: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
  </svg>
);

export const MaterialSavings: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M15 10c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1zm4.9-3.24l-3.11-3.11a1 1 0 0 0-1.41 0L14.07 5H9.93L8.62 3.65a1 1 0 0 0-1.41 0L4.1 6.76C2.8 8.06 2 9.87 2 11.83V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7.17c0-1.96-.8-3.77-2.1-5.07zM20 19H4v-7.17c0-1.43.58-2.75 1.52-3.69L7.91 5.75l.59.59V8h7V6.34l.59-.59 2.39 2.39c.94.94 1.52 2.26 1.52 3.69V19z" />
  </svg>
);

export const MaterialMood: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

export const MaterialWaterDrop: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);
