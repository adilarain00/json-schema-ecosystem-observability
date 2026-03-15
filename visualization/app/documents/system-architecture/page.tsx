/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { architectureOverview } from '../../../docs/architecture';
import { Hero } from '../../../components/docs/Hero';
import { Section } from '../../../components/docs/Section';
import { ArchitectureDiagram } from '@/components/docs/ArchitectureDiagram';

export default function SystemArchitecturePage() {
  const data = architectureOverview;

  return (
    <div className='max-w-5xl mx-auto pb-20 animate-in fade-in duration-1000'>
      <Hero
        title={data.title}
        description={data.subtitle}
        tags={['#architecture', '#pipeline', '#observability']}
      />

      <Section title='System Architecture' description={data.subtitle}>
        <ArchitectureDiagram
          imageSrc='/sysarch.png'
          altText='System Architecture Diagram'
        />
      </Section>

      <Section title='Architecture Layers'>
        <div className='space-y-16'>
          {data.layers.map((layer, idx) => (
            <div key={idx} className='group'>
              <div className='flex items-center gap-6 mb-8'>
                <div className='text-6xl font-black text-zinc-900 group-hover:text-zinc-800 transition-colors'>
                  {layer.number}
                </div>
                <div>
                  <h3 className='text-2xl font-black text-white'>
                    {layer.heading}
                  </h3>
                  <div
                    className={`h-1 w-12 bg-${layer.color}-500 rounded-full mt-2`}
                  />
                </div>
              </div>

              <div className='pl-6 md:pl-20 space-y-8'>
                <p className='text-lg text-zinc-400 font-medium leading-relaxed max-w-5xl'>
                  {layer.description}
                </p>

                {layer.signals && (
                  <div className='flex flex-wrap gap-3'>
                    {layer.signals.map((signal, sIdx) => (
                      <div
                        key={sIdx}
                        className='px-5 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-sm'
                      >
                        {signal}
                      </div>
                    ))}
                  </div>
                )}

                {layer.components && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {layer.components.map((comp: any, cIdx) => (
                      <div
                        key={cIdx}
                        className='p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/60'
                      >
                        <h4 className='text-white font-black mb-2'>
                          {comp.name}
                        </h4>
                        <p className='text-zinc-500 text-sm font-medium'>
                          {comp.responsibility}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {layer.schema && (
                  <div className='p-8 rounded-3xl bg-[#0d0d0d] border border-zinc-800'>
                    <h4 className='text-white font-black mb-6'>
                      {layer.schema.heading}
                    </h4>
                    <div className='overflow-x-auto'>
                      <table className='w-full text-left'>
                        <thead>
                          <tr className='border-b border-zinc-800 text-xs text-zinc-500 uppercase font-black tracking-widest'>
                            <th className='py-4 pr-4'>Field</th>
                            <th className='py-4 px-4'>Type</th>
                            <th className='py-4 pl-4'>Description</th>
                          </tr>
                        </thead>
                        <tbody className='text-sm font-medium'>
                          {layer.schema.fields.map((field: any, fIdx) => (
                            <tr
                              key={fIdx}
                              className='border-b border-zinc-900/50 hover:bg-zinc-800/20 transition-colors'
                            >
                              <td className='py-4 pr-4 text-white font-mono'>
                                {field.field}
                              </td>
                              <td className='py-4 px-4 text-blue-400 font-mono'>
                                {field.type}
                              </td>
                              <td className='py-4 pl-4 text-zinc-400'>
                                {field.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title='End-to-End Data Flow'>
        <div className='relative space-y-12 pl-8 border-l-2 border-zinc-900'>
          {data.dataFlow.steps.map((step, idx) => (
            <div key={idx} className='relative'>
              <div className='absolute -left-10.25 top-0 w-4 h-4 rounded-full bg-zinc-950 border-4 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' />
              <div className='space-y-2'>
                <div className='flex items-center gap-3'>
                  <span className='text-xs font-black text-blue-500 uppercase tracking-widest'>
                    Step 0{step.step}
                  </span>
                  <h4 className='text-xl font-black text-white'>
                    {step.label}
                  </h4>
                </div>
                <p className='text-zinc-400 font-medium leading-relaxed max-w-2xl'>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title='Design Principles'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {data.designPrinciples.map((dp, idx) => (
            <div
              key={idx}
              className='p-8 rounded-4xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-all group'
            >
              <h4 className='text-xl font-black text-white mb-4 group-hover:text-blue-500 transition-colors'>
                {dp.principle}
              </h4>
              <p className='text-zinc-400 font-medium leading-relaxed'>
                {dp.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
