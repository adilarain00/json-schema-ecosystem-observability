'use client';

import React from 'react';
import { Github, ExternalLink, Youtube } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  tags?: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  youtubeUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  tags,
  githubUrl,
  liveDemoUrl,
  youtubeUrl,
}) => {
  return (
    <div className='pb-16 pt-8 border-b border-zinc-800/50'>
      <div className='max-w-6xl mx-auto text-center'>
        {/* Tags */}
        {tags && (
          <div className='flex flex-wrap justify-center gap-2 mb-6'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider'
              >
                {tag.startsWith('#') ? tag.slice(1) : tag}
              </span>
            ))}
          </div>
        )}

        <h1 className='text-5xl md:text-7xl font-black text-white leading-[1.1] mb-4'>
          {title}
        </h1>

        {subtitle && (
          <p className='text-2xl md:text-3xl font-bold text-zinc-400 tracking-tight mb-6 max-w-4xl mx-auto'>
            {subtitle}
          </p>
        )}

        <p className='text-lg md:text-xl text-zinc-400 leading-relaxed font-medium mb-10 max-w-4xl mx-auto'>
          {description}
        </p>

        <div className='flex flex-wrap justify-center gap-4'>
          {githubUrl && (
            <a
              href={githubUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all shadow-xl shadow-white/5'
            >
              <Github size={20} />
              GitHub
            </a>
          )}

          {liveDemoUrl && (
            <a
              href={liveDemoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white border border-zinc-800 rounded-full font-bold hover:bg-zinc-800 transition-all'
            >
              <ExternalLink size={20} />
              Live Demo
            </a>
          )}

          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-full font-bold hover:bg-red-600/20 transition-all'
            >
              <Youtube size={20} />
              YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
