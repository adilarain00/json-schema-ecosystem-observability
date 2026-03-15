import { get } from '../utils/apiClient';
import { NpmDownloadResponse } from '../types';

/*
  NPM Collector: Fetches weekly download counts for a package from NPM Registry API.
  - Used for adoption scoring in ecosystem health metrics
 */
export const collectNpmMetrics = async (packageName: string): Promise<number> => {
  try {
    const url = `https://api.npmjs.org/downloads/point/last-week/${packageName}`;
    const data = await get<NpmDownloadResponse>(url);
    return data.downloads;
  } catch (error) {
    console.error(`Failed to collect NPM metrics for ${packageName}`);
    return 0;
  }
};
