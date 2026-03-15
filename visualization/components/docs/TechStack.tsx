'use client';
import React from 'react';

interface TechStackProps {
  stack: Record<string, string[]>;
}

export const TechStack: React.FC<TechStackProps> = ({ stack }) => {
  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {Object.entries(stack).map(([category, techs], idx) => (
        <div
          key={idx}
          className='flex flex-col sm:flex-row sm:items-center gap-4'
        >
          <div className='text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 min-w-30'>
            {category}:
          </div>

          <div className='flex flex-wrap gap-4'>
            {techs.map((tech) => (
              <span
                key={tech}
                className='px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all shadow-sm'
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
