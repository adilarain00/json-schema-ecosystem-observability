'use client';
import React from 'react';

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <section className={`py-16 ${className}`}>
      {title && (
        <div className='mb-10'>
          <h2 className='text-3xl md:text-4xl font-black text-white tracking-tight mb-4'>
            {title}
          </h2>
          {description && (
            <p className='text-lg text-zinc-400 font-medium max-w-3xl leading-relaxed'>
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};
