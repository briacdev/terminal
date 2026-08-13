---
title: PostgreSQL Maintenance, Pooling, and Production Basics
description: Operate PostgreSQL in production with autovacuum, connection pooling, replication awareness, and a short operational checklist.
date: 2026-04-20
tags: [postgresql, production, autovacuum, pgbouncer]
draft: false
readingTime: 10 min
---

## Production is a habit, not a product

The previous steps taught you to model, query, and recover data. This last page is the operating minimum: vacuum, connections, replicas, and what to watch. You do not need to become a DBA today. You do need to stop treating PostgreSQL as a black box once users depend on it.

## Autovacuum and bloat

PostgreSQL uses MVCC: updates and deletes leave old row versions. **Vacuum** reclaims that space and **ANALYZE** refreshes statistics. Autovacuum does both in the background.

If autovacuum cannot keep up, tables bloat and plans get worse. Watch:

```sql
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum, last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

Do not disable autovacuum to "go faster". Fix the cause: long transactions, too many churned rows, or starved workers. Manual `VACUUM` is for emergencies and bulk jobs, not a daily ritual on a healthy system.

## Connection pooling

Each PostgreSQL connection is expensive. Application servers with 50 processes times 20 connections will exhaust `max_connections`. Put a pool in front:

- in-process pool for a single app instance
- [PgBouncer](https://www.pgbouncer.org/) when many instances share one database

Transaction pooling is the usual PgBouncer mode for typical web apps. Session pooling is needed if you use session-level features (`SET`, temporary tables, prepared statements in some setups). Measure `numbackends` in `pg_stat_database` and wait events in `pg_stat_activity`.

## Replication and failover

Streaming replication gives you a hot standby for reads or for failover. Managed providers often expose a primary URL and a replica URL. Application rules:

- send writes to the primary only
- accept replica lag if you read from standbys
- know who triggers failover and how DNS/URL switching works

High availability is a rehearsed procedure, not a checkbox. Pair it with the backups you tested in the previous step.

## A short production watchlist

- disk space and WAL
- connection count vs `max_connections`
- longest running transaction
- autovacuum lag (`n_dead_tup`)
- slow queries (`pg_stat_statements` if the extension is available)
- backup age and last successful restore drill

```sql
SELECT pid, now() - xact_start AS xact_age, state, query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY xact_start;
```

A transaction open for hours is a production bug even if the query looks idle.

## Security minimum

- no superuser for the application role
- encrypted connections in transit
- least-privilege grants per schema
- credentials in a secret manager, not in git

Encryption-at-rest and `pgcrypto` are extra layers. Column encryption does not replace access control.

## You finished the path

You can now install PostgreSQL, model a shop, query it, index it, transact safely, use JSONB and search where they fit, migrate schema, restore dumps, and operate with a small checklist. Go back to any step when a production issue maps to it. The official [PostgreSQL documentation](https://www.postgresql.org/docs/current/) remains the reference.

## Checklist

- Autovacuum is on and dead tuples are not growing without bound.
- Apps use a pool; they do not open a connection per request without reuse.
- Writes go to the primary; replica lag is understood.
- Backups, timeouts, and role privileges are documented.
