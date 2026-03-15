graph TD
metrics.json --> AnomalyDetection
AnomalyDetection --> Alerts
Alerts --> Dashboard

```
graph TD
    metrics.json --> AnomalyDetection
    AnomalyDetection --> Alerts
    Alerts --> Dashboard
```

# Anomaly Detection

# Introduction

Anomaly detection is a cornerstone of the observability platform, enabling early identification of ecosystem issues, regressions, or unexpected trends. By continuously monitoring key metrics, the system can alert maintainers to problems before they impact the broader community.

# Background

Open-source ecosystems are dynamic and subject to rapid change. Sudden drops in package downloads, validator compliance regressions, or stagnation in community activity can signal underlying problems. Automated anomaly detection provides a proactive approach to ecosystem health management.

# Architecture

The anomaly detection subsystem is integrated into the data pipeline and operates on aggregated metrics after collection and normalization. It consists of:

1. **Rule-Based Detection Engine**: Applies heuristics and thresholds to identify significant deviations in metrics.
2. **Alert Generation**: Creates structured alerts with severity levels and context.
3. **Alert Storage**: Persists alerts in a machine-readable format for dashboard consumption.
4. **Dashboard Visualization**: Surfaces alerts and signals to users in real time.

## Detection Flow Diagram

```
metrics.json → Anomaly Detection Engine → Alerts.json → Dashboard Signals Panel
```

# Implementation Details

## Detection Strategy

- **Download Drop Detection**: Flags sudden, sustained drops in NPM downloads for key packages.
- **Validator Compliance Monitoring**: Detects regressions in Bowtie compliance scores for any validator or draft.
- **Ecosystem Growth Stagnation**: Identifies periods of flat or declining GitHub activity (repo count, stars, forks).
- **Custom Rules**: Additional rules can be added for new metrics or ecosystem signals.

## Alert Severity Levels

- **Info**: Minor deviations or informational signals.
- **Warning**: Significant but non-critical anomalies.
- **Critical**: Severe regressions or outages requiring immediate attention.

## Alert Generation and Storage

- Alerts are timestamped, categorized by severity, and include contextual metadata (affected metric, previous value, new value, threshold crossed).
- Alerts are written to `alerts.json` for consumption by the dashboard and external tools.

## Dashboard Signal Visualization

- The dashboard features a dedicated signals panel, surfacing current and historical alerts with severity indicators and trend context.

# Design Decisions

- **Rule-Based Simplicity**: Initial implementation uses simple heuristics for transparency and ease of tuning.
- **Extensibility**: The engine is designed to support more advanced statistical or ML-based detection in the future.
- **Separation of Concerns**: Anomaly detection is isolated from data collection and aggregation for maintainability.

# Limitations

- **False Positives/Negatives**: Rule-based detection may miss subtle anomalies or flag benign fluctuations.
- **Static Thresholds**: Current thresholds are manually tuned and may require adjustment as the ecosystem evolves.
- **No Root Cause Analysis**: The system flags anomalies but does not diagnose underlying causes.

# Summary

The anomaly detection subsystem provides early warning for ecosystem health issues, enabling maintainers to respond proactively. Its modular, extensible design ensures it can evolve alongside the platform and the needs of the JSON Schema community.
