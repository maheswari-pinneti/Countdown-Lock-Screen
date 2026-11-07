import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
  width,
  height,
}) => {
  const variantStyles = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-2xl',
  }[variant];

  return (
    <div
      className={`relative overflow-hidden bg-zinc-800/50 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ${variantStyles} ${className}`}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
    />
  );
};

export const CountdownCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-[#0C111D] border border-zinc-800/80 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <Skeleton width={110} height={24} variant="rounded" />
        <Skeleton width={40} height={16} variant="rounded" />
      </div>

      <div className="space-y-2 pt-2">
        <Skeleton width="70%" height={22} variant="rounded" />
        <Skeleton width="45%" height={14} variant="rounded" />
      </div>

      <div className="p-4 rounded-2xl bg-[#060913] border border-zinc-800 flex items-center justify-center gap-2">
        <Skeleton width={60} height={36} variant="rounded" />
        <Skeleton width={60} height={36} variant="rounded" />
        <Skeleton width={60} height={36} variant="rounded" />
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between">
          <Skeleton width={90} height={12} variant="rounded" />
          <Skeleton width={40} height={12} variant="rounded" />
        </div>
        <Skeleton width="100%" height={8} variant="rounded" />
      </div>

      <div className="flex gap-2 pt-3">
        <Skeleton width="50%" height={36} variant="rounded" />
        <Skeleton width="50%" height={36} variant="rounded" />
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Welcome Banner Skeleton */}
      <div className="p-8 rounded-3xl bg-[#0C111D] border border-zinc-800 space-y-4">
        <Skeleton width={180} height={20} variant="rounded" />
        <Skeleton width="50%" height={36} variant="rounded" />
        <Skeleton width="75%" height={16} variant="rounded" />
      </div>

      {/* Grid of 5 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CountdownCardSkeleton />
        <CountdownCardSkeleton />
        <CountdownCardSkeleton />
      </div>
    </div>
  );
};

