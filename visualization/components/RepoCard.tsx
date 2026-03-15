import { Github } from 'lucide-react';

export interface RepoCardProps {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  updatedAt?: string;
}

export default function RepoCard({
  name,
  description,
  stars,
  forks,
  language,
  url,
  updatedAt,
}: RepoCardProps) {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='block bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:border-blue-500 transition-colors'
    >
      <div className='flex items-center gap-2 mb-2'>
        <Github size={18} className='text-blue-500 dark:text-blue-400' />
        <span className='font-semibold text-blue-600 dark:text-blue-400 text-base line-clamp-1' title={name}>{name}</span>
        <span className='ml-auto text-xs text-zinc-500 line-clamp-1'>{language}</span>
      </div>
      <div className='text-zinc-600 dark:text-zinc-300 text-sm mb-3 line-clamp-2 min-h-[2.5em]'>
        {description}
      </div>
      <div className='flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400'>
        <div className='flex gap-3'>
          <span>⭐ {stars.toLocaleString()}</span>
          <span>🍴 {forks.toLocaleString()}</span>
        </div>
        {updatedAt && (
          <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
        )}
      </div>
    </a>
  );
}
