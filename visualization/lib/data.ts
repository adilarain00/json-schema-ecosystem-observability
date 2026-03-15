import fs from 'fs';
import path from 'path';

export interface BowtieValidator {
  name: string;
  language: string;
  compliance: number;
  passedTests: number;
  failedTests: number;
  category: string;
}

export interface BowtieMetrics {
  validators: BowtieValidator[];
}

export interface Alert {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface MetricsData {
  timestamp: string;
  npmDownloads: {
    ajv: number;
    [key: string]: number;
  };
  github: {
    repoCount: number;
    stars: number;
    forks: number;
  };
  bowtie: Record<string, number>;
}

/*
  Dashboard Data Layer: Loads metrics from static JSON file for visualization.
  - Reads metrics.json produced by pipeline
  - Provides fallback mock data for development
*/
export function getMetrics(): MetricsData {
  try {
    const filePath = path.join(process.cwd(), '..', 'data', 'metrics.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileData) as MetricsData;
    }
  } catch (error) {
    console.warn("Could not read real metrics, falling back to mock data:", error);
  }

  // Fallback / Mock Data if `npm run collect-metrics` hasn't been run
  return {
    timestamp: new Date().toISOString().split('T')[0],
    npmDownloads: {
      ajv: 4256780
    },
    github: {
      repoCount: 12480,
      stars: 550000,
      forks: 72000
    },
    bowtie: {
      'ajv': 98,
      'python-jsonschema': 95,
      'jsonschema-rs': 97
    }
  };
}

export function getBowtieMetrics(): BowtieMetrics {
  try {
    const filePath = path.join(process.cwd(), '..', 'data', 'bowtie-metrics.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileData) as BowtieMetrics;
    }
  } catch (error) {
    console.warn("Could not read real bowtie metrics:", error);
  }

  return {
    validators: [
      { name: 'ajv', language: 'JavaScript', compliance: 98, passedTests: 980, failedTests: 20, category: 'perfect' },
      { name: 'python-jsonschema', language: 'Python', compliance: 95, passedTests: 950, failedTests: 50, category: 'perfect' }
    ]
  };
}

export function getAlerts(): Alert[] {
  try {
    const filePath = path.join(process.cwd(), '..', 'data', 'alerts.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(fileData);
      return (parsed.alerts || []) as Alert[];
    }
  } catch (error) {
    console.warn("Could not read alerts:", error);
  }
  return [];
}
