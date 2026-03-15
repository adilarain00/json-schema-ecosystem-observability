# Collectors

# Introduction

Collectors are the foundation of the observability platform’s data acquisition layer. Each collector is a purpose-built Node.js module that interfaces with a specific data source, transforming raw ecosystem signals into structured metrics for downstream processing.

# Background

The JSON Schema ecosystem is distributed across many platforms and languages. To provide a holistic view, the platform must aggregate data from multiple sources, each with its own API, data model, and reliability characteristics. The collector architecture was designed to be modular, resilient, and extensible.

# Architecture

The collector subsystem consists of three primary collectors:

1. **NPM Collector**: Gathers download statistics for key JSON Schema packages from the NPM Registry API.
2. **GitHub Collector**: Aggregates repository statistics (count, stars, forks, issues) for projects tagged with `json-schema` using the GitHub REST API.
3. **Bowtie Collector**: Measures compliance of JSON Schema validators against the official Bowtie test suite, parsing results for each supported language.

## Collector Architecture Diagram

```
APIs (NPM, GitHub, Bowtie) → [Collectors] → Aggregator → metrics.json
```

# Implementation Details

## NPM Collector

- **API Endpoint**: Uses the NPM Registry API to fetch download counts for a curated list of packages.
- **Rate Limiting**: Implements request throttling to avoid exceeding NPM’s public API rate limits.
- **Data Normalization**: Converts raw download counts into a consistent format for aggregation.
- **Error Handling**: Retries failed requests with exponential backoff; logs errors for auditability.

## GitHub Collector

- **API Endpoint**: Uses the GitHub REST API to search for repositories tagged with `json-schema` and to fetch repository statistics (stars, forks, issues, contributors).
- **Authentication**: Uses a GitHub token for authenticated requests, increasing rate limits and reliability.
- **Pagination**: Handles paginated responses to aggregate data across many repositories.
- **Rate Limiting**: Monitors remaining API quota and adapts request frequency.
- **Error Handling**: Retries on transient errors; logs and surfaces persistent failures.

## Bowtie Collector

- **Data Source**: Downloads or receives Bowtie test suite results for each validator implementation.
- **Parsing**: Extracts compliance scores and failure details for each validator and draft version.
- **Normalization**: Maps results to a common schema for cross-language comparison.
- **Error Handling**: Validates input data and flags incomplete or malformed results.

# Data Flow

```
NPM API → NPM Collector
GitHub API → GitHub Collector
Bowtie Results → Bowtie Collector
All → Aggregator → metrics.json
```

# Design Decisions

- **Modularization**: Each collector is a standalone module, making it easy to add, remove, or update collectors as the ecosystem evolves.
- **Resilience**: Collectors are designed to handle API failures gracefully, with retries and error logging.
- **Extensibility**: New collectors can be added with minimal changes to the pipeline core.
- **Security**: API tokens are managed securely and never hardcoded.

# Limitations

- **API Rate Limits**: All collectors are subject to third-party API rate limits, which may delay data collection during high-traffic periods.
- **Data Source Reliability**: If a source API is down or returns incomplete data, the collector will log the error and continue, but some metrics may be missing for that run.
- **Schema Evolution**: Adding new metrics or changing data formats requires updates to both the collector and the aggregator.

# Summary

The collector subsystem is a robust, extensible foundation for ecosystem data acquisition. By modularizing each data source and implementing resilient error handling, the platform ensures reliable, up-to-date metrics for the entire JSON Schema community.
