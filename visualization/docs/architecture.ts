export const architectureOverview = {
    title: 'System Architecture',
    subtitle:
        'A layered, modular pipeline architecture that cleanly separates data collection, normalization, anomaly detection, and visualization — designed for extensibility, reproducibility, and production reliability.',
    layers: [
        {
            number: '01',
            heading: 'Data Source Layer',
            icon: 'Database',
            color: 'blue',
            description:
                'The platform draws from three authoritative external sources, each exposing a distinct dimension of ecosystem health. The NPM Registry API delivers weekly package download counts and version metadata for all tracked JSON Schema packages, forming the adoption signal layer. The GitHub REST and GraphQL APIs expose repository-level activity: commits, pull requests, issues, releases, stars, and forks across all ecosystem projects. Bowtie NDJSON compliance reports supply per-validator, per-draft test-case results for the full JSON Schema specification suite. Together, these three sources cover the complete observable surface of the ecosystem.',
            signals: [
                'NPM: Weekly download counts, package version history, registry metadata',
                'GitHub: Commit frequency, PR volume, issue cadence, star/fork growth, CI run status',
                'Bowtie: Per-test-case pass/fail results, per-validator compliance scores, per-draft coverage',
            ],
        },
        {
            number: '02',
            heading: 'Collector Layer',
            icon: 'Download',
            color: 'indigo',
            description:
                "Three dedicated, isolated collectors — the NPM Collector, GitHub Collector, and Bowtie Parser — each implement as a TypeScript module and receive their trigger directly from the Automation Pipeline (layer 6). This separation ensures that a change in one source's API contract only requires modifying that collector, leaving the rest of the pipeline untouched. The NPM Collector handles authenticated bulk download queries with pagination and request batching. The GitHub Collector orchestrates REST and GraphQL queries, applying exponential backoff with jitter on 429 responses and splitting queries that exceed GraphQL complexity limits. The Bowtie Parser implements a streaming NDJSON reader built on Node.js readable streams, processing compliance reports line by line to avoid loading multi-gigabyte files into memory.",
            components: [
                {
                    name: 'NPM Collector',
                    responsibility:
                        'Fetches weekly downloads per package, handles pagination, applies authenticated rate-limit strategies',
                },
                {
                    name: 'GitHub Collector',
                    responsibility:
                        'Queries REST + GraphQL APIs, batches multi-repo requests, manages complexity throttling and exponential backoff',
                },
                {
                    name: 'Bowtie Parser',
                    responsibility:
                        'Streams large NDJSON compliance reports incrementally, aggregates per-validator results without memory overhead',
                },
            ],
        },
        {
            number: '03',
            heading: 'Metrics Processing Layer',
            icon: 'Cpu',
            color: 'violet',
            description:
                "Raw API responses from all three collectors flow into a two-stage processing layer. The first stage, the Unified Metrics Normalizer, maps each source's heterogeneous data format into a single canonical metrics schema. This schema defines standardized fields for metric name, source identifier, entity key, collection timestamp, raw value, computed growth rate, normalized health score, and anomaly flags. Acting as an anti-corruption layer, the normalizer shields all downstream logic from upstream API changes. The second stage, the Metrics Aggregator, merges normalized signals from all sources, constructs historical snapshot records per entity, and computes ecosystem-wide aggregate scores that summarize overall health in a single comparable index.",
            schema: {
                heading: 'Canonical Metrics Schema',
                fields: [
                    {
                        field: 'source',
                        type: 'string',
                        description: "Data origin: 'npm' | 'github' | 'bowtie'",
                    },
                    {
                        field: 'entity',
                        type: 'string',
                        description: 'Package name, repo slug, or validator identifier',
                    },
                    {
                        field: 'metric',
                        type: 'string',
                        description:
                            "Metric type: 'downloads' | 'stars' | 'compliance_score' | ...",
                    },
                    {
                        field: 'timestamp',
                        type: 'ISO 8601',
                        description: 'Collection run timestamp for time-series querying',
                    },
                    {
                        field: 'rawValue',
                        type: 'number',
                        description: 'Unprocessed value from the source API',
                    },
                    {
                        field: 'normalizedScore',
                        type: 'number (0–100)',
                        description:
                            'Percentile-normalized health score for cross-source comparison',
                    },
                    {
                        field: 'growthRate',
                        type: 'number (%)',
                        description: 'Week-over-week percentage change for trend analysis',
                    },
                    {
                        field: 'anomalyFlag',
                        type: 'boolean',
                        description:
                            'Set by anomaly engine when value exceeds baseline threshold',
                    },
                    {
                        field: 'anomalySeverity',
                        type: "'low' | 'medium' | 'high'",
                        description:
                            'Alert severity classification for dashboard prioritization',
                    },
                ],
            },
        },
        {
            number: '04',
            heading: 'Observability & Anomaly Detection Engine',
            icon: 'AlertTriangle',
            color: 'amber',
            description:
                'The observability and anomaly engine sits between the metrics processing layer and storage, transforming normalized metrics into actionable signals before they are persisted. Rather than applying static absolute thresholds, the engine maintains a rolling historical baseline for each tracked entity derived from the previous N collection runs. Anomalies fire when a metric deviates from its own entity-specific baseline by more than a configurable multiplier, making detection self-calibrating and context-aware. The Anomaly Detection Engine runs three specialized profiles in parallel: the NPM profile monitors download velocity for sudden drops or spikes, the GitHub profile applies dormancy detection for repositories with sustained inactivity, and the Bowtie profile tracks compliance score regression between successive runs. Flagged anomalies pass to the Ecosystem Health Scorer, which computes a composite health index per entity, assigns per-entity trend scores, and classifies alert severity before writing results to storage.',
            detectionProfiles: [
                {
                    source: 'NPM',
                    strategy:
                        'Velocity deviation — flags download growth rate changes exceeding ±2σ from entity rolling baseline',
                },
                {
                    source: 'GitHub',
                    strategy:
                        'Dormancy detection — flags repos with zero commits or merged PRs beyond configurable inactivity window',
                },
                {
                    source: 'Bowtie',
                    strategy:
                        'Regression detection — flags validators with compliance score drops exceeding threshold between successive runs',
                },
            ],
        },
        {
            number: '05',
            heading: 'Storage Layer',
            icon: 'HardDrive',
            color: 'emerald',
            description:
                'All processed metrics, health scores, and anomaly flags are persisted as timestamped NDJSON snapshot files, one file per collection run. This append-only, file-based approach requires no database infrastructure, is trivially version-controllable in Git, and produces a fully auditable, reproducible record of every metric ever collected. Each snapshot contains the complete set of normalized entity records for that run. The dashboard reconstructs time-series data by reading and merging any contiguous window of snapshot files. The newline-delimited JSON format is streamable, grep-able, and compatible with standard Unix tooling for ad hoc querying and debugging.',
            format: {
                example: `{ "source": "npm", "entity": "ajv", "metric": "weekly_downloads", "timestamp": "2025-06-01T00:00:00Z", "rawValue": 8420000, "normalizedScore": 94.2, "growthRate": 3.1, "anomalyFlag": false, "anomalySeverity": null }
{ "source": "github", "entity": "json-schema-org/json-schema-spec", "metric": "commit_count_7d", "timestamp": "2025-06-01T00:00:00Z", "rawValue": 12, "normalizedScore": 71.5, "growthRate": -8.3, "anomalyFlag": false, "anomalySeverity": null }
{ "source": "bowtie", "entity": "ajv", "metric": "compliance_score_draft2020", "timestamp": "2025-06-01T00:00:00Z", "rawValue": 98.4, "normalizedScore": 98.4, "growthRate": 0.2, "anomalyFlag": false, "anomalySeverity": null }`,
            },
        },
        {
            number: '06',
            heading: 'Automation Pipeline (GitHub Actions)',
            icon: 'GitBranch',
            color: 'sky',
            description:
                'The Automation Pipeline is the orchestration layer that sits above the Data Source Layer and directly triggers all three collectors. A weekly scheduled GitHub Actions workflow fires this pipeline, invoking the NPM Collector, GitHub Collector, and Bowtie Parser in sequence. It manages environment secrets (GitHub and NPM API tokens), handles errors and retries at the step level, runs the metrics processing and anomaly detection stages, and commits the updated NDJSON snapshot to the repository so the Next.js dashboard picks up fresh data on its next build. The pipeline is fully stateless: every run is self-contained and reproducible with no dependency on previous run state. If a single weekly run fails partially, the historical snapshot archive stays consistent and the dashboard always serves the most recent successfully collected data.',
            workflowSteps: [
                'Trigger on weekly cron schedule (configurable) or manual workflow_dispatch',
                'Checkout repository and install Node.js dependencies',
                'Load API secrets (GITHUB_TOKEN, NPM_TOKEN) from GitHub repository secrets',
                'Execute NPM Collector → validate output → write NDJSON snapshot segment',
                'Execute GitHub Collector → validate output → write NDJSON snapshot segment',
                'Execute Bowtie Parser → validate output → write NDJSON snapshot segment',
                'Run Metrics Aggregator → merge all segments → compute ecosystem health scores',
                'Run Anomaly Detection Engine → flag anomalies → classify alert severity',
                'Commit updated snapshot file and metrics summary to repository',
                'Trigger Next.js dashboard redeployment via Vercel webhook',
            ],
        },
        {
            number: '07',
            heading: 'Dashboard Visualization Layer',
            icon: 'Monitor',
            color: 'rose',
            description:
                'The Next.js dashboard is the user-facing surface of the platform. It reads directly from the NDJSON snapshot files produced by the Storage Layer and renders four visualization components: Interactive Trend Charts, Ecosystem Health Cards, a Compliance Matrix Heatmap, and an Anomaly and Alert Panel. Built with React, TypeScript, Tailwind CSS, and Recharts, the dashboard uses build-time static generation with incremental static regeneration for freshness. Interactive trend charts display time-series data for NPM downloads, GitHub activity, and Bowtie compliance scores with configurable time windows. The compliance matrix heatmap renders a validator × draft grid with color-coded health scores, making cross-validator spec compliance immediately comparable. The anomaly and alert panel surfaces severity-ranked alerts with entity context and recommended actions. Health cards present composite scores per tracked entity with trend indicators showing week-over-week direction.',
            components: [
                {
                    name: 'Trend Charts',
                    tech: 'Recharts LineChart / BarChart',
                    description:
                        'Time-series visualization for NPM downloads, GitHub activity, and Bowtie scores with interactive tooltips and configurable time windows',
                },
                {
                    name: 'Compliance Matrix',
                    tech: 'Recharts custom grid + Tailwind',
                    description:
                        'Validator × Draft heatmap with color-coded health scores (green to red scale) and regression indicators for at-a-glance cross-validator benchmarking',
                },
                {
                    name: 'Anomaly Alert Panel',
                    tech: 'React + Tailwind',
                    description:
                        'Severity-ranked alert list with entity context, metric value, baseline deviation, and timestamp — prioritized by impact for maintainer triage',
                },
                {
                    name: 'Health Score Cards',
                    tech: 'React + Recharts SparklineChart',
                    description:
                        'Per-entity composite health scores with 7-day sparklines and week-over-week trend arrows — summarizing ecosystem status at a glance',
                },
            ],
        },
    ],
    dataFlow: {
        heading: 'End-to-End Data Flow',
        steps: [
            {
                step: 1,
                label: 'Fetch',
                description:
                    'Collectors query NPM, GitHub, and Bowtie APIs with authentication and rate-limit management, triggered by the GitHub Actions pipeline',
            },
            {
                step: 2,
                label: 'Normalize',
                description:
                    'Raw API responses are mapped into the canonical unified metrics schema by source-specific normalizers',
            },
            {
                step: 3,
                label: 'Aggregate',
                description:
                    'Normalized records are merged across sources and historical snapshots are constructed per entity',
            },
            {
                step: 4,
                label: 'Detect',
                description:
                    'The Anomaly Detection Engine compares current values against rolling baselines; the Ecosystem Health Scorer classifies deviations by severity',
            },
            {
                step: 5,
                label: 'Persist',
                description:
                    'The complete metrics snapshot is written to a timestamped NDJSON file in the repository',
            },
            {
                step: 6,
                label: 'Visualize',
                description:
                    'The Next.js dashboard reads snapshots directly from the Storage Layer and renders interactive trend charts, compliance matrices, health cards, and alert panels',
            },
        ],
    },
    designPrinciples: [
        {
            principle: 'Modularity',
            description:
                'Each collector, processor, and detection profile is an independently maintainable module — changes to one component never cascade into others.',
        },
        {
            principle: 'Reproducibility',
            description:
                'Stateless pipelines and append-only NDJSON snapshots ensure every collection run is fully reproducible and auditable.',
        },
        {
            principle: 'Extensibility',
            description:
                'Adding a new data source requires only implementing a new collector that outputs to the canonical schema — zero changes to processing or visualization layers.',
        },
        {
            principle: 'Resilience',
            description:
                'Exponential backoff, step-level error handling in CI, and streaming parsers ensure the pipeline degrades gracefully under API failures or data anomalies.',
        },
    ],
};
