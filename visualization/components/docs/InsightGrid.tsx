/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Globe, Zap, AlertTriangle, BarChart2 } from 'lucide-react';

interface InsightItem {
  title: string;
  icon: string;
  content: string;
}

interface InsightGridProps {
  items: InsightItem[];
}

const IconMap: Record<string, any> = {
  Globe: Globe,
  Zap: Zap,
  AlertTriangle: AlertTriangle,
  BarChart2: BarChart2,
};

export const InsightGrid: React.FC<InsightGridProps> = ({ items }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {items.map((item, idx) => {
        const Icon = IconMap[item.icon] || Globe;
        return (
          <div
            key={idx}
            className='p-8 rounded-4xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 hover:border-zinc-700/60 transition-all group'
          >
            <div className='flex items-center gap-4 mb-6'>
              <div className='p-3 rounded-2xl bg-zinc-800 text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg'>
                <Icon size={24} />
              </div>
              <h3 className='text-xl font-black text-white'>{item.title}</h3>
            </div>
            <p className='text-zinc-400 font-medium leading-relaxed'>
              {item.content}
            </p>
          </div>
        );
      })}
    </div>
  );
};
