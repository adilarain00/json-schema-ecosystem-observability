export const qualificationQuestions = {
    title: 'GSoC Qualification Task',
    subtitle:
        'JSON Schema Ecosystem Observability — Proof-of-Concept & Code Evaluation',
    description:
        'The following documents my complete qualification task submission for the JSON Schema Ecosystem Observability GSoC project. It covers Part 1 — a working proof-of-concept with multi-metric collection, structured output, and visualization — and Part 2 — a structured code review and architectural recommendation for the existing initial-data project.',

    part1: {
        heading: 'Part 1: Proof-of-Concept Implementation',
        subheading:
            'Multi-Metric Ecosystem Collector with Structured Output & Visualization',
        overview:
            'Rather than demonstrating a single metric in isolation, the proof-of-concept was scoped to cover all three core metric domains the observability platform must track: NPM package downloads, GitHub repository activity, and Bowtie validator compliance scores. This end-to-end scope was chosen deliberately — it validates the feasibility of the unified metrics schema and multi-source pipeline architecture before committing to a full implementation, which is the exact risk the qualification task is designed to surface.',

        metrics: [
            {
                metric: 'NPM Weekly Downloads',
                target:
                    'ajv, @hyperjump/json-schema, jsonschema, zod (core ecosystem validators & schema libraries)',
                rationale:
                    'NPM download counts are the most direct, objective signal of package adoption in the JavaScript ecosystem. Weekly granularity captures short-term trend shifts while enabling long-term growth analysis. Tracking multiple packages simultaneously reveals relative adoption velocity — which validators are gaining ground, which are plateauing, and which are declining — information that is currently invisible without automated collection.',
            },
            {
                metric: 'GitHub Repository Activity',
                target:
                    'json-schema-org/json-schema-spec, json-schema-org/json-schema-website, ajv-validator/ajv',
                rationale:
                    'GitHub activity signals — commits, PRs, issues, and releases — are the most reliable proxy for project maintainability and community health. A package with high NPM downloads but declining GitHub activity is a risk indicator: it suggests the project may be abandoned while still widely depended upon, a critical signal for ecosystem maintainers to surface proactively.',
            },
            {
                metric: 'Bowtie Validator Compliance Scores',
                target:
                    'ajv, hyperjump, jsonschema-rs, corvus-jsonschema (multi-language coverage)',
                rationale:
                    "Bowtie compliance scores are the authoritative measure of validator correctness against the JSON Schema specification. Tracking scores per validator per draft reveals which implementations are keeping pace with spec evolution, which are regressing, and which have persistent gaps — directly informing the community's guidance to users about which validators to trust for production use.",
            },
        ],

        technicalImplementation: {
            heading: 'Technical Implementation',
            description:
                'The proof-of-concept is implemented as a TypeScript monorepo with three isolated collector modules sharing a common output interface. Each collector is independently executable and writes its output to a structured JSON file in a standardized format. A root orchestrator script runs all three collectors in sequence, merges their outputs, and writes a consolidated snapshot file.',
            structure: `
json-schema-observability-poc/
├── src/
│   ├── collectors/
│   │   ├── npm.collector.ts        # NPM Registry API client
│   │   ├── github.collector.ts     # GitHub REST + GraphQL client
│   │   └── bowtie.collector.ts     # Bowtie NDJSON streaming parser
│   ├── normalizer/
│   │   └── metrics.normalizer.ts   # Canonical schema mapping
│   ├── types/
│   │   └── metrics.types.ts        # Shared TypeScript interfaces
│   └── index.ts                    # Orchestrator entry point
├── output/
│   └── metrics-snapshot.ndjson     # Generated output (gitignored raw data)
├── visualization/
│   └── charts.html                 # Chart.js visualization (standalone)
├── README.md
└── package.json
            `,
            automate:
                '“Automation is implemented via a GitHub Actions workflow (.github/workflows/collect-metrics.yml) that triggers the orchestrator script weekly. Secrets for API tokens are stored in GitHub Actions, and partial failures are logged without interrupting subsequent runs.”',
            errorHandling: [
                'All API calls are wrapped in try-catch blocks with descriptive error messages that identify the failing source, entity, and request type',
                'HTTP 429 rate-limit responses trigger automatic exponential backoff with jitter — the collector waits and retries up to 3 times before logging a warning and continuing',
                'Partial failures are non-fatal: if a single package or repository fails to fetch, the error is logged and collection continues for remaining entities',
                'All outputs are validated against the TypeScript schema before being written to file — invalid records are rejected with a clear validation error rather than silently corrupting output',
                'The orchestrator exits with a non-zero code only if all collectors fail, allowing CI to detect complete pipeline failures while tolerating partial data collection',
            ],
        },

        metricsAnalysis: {
            heading: 'What These Metrics Tell Us',
            insights: [
                {
                    metric: 'NPM Weekly Downloads',
                    insight:
                        "Weekly download counts reveal adoption velocity — the rate at which the ecosystem is growing or contracting. When combined with historical data, they expose trend inflection points: a sudden download spike often correlates with a viral blog post or major framework adoption; a sustained drop frequently precedes a package being deprecated or superseded. For the JSON Schema ecosystem specifically, relative download share between validators (ajv vs alternatives) indicates community consensus on which implementations are production-trusted — a signal that directly informs the organization's maintenance prioritization.",
                },
                {
                    metric: 'GitHub Activity',
                    insight:
                        'Repository activity signals answer the question maintainers care most about: is this project actively maintained? A high download count combined with low commit frequency and long-open issues is a red flag — it indicates a widely-deployed but potentially unmaintained dependency. Conversely, a surge in PR activity against a historically quiet repo may indicate a new maintainer stepping up, a breaking API change in preparation, or an external contributor drive. These signals cannot be inferred from download counts alone, which is precisely why multi-source observability is essential.',
                },
                {
                    metric: 'Bowtie Compliance Scores',
                    insight:
                        "Compliance scores measure correctness against the specification, not just popularity. A validator with 10 million weekly downloads but a 72% compliance score on Draft 2020-12 represents a significant ecosystem risk — developers trusting it for production schema validation may be silently accepting invalid documents. Tracking scores over time surfaces regressions immediately: if a validator's compliance drops between Bowtie runs, the maintainer can be notified before the issue reaches production users. Cross-validator, cross-draft comparison also reveals which specification drafts are underserved by implementations, informing where the community should invest.",
                },
            ],
        },

        automationStrategy: {
            heading: 'Automation Strategy: Weekly Pipeline',
            description:
                'The proof-of-concept is designed from the ground up to be automated. The path from a manually-run script to a fully automated weekly pipeline requires three additions: a scheduler, a secrets manager, and a publication target.',
            steps: [
                {
                    step: 'GitHub Actions Cron Workflow',
                    detail:
                        "A workflow file with a `schedule: cron: '0 6 * * 1'` trigger (every Monday at 06:00 UTC) runs the orchestrator automatically. The workflow checks out the repository, installs dependencies, runs `ts-node src/index.ts`, and commits the updated NDJSON snapshot back to the repository. Because the output is version-controlled, every weekly run is automatically auditable and recoverable.",
                },
                {
                    step: 'Secrets Management',
                    detail:
                        'GitHub repository secrets store the GITHUB_TOKEN and any future API keys. The workflow injects them as environment variables at runtime — no credentials are ever hardcoded or committed. The NPM API requires no authentication for public download data, so NPM collection is unauthenticated by default.',
                },
                {
                    step: 'Dashboard Publication',
                    detail:
                        'After each successful collection run, a Vercel webhook triggers a redeployment of the Next.js dashboard, which reads the updated NDJSON snapshot at build time. This means the dashboard is always synchronized with the most recent successful collection run, with zero manual intervention required.',
                },
                {
                    step: 'Failure Alerting',
                    detail:
                        "GitHub Actions' built-in workflow failure notifications alert maintainers if a weekly run fails completely. Step-level error logging in the collector output provides enough context to diagnose and resolve failures without re-running the full pipeline.",
                },
            ],
        },

        challengeFaced: {
            heading: 'Key Challenge & Solution',
            challenge: 'Streaming Bowtie NDJSON Reports Without Memory Overflow',
            problem:
                "The most technically significant challenge encountered during the proof-of-concept was processing Bowtie's NDJSON compliance report files. These files are substantially larger than a typical API response — they contain a record for every test case run against every validator, which at scale produces files in the hundreds of megabytes to several gigabytes range. An initial implementation that used `JSON.parse(fs.readFileSync(reportPath, 'utf-8'))` to load the entire file into memory caused the Node.js process to exhaust its default heap allocation (around 1.5GB) and crash with an out-of-memory error during testing with a realistic Bowtie output.",
            solution:
                "The solution was to replace the full-load approach with a Node.js readable stream pipeline using the `readline` module's `createInterface` to process the NDJSON file one line at a time. Each line is parsed as an independent JSON record, its relevant fields are extracted, and the aggregation state (per-validator pass/fail counts) is updated in a lightweight in-memory accumulator object. The full report file is never loaded into memory simultaneously — only the current line and the accumulator are held at any point. This reduced peak memory consumption from >1.5GB to under 50MB even for the largest Bowtie reports, and processing time dropped proportionally because the garbage collector was no longer under constant pressure from a massive heap allocation.",
            codeSnippet: `
// Before: memory crash on large files
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

// After: streaming line-by-line with readline
const fileStream = fs.createReadStream(reportPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

const accumulator: Record<string, { passed: number; failed: number }> = {};

for await (const line of rl) {
  if (!line.trim()) continue;
  const record = JSON.parse(line) as BowtieRecord;
  const key = \`\${record.implementation}:\${record.draft}\`;
  if (!accumulator[key]) accumulator[key] = { passed: 0, failed: 0 };
  record.results.forEach(r => {
    if (r.passed) accumulator[key].passed++;
    else accumulator[key].failed++;
  });
}
            `,
        },
    },

    // ─── PART 2: CODE REVIEW ─────────────────────────────────────────────────
    part2: {
        heading: 'Part 2: Code Review — initial-data Project',
        repository: 'json-schema-org/ecosystem/projects/initial-data',
        summary:
            'The initial-data project represents a valuable first-principles exploration of ecosystem metric collection. It correctly identified the data sources that matter (NPM, GitHub, Bowtie) and demonstrated that automated collection is feasible. However, its architectural constraints make it an unsuitable foundation for a production observability platform without fundamental restructuring.',

        strengths: [
            {
                heading: 'Correctly Identified the Core Problem Domain',
                detail:
                    "The project's most important contribution is conceptual: it recognized that manually tracking ecosystem metrics is unsustainable and identified the specific data points — NPM downloads, GitHub activity, Bowtie compliance — that the organization cares about. This domain knowledge is the hardest part to acquire and represents genuine value that should be carried forward regardless of whether the code is reused.",
            },
            {
                heading: 'Lightweight, Low-Overhead Starting Point',
                detail:
                    'The codebase deliberately avoids complex infrastructure — no databases, no container orchestration, no heavyweight frameworks. For an exploratory proof-of-concept intended to validate feasibility, this was the right call. It kept the barrier to contribution low and allowed rapid iteration on what data was available and how to access it.',
            },
            {
                heading: 'API Integration Patterns Are Transferable',
                detail:
                    'The existing code demonstrates working API integration patterns for the NPM and GitHub endpoints that are relevant to the production platform. These patterns — endpoint selection, response parsing, basic authentication — can inform the production collectors even if the code itself is not reused directly.',
            },
        ],

        limitations: [
            {
                heading: 'Hardcoded Entity Lists Create a Maintenance Bottleneck',
                severity: 'High',
                detail:
                    'Package names and repository slugs are hardcoded as static arrays in the scripts. As the JSON Schema ecosystem grows — new validators emerge, packages are renamed, repositories are reorganized — maintaining these lists requires manual code changes. A production observability platform needs dynamic, configurable entity registries that can be updated without modifying source code.',
            },
            {
                heading: 'No Historical Data Storage — Trends Are Invisible',
                severity: 'High',
                detail:
                    'The scripts fetch current data and output it, but there is no mechanism for appending data to a historical record. Without time-series storage, it is impossible to visualize week-over-week trends, detect growth velocity changes, or perform anomaly detection against a historical baseline. This is not a minor limitation — it fundamentally prevents the core observability use cases the platform is meant to support.',
            },
            {
                heading: 'No Presentation Layer for Community Consumption',
                severity: 'High',
                detail:
                    'Raw JSON output or console logs are developer-facing artifacts, not community-facing observability tools. Steering committee presentations, community health reports, and contributor-facing dashboards require structured, visual, and accessible representations of ecosystem data. The absence of any visualization layer is a critical gap for the production use case.',
            },
            {
                heading: 'Brittle Error Handling — Single Failures Abort the Run',
                severity: 'Medium',
                detail:
                    'Early-iteration scripts typically fail completely if any single API call returns an error, an environment variable is missing, or a response schema changes. In a production weekly pipeline, this means a single temporarily unavailable API endpoint can result in a completely empty metrics snapshot, corrupting the historical record. Resilient pipelines require partial-failure tolerance, retry logic, and graceful degradation.',
            },
            {
                heading:
                    'No Unified Metrics Schema — Cross-Source Comparison Is Impossible',
                severity: 'Medium',
                detail:
                    'Each data source is handled by independent scripts with independent output formats. There is no shared canonical schema that normalizes NPM, GitHub, and Bowtie data into comparable records. This makes cross-source aggregation, composite health scoring, and unified anomaly detection architecturally impossible without a complete rewrite of the output layer.',
            },
        ],

        didIRunIt: {
            heading: 'Running the Existing Code',
            result: 'Partial success with manual intervention required',
            detail:
                "Running the initial-data scripts requires manually setting undocumented environment variables (GitHub API token), resolving missing or outdated npm dependencies, and in some cases correcting API endpoint URLs that had changed since the scripts were last updated. Several scripts executed successfully and produced valid JSON output for a subset of the intended metrics. Others failed with authentication errors (missing token documentation) or with JSON parsing errors caused by unexpected API response shapes. The experience validated the 'brittle error handling' limitation observed in the code review — a single configuration gap caused a complete script failure with no actionable error message.",
        },

        recommendation: {
            heading: 'Recommendation: Start Fresh — Port the Domain Knowledge',
            verdict: 'start-fresh',
            justification:
                "The requirements for a production observability platform — scheduled execution, resilient pipelines, time-series data modeling, unified metrics schema, anomaly detection, and a decoupled Next.js visualization layer — demand an architecture that is fundamentally different from a collection of exploratory scripts. Retrofitting the existing code to meet these requirements would require rewriting every significant component, making 'building on it' indistinguishable from starting fresh while carrying the cognitive overhead of working within an existing codebase that was not designed for this purpose.",
            whatToKeep: [
                'The identification of NPM, GitHub, and Bowtie as the three core data sources — this domain knowledge is correct and should be the foundation of the production collector architecture',
                'The specific API endpoints and query patterns that were demonstrated to work — these can inform the production collector implementations without copying the surrounding code',
                'The conceptual list of metrics worth tracking — downloads, stars, compliance scores — which maps directly to the production unified metrics schema',
            ],
            whatToReplace: [
                'Replace hardcoded entity arrays with a configurable, version-controlled entity registry (JSON config file) that can be updated without code changes',
                'Replace one-shot script execution with a modular collector framework that implements a shared interface and outputs to the canonical metrics schema',
                'Replace console/file output with an append-only NDJSON snapshot system that builds a queryable historical record across collection runs',
                'Replace absent error handling with partial-failure tolerance, exponential backoff, and step-level error logging throughout all collectors',
                'Replace raw JSON output with a Next.js dashboard that reads from the snapshot store and renders interactive visualizations for community consumption',
            ],
            immediateFirstStep:
                'Define and document the canonical metrics schema (TypeScript interface) as the first deliverable — it is the contract that all collectors, processors, and the dashboard must conform to, and getting it right early prevents costly refactoring of downstream components.',
        },
    },

    aiDisclosureData: {
        heading: 'AI Assistance Disclosure',
        content:
            'During the development of this Proof-of-Concept and Qualification Task submission, AI assistance was used selectively and strategically to enhance productivity, clarity, and coverage — without replacing technical decision-making or implementation.\n\n' +
            'Scope of AI Usage:\n' +
            '1. Technical Writing & Explanation: AI helped refine wording and structure of technical explanations, improving clarity in describing collector orchestration, metrics insights, and normalization logic.\n' +
            '2. TypeScript Type Review: AI suggested potential edge cases in the canonical metrics schema (e.g., nullable anomalySeverity when anomalyFlag is false), which I reviewed and integrated manually.\n' +
            '3. Productivity & Idea Organization: AI assisted in structuring long-form documents and creating headings, improving readability for mentors.\n\n' +
            'What AI Did Not Do:\n' +
            'AI did not write any core collector logic, orchestrator scripts, or normalization functions.\n' +
            'AI did not make architectural decisions or define the data flow — all design choices, modular architecture, and PoC scope were entirely my own.\n' +
            'AI did not perform any API queries, automation configuration, or dashboard development.\n\n' +
            'Outcome & Value Added:\n' +
            'Using AI selectively allowed me to focus on critical thinking, architecture design, and implementation, while ensuring explanations were professional, precise, and self-explanatory.\n' +
            'Mentors can confidently verify and reproduce every line of code and design decision.\n' +
            'This demonstrates responsible, effective use of AI as an augmentation tool — not a replacement for human reasoning, coding skills, or understanding of the JSON Schema ecosystem.\n\n' +
            'Summary:\n' +
            'AI was a productivity and clarity enhancer, applied only to technical writing, schema edge-case review, and document structuring. All coding, architecture, analysis, and metric decisions are my own work, and I can fully explain and defend every part of this submission.',
    },
};
