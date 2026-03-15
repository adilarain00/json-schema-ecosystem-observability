graph TD
NPMDownloads --> Metrics
GithubStats --> Metrics
BowtieScores --> Metrics
Metrics --> HealthScore

# Metrics Model

# Introduction

The metrics model defines the structure, semantics, and aggregation logic for all ecosystem metrics tracked by the observability platform. It provides a unified schema for adoption, growth, and compliance signals, enabling robust analysis and visualization.

# Background

Ecosystem health is multi-dimensional. To capture a holistic view, the platform tracks a range of metrics across adoption, activity, and quality dimensions. The metrics model ensures consistency, comparability, and extensibility as new signals are added.

# Metric Types

| Metric Category | Metric Name        | Description                                    |
| --------------- | ------------------ | ---------------------------------------------- |
| Adoption        | npm_downloads      | Weekly downloads for key packages (NPM)        |
| Growth          | github_repo_count  | Number of GitHub repos tagged `json-schema`    |
| Growth          | github_stars       | Total stars across ecosystem repos             |
| Growth          | github_forks       | Total forks across ecosystem repos             |
| Compliance      | bowtie_score       | Validator compliance % (Bowtie test suite)     |
| Health          | health_score       | Composite score (adoption, growth, compliance) |
| History         | snapshot_timestamp | Timestamp of metrics snapshot                  |

# Data Schema

```
NPMDownloads → Metrics
GithubStats → Metrics
BowtieScores → Metrics
Metrics → HealthScore
```

# Metric Aggregation Logic

- **Normalization**: All raw metrics are normalized to a common scale where possible.
- **Aggregation**: Metrics are aggregated by category (adoption, growth, compliance) and merged into a single data object.
- **Health Score Calculation**: The health score is computed as a weighted sum:

  $health\_score = 0.4 \times adoption + 0.35 \times growth + 0.25 \times compliance$

- **Historical Snapshots**: Each pipeline run produces a timestamped snapshot, enabling time-series analysis and trend visualization.

# Implementation Details

- **Extensible Schema**: The metrics model is designed to accommodate new metrics and categories as the ecosystem evolves.
- **Versioning**: Changes to the schema are versioned for backward compatibility.
- **Validation**: All metrics are validated for completeness and plausibility before aggregation.

# Design Decisions

- **Unified Data Model**: Ensures all metrics are comparable and easily visualized.
- **Weighted Health Score**: Provides a single, actionable signal for ecosystem health.
- **Historical Tracking**: Enables trend analysis and anomaly detection over time.

# Limitations

- **Subjective Weights**: Health score weights are manually tuned and may require adjustment.
- **Data Gaps**: Missing or incomplete data from source APIs may affect metric accuracy.
- **Schema Evolution**: Adding new metrics requires updates to the schema and dashboard logic.

# Summary

The metrics model provides a robust, extensible foundation for ecosystem health analysis. By unifying adoption, growth, and compliance signals, it enables maintainers and contributors to make informed, data-driven decisions.
