import React from 'react';
import { CustomIconProps } from './SimpleIcons';

// Font Awesome Style Icons (Solid & Classic UI Glyphs)

export const FaBriefcase: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H352v32c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
  </svg>
);

export const FaGraduationCap: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 640 512" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M320 32c-8.1 0-16.1 2.3-23 6.9L10 170.9c-13.3 8.9-13.3 28.5 0 37.4l287 191c6.9 4.6 14.9 6.9 23 6.9s16.1-2.3 23-6.9l287-191c13.3-8.9 13.3-28.5 0-37.4L343 38.9c-6.9-4.6-14.9-6.9-23-6.9zM96 280v93.3c0 42.2 100.3 76.7 224 76.7s224-34.5 224-76.7V280l-201 134c-6.9 4.6-14.9 6.9-23 6.9s-16.1-2.3-23-6.9L96 280z" />
  </svg>
);

export const FaTrophy: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 576 512" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M400 0H176c-26.5 0-48 21.5-48 48v32H16c-8.8 0-16 7.2-16 16v96c0 70.7 57.3 128 128 128h17.4c29.1 48.7 77.2 83.2 134.6 92.4V448H224c-17.7 0-32 14.3-32 32s14.3 32 32 32h128c17.7 0 32-14.3 32-32s-14.3-32-32-32H296V412.4c57.4-9.2 105.5-43.7 134.6-92.4H448c70.7 0 128-57.3 128-128V96c0-8.8-7.2-16-16-16H448V48c0-26.5-21.5-48-48-48zM128 256c-35.3 0-64-28.7-64-64V144h64v112zm384-64c0 35.3-28.7 64-64 64V144h64v48z" />
  </svg>
);

export const FaBullseye: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zm0 448c-106 0-192-86-192-192S150 64 256 64s192 86 192 192s-86 192-192 192zm0-320c-70.7 0-128 57.3-128 128s57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128zm0 192c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z" />
  </svg>
);

export const FaMugHot: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M88 0C74.7 0 64 10.7 64 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C120.5 112.3 128 119.9 128 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C119.5 47.7 112 40.1 112 24c0-13.3-10.7-24-24-24zm128 0c-13.3 0-24 10.7-24 24 0 38.9 23.4 59.4 39.1 73.1l1.1 1C248.5 112.3 256 119.9 256 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C247.5 47.7 240 40.1 240 24c0-13.3-10.7-24-24-24zm128 0c-13.3 0-24 10.7-24 24 0 38.9 23.4 59.4 39.1 73.1l1.1 1C376.5 112.3 384 119.9 384 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C375.5 47.7 368 40.1 368 24c0-13.3-10.7-24-24-24zM0 224v160c0 70.7 57.3 128 128 128h192c70.7 0 128-57.3 128-128v-32h32c35.3 0 64-28.7 64-64v-32c0-35.3-28.7-64-64-64H0zm448 96h-32v-64h32c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
  </svg>
);

export const FaHandshake: React.FC<CustomIconProps> = ({ size = 24, className = 'w-5 h-5', ...props }) => (
  <svg viewBox="0 0 640 512" width={size} height={size} fill="currentColor" className={className} {...props}>
    <path d="M323.4 85.2l-96.8 96.9c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l96.8-96.9c9.4-9.4 9.4-24.6 0-33.9l-22.6-22.6c-9.4-9.4-24.6-9.4-33.9 0zM432.2 194l-96.8 96.9c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l96.8-96.9c9.4-9.4 9.4-24.6 0-33.9l-22.6-22.6c-9.4-9.4-24.6-9.4-33.9 0zM576 0H416c-17.7 0-32 14.3-32 32v64H256V32c0-17.7-14.3-32-32-32H64C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z" />
  </svg>
);
