import { Alert } from '../types';
import { readJsonFile, writeJsonFile } from '../storage';

export const detectAnomalies = (current: any): Alert[] => {
  let history: any[] = readJsonFile('history.json') || [];

  const alerts: Alert[] = [];

  // Check last snapshot
  if (history.length > 0) {
    const previous = history[history.length - 1];

    // 1. npm download drop (> 15%)
    const prevNpm = previous.npmDownloads.ajv || 0;
    const currNpm = current.npmDownloads.ajv || 0;
    if (prevNpm > 0) {
      const drop = (prevNpm - currNpm) / prevNpm;
      if (drop > 0.15) {
        alerts.push({
          type: 'npm-drop',
          message: `AJV downloads dropped ${(drop * 100).toFixed(1)}% compared to previous run`,
          severity: 'high'
        });
      }
    }

    // 2. validator compliance drop (< 90%)
    // Major validators check
    const majorValidators = ['ajv', 'jsonschema', 'python-jsonschema'];
    Object.entries(current.bowtie || {}).forEach(([name, compliance]) => {
      const compValue = compliance as number;
      if (majorValidators.some(v => name.toLowerCase().includes(v)) && compValue < 90) {
        alerts.push({
          type: 'compliance-drop',
          message: `Major validator ${name} compliance dropped to ${compValue}%`,
          severity: 'medium'
        });
      }
    });

    // 3. repository growth slowdown (stagnation for 2 samples)
    if (history.length >= 2) {
      const previous2 = history[history.length - 2];
      const growth1 = previous.github.repoCount - previous2.github.repoCount;
      const growth2 = current.github.repoCount - previous.github.repoCount;

      if (growth1 <= 0 && growth2 <= 0) {
        alerts.push({
          type: 'growth-stagnation',
          message: `Repository growth has stagnated over the last two periods at ${current.github.repoCount} repos`,
          severity: 'low'
        });
      }
    }
  } else {
    // No history yet - provide a welcome alert or check absolute thresholds
    // Check absolute compliance for major validators even on first run
    Object.entries(current.bowtie || {}).forEach(([name, compliance]) => {
      const compValue = compliance as number;
      if (compValue < 80) {
        alerts.push({
          type: 'compliance-drop',
          message: `Validator ${name} has very low compliance: ${compValue}%`,
          severity: 'medium'
        });
      }
    });
  }

  // Persist history (keep last 10 runs)
  history.push(current);
  if (history.length > 10) history = history.slice(-10);

  writeJsonFile('history.json', history);
  writeJsonFile('alerts.json', { alerts });

  return alerts;
};
