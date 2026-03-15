/* eslint-disable @typescript-eslint/no-unused-vars */
import { getMetrics, getBowtieMetrics, getAlerts } from './data';

export async function fetchNpmDownloads(pkg: string, range: string = 'last-month') {
  try {
    const res = await fetch(`https://api.npmjs.org/downloads/range/${range}/${pkg}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('NPM API failed');
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch NPM downloads for ${pkg}`, error);
    return null;
  }
}

export async function fetchMultipleNpmDownloads(packages: string[], range: string = 'last-month') {
  const promises = packages.map(pkg => fetchNpmDownloads(pkg, range));
  const results = await Promise.all(promises);
  return results.filter(Boolean);
}


export async function fetchGithubRepos(query: string = 'topic:json-schema', perPage = 100, pages = 10) {
  try {
    const allRepos = [];
    let totalCount = 0;

    // Attempt to fetch first page
    const firstPageUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}&page=1`;
    const res = await fetch(firstPageUrl, { next: { revalidate: 86400 } }); // Cache for 1 day to heavily avoid rate limit
    if (!res.ok) {
      console.warn('GitHub API failed on first page', await res.text());
      return { total_count: 0, items: [] };
    }

    const data = await res.json();
    totalCount = data.total_count;
    allRepos.push(...(data.items || []));

    // Fetch remaining pages (up to 10 pages total for 1000 limit)
    const limit = Math.min(pages, Math.ceil(totalCount / perPage), 10);
    const requests = [];
    for (let page = 2; page <= limit; page++) {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
      // In a real app we'd pause, but here Next.js cache can help
      requests.push(fetch(url, { next: { revalidate: 86400 } }).then(r => r.ok ? r.json() : { items: [] }));
    }

    const results = await Promise.all(requests);
    results.forEach(res => {
      if (res.items) {
        allRepos.push(...res.items);
      }
    });

    return {
      total_count: totalCount,
      items: allRepos
    };
  } catch (error) {
    console.error('Failed to fetch GitHub repos', error);
    return { total_count: 0, items: [] };
  }
}

export async function fetchBowtieData() {
  try {
    // Attempting to fetch from a fictional Bowtie API endpoint
    // as Bowtie doesn't have a stable public JSON API yet.
    const res = await fetch('https://bowtie.report/api/compliance.json', { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Bowtie endpoint unavailable');
    const data = await res.json();
    return data.validators;
  } catch (error) {
    console.warn('Bowtie API failed, falling back to local dataset');
    const localData = getBowtieMetrics();
    return localData.validators;
  }
}

export async function fetchAlerts() {
  try {
    // Simulated API fetch
    return getAlerts();
  } catch (error) {
    return [];
  }
}
