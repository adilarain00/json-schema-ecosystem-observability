import { get } from '../utils/apiClient';
import { GithubSearchResponse } from '../types';

/*
  GitHub Collector: Aggregates repository statistics for the JSON Schema topic.
  - Fetches top repositories from GitHub REST API
  - Sums stars and forks for ecosystem activity
  - Scales metrics to approximate total ecosystem values
 */
export const collectGithubMetrics = async () => {
  try {
    const url = `https://api.github.com/search/repositories?q=topic:json-schema&per_page=100`;
    const data = await get<GithubSearchResponse>(url);

    let totalStars = 0;
    let totalForks = 0;

    // Approximate total stars and forks from top 100 repositories + total count scale
    // This is an estimation for the dashboard visualization
    if (data.items && data.items.length > 0) {
      for (const repo of data.items) {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;
      }

      const multiplier = Math.max(1, Math.floor(data.total_count / data.items.length));
      totalStars = totalStars * multiplier;
      totalForks = totalForks * multiplier;
    }

    return {
      repoCount: data.total_count,
      stars: Math.floor(totalStars),
      forks: Math.floor(totalForks)
    };
  } catch (error) {
    console.error('Failed to collect GitHub metrics');
    return {
      repoCount: 0,
      stars: 0,
      forks: 0
    };
  }
};
