import React from 'react';
import { CustomIconProps } from './SimpleIcons';

// Bootstrap Icons Style (Developer, Kanban, Terminal, System)

export const BiBootstrap: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M8.637 4.5h-1.63v6h1.63c1.037 0 1.77-.282 2.21-.786.442-.505.656-1.22.656-2.128 0-.9-.214-1.61-.656-2.114-.44-.504-1.173-.786-2.21-.786zm-.49 4.79v-3.58h.49c.642 0 1.09.162 1.354.493.264.331.393.812.393 1.442 0 .633-.129 1.115-.393 1.446-.264.332-.712.499-1.354.499h-.49z" />
    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 1.5v9h3.637c1.378 0 2.457-.386 3.194-1.134.738-.748 1.107-1.83 1.107-3.218 0-1.388-.369-2.47-1.107-3.218C10.594 3.886 9.515 3.5 8.137 3.5H4.5z" />
  </svg>
);

export const BiKanban: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M13.5 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h2zm-1 1.5v11h1v-11h-1zM2.5 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zm1 1.5v11h-1v-11h1zm4.5-1.5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zm1 1.5v6h-1v-6h1z" />
  </svg>
);

export const BiDiagram3: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h3A1.5 1.5 0 0 1 6 1.5v1A1.5 1.5 0 0 1 4.5 4h-3A1.5 1.5 0 0 1 0 2.5v-1zM1.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm10 0A1.5 1.5 0 0 1 13 2.5v1a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 7 3.5v-1A1.5 1.5 0 0 1 8.5 1h3zm-3 .5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-4 9A1.5 1.5 0 0 1 6 12v1A1.5 1.5 0 0 1 4.5 14.5h-3A1.5 1.5 0 0 1 0 13v-1A1.5 1.5 0 0 1 1.5 10.5h3zm-3 .5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm10 0a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 7 13.5v-1a1.5 1.5 0 0 1 1.5-1.5h3zm-3 .5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3z" />
  </svg>
);

export const BiLightningCharge: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M11.251.068a.5.5 0 0 1 .42.58L10.477 5.5H14a.5.5 0 0 1 .404.795l-8 10a.5.5 0 0 1-.878-.474L6.724 10.5H3a.5.5 0 0 1-.404-.795l8-10a.5.5 0 0 1 .655-.137z" />
  </svg>
);

export const BiWallet2: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
  </svg>
);
