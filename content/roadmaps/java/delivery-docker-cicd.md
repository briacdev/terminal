---
title: Delivery - Docker and CI/CD
description: "Ship Java apps reliably with Docker images, CI quality gates, CD rollout strategies (rolling, blue/green, canary), and secret-safe config."
date: 2025-01-17
tags: [java, delivery, docker, cicd]
draft: false
readingTime: 16 min
---

## Why this step matters

Shipping software reliably is as important as writing code.
Docker and CI/CD make builds reproducible and deployments safer.

A good delivery loop turns “it works on my machine” into “it works in production”.

## Containerize the app

Typical Java Dockerfile pattern:

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Use lightweight runtime images and keep image size controlled.
Prefer multi-stage builds when you compile inside Docker.

Tag images with immutable versions (commit SHA or release version), not only `latest`.

## CI pipeline essentials

A baseline pipeline should run:

1. lint / format checks
2. unit tests
3. build package
4. optional integration tests
5. image build and publish

Fail fast on quality gates.
Build once and promote the same artifact through environments.

## CD and deployment strategy

Common strategies:

- rolling update
- blue/green
- canary

### Rolling update

You progressively replace old instances with new ones.
Traffic keeps flowing during the rollout, without full downtime.

Strengths:

- simple to implement on most platforms
- little extra infrastructure needed

Limitation:

- rollback can be slower because old and new versions are mixed during transition

### Blue/Green

You keep two full environments:

- `blue` = current production version
- `green` = new candidate version

When `green` is validated, you switch all traffic at once.

Strengths:

- very fast rollback (switch traffic back to `blue`)
- reduced deployment risk during cutover

Limitation:

- higher infrastructure cost (double environment)

### Canary

You first route a small share of traffic (for example 5%) to the new version.
If metrics stay healthy, you increase gradually (20%, 50%, 100%).

Strengths:

- early detection of real-user regressions
- limited blast radius if something fails

Limitation:

- requires strong observability and fine-grained traffic routing

Start simple and add progressive rollout when needed.

## Environment management

Keep secrets and env config outside images.
Use platform secret stores or CI secret management.
Never bake production credentials into Docker layers.

## Health checks and rollback

Expose health endpoints and wire them into the orchestrator.
Define a rollback trigger: rising error rate, failed health checks, or broken SLOs.

## Common mistakes

- deploying directly from developer machines
- skipping test gates before deployment
- mutable image tags without traceability
- no rollback strategy
- storing secrets in the image or in plain CI logs

## Practice checklist

- write a minimal Dockerfile for a packaged JAR
- add unit tests + package as required CI stages
- choose one rollout strategy and document its rollback
- move one secret out of source control into a secret store

## Takeaway

1. Build once, deploy consistently
2. Automate tests and packaging in CI
3. Use a safe rollout strategy in CD
4. Keep deployment observable and reversible
