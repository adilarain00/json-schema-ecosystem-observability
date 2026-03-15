// This is a mock repo list for demonstration. Replace with real data fetching in production.
export const mockRepos = Array.from({ length: 1000 }).map((_, i) => ({
    name: `json-schema-repo-${i + 1}`,
    description: `A sample JSON Schema related repository number ${i + 1}.` + (i % 3 === 0 ? ' This repo is very popular.' : ''),
    stars: Math.floor(Math.random() * 10000),
    forks: Math.floor(Math.random() * 2000),
    language: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Java', 'Go', 'PHP'][i % 7],
    url: `https://github.com/json-schema-org/json-schema-repo-${i + 1}`,
}));
