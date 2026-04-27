---
title: pgcopycat
description: PostgreSQL application-cloning CLI for local refresh workflows, built in Go around pg_dump, pg_restore, and psql.
tags: [go, postgresql, cli, tooling]
stack: [go, postgresql]
year: 2026
active: true
cover: /projects/pgcopycat.webp
links:
  repo: https://github.com/briacdev/pgcopycat
---

## Project Context

`pgcopycat` was built around a very practical developer need: getting a usable local copy of an application database without trying to clone an entire PostgreSQL instance.

In many teams, a local refresh workflow is still a mix of shell history, half-documented dump commands, manual cleanup steps, and a fair amount of risk around restoring into the wrong target. That usually works until it does not. The goal of `pgcopycat` is to turn that fragile process into a repeatable CLI workflow with clear checks, safer defaults, and reusable configuration.

Instead of behaving like a cluster-level migration product, the tool stays focused on the application layer of PostgreSQL: schemas, tables, indexes, sequences, views, and data depending on the selected mode.

## What the Tool Solves

The main problem is not “copy everything PostgreSQL knows.” It is “give developers a refreshable application database they can actually use.”

That distinction matters. Most local refresh workflows do not need roles, ownership restoration, access control reconstruction, or cluster administration logic. They need a clean way to move application structure and optionally data from one environment to another while keeping the process understandable and safe.

`pgcopycat` addresses that by orchestrating native PostgreSQL tools that developers already trust:

- `pg_dump`
- `pg_restore`
- `psql`

The project does not replace PostgreSQL tooling. It wraps it into a focused, developer-oriented cloning flow.

## Workflow Design

One of the strongest parts of the project is its dual execution model.

When launched without arguments, `pgcopycat` can guide the user through an interactive flow: check required PostgreSQL client tools, detect existing profiles, ask for source and destination information, propose exclusions, validate extension state, and summarize what is about to happen before execution.

That makes it approachable for developers who do not want to memorize every flag.

At the same time, the project supports a more operational mode through YAML configuration files and reusable profiles. This is important because refresh workflows tend to stabilize around a few recurring patterns: local developer refresh, staging-like schema clone, partial data copy, or a safe dry run before a more destructive restore.

The result is a tool that works both as a one-off assistant and as a repeatable part of a team workflow.

## Core Capabilities

### Clone modes

`pgcopycat` supports multiple cloning strategies depending on the intent:

- `full`
- `schema-only`
- `data-only`

This avoids forcing the same restore behavior on every environment. Sometimes the structure is enough. Sometimes only the data layer matters. Sometimes you need both.

### Configurable filters

The project supports inclusion and exclusion rules for schemas and tables, including cases where table structure should exist but table data should be skipped. That is particularly useful for heavy audit tables, event logs, ephemeral jobs, or data sets that are not useful in local development.

### Extension handling

A local refresh often fails late because the target database is structurally close, but missing an extension used by the dump. `pgcopycat` brings that forward into pre-checks and can optionally ensure destination extensions before execution.

### Sequence reset

Post-restore sequence drift is one of those issues that wastes time because the clone looks correct until the next insert fails or behaves strangely. The tool includes sequence resynchronization as part of the workflow so the resulting database is more immediately usable.

### Reporting

Every run produces a final report summarizing the selected profile or config, modes, filters, extension handling, sequence reset status, steps, duration, and final result. That makes the workflow easier to audit and troubleshoot than a raw terminal history.

## Safety Model

`pgcopycat` is intentionally conservative about destructive operations.

The project includes checks to reduce the most common mistakes in refresh workflows:

- tool availability is checked before database questions
- source and destination identity are compared before execution
- non-empty targets can be rejected in safe mode
- missing extensions are surfaced early
- destructive operations require confirmation unless explicitly bypassed

This safety layer is a major part of the project’s value. The goal is not just to make cloning faster, but to make it harder to do the wrong thing under time pressure.

## Why This Project Matters

`pgcopycat` sits in a useful middle ground between ad hoc scripts and heavyweight migration tooling.

For small teams, it can replace a fragile internal checklist with one consistent command-line workflow.

For more mature teams, it can formalize local and pre-production refresh routines without introducing a large orchestration platform.

For me, it is also a strong example of the kind of tooling I like building: narrow scope, clear operational value, strong defaults, and respect for the native tools already used in production environments.

## Current Direction

The project is currently positioned as a developer-first PostgreSQL refresh utility with a strong emphasis on:

- reusable local refresh profiles
- safer destination handling
- better ergonomics around interactive and non-interactive execution
- predictable application-level cloning instead of overreaching cluster administration

It is a good fit for teams that want repeatability and safety in local database refresh workflows, while staying close to standard PostgreSQL tooling.

## External Links

- Repository: [github.com/briacdev/pgcopycat](https://github.com/briacdev/pgcopycat)
