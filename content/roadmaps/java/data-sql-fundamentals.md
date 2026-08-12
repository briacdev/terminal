---
title: Data - SQL Fundamentals
description: "Learn the SQL every Java backend developer needs: joins, indexes, transactions, EXPLAIN basics, and query patterns that stay fast."
date: 2025-01-11
tags: [java, data, sql, databases]
draft: false
readingTime: 16 min
---

## Why this step matters

Even with ORM tools, backend performance and correctness depend on SQL knowledge.
If you cannot read SQL plans and join logic, production incidents become hard to solve.

SQL is not optional for serious Java backend work.

## Core query operations

```sql
SELECT id, email
FROM users
WHERE active = true
ORDER BY created_at DESC
LIMIT 20;
```

Learn to use:

- `SELECT`, `WHERE`, `ORDER BY`, `LIMIT` / `OFFSET`
- `INSERT`, `UPDATE`, `DELETE`
- aggregates (`COUNT`, `SUM`, `AVG`) with `GROUP BY`

## Joins

```sql
SELECT u.id, u.email, o.total
FROM users u
JOIN orders o ON o.user_id = u.id;
```

Important join types:

- `INNER JOIN`: only matching rows
- `LEFT JOIN`: keep left rows even without matches
- `RIGHT JOIN`: less common in practice

Know what happens when rows are missing on one side.
Prefer explicit join conditions over accidental cross joins.

## Indexes

Indexes accelerate lookups and sorting, but add write overhead and storage cost.

Good candidates:

- columns in frequent `WHERE` filters
- join keys / foreign keys
- ordering columns (`ORDER BY`)
- uniqueness constraints

Bad pattern:

- creating many unused indexes
- indexing low-selectivity columns without evidence

## Transactions

Transactions group operations atomically.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

If something fails, rollback restores consistency.
Understand isolation basics (dirty reads, non-repeatable reads, phantoms) at a practical level.

## Query optimization basics

- select only needed columns
- avoid `SELECT *` in hot paths
- paginate large result sets
- inspect plans with `EXPLAIN` / `EXPLAIN ANALYZE`
- push filtering early; avoid functions on indexed columns in `WHERE` when possible

## Filtering and pagination patterns

Keyset pagination often scales better than deep `OFFSET` for large tables.
Always define a stable sort order for paged APIs.

## Common mistakes

- N+1 style repeated queries from application code
- missing indexes on join/filter columns
- long transactions holding locks too long
- ignoring isolation-level effects
- fixing slowness by caching before measuring the query plan

## Practice checklist

- write an inner join and a left join for users/orders
- add an index for a frequent filter and compare `EXPLAIN`
- wrap a transfer in `BEGIN` / `COMMIT` with rollback on failure
- rewrite a `SELECT *` hot query to explicit columns

## Takeaway

1. SQL is a core backend skill, even with an ORM
2. Master joins, indexes, and transactions
3. Use `EXPLAIN` and measure before optimizing blindly
4. Optimize for both read speed and write cost
