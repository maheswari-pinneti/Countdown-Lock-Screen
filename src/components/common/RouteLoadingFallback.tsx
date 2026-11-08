import React from 'react';
import { Skeleton } from './SkeletonLoader';

export const RouteLoadingFallback: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn py-6 px-4">
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton width={240} height={32} />
        <Skeleton width={180} height={16} />
      </div>
      <Skeleton width={140} height={40} />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton height={130} />
      <Skeleton height={130} />
      <Skeleton height={130} />
      <Skeleton height={130} />
    </div>

    <Skeleton height={380} />
  </div>
);
