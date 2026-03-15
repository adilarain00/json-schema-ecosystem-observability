/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMetrics } from '../../lib/data';
import { fetchGithubRepos } from '../../lib/api';
import ChartWrapper from '../../components/ChartWrapper';
import { Github, FolderGit2, Star, GitFork } from 'lucide-react';
import RepoList from '../../components/RepoList';

export default async function GithubActivityPage() {
  const localData = getMetrics();
  const githubData = await fetchGithubRepos('topic:json-schema', 100, 10); // fetch up to 1000

  const repos = githubData.items || [];

  // Create RepoCard props structure from github API objects
  const repoCards = repos.map((r: any) => ({
    name: r.full_name,
    description: r.description || 'No description provided.',
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language || 'Unknown',
    url: r.html_url,
    updatedAt: r.updated_at,
  }));

  // Analyze languages from fetched repos
  const languageCounts: Record<string, number> = {};
  repos.forEach((r: any) => {
    if (r.language) {
      languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
    }
  });

  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const languageData = {
    labels: topLanguages.map((l) => l[0]),
    datasets: [
      {
        label: 'Repositories by Topic',
        data: topLanguages.map((l) => l[1]),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
      },
    ],
  };

  const totalRepos = githubData.total_count || localData.github.repoCount;
  const totalStars = repos.reduce(
    (sum: number, r: any) => sum + r.stargazers_count,
    0,
  );
  const totalForks = repos.reduce(
    (sum: number, r: any) => sum + r.forks_count,
    0,
  );

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-end'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>GitHub Activity</h2>
          <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
            Metrics across projects featuring the "json-schema" topic.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {/* Total Repositories */}
        <div className='bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col items-center text-center'>
          <div className='bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl mb-4 text-purple-600 dark:text-purple-400'>
            <FolderGit2 size={24} />
          </div>
          <h3 className='text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1'>
            Total Repositories
          </h3>
          <div className='text-3xl font-bold text-purple-600 dark:text-purple-400'>
            {totalRepos.toLocaleString()}
          </div>
        </div>

        {/* Total Stars */}
        <div className='bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col items-center text-center'>
          <div className='bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl mb-4 text-emerald-600 dark:text-emerald-400'>
            <Star size={24} />
          </div>
          <h3 className='text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1'>
            Total Stars (Top 1k)
          </h3>
          <div className='text-3xl font-bold text-emerald-600 dark:text-emerald-400'>
            {totalStars.toLocaleString()}
          </div>
        </div>

        {/* Total Forks */}
        <div className='bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col items-center text-center'>
          <div className='bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl mb-4 text-blue-600 dark:text-blue-400'>
            <GitFork size={24} />
          </div>
          <h3 className='text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1'>
            Total Forks (Top 1k)
          </h3>
          <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
            {totalForks.toLocaleString()}
          </div>
        </div>

        {/* Tracked Repos */}
        <div className='bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col items-center text-center'>
          <div className='bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl mb-4 text-yellow-500 dark:text-yellow-400'>
            <Github size={24} />
          </div>
          <h3 className='text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1'>
            Tracked Repos
          </h3>
          <div className='text-3xl font-bold text-yellow-500 dark:text-yellow-400'>
            {repoCards.length.toLocaleString()}
          </div>
        </div>
      </div>

      <div className='chart-container mt-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6'>
        <h3 className='text-lg font-medium mb-6 dark:text-white'>
          Language Breakdown (Top Repos)
        </h3>
        <p className='text-zinc-500 dark:text-zinc-400 mb-6 text-sm'>
          Calculated dynamically from the top {repoCards.length} repositories
          matching "topic:json-schema".
        </p>
        <div className='mt-4'>
          <ChartWrapper type='bar' data={languageData} height={350} />
        </div>
      </div>

      {repoCards.length > 0 ? (
        <RepoList repos={repoCards} />
      ) : (
        <div className='mt-10 p-10 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500'>
          Could not load repository list from GitHub API. Please try again
          later.
        </div>
      )}
    </div>
  );
}
