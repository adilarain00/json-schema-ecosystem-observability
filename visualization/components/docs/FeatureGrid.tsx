'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface FeatureGroup {
  heading: string;
  bullets: string[];
}

interface FeatureGridProps {
  features: FeatureGroup[];
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((group, idx) => (
        <div key={idx} className="space-y-6">
          <h3 className="text-xl font-black text-white px-2">
            {group.heading}
          </h3>
          <div className="space-y-3">
            {group.bullets.map((bullet, bIdx) => (
              <div 
                key={bIdx} 
                className="flex gap-3 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/40 hover:bg-zinc-900/50 transition-colors"
              >
                <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <span className="text-zinc-400 text-sm font-medium leading-relaxed">
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
