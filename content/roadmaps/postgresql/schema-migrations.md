---
title: PostgreSQL Schema Migrations
description: Version PostgreSQL schema changes, apply them in order, and use expand-then-contract so production DDL stays safe.
date: 2026-04-18
tags: [postgresql, migrations, flyway, schema]
draft: false
readingTime: 9 min
---

## Schema is code

If a column exists only because someone ran SQL on the server, you cannot recreate the database and you cannot review the change. Migrations are ordered scripts (or declarative files) that live in git and run in every environment the same way.

This page is about the **PostgreSQL** side of that workflow. Spring-specific Flyway setup belongs to the Spring Boot roadmap.

## What a migration looks like

A typical versioned file:

```sql
-- V20260418__add_orders_paid_at.sql
ALTER TABLE orders
  ADD COLUMN paid_at timestamptz;

CREATE INDEX orders_paid_at_idx ON orders (paid_at)
  WHERE paid_at IS NOT NULL;
```

Rules that keep teams sane:

- never edit a migration that already ran in production
- one logical change per file
- forward scripts are required; down scripts are optional and often unused

Flyway, Liquibase, and many application tools all implement this idea. The database only sees SQL.

## Expand, then contract

Breaking deploys happen when you drop a column the old application still reads. Split risky changes:

1. **Expand**: add the new column or table, backfill, keep the old one
2. Deploy application code that writes both, then reads the new one
3. **Contract**: drop the old column in a later migration

```sql
-- expand
ALTER TABLE customers ADD COLUMN email_normalized text;

UPDATE customers
SET email_normalized = lower(email)
WHERE email_normalized IS NULL;

ALTER TABLE customers
  ALTER COLUMN email_normalized SET NOT NULL;
```

Later, after the app no longer uses `email` as the lookup key, you can drop or keep it. Do not combine add, backfill, not-null, and drop in one shot on a large table.

## DDL that locks

`ALTER TABLE ... ADD COLUMN` with a constant default is usually fast on modern PostgreSQL. Rewrites still happen for some type changes. `CREATE INDEX` without `CONCURRENTLY` locks writes. For large production tables:

```sql
CREATE INDEX CONCURRENTLY orders_customer_id_idx ON orders (customer_id);
```

`CONCURRENTLY` cannot run inside a transaction block. Know your migration runner's transaction mode before you copy that snippet.

## Local and CI

Every pull request should be able to apply migrations on an empty database and on the previous schema. Keep a `shop_test` database or use throwaway containers. Never "fix prod" without adding the same SQL to the migration history.

## Checklist

- Schema changes are files in version control.
- Production DDL is not done ad hoc in `psql`.
- Destructive changes wait until the old code is gone.
- Large indexes use `CONCURRENTLY` when the runner allows it.

## Next step

Take backups you can actually restore with `pg_dump` and `pg_restore`.
