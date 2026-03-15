'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Challenge {
  challenge: string;
  problem: string;
  solution: string;
}

interface ProblemSolutionProps {
  challenges: Challenge[];
}

export const ProblemSolution: React.FC<ProblemSolutionProps> = ({
  challenges,
}) => {
  return (
    <div className='space-y-12'>
      {challenges.map((item, idx) => (
        <div key={idx} className='space-y-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-blue-500/10 p-2 rounded-lg'>
              <AlertCircle size={20} className='text-blue-500' />
            </div>
            <h3 className='text-xl font-black text-white'>{item.challenge}</h3>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 pl-12'>
            <div className='p-8 rounded-3xl bg-red-950 shadow-inner border border-red-800/50'>
              <div className='text-xs font-black text-zinc-200 uppercase tracking-widest mb-4'>
                The Problem
              </div>
              <p className='text-zinc-400 font-medium leading-relaxed'>
                {item.problem}
              </p>
            </div>

            <div className='p-8 rounded-3xl bg-green-950 border border-green-500/10 shadow-lg'>
              <div className='text-xs font-black text-zinc-200 uppercase tracking-widest mb-4'>
                The Solution
              </div>
              <p className='text-zinc-400 font-medium leading-relaxed'>
                {item.solution}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
