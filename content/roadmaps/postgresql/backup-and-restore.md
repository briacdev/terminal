---
title: PostgreSQL Backup and Restore with pg_dump
description: Back up PostgreSQL with pg_dump, restore with pg_restore, and verify recoveries instead of trusting backup files blindly.
date: 2026-04-19
tags: [postgresql, backup, pg-dump, restore]
draft: false
readingTime: 9 min
---

## A backup that never restored is a hope

Backups exist to restore. `pg_dump` is the logical backup you will use first as a developer: it copies database contents to a file you can load elsewhere. Physical backups and point-in-time recovery (PITR) are for operators with WAL archiving. Learn dump/restore well before you rely on PITR.

## Logical vs physical

- **Logical** (`pg_dump` / `pg_dumpall`): SQL or custom-format objects. Good for copying a schema, migrating versions, or seeding a laptop.
- **Physical** (base backup + WAL): a copy of data files. Required for PITR ("restore to 03:12 UTC").

This page focuses on logical backups because every developer needs them. Physical backups belong with your host's runbook (managed Postgres, Barman, pgBackRest).

## Dump one database

```bash
pg_dump -h localhost -U shop_app -d shop -Fc -f shop.dump
```

`-Fc` is custom format. It works with `pg_restore` and lets you select tables later. Plain SQL (`-Fp`) is readable but less flexible.

Dump only the schema while developing migrations:

```bash
pg_dump -h localhost -U shop_app -d shop --schema-only -f shop-schema.sql
```

## Restore

Create an empty target first, then restore:

```bash
createdb -h localhost -U postgres shop_copy
pg_restore -h localhost -U postgres -d shop_copy --no-owner shop.dump
```

`--no-owner` avoids failing when the original owner role does not exist locally. Restore into a **new** database name when you are testing. Restoring over a live production database is not a rehearsal.

## What to verify

After restore:

```sql
SELECT count(*) FROM shop.customers;
SELECT max(created_at) FROM shop.orders;
```

Compare counts and a recent timestamp with the source. Also restore on a schedule, not only after an incident. An unreadable dump found during an outage is a second incident.

## Limits of pg_dump

A dump is a snapshot of committed data when the dump started (plus dump duration caveats for large DBs). It is not PITR. It does not replace replication. Huge databases may need parallel dump/restore (`-j`) and disk planning.

Exclude bulky tables you do not need locally:

```bash
pg_dump -Fc -f shop.dump --exclude-table-data=shop.audit_events
```

## Checklist

- You can dump and restore the shop database on your machine.
- The restore is tested, not only the dump job.
- Production has a documented restore owner and a target time objective.
- You know whether you currently have PITR or only logical dumps.

## Next step

Keep the database healthy in production: autovacuum, pooling, and a simple high-availability mindset.
