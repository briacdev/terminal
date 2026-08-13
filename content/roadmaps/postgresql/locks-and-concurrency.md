---
title: Locks, Deadlocks, and Concurrency in PostgreSQL
description: Understand PostgreSQL row and table locks, diagnose deadlocks, and design write workflows that keep contention low.
date: 2026-04-15
tags: [postgresql, locks, deadlock, concurrency]
draft: false
readingTime: 9 min
---

## Locks are how concurrency stays correct

When two sessions update the same order, PostgreSQL does not merge the writes. One session waits on a **row lock**, then runs after the other commits or rolls back. That wait is normal. Unbounded waits and deadlocks are the problems to design away.

## Row locks vs table locks

`UPDATE`, `DELETE`, and `SELECT ... FOR UPDATE` lock rows. Other sessions can still read committed data under Read Committed. They cannot update the same rows until the lock is released at transaction end.

Table-level locks appear with DDL (`ALTER TABLE`, `CREATE INDEX` without `CONCURRENTLY`) and with some maintenance commands. Avoid mixing long transactions with schema changes.

```sql
BEGIN;
SELECT id, status
FROM orders
WHERE id = 10
FOR UPDATE;

UPDATE orders SET status = 'paid' WHERE id = 10 AND status = 'draft';
COMMIT;
```

`FOR UPDATE` is useful when you read a row and update it only if it is still in the expected state. Skip it on read-only pages.

## Deadlocks

A deadlock happens when session A waits for B and B waits for A. PostgreSQL aborts one transaction with `SQLSTATE 40P01`. Retry the loser.

Reduce deadlocks by locking rows in a **stable order** (always lower `id` first) and by keeping transactions short:

```sql
-- transfer: lock both accounts in id order
SELECT id FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
```

## See who is waiting

```sql
SELECT pid, wait_event_type, wait_event, state, query
FROM pg_stat_activity
WHERE datname = current_database();
```

`pg_locks` plus `pg_stat_activity` is enough to see a blocker. In production, a pooler and a timeout (`lock_timeout`, `statement_timeout`) prevent a stuck session from blocking the whole table.

```sql
SET lock_timeout = '5s';
SET statement_timeout = '15s';
```

Set these in the application role, not only in your `psql` session.

## Design for low contention

- Update a hot counter in a separate table if many sessions increment it
- Do not serialize the whole checkout on one "global settings" row
- Prefer `INSERT` of events over rewriting a heavily contested aggregate row
- Use `SKIP LOCKED` for work queues so workers do not wait on each other

```sql
SELECT id
FROM jobs
WHERE status = 'pending'
ORDER BY id
FOR UPDATE SKIP LOCKED
LIMIT 1;
```

## Checklist

- Updates of the same entity use short transactions and `FOR UPDATE` only when needed.
- Multi-row locks happen in a consistent order.
- Timeouts exist on application sessions.
- Queue workers use `SKIP LOCKED` instead of waiting.

## Next step

Store attributes that truly vary as JSONB without turning the whole schema into a document dump.
