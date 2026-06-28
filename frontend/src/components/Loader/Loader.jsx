import React from 'react';

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="glass p-4 rounded-xl animate-pulse">
    <div className="flex gap-4 items-start">
      <div className="w-4 h-4 bg-white/10 rounded mt-1 flex-shrink-0"></div>
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/5 rounded w-full"></div>
        <div className="h-4 bg-white/5 rounded w-5/6"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-5 bg-white/10 rounded-full w-16"></div>
          <div className="h-5 bg-white/10 rounded-full w-20"></div>
          <div className="h-5 bg-white/10 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  </div>
);

// Stat card skeleton
const SkeletonStat = () => (
  <div className="glass p-5 rounded-xl animate-pulse space-y-3">
    <div className="h-4 bg-white/10 rounded w-1/2"></div>
    <div className="h-8 bg-white/10 rounded w-1/3"></div>
  </div>
);

const Loader = ({ type = 'tasks', count = 5 }) => {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: count }).map((_, i) => <SkeletonStat key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
};

export default Loader;
