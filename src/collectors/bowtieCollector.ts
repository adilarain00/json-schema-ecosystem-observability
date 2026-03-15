import axios from 'axios';
import readline from 'readline';
import { ImplementationMeta, ValidatorMetric } from '../types';
import { writeJsonFile } from '../storage';

const IMPLEMENTATIONS_URL = 'https://bowtie.report/implementations.json';
const DRAFT_2020_12_URL = 'https://bowtie.report/draft2020-12.json';

/*
  Bowtie Collector: Fetches validator compliance scores from Bowtie test suite results.
  - Downloads implementation metadata and test results
  - Parses streamed JSON lines for each validator
  - Calculates passed/failed test counts for compliance scoring
 */
export const collectBowtieMetrics = async (): Promise<{ validators: ValidatorMetric[] }> => {
  console.log('Fetching Bowtie implementations metadata...');
  const implementationsResponse = await axios.get<Record<string, ImplementationMeta>>(IMPLEMENTATIONS_URL);
  const implementationsMeta = implementationsResponse.data;

  console.log('Fetching Bowtie results for Draft 2020-12...');
  const response = await axios.get(DRAFT_2020_12_URL, { responseType: 'stream' });

  const rl = readline.createInterface({
    input: response.data,
    terminal: false
  });

  // Track test pass/fail counts for each validator
  const stats: Record<string, { passed: number; failed: number }> = {};

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line);
      // Implementation result line: contains test results for a validator
      if (data.implementation && data.results && data.expected) {
        const id = data.implementation;
        if (!stats[id]) {
          stats[id] = { passed: 0, failed: 0 };
        }

        const results: any[] = data.results;
        const expected: boolean[] = data.expected;

        results.forEach((res, index) => {
          if (res.valid === expected[index]) {
            stats[id].passed++;
          } else if (res.valid !== undefined && res.valid !== expected[index]) {
            stats[id].failed++;
          } else if (res.error || res.skipped) {
            stats[id].failed++;
          }
        });
      }
    } catch (e) {
      // Skip lines that aren't valid JSON (like potential header metadata that might be malformed or different)
    }
  }

  const validators: ValidatorMetric[] = Object.entries(stats).map(([id, stat]) => {
    const meta = implementationsMeta[id] || { name: id, language: 'unknown' };
    const total = stat.passed + stat.failed;
    const compliance = total > 0 ? parseFloat(((stat.passed / total) * 100).toFixed(2)) : 0;

    let category: 'perfect' | 'high' | 'needs-improvement' = 'needs-improvement';
    if (compliance >= 95) {
      category = 'perfect';
    } else if (compliance >= 85) {
      category = 'high';
    }

    return {
      name: meta.name,
      language: meta.language,
      compliance,
      passedTests: stat.passed,
      failedTests: stat.failed,
      category
    };
  });

  // Sort by compliance descending
  validators.sort((a, b) => b.compliance - a.compliance);

  const result = { validators };

  // Save to bowtie-metrics.json
  const outputFile = writeJsonFile('bowtie-metrics.json', result);
  console.log(`Bowtie metrics saved to ${outputFile}`);

  return result;
};
