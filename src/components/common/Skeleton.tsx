import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
};

export const ResultsSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Product Header Card Skeleton */}
      <div className="bg-white dark:bg-[#121832] rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-6">
        <Skeleton className="w-full md:w-56 h-48 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-28 rounded-[20px]" />
          <Skeleton className="h-28 rounded-[20px]" />
          <Skeleton className="h-28 rounded-[20px]" />
          <Skeleton className="h-28 rounded-[20px]" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-96 rounded-[20px]" />
        </div>
      </div>
    </div>
  );
};
