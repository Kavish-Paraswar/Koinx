import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse select-none">
      {/* Top Banner Skeleton */}
      <div className="h-20 w-full bg-slate-900 border border-slate-800 rounded-2xl" />

      {/* Cards Row Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pre Card */}
        <div className="glass-panel border-slate-850 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div className="h-5 w-32 bg-slate-800 rounded-md" />
            <div className="h-5 w-20 bg-slate-800 rounded-full" />
          </div>
          <div className="h-28 bg-slate-900/60 rounded-xl border border-slate-800/40 p-4" />
          <div className="h-28 bg-slate-900/60 rounded-xl border border-slate-800/40 p-4" />
          <div className="h-10 bg-slate-900/80 rounded-lg mt-2" />
        </div>

        {/* Post Card */}
        <div className="glass-panel border-slate-850 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div className="h-5 w-32 bg-slate-800 rounded-md" />
            <div className="h-5 w-20 bg-slate-800 rounded-full" />
          </div>
          <div className="h-28 bg-slate-900/60 rounded-xl border border-slate-800/40 p-4" />
          <div className="h-28 bg-slate-900/60 rounded-xl border border-slate-800/40 p-4" />
          <div className="h-10 bg-slate-900/80 rounded-lg mt-2" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="glass-panel border-slate-850 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="h-5 w-48 bg-slate-800 rounded-md" />
          <div className="h-8 w-60 bg-slate-800 rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-12 w-full bg-slate-900/60 rounded-lg border border-slate-800/30" />
          ))}
        </div>
      </div>
    </div>
  );
};
