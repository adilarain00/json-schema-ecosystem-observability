/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchMultipleNpmDownloads } from '../../lib/api';
import ChartWrapper from '../../components/ChartWrapper';
import { Download, TrendingUp, TrendingDown, Star } from 'lucide-react';

export default async function NpmDownloadsPage() {
  const packagesList = [
    { name: 'ajv', display: 'ajv', color: '#22c55e' },
    { name: 'jsonschema', display: 'jsonschema', color: '#3b82f6' },
    { name: 'ajv-formats', display: 'ajv-formats', color: '#f59e0b' },
    {
      name: 'fast-json-stringify',
      display: 'fast-json-stringify',
      color: '#6366f1',
    },
    { name: 'djv', display: 'djv', color: '#ef4444' },
  ];

  const npmDataList = await fetchMultipleNpmDownloads(
    packagesList.map((p) => p.name),
    'last-month',
  );

  let totalWeekly = 0;

  const packageStats = packagesList.map((pkg, idx) => {
    const rawData = npmDataList[idx]?.downloads || [];
    // Last 7 days
    const last7Days = rawData.slice(-7);
    const weeklyDownloads = last7Days.reduce(
      (sum: number, d: any) => sum + d.downloads,
      0,
    );

    // Previous 7 days (day -14 to -8)
    const prev7Days = rawData.slice(-14, -7);
    const prevWeeklyDownloads = prev7Days.reduce(
      (sum: number, d: any) => sum + d.downloads,
      0,
    );

    const trend =
      prevWeeklyDownloads === 0
        ? 0
        : ((weeklyDownloads - prevWeeklyDownloads) / prevWeeklyDownloads) * 100;

    totalWeekly += weeklyDownloads;

    return {
      ...pkg,
      weeklyDownloads,
      trend,
      ecosystemShare: 0,
    };
  });

  // Calculate ecosystem share and sort
  packageStats.forEach((pkg) => {
    pkg.ecosystemShare =
      totalWeekly > 0 ? (pkg.weeklyDownloads / totalWeekly) * 100 : 0;
  });

  const sortedPackages = [...packageStats].sort(
    (a, b) => b.weeklyDownloads - a.weeklyDownloads,
  );
  const topPackage = sortedPackages[0]?.display || 'N/A';

  const fastestGrowthPackage =
    [...packageStats].sort((a, b) => b.trend - a.trend)[0]?.display || 'N/A';

  const barData = {
    labels: sortedPackages.map((p) => p.display),
    datasets: [
      {
        label: 'Weekly Downloads',
        data: sortedPackages.map((p) => p.weeklyDownloads),
        backgroundColor: sortedPackages.map((p) => p.color),
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>NPM Downloads</h2>
        <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
          Activity and downloads for core JSON Schema packages.
        </p>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='metric-card space-y-3 dark:bg-zinc-950 dark:border-zinc-800 bg-white border border-zinc-200 rounded-xl p-6'>
          <div className='flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400'>
            <Download size={16} /> Total Weekly Downloads
          </div>
          <div className='text-3xl font-bold text-emerald-500 dark:text-emerald-400'>
            {totalWeekly.toLocaleString()}
          </div>
        </div>

        <div className='metric-card space-y-3 dark:bg-zinc-950 dark:border-zinc-800 bg-white border border-zinc-200 rounded-xl p-6'>
          <div className='flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400'>
            <Star size={16} /> Top Package
          </div>
          <div className='text-3xl font-bold text-blue-500 dark:text-blue-400'>
            {topPackage}
          </div>
        </div>

        <div className='metric-card space-y-3 dark:bg-zinc-950 dark:border-zinc-800 bg-white border border-zinc-200 rounded-xl p-6'>
          <div className='flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400'>
            <TrendingUp size={16} /> Fastest Growth
          </div>
          <div className='text-3xl font-bold text-purple-500 dark:text-purple-400'>
            {fastestGrowthPackage}
          </div>
        </div>
      </div>

      <div className='chart-container bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6'>
        <h3 className='text-lg font-medium mb-6 dark:text-white'>
          Package Download Comparison
        </h3>
        <ChartWrapper type='bar' data={barData} height={400} />
      </div>

      <div className='chart-container mt-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6'>
        <h3 className='text-lg font-medium mb-6 dark:text-white'>
          Package Download Trends
        </h3>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-zinc-600 dark:text-zinc-300'>
            <thead className='border-b border-zinc-200 dark:border-zinc-800'>
              <tr>
                <th className='text-left py-3 font-medium'>Package</th>
                <th className='text-left py-3 font-medium'>Weekly Downloads</th>
                <th className='text-left py-3 font-medium'>Trend</th>
                <th className='text-left py-3 font-medium'>Ecosystem Share</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-zinc-200 dark:divide-zinc-900'>
              {sortedPackages.map((pkg) => (
                <tr
                  key={pkg.name}
                  className='hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors'
                >
                  <td className='py-4 flex items-center gap-3'>
                    <span
                      className='w-2.5 h-2.5 rounded-full'
                      style={{ background: pkg.color }}
                    ></span>
                    <a
                      href={`https://www.npmjs.com/package/${pkg.name}`}
                      target='_blank'
                      rel='noreferrer'
                      className='font-medium text-zinc-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition'
                    >
                      {pkg.display}
                    </a>
                  </td>
                  <td
                    className='py-4 font-semibold'
                    style={{ color: pkg.color }}
                  >
                    {pkg.weeklyDownloads.toLocaleString()}
                  </td>
                  <td className='py-4'>
                    <span
                      className={`flex items-center gap-1 ${pkg.trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
                    >
                      {pkg.trend >= 0 ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {Math.abs(pkg.trend).toFixed(1)}%
                    </span>
                  </td>
                  <td className='py-4'>{pkg.ecosystemShare?.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
