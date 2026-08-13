---
title: Production - Observability and Performance
description: "Operate Java services in production with structured logs, metrics, distributed tracing, profiling, and evidence-based performance tuning."
date: 2025-01-18
tags: [java, production, observability, performance]
draft: false
readingTime: 17 min
---

## Why this step matters

If you cannot observe your system, you cannot operate it reliably.
Production quality depends on visibility and performance discipline together.

Observability answers three questions fast: what broke, where, and why.

## Structured logs

Prefer structured logs over free-form text.
Include stable fields like:

- timestamp
- level
- service name
- request id / trace id
- user or tenant id when relevant

This makes search and correlation much faster in tools like ELK, Loki, or Cloud Logging.

Log business outcomes and unexpected failures.
Avoid logging secrets, tokens, or full personal data.

## Metrics and tracing

Metrics answer: “what is happening right now?”
Tracing answers: “where is time spent across services?”

Core metrics to expose:

- request rate
- latency percentiles (p50 / p95 / p99)
- error rate
- JVM heap, GC pause time, thread count
- database pool usage and query latency

Distributed tracing links one user request across API, services, and data stores.
Propagate correlation IDs end to end.

## Alerting mindset

Alert on symptoms that impact users, not on noisy low-level events.
Define SLO-oriented thresholds when possible:

- high error rate
- elevated p95 latency
- saturation (CPU, pool exhaustion, disk)

Every alert should have an owner and a clear first response step.

## Profiling and tuning workflow

1. measure baseline
2. identify bottleneck
3. change one thing
4. measure again

Never optimize blindly.
Use sampling profilers, flight recorder, or APM before changing JVM flags or rewriting hot paths.

## Typical bottlenecks

- excessive DB round-trips and N+1 queries
- blocking I/O under high concurrency
- high object allocation and GC pressure
- hot code paths with inefficient algorithms
- undersized connection or thread pools

## Dashboard starter set

Create one service dashboard with:

- golden signals (latency, traffic, errors, saturation)
- JVM health
- dependency health (DB, cache, external APIs)

Review it during incidents and after each release.

## Common mistakes

- no correlation id in logs
- collecting metrics but never wiring dashboards/alerts
- tuning JVM flags without evidence
- optimizing micro-code before fixing architecture hotspots
- logging too much volume and drowning useful signals

## Practice checklist

- add a request correlation id to every log line
- expose p95 latency and error rate for one endpoint
- run a profiler on a slow endpoint and note top allocations
- write one alert that maps to a real user symptom

## Takeaway

1. Observability is part of the product, not an optional add-on
2. Use logs, metrics, and traces together
3. Tune performance through measurement loops
4. Focus first on user-impacting bottlenecks
