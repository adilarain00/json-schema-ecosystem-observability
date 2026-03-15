/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBowtieData } from '../../lib/api';
import ChartWrapper from '../../components/ChartWrapper';
import { Target } from 'lucide-react';

export default async function BowtiePage() {
  const bowtieData = await fetchBowtieData();

  // Sort bowtie entries by score descending
  const sortedBowtie = bowtieData.sort(
    (a: any, b: any) => b.compliance - a.compliance,
  );

  // Group into categories
  const categories = {
    perfect: sortedBowtie.filter((v: any) => v.compliance >= 95),
    high: sortedBowtie.filter(
      (v: any) => v.compliance >= 85 && v.compliance < 95,
    ),
    needsImprovement: sortedBowtie.filter((v: any) => v.compliance < 85),
  };

  const scoreData = {
    labels: sortedBowtie.map((entry: any) => entry.name),
    datasets: [
      {
        label: 'Compliance Score (%)',
        data: sortedBowtie.map((entry: any) => entry.compliance),
        backgroundColor: sortedBowtie.map(
          (entry: any) =>
            entry.compliance >= 95
              ? 'rgba(16, 185, 129, 0.8)' // green
              : entry.compliance >= 85
                ? 'rgba(245, 158, 11, 0.8)' // yellow
                : 'rgba(239, 68, 68, 0.8)', // red
        ),
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-end'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Bowtie Implementation
          </h2>
          <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
            JSON Schema test suite compliance scores for top validators.
          </p>
        </div>
      </div>

      <div className='bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-6 mb-8 flex items-start gap-4'>
        <Target
          className='text-emerald-600 dark:text-emerald-500 mt-1 shrink-0'
          size={24}
        />
        <div>
          <h3 className='text-lg font-medium text-emerald-700 dark:text-emerald-400 mb-1'>
            What is Bowtie?
          </h3>
          <p className='text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-4xl'>
            Bowtie is a comprehensive test suite that executes various JSON
            Schema implementations against the official JSON Schema Test Suite.
            High compliance scores mean the validator strictly adheres to the
            official JSON Schema specification drafts.
          </p>
          <div className='mt-3 text-zinc-600 dark:text-zinc-300 text-sm'>
            <ul className='list-disc pl-6 space-y-1'>
              <li>
                Bowtie helps ensure interoperability and correctness for JSON
                Schema validators across languages.
              </li>
              <li>
                Scores are calculated based on passing official test cases for
                each draft version.
              </li>
              <li>Top validators are regularly tested and compared.</li>
              <li>
                Learn more:{' '}
                <a
                  href='https://github.com/bowtie-json-schema/bowtie'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-600 dark:text-blue-400 hover:text-blue-500'
                >
                  Bowtie on GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white dark:bg-zinc-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 shadow-sm'>
          <h4 className='font-semibold text-emerald-600 dark:text-emerald-400 mb-2'>
            Perfect Compliance (95-100%)
          </h4>
          <div className='text-3xl font-bold text-zinc-900 dark:text-white mb-2'>
            {categories.perfect.length}
          </div>
          <p className='text-xs text-zinc-500 dark:text-zinc-400'>
            Highly recommended validators for production use.
          </p>
        </div>
        <div className='bg-white dark:bg-zinc-950 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 shadow-sm'>
          <h4 className='font-semibold text-yellow-600 dark:text-yellow-400 mb-2'>
            High Compliance (85-94%)
          </h4>
          <div className='text-3xl font-bold text-zinc-900 dark:text-white mb-2'>
            {categories.high.length}
          </div>
          <p className='text-xs text-zinc-500 dark:text-zinc-400'>
            Good alternatives but may fail some edge cases.
          </p>
        </div>
        <div className='bg-white dark:bg-zinc-950 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm'>
          <h4 className='font-semibold text-red-600 dark:text-red-400 mb-2'>
            Needs Improvement (&lt;85%)
          </h4>
          <div className='text-3xl font-bold text-zinc-900 dark:text-white mb-2'>
            {categories.needsImprovement.length}
          </div>
          <p className='text-xs text-zinc-500 dark:text-zinc-400'>
            Not recommended for strict validation tasks yet.
          </p>
        </div>
      </div>

      <div className='grid gap-8'>
        <div className='chart-container bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6'>
          <h3 className='text-lg font-medium mb-6 dark:text-white'>
            Validator Compliance Chart
          </h3>
          <ChartWrapper type='bar' data={scoreData} height={350} />
        </div>

        <div className='bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col'>
          <h3 className='text-lg font-medium mb-6 dark:text-white'>
            Raw Compliance Table
          </h3>

          <div className='flex-1 overflow-x-auto'>
            <table className='w-full text-left text-sm whitespace-nowrap text-zinc-600 dark:text-zinc-300'>
              <thead className='bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800'>
                <tr>
                  <th className='px-4 py-3 font-medium rounded-tl-lg'>
                    Validator
                  </th>
                  <th className='px-4 py-3 font-medium'>Language</th>
                  <th className='px-4 py-3 font-medium text-right'>
                    Pass/Fail
                  </th>
                  <th className='px-4 py-3 font-medium text-right rounded-tr-lg'>
                    Compliance
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-200 dark:divide-zinc-800'>
                {sortedBowtie.map((val: any, idx: number) => {
                  const score = val.compliance;
                  return (
                    <tr
                      key={`${val.name}-${val.language}`}
                      className='hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors'
                    >
                      <td className='px-4 py-3 font-medium flex items-center gap-2'>
                        {idx === 0 && (
                          <span className='text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 px-2 py-0.5 rounded-md border border-yellow-200 dark:border-yellow-500/30'>
                            #1
                          </span>
                        )}
                        <span className='text-zinc-900 dark:text-zinc-200'>
                          {val.name}
                        </span>
                      </td>
                      <td className='px-4 py-3'>
                        <span className='capitalize bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs'>
                          {val.language}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-right text-xs'>
                        <span className='text-emerald-600 dark:text-emerald-400'>
                          {val.passedTests}
                        </span>
                        <span className='mx-1 text-zinc-400'>/</span>
                        <span className='text-red-600 dark:text-red-400'>
                          {val.failedTests}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-right font-bold'>
                        <span
                          className={`px-2 py-1 rounded-md ${
                            score >= 95
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                              : score >= 85
                                ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {score}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
