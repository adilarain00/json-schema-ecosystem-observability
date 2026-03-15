import { collectNpmMetrics } from '../collectors/npmCollector';
import { collectGithubMetrics } from '../collectors/githubCollector';
import { collectBowtieMetrics } from '../collectors/bowtieCollector';
import { detectAnomalies } from '../utils/alerts';
import { writeJsonFile } from '../storage';
import { normalizeMetrics, calculateHealthMetrics } from '../normalization';

export async function runPipeline() {
  console.log('Starting metrics collection...');

  try {
    // Run all collectors concurrently for efficiency
    const [ajvNpmDownloads, githubMetrics, bowtieMetrics] = await Promise.all([
      collectNpmMetrics('ajv'),
      collectGithubMetrics(),
      collectBowtieMetrics()
    ]);

    const data = normalizeMetrics(ajvNpmDownloads, githubMetrics, bowtieMetrics);

    // Persist metrics to static JSON file for dashboard consumption
    const metricsFile = writeJsonFile('metrics.json', data);
    console.log(`Metrics successfully collected and saved to ${metricsFile}`);

    // Run anomaly detection on latest metrics
    const alerts = detectAnomalies(data);
    if (alerts.length > 0) {
      console.log(`Detected ${alerts.length} ecosystem alerts!`);
    }

    const healthMetrics = calculateHealthMetrics(ajvNpmDownloads, githubMetrics, bowtieMetrics);
    
    const healthFile = writeJsonFile('health-metrics.json', healthMetrics);
    console.log(`Health metrics saved to ${healthFile}`);
  } catch (error) {
    console.error('Failed to collect metrics data:', error);
    process.exit(1);
  }
}
