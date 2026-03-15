import { ValidatorMetric } from '../types';

export function normalizeMetrics(ajvNpmDownloads: number, githubMetrics: any, bowtieMetrics: { validators: ValidatorMetric[] }) {
  const timestamp = new Date().toISOString().split('T')[0];

  // Aggregate and normalize all metrics into unified data object
  const data = {
    timestamp,
    npmDownloads: {
      ajv: ajvNpmDownloads
    },
    github: githubMetrics,
    bowtie: bowtieMetrics.validators.reduce((acc: Record<string, number>, v: ValidatorMetric) => {
      acc[v.name] = v.compliance;
      return acc;
    }, {})
  };

  return data;
}

export function calculateHealthMetrics(ajvNpmDownloads: number, githubMetrics: any, bowtieMetrics: { validators: ValidatorMetric[] }) {
  const timestamp = new Date().toISOString().split('T')[0];

  // Calculate Health Metrics
  // Health score combines adoption, activity, and quality metrics
  const adoptionScore = Math.min((ajvNpmDownloads / 5000000) * 100, 100); // NPM adoption
  const githubScore = Math.min((githubMetrics.repoCount / 2000) * 100, 100); // GitHub activity
  const bowtieAvg = bowtieMetrics.validators.length > 0
    ? bowtieMetrics.validators.reduce((acc: number, v: ValidatorMetric) => acc + v.compliance, 0) / bowtieMetrics.validators.length
    : 0;
    
  // Weighted sum for ecosystem health
  const healthScore = Math.round(adoptionScore * 0.4 + githubScore * 0.35 + bowtieAvg * 0.25);

  return {
    timestamp,
    healthScore,
    components: {
      adoption: adoptionScore.toFixed(2),
      growth: githubScore.toFixed(2),
      compliance: bowtieAvg.toFixed(2)
    }
  };
}
