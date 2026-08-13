---
title: EXPLAIN ANALYZE and PostgreSQL Query Plans
description: Read PostgreSQL EXPLAIN ANALYZE output, spot sequential scans and bad joins, and tune queries in small measured iterations.
date: 2026-04-13
tags: [postgresql, explain, query-plan, performance]
draft: false
readingTime: 10 min
---

## Measure before you add another index

If you cannot read a plan, you are guessing. `EXPLAIN` shows what PostgreSQL intends to do. `EXPLAIN ANALYZE` runs the query and shows actual times and row counts.

Use this workflow on every slow query: reproduce, explain, change one thing, explain again.

## Run EXPLAIN ANALYZE

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT o.id, c.email
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'paid'
  AND o.created_at >= now() - interval '7 days'
ORDER BY o.created_at DESC, o.id DESC
LIMIT 20;
```

`BUFFERS` shows cache vs disk reads. That matters more than node names once the plan shape is clear.

Do not run `ANALYZE` blindly on a query that writes. `EXPLAIN ANALYZE` for `UPDATE`/`DELETE` **executes** the write. Wrap it in a transaction and `ROLLBACK` if you are experimenting.

## What to look at first

Read from the inside out. The innermost node is where PostgreSQL starts.

Pay attention to:

- **Seq Scan** on a large table with a selective `WHERE`: you probably need an index
- **Index Scan** vs **Bitmap Heap Scan**: both can be healthy
- **Nested Loop** with huge actual rows on the inner side: a join estimate may be wrong
- **Sort** plus **Limit**: a matching ordered index can avoid the sort
- **actual rows** far from **planned rows**: statistics may be stale (`ANALYZE` the table)

Times are per node. A node that looks scary but takes 0.2 ms is not your problem.

## A practical iteration

1. Run the query with `EXPLAIN ANALYZE` on realistic data volume
2. Identify the node that consumes most time
3. Change **one** thing: a predicate, an index, a `JOIN` order hint-free rewrite, or `SET enable_seqscan = off` only as a diagnostic
4. Compare the new plan

Never keep `enable_seqscan = off` in production. It is a flashlight, not a configuration.

## Statistics

PostgreSQL plans with table statistics. After large loads:

```sql
ANALYZE orders;
```

Autovacuum usually does this. If estimates are wildly wrong after a bulk import, run `ANALYZE` yourself before creating five indexes.

## Checklist

- Slow SQL is captured with `EXPLAIN (ANALYZE, BUFFERS)`.
- You compared actual vs planned rows.
- You changed one variable between two explains.
- Diagnostic session settings are not left on in the application.

## Next step

Wrap related writes in transactions and choose an isolation level you understand.
