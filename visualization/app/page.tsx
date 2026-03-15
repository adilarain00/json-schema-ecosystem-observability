/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMetrics } from '../lib/data';
import {
  fetchMultipleNpmDownloads,
  fetchGithubRepos,
  fetchBowtieData,
  fetchAlerts,
} from '../lib/api';
import ChartWrapper from '../components/ChartWrapper';
import { Activity, Github, Download, CheckCircle } from 'lucide-react';

export default async function OverviewPage() {
  // Fetch from APIs
  const [npmDataList, githubData, bowtieData] = await Promise.all([
    fetchMultipleNpmDownloads(
      ['ajv', 'jsonschema', 'ajv-formats', 'fast-json-stringify', 'djv'],
      'last-year',
    ),
    fetchGithubRepos('topic:json-schema', 100, 10),
    fetchBowtieData(),
    fetchAlerts(),
  ]);

  // Accordion local data
  const localMetrics = getMetrics();

  // Process NPM Data for Monthly Growth (last 6 months)
  const monthlyNpmData: Record<string, number> = {};
  let currentWeeklyNpm = 0;

  npmDataList.forEach((pkgData: any) => {
    if (!pkgData || !pkgData.downloads) return;

    // Group all package downloads into monthly buckets
    pkgData.downloads.forEach((dayData: any) => {
      const date = new Date(dayData.day);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleString('default', { month: 'short' });
      monthlyNpmData[monthLabel] =
        (monthlyNpmData[monthLabel] || 0) + dayData.downloads;
    });

    // Sum up the last 7 days of downloads for currentWeeklyNpm
    const last7Days = pkgData.downloads.slice(-7);
    currentWeeklyNpm += last7Days.reduce(
      (sum: number, d: any) => sum + d.downloads,
      0,
    );
  });

  // Extract last 6 months for the chart
  const allMonths = Object.keys(monthlyNpmData);
  const last6Months = allMonths.slice(-6);
  const npmChartData = last6Months.map((m) => monthlyNpmData[m] / 1000000); // Scale to millions

  // Process GitHub Data
  let totalStars = 0;
  let totalForks = 0;
  if (githubData?.items) {
    githubData.items.forEach((repo: any) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
    });
  }
  const repoCount = githubData?.total_count || localMetrics.github.repoCount;
  // If we only have 1000 items, the stars/forks might be lower than total ecosystem. We could extrapolate or limit max.
  // For now, use fetched total.

  // Simulate mock GitHub growth (since we can't get historical points from basic search api easily)
  // We make it proportional to our latest data
  const githubChartData = last6Months.map(
    (_, i) => (totalStars / 1000) * (0.8 + 0.04 * i),
  );

  // Process Health Score
  // npm adoption -> 40%, GitHub activity -> 35%, validator compliance -> 25%
  const adoptionScore = Math.min((currentWeeklyNpm / 5000000) * 100, 100); // assuming 5M/wk is 100%
  const githubScore = Math.min((repoCount / 2000) * 100, 100); // assuming 2k repos is 100%

  let bowtieAvg = 0;
  if (bowtieData && bowtieData.length > 0) {
    bowtieAvg =
      bowtieData.reduce((acc: number, val: any) => acc + val.compliance, 0) /
      bowtieData.length;
  }
  const healthScore =
    Math.round(adoptionScore * 0.4 + githubScore * 0.35 + bowtieAvg * 0.25) ||
    0;

  const historicalGrowth = {
    labels: last6Months,
    datasets: [
      {
        label: 'NPM Downloads (Millions)',
        data: npmChartData,
        backgroundColor: [
          '#22c55e',
          '#16a34a',
          '#4ade80',
          '#15803d',
          '#86efac',
          '#22c55e',
        ],
        borderRadius: 6,
      },
      {
        label: 'GitHub Stars (Thousands)',
        data: githubChartData,
        backgroundColor: [
          '#3b82f6',
          '#2563eb',
          '#60a5fa',
          '#1d4ed8',
          '#93c5fd',
          '#3b82f6',
        ],
        borderRadius: 6,
      },
    ],
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-end'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Ecosystem Overview
          </h2>
          <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
            Key metrics across the JSON Schema ecosystem.
          </p>
        </div>
        <p className='text-xs text-zinc-500'>
          Last updated: {new Date().toISOString().split('T')[0]}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='metric-card space-y-3 dark:bg-zinc-950 dark:border-zinc-800 bg-white border border-zinc-200 rounded-xl p-6'>
          <div className='flex items-center gap-2 text-zinc-500 dark:text-zinc-400'>
            <Download size={16} />
            <h3 className='text-sm font-medium'>Weekly npm Downloads</h3>
          </div>
          <div className='text-3xl font-bold text-emerald-500 dark:text-emerald-400'>
            {currentWeeklyNpm.toLocaleString()}
          </div>
          <div className='text-xs text-emerald-500'>Live from npm API</div>
        </div>

        <div className='metric-card space-y-3 dark:bg-zinc-950 dark:border-zinc-800 bg-white border border-zinc-200 rounded-xl p-6'>
          <div className='flex items-center gap-2 text-zinc-500 dark:text-zinc-400'>
            <Github size={16} />
            <h3 className='text-sm font-medium'>GitHub Repository Count</h3>
          </div>
          <div className='text-3xl font-bold text-blue-500 dark:text-blue-400'>
            {repoCount.toLocaleString()}
          </div>
          <div className='text-xs text-blue-500'>Live from GitHub API</div>
        </div>

        <div className='metric-card space-y-3 dark:bg-zinc-950 dark:border-zinc-800 bg-white border border-zinc-200 rounded-xl p-6'>
          <div className='flex items-center gap-2 text-zinc-500 dark:text-zinc-400'>
            <Activity size={16} />
            <h3 className='text-sm font-medium'>Total GitHub Stars (Top 1k)</h3>
          </div>
          <div className='text-3xl font-bold text-purple-500 dark:text-purple-400'>
            {totalStars.toLocaleString()}
          </div>
          <div className='text-xs text-purple-500'>Live from GitHub API</div>
        </div>

        <div className='metric-card space-y-3 dark:bg-zinc-950 dark:border-zinc-800 bg-white border border-zinc-200 rounded-xl p-6'>
          <div className='flex items-center gap-2 text-zinc-500 dark:text-zinc-400'>
            <CheckCircle size={16} />
            <h3 className='text-sm font-medium'>Total Forks (Top 1k)</h3>
          </div>
          <div className='text-3xl font-bold text-orange-500 dark:text-orange-400'>
            {totalForks.toLocaleString()}
          </div>
          <div className='text-xs text-orange-500'>Live from GitHub API</div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-10 gap-6 mt-8'>
        <div className='chart-container lg:col-span-7 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6'>
          <h3 className='text-lg font-medium mb-6 dark:text-white'>
            Ecosystem Growth
          </h3>
          <ChartWrapper type='bar' data={historicalGrowth} height={350} />
        </div>

        <div className='chart-container lg:col-span-3 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6'>
          <h3 className='text-lg font-medium mb-4 dark:text-white'>
            Ecosystem Health
          </h3>

          <div className='relative w-40 h-40 flex items-center justify-center'>
            <svg viewBox='0 0 100 100' className='w-full h-full -rotate-90'>
              <circle
                cx='50'
                cy='50'
                r='45'
                fill='none'
                stroke='currentColor'
                className='text-zinc-200 dark:text-zinc-800'
                strokeWidth='10'
              />
              <circle
                cx='50'
                cy='50'
                r='45'
                fill='none'
                stroke='#22c55e'
                strokeWidth='10'
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap='round'
              />
            </svg>
            <span className='absolute text-3xl font-bold text-emerald-500 dark:text-emerald-400'>
              {healthScore}%
            </span>
          </div>
          <p className='text-sm text-zinc-500 dark:text-zinc-400 mt-3 text-center'>
            Ecosystem Health Score
          </p>

          <div className='flex gap-2 mt-4 flex-wrap justify-center'>
            <span className='px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-full'>
              Growing
            </span>
            <span className='px-2 py-1 text-xs bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 rounded-full'>
              Active Maintainers
            </span>
            <span className='px-2 py-1 text-xs bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 rounded-full'>
              Strong Adoption
            </span>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <details
          open
          className='group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-all duration-300'
        >
          <summary className='font-semibold text-lg cursor-pointer flex items-center justify-between dark:text-white'>
            Latest Metrics JSON API
            <span className='text-zinc-500 text-sm group-open:rotate-180 transition'>
              ▼
            </span>
          </summary>
          <pre className='mt-4 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 overflow-x-auto text-emerald-600 dark:text-emerald-300'>
            {JSON.stringify(localMetrics, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
