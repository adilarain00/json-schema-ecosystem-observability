'use client';

import React from 'react';
import { observabilityCaseStudy } from '../../../docs/caseStudy';
import { Hero } from '../../../components/docs/Hero';
import { Section } from '../../../components/docs/Section';
import { StatsGrid } from '../../../components/docs/StatsGrid';
import { FeatureGrid } from '../../../components/docs/FeatureGrid';
import { TechStack } from '../../../components/docs/TechStack';
import { ArchitectureDiagram } from '../../../components/docs/ArchitectureDiagram';
import { ProblemSolution } from '../../../components/docs/ProblemSolution';
import { InsightGrid } from '../../../components/docs/InsightGrid';
import { Conclusion } from '../../../components/docs/Conclusion';

export default function PoCCaseStudyPage() {
  const data = observabilityCaseStudy;

  return (
    <div className='max-w-5xl mx-auto pb-20 animate-in fade-in duration-1000'>
      {/* Hero */}
      <Hero
        title={data.name}
        description={data.shortDescription}
        tags={data.tags}
        githubUrl={data.github}
        liveDemoUrl={data.liveDemo}
        youtubeUrl={data.youtubeDemo}
      />

      {/* Overview */}
      <Section title='Overview'>
        <div className='space-y-12'>
          {data.overview.map((item, idx) => (
            <div key={idx} className='max-w-5xl'>
              <h3 className='text-xl font-bold text-white mb-4'>
                {item.heading}
              </h3>
              <p className='text-lg text-zinc-400 font-medium leading-relaxed max-w-5xl'>
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <Section title='Platform Vital Stats'>
        <StatsGrid stats={data.stats} />
      </Section>

      {/* Project Goals */}
      <Section
        title='Project Goals'
        description="Defining the core objectives that drive the platform's development and impact."
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {data.projectGoals.map((goal, idx) => (
            <div
              key={idx}
              className='p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-all font-medium text-zinc-300 flex items-start gap-4'
            >
              <div className='mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0' />
              {goal}
            </div>
          ))}
        </div>
      </Section>

      {/* Key Features */}
      <Section title='Key Features'>
        <FeatureGrid features={data.keyFeatures} />
      </Section>

      {/* Tech Stack */}
      <Section title='Tech Stack'>
        <TechStack stack={data.techStack} />
      </Section>

      <Section
        title='System Architecture'
        description={data.systemArchitecture.description}
      >
        <ArchitectureDiagram
          imageSrc='/sysarch.png'
          altText='System Architecture Diagram'
        />
      </Section>

      {/* Challenges & Solutions */}
      <Section
        title='Engineering Challenges'
        description='Solving complex data pipeline and performance bottlenecks.'
      >
        <ProblemSolution challenges={data.challengesAndSolutions} />
      </Section>

      {/* Ecosystem Insights */}
      <Section title='Ecosystem Insights'>
        <InsightGrid items={data.overviewSection.items} />
      </Section>

      {/* Conclusion */}
      <Conclusion
        heading={data.conclusionSection.heading}
        content={data.conclusionSection.content}
      />
    </div>
  );
}
