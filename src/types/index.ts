export interface ImplementationMeta {
  name: string;
  language: string;
  version?: string;
}

export interface ValidatorMetric {
  name: string;
  language: string;
  compliance: number;
  passedTests: number;
  failedTests: number;
  category: 'perfect' | 'high' | 'needs-improvement';
}

export interface GithubSearchResponse {
  total_count: number;
  items: any[];
}

export interface NpmDownloadResponse {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

export interface Alert {
  type: 'npm-drop' | 'compliance-drop' | 'growth-stagnation';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface UnifiedData {
  timestamp: string;
  npmDownloads: {
    ajv: number;
  };
  github: {
    repoCount: number;
    stars: number;
    forks: number;
  };
  bowtie: Record<string, number>;
}
