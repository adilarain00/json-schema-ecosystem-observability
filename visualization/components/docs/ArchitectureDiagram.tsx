/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

interface ArchitectureDiagramProps {
  diagram?: string;
  imageSrc?: string;
  altText?: string;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  diagram,
  imageSrc,
  altText = 'Architecture Diagram',
}) => {
  return (
    <div className='my-16 max-w-5xl mx-auto'>
      <div className='rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden'>
        {/* Card Header */}
        <div className='px-6 py-3 border-b border-zinc-800 text-xs uppercase tracking-widest text-zinc-500 font-bold'>
          System Architecture
        </div>

        {/* Card Content */}
        <div className='p-6 overflow-x-auto'>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={altText}
              className='mx-auto rounded-xl border border-zinc-800 bg-white shadow-sm'
            />
          ) : diagram ? (
            <pre className='font-mono text-sm text-zinc-400 leading-relaxed whitespace-pre'>
              {diagram}
            </pre>
          ) : (
            <p className='text-zinc-500 text-center'>
              No architecture diagram available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
