/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';

interface DocumentRendererProps {
  data: any;
  level?: number;
}

const isPrimitive = (val: any) => typeof val !== 'object' || val === null;

const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, ' ');

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className='inline-block rounded-full px-3 py-1 bg-zinc-800/80 text-xs text-zinc-200 font-semibold mr-2 mb-1 border border-zinc-700'>
    {children}
  </span>
);

const ButtonLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className='inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow transition-colors border border-blue-700 mr-2 mb-2 text-sm'
  >
    {children}
  </a>
);

const PlainValue = ({ value }: { value: any }) => (
  <p className='text-zinc-300 leading-relaxed whitespace-pre-wrap'>
    {String(value)}
  </p>
);

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  data,
  level = 0,
}) => {
  if (data === null || data === undefined) return null;

  // Primitive values
  if (isPrimitive(data)) {
    return <PlainValue value={data} />;
  }

  // Arrays
  if (Array.isArray(data)) {
    // Stats: 2x2 grid of cards with number + label
    if (
      data.length > 0 &&
      data[0] &&
      typeof data[0] === 'object' &&
      data[0].statValue !== undefined &&
      data[0].statLabel
    ) {
      return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 my-8'>
          {data.map((item, i) => (
            <div
              key={i}
              className='bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center shadow-md'
            >
              <div className='text-4xl font-extrabold text-white mb-2'>
                {item.statValue}
              </div>
              <div className='text-zinc-400 text-base font-semibold'>
                {item.statLabel}
              </div>
            </div>
          ))}
        </div>
      );
    }
    // Array of {heading, content} objects: render as vertical sections
    if (
      data.length > 0 &&
      data[0] &&
      typeof data[0] === 'object' &&
      'heading' in data[0] &&
      'content' in data[0]
    ) {
      return (
        <div className='space-y-8 my-8'>
          {data.map((item, i) => (
            <div key={i} className='mb-6'>
              <h3 className='text-xl font-bold text-white mb-2'>
                {item.heading}
              </h3>
              <p className='text-zinc-300 leading-relaxed w-full'>
                {item.content}
              </p>
            </div>
          ))}
        </div>
      );
    }
    // Project Goals: 2x3 grid of cards
    if (
      data.length > 0 &&
      data[0] &&
      typeof data[0] === 'object' &&
      data[0].goal
    ) {
      return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 my-8'>
          {data.map((item, i) => (
            <div
              key={i}
              className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md flex items-center'
            >
              <span className='text-zinc-200 text-base font-medium'>
                {item.goal}
              </span>
            </div>
          ))}
        </div>
      );
    }
    // Challenges: 2x2 grid of cards with heading/problem/solution
    if (
      data.length > 0 &&
      data[0] &&
      typeof data[0] === 'object' &&
      data[0].heading &&
      data[0].problem &&
      data[0].solution
    ) {
      return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 my-8'>
          {data.map((item, i) => (
            <div
              key={i}
              className='bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col gap-2'
            >
              <div className='text-lg font-bold text-white mb-1'>
                {item.heading}
              </div>
              <div className='text-zinc-400 text-sm mb-1'>
                <span className='font-semibold text-zinc-300'>Problem:</span>{' '}
                {item.problem}
              </div>
              <div className='text-zinc-400 text-sm'>
                <span className='font-semibold text-zinc-300'>Solution:</span>{' '}
                {item.solution}
              </div>
            </div>
          ))}
        </div>
      );
    }
    // Tech stack: horizontal badges per category
    if (data.length > 0 && typeof data[0] === 'string') {
      return (
        <div className='flex flex-wrap gap-2 my-2'>
          {data.map((tech, i) => (
            <Badge key={i}>{tech}</Badge>
          ))}
        </div>
      );
    }
    // Links: button-style links
    if (
      data.length > 0 &&
      data[0] &&
      typeof data[0] === 'object' &&
      data[0].url &&
      data[0].label
    ) {
      return (
        <div className='flex flex-wrap gap-2 my-2'>
          {data.map((item, i) => (
            <ButtonLink key={i} href={item.url}>
              {item.label}
            </ButtonLink>
          ))}
        </div>
      );
    }
    // Features or System Architecture: vertical bullet list with hover
    if (data.length > 0 && typeof data[0] === 'string') {
      return (
        <ul className='space-y-2 my-4'>
          {data.map((item, i) => (
            <li
              key={i}
              className='px-4 py-2 rounded transition-colors hover:bg-zinc-800/60 text-zinc-300 list-disc ml-6'
            >
              {item}
            </li>
          ))}
        </ul>
      );
    }
    // Default: render as vertical list
    return (
      <div className='space-y-3 my-4'>
        {data.map((item, i) => (
          <div key={i} className='pl-4'>
            <DocumentRenderer data={item} level={level} />
          </div>
        ))}
      </div>
    );
  }

  // Objects
  // Special case: {heading, content} object
  if (
    typeof data === 'object' &&
    data !== null &&
    Object.keys(data).length === 2 &&
    'heading' in data &&
    'content' in data &&
    typeof data.heading === 'string' &&
    typeof data.content === 'string'
  ) {
    return (
      <div className='mb-6'>
        <h3 className='text-xl font-bold text-white mb-2'>{data.heading}</h3>
        <p className='text-zinc-300 leading-relaxed w-full'>{data.content}</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {Object.entries(data).map(([key, value]) => {
        if (['id', '_id', '__v'].includes(key)) return null; // skip internal fields

        const label = formatKey(key);

        // Top-level heading/subheading/description
        if (level === 0 && ['title', 'name'].includes(key)) {
          return (
            <h2
              key={key}
              className='text-4xl md:text-5xl font-black text-white mt-8 mb-2'
            >
              {value as React.ReactNode}
            </h2>
          );
        }
        if (level === 0 && ['subtitle', 'subheading'].includes(key)) {
          return (
            <div key={key} className='text-zinc-400 text-xl font-semibold mb-4'>
              {value as React.ReactNode}
            </div>
          );
        }
        if (
          level === 0 &&
          (key === 'description' || key === 'shortDescription')
        ) {
          return (
            <div key={key} className='text-zinc-400 text-lg mb-8'>
              {value as React.ReactNode}
            </div>
          );
        }

        // Tags: horizontal badges
        if (key === 'tags' && Array.isArray(value)) {
          return (
            <div key={key} className='flex flex-wrap gap-2 mb-4'>
              {value.map((tag: string, idx: number) => (
                <Badge key={idx}>{tag}</Badge>
              ))}
            </div>
          );
        }

        // Links: button-style links
        if (key === 'links' && Array.isArray(value)) {
          return (
            <div key={key} className='flex flex-wrap gap-2 mb-4'>
              {value.map((item: any, idx: number) => (
                <ButtonLink key={idx} href={item.url}>
                  {item.label}
                </ButtonLink>
              ))}
            </div>
          );
        }

        // Overview section: array of {heading, content} or array of strings
        if (
          ['overview', 'about', 'projectOverview'].includes(key) &&
          Array.isArray(value)
        ) {
          // If array of {heading, content}
          if (
            value.length > 0 &&
            typeof value[0] === 'object' &&
            value[0] !== null &&
            'heading' in value[0] &&
            'content' in value[0]
          ) {
            return (
              <div key={key} className='mb-6 space-y-8'>
                <h3 className='text-2xl font-bold text-white mb-4'>
                  Project Overview
                </h3>
                {value.map((item: any, idx: number) => (
                  <div key={idx} className='mb-6'>
                    <h4 className='text-lg font-bold text-white mb-2'>
                      {item.heading}
                    </h4>
                    <p className='text-zinc-300 leading-relaxed w-full'>
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            );
          } else {
            // Array of strings
            return (
              <div key={key} className='mb-6'>
                <h3 className='text-2xl font-bold text-white mb-4'>
                  Project Overview
                </h3>
                <div className='space-y-4'>
                  {value.map((para: string, idx: number) => (
                    <p
                      key={idx}
                      className='text-zinc-300 leading-relaxed w-full'
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            );
          }
        }

        // Stats, Project Goals, Tech Stack, Features, System Architecture, Challenges handled in array logic above
        // Features/System Architecture: full width, vertical bullet list
        if (
          ['features', 'systemArchitecture'].includes(key) &&
          Array.isArray(value)
        ) {
          return (
            <div key={key} className='mb-6'>
              <h3 className='text-2xl font-bold text-white mb-4'>{label}</h3>
              <ul className='space-y-2'>
                {value.map((item: string, idx: number) => (
                  <li
                    key={idx}
                    className='px-4 py-2 rounded transition-colors hover:bg-zinc-800/60 text-zinc-300 list-disc ml-6'
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        // Tech stack: category heading + horizontal badges
        if (
          key === 'techStack' &&
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        ) {
          return (
            <div key={key} className='mb-6'>
              <h3 className='text-2xl font-bold text-white mb-4'>Tech Stack</h3>
              {Object.entries(value).map(([cat, techs]: [string, any], idx) => (
                <div key={cat} className='mb-2'>
                  <div className='text-zinc-400 font-semibold mb-1'>
                    {formatKey(cat)}
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {Array.isArray(techs) &&
                      techs.map((t: string, i: number) => (
                        <Badge key={i}>{t}</Badge>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        // Project Goals: heading + grid handled in array logic
        // Challenges: heading + grid handled in array logic
        // Default: section heading + recursive render
        if (
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        ) {
          return (
            <div key={key} className='space-y-2'>
              <h3 className={`text-2xl font-bold text-white mt-8 mb-2`}>
                {label}
              </h3>
              <DocumentRenderer data={value} level={level + 1} />
            </div>
          );
        }

        // Render arrays and primitives
        return <DocumentRenderer key={key} data={value} level={level + 1} />;
      })}
    </div>
  );
};
