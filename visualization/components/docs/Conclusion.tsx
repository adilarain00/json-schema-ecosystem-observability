'use client';
import React from 'react';

interface ConclusionProps {
  heading: string;
  content: string;
}

export const Conclusion: React.FC<ConclusionProps> = ({ heading, content }) => {
  // Split content into sections by double newlines
  const sections = content.split(/\n\n+/);

  // Helper to render bullet points
  const renderBullets = (text: string) => {
    return text
      .split(/\n/)
      .filter(
        (line) => /^\d+\. |• |AI did/.test(line) || line.startsWith('AI '),
      )
      .map((line, idx) => (
        <li
          key={idx}
          className='text-zinc-400 text-left text-sm md:text-base font-medium mb-2 pl-2'
        >
          {line.replace(/^\d+\.\s|•\s/, '')}
        </li>
      ));
  };

  // Helper to render section headings
  const renderHeading = (text: string) => (
    <h3 className='text-xl md:text-2xl font-black text-white mb-4 mt-8 text-left'>
      {text}
    </h3>
  );

  // Render each section
  return (
    <div className='mt-12 max-w-4xl mx-auto'>
      <h2 className='text-3xl md:text-5xl font-black text-white tracking-tight mb-6 text-center'>
        {heading}
      </h2>
      {sections.map((section, idx) => {
        // Section heading: first line ending with ':'
        const lines = section.split('\n');
        const headingLineIdx = lines.findIndex((l) => l.trim().endsWith(':'));
        let headingLine = null;
        let contentLines = lines;
        if (headingLineIdx !== -1) {
          headingLine = lines[headingLineIdx].replace(':', '').trim();
          contentLines = lines.slice(headingLineIdx + 1);
        }
        // Render heading if found
        return (
          <div key={idx} className='mb-8'>
            {headingLine && renderHeading(headingLine)}
            {/* Render bullet points if present */}
            {renderBullets(contentLines.join('\n')).length > 0 ? (
              <ul className='list-disc list-inside ml-6'>
                {renderBullets(contentLines.join('\n'))}
              </ul>
            ) : (
              <p className='text-zinc-400 text-left text-sm md:text-base font-medium leading-relaxed'>
                {contentLines.join(' ')}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
