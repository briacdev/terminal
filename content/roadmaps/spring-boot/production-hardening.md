---
title: Production Hardening
description: "Harden a live Spring Boot API: secure defaults, rollback, and an operational runbook for incidents."
date: 2026-04-01
tags: [spring-boot, production, operations]
draft: false
readingTime: 11 min
---

## Where this lesson sits

This is lesson 21 of 21. The API is built, tested, observed, and deployed. Hardening is the production contract: secure defaults, rollback, and a written response to incidents.

## What you will learn

- Which Boot defaults to lock down
- How rollback must be a rehearsed path
- What a short runbook contains

## Mental model

Production is hostile: scanners, expired certs, full disks, a bad migration. Assume failure. Design for a fast undo.

Secure defaults:

- no public actuator besides health
- HTTPS at the edge
- secrets from a manager, not YAML
- Flyway `validate` on startup
- anonymous access only on documented public routes

Rollback: keep the previous image tag. Database migrations must be forward-compatible if you roll back the app (`V2` adds a nullable column; the old app still runs). Destructive drops wait until the new app is stable.

A runbook is a page, not a novel: how to see health, how to read the last deploy sha, how to revert, who to call, where logs live.

## Practical example

A minimal production checklist:

1. `SPRING_PROFILES_ACTIVE=prod`
2. Actuator allow-list is health (and maybe prometheus on a private port)
3. Previous image tag is still in the registry
4. On-call knows `/actuator/health` and the dashboard
5. A failed Flyway migration stops the new instance; the old instance keeps traffic

If you cannot answer "how do we undo the last deploy in ten minutes?", you are not hardened yet.

## Common mistakes

- First production test is the customer launch
- Irreversible migrations bundled with a risky feature
- Dashboards nobody on-call can open

## Next lesson

You finished the path. Return to the [Spring Boot Roadmap](/spring-boot) when you need a recap.

## Official docs

- [Production-ready features](https://docs.spring.io/spring-boot/reference/actuator/)
- [Deployment](https://docs.spring.io/spring-boot/reference/deploying/index.html)

## Takeaway

- Production settings are explicit, not inherited from local
- Rollback is a feature you practice
- A runbook turns an outage into a procedure
