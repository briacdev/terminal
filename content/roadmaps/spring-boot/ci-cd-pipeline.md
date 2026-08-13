---
title: CI/CD Pipeline
description: "Ship Spring Boot with a pipeline that runs tests, publishes artifacts, and deploys progressively instead of hoping local builds match production."
date: 2026-03-31
tags: [spring-boot, ci-cd, delivery]
draft: false
readingTime: 10 min
---

## Where this lesson sits

You can build a jar locally. CI must build the same jar, run the same tests, and deploy an artifact you can roll back. This lesson is the pipeline, not a specific vendor.

## What you will learn

- Why tests are a gate, not a suggestion
- How to publish one artifact per commit
- How to deploy progressively

## Mental model

A pipeline is a scripted path:

1. checkout
2. `./mvnw verify` (unit + integration, wrapper only)
3. build the jar / image tagged with the git sha
4. push the artifact to a registry
5. deploy to staging
6. deploy to production with a rollback path

Never deploy "whatever is on the laptop". Never skip tests to unblock a Friday release. Quality gates can be coverage thresholds or "integration tests must pass".

Progressive delivery means staging first, then a small production slice, then the rest. The sha you tested is the sha you run.

## Practical example

```yaml
# conceptual GitHub Actions sketch
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: "21"
          distribution: temurin
      - run: ./mvnw -B verify
      - run: ./mvnw -B -DskipTests package
```

Then a later job builds and pushes `catalog-api` tagged with the git SHA. Production deploys that tag, not `latest`.

## Common mistakes

- Using `latest` as the only image tag
- Different JDK locally vs in CI
- Deploying without running Testcontainers jobs because "they are slow"

## Next lesson

Next: [Production Hardening](/spring-boot/production-hardening).

## Official docs

- [Spring Boot build](https://docs.spring.io/spring-boot/reference/using/build-systems.html)
- [Continuous delivery ideas](https://docs.spring.io/spring-boot/reference/packaging/index.html)

## Takeaway

- The pipeline is the only supported way to ship
- One git sha maps to one artifact
- Staging exists to fail before customers see it
