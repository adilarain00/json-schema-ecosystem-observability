'use client';

import React from 'react';
import { qualificationQuestions } from '../../../docs/qualification';
import { Hero } from '../../../components/docs/Hero';
import { Section } from '../../../components/docs/Section';
import { Conclusion } from '../../../components/docs/Conclusion';

export default function QualificationQuestionsPage() {
  const data = qualificationQuestions;

  return (
    <div className='max-w-4xl mx-auto pb-20 animate-in fade-in duration-1000'>
      <Hero
        title={data.title}
        subtitle={data.subtitle}
        description={data.description}
        tags={['#gsoc', '#qualification', '#poc']}
      />

      <div className='space-y-24'>
        {/* Part 1 */}
        <Section title={data.part1.heading} description={data.part1.subheading}>
          <div className='space-y-12'>
            <p className='text-xl text-zinc-300 font-medium leading-relaxed italic border-l-4 border-blue-600 pl-8 py-2 bg-blue-600/5 rounded-r-2xl'>
              {data.part1.overview}
            </p>

            <div className='space-y-8'>
              <h4 className='text-2xl font-black text-white'>Metrics Scoped</h4>
              <div className='grid gap-6'>
                {data.part1.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className='p-8 rounded-3xl bg-zinc-900 shadow-xl border border-zinc-800'
                  >
                    <div className='text-xs font-black text-blue-500 uppercase tracking-widest mb-2'>
                      {m.metric}
                    </div>
                    <div className='text-white font-black mb-4'>{m.target}</div>
                    <p className='text-zinc-400 font-medium leading-relaxed'>
                      {m.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-8'>
              <h4 className='text-2xl font-black text-white'>
                {data.part1.technicalImplementation.heading}
              </h4>
              <p className='text-zinc-400 font-medium leading-relaxed max-w-3xl'>
                {data.part1.technicalImplementation.description}
              </p>
              <div className='p-8 rounded-3xl bg-black border border-zinc-800 font-mono text-sm text-zinc-500 overflow-x-auto'>
                <pre>{data.part1.technicalImplementation.structure}</pre>
              </div>
            </div>

            <div className='space-y-8'>
              <h4 className='text-2xl font-black text-white'>
                Error Handling & Resilience
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {data.part1.technicalImplementation.errorHandling.map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className='p-5 rounded-2xl bg-zinc-900/50 border border-zinc-900 text-zinc-400 font-medium text-sm flex gap-3'
                    >
                      <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0' />
                      {item}
                    </div>
                  ),
                )}
              </div>

              <p className='text-md text-zinc-300 font-medium leading-relaxed italic border-l-4 border-emerald-600 pl-8 py-6 bg-emerald-600/5 rounded-r-2xl'>
                {data.part1.technicalImplementation.automate}
              </p>
            </div>
          </div>
        </Section>

        {/* Part 2 */}
        <Section
          title={data.part2.heading}
          description={`Analysis of repository: ${data.part2.repository}`}
        >
          <div className='space-y-16'>
            <p className='text-xl text-zinc-300 font-medium leading-relaxed italic border-l-4 border-emerald-600 pl-8 py-2 bg-emerald-600/5 rounded-r-2xl'>
              {data.part2.summary}
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-6'>
                <h4 className='text-xl font-black text-emerald-500 uppercase tracking-widest'>
                  Strengths
                </h4>
                {data.part2.strengths.map((s, idx) => (
                  <div key={idx} className='space-y-2'>
                    <h5 className='text-white font-bold'>{s.heading}</h5>
                    <p className='text-zinc-500 text-sm font-medium leading-relaxed'>
                      {s.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className='space-y-6'>
                <h4 className='text-xl font-black text-rose-500 uppercase tracking-widest'>
                  Limitations
                </h4>
                {data.part2.limitations.map((l, idx) => (
                  <div key={idx} className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <h5 className='text-white font-bold'>{l.heading}</h5>
                      <span className='text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black'>
                        {l.severity}
                      </span>
                    </div>
                    <p className='text-zinc-500 text-sm font-medium leading-relaxed'>
                      {l.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className='p-8 rounded-3xl bg-zinc-900 border border-zinc-800'>
              <h4 className='text-xl font-black text-white mb-4'>
                {data.part2.recommendation.heading}
              </h4>
              <div className='text-2xl font-black text-emerald-500 mb-6'>
                {data.part2.recommendation.verdict
                  .toUpperCase()
                  .replace('-', ' ')}
              </div>
              <p className='text-zinc-400 font-medium leading-relaxed mb-8'>
                {data.part2.recommendation.justification}
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-4'>
                  <div className='text-xs font-black text-emerald-500 uppercase tracking-widest'>
                    What to Keep
                  </div>
                  <ul className='space-y-2'>
                    {data.part2.recommendation.whatToKeep.map((item, idx) => (
                      <li
                        key={idx}
                        className='text-xs text-zinc-500 font-medium'
                      >
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='space-y-4'>
                  <div className='text-xs font-black text-rose-500 uppercase tracking-widest'>
                    What to Replace
                  </div>
                  <ul className='space-y-2'>
                    {data.part2.recommendation.whatToReplace.map(
                      (item, idx) => (
                        <li
                          key={idx}
                          className='text-xs text-zinc-500 font-medium'
                        >
                          • {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* AI Disclosure */}
        <Conclusion
          heading={data.aiDisclosureData.heading}
          content={data.aiDisclosureData.content}
        />
      </div>
    </div>
  );
}
