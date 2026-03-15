'use client';
import { useState } from 'react';
import RepoCard, { RepoCardProps } from './RepoCard';

export default function RepoList({ repos }: { repos: RepoCardProps[] }) {
  const [page, setPage] = useState(1);
  const perPage = 20;
  const totalPages = Math.ceil(repos.length / perPage);
  const pagedRepos = repos.slice((page - 1) * perPage, page * perPage);

  return (
    <div className='mt-10'>
      <h3 className='text-lg font-semibold mb-4'>
        Top JSON Schema Repositories
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {pagedRepos.map((repo) => (
          <RepoCard key={repo.url} {...repo} />
        ))}
      </div>
      <div className='flex justify-center items-center gap-2 mt-8'>
        <button
          className='px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200 disabled:opacity-50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition'
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        
        {/* Pagination logic: Previous | 1 | 2 | 3 | Next */}
        <div className='flex gap-1'>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pages around current page
            let pageNum = page - 2 + i;
            if (page < 3) pageNum = i + 1;
            else if (page > totalPages - 2) pageNum = totalPages - 4 + i;
            
            if (pageNum < 1 || pageNum > totalPages) return null;
            
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded transition ${page === pageNum ? 'bg-blue-600 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          className='px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200 disabled:opacity-50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition'
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}
