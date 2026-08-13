---
title: PostgreSQL Transactions and Isolation Levels
description: Keep PostgreSQL transactions short, understand ACID in practice, and choose between Read Committed and Repeatable Read.
date: 2026-04-14
tags: [postgresql, transactions, isolation, acid]
draft: false
readingTime: 9 min
---

## A transaction is a contract

A transaction groups statements so they all commit or all roll back. That is the "A" and "D" in ACID: atomic and durable once committed. Isolation and consistency are the parts teams usually misunderstand.

Keep transactions **short**. A transaction that holds rows while the application calls a payment API will block other writers.

## BEGIN, COMMIT, ROLLBACK

```sql
BEGIN;

UPDATE accounts SET balance_cents = balance_cents - 1000 WHERE id = 1;
UPDATE accounts SET balance_cents = balance_cents + 1000 WHERE id = 2;

COMMIT;
```

If the second update fails, `ROLLBACK` (or a disconnected session abort) restores both rows. In application code, the client library usually starts the transaction for you. Know where it starts and ends.

Single statements already run in their own transaction. `BEGIN` is for **multiple** statements that must succeed together.

## Isolation levels you will actually use

PostgreSQL default is **Read Committed**. Each statement sees rows committed before that statement started. Two `SELECT`s in the same transaction can see different data if another session committed in between.

**Repeatable Read** (and **Serializable**) give a stable snapshot for the whole transaction. If a concurrent write would make the snapshot unsafe, PostgreSQL may raise a serialization error. Retry the transaction.

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT sum(total_cents) FROM orders WHERE customer_id = 42 AND status = 'paid';
-- other statements still see the same snapshot
COMMIT;
```

Use Repeatable Read for reports that must not mix old and new rows. Stay on Read Committed for typical request/response CRUD unless you have a proven anomaly.

**Serializable** is the strictest level. Use it when the business rule cannot tolerate write skew and you are willing to retry.

## What ACID does not mean

ACID does not mean "no locks" and does not mean "the application cannot see errors". It means the database will not silently apply half of a committed transaction. Your job is to define the transaction boundary: transfer both sides of a money move in one transaction; do not open a transaction around an HTTP round trip.

## Failures you must handle

- deadlock (next page)
- unique violation
- serialization failure (`SQLSTATE 40001`)

Those are retryable or user-visible depending on the case. Swallowing them and retrying forever is not a strategy.

## Checklist

- Multi-row business changes share one transaction.
- Transactions do not wait on external HTTP calls.
- You know the session isolation level (usually Read Committed).
- Serialization failures are retried only when you chose Repeatable Read or Serializable.

## Next step

See how row locks and deadlocks appear when two transactions touch the same rows.
