'use client';
import React from 'react';

interface Stat {
  label: string;
  value: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-between'>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className='p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/60 transition-all duration-300 shadow-lg flex flex-col items-center text-center'
        >
          <div className='text-sm font-bold text-zinc-500 uppercase mb-3 group-hover:text-blue-500 transition-colors'>
            {stat.label}
          </div>

          <div className='text-5xl md:text-6xl font-black text-white tracking-tight p-3'>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};
