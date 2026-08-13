---
title: SELECT, Filter, Sort, and Paginate in PostgreSQL
description: Write precise PostgreSQL SELECT queries with WHERE, ORDER BY, LIMIT, and keyset pagination that stays stable under inserts.
date: 2026-04-07
tags: [postgresql, select, pagination, sql]
draft: false
readingTime: 9 min
---

## Read only the rows you need

Most production SQL is not clever. It is a precise `SELECT` with a filter, a sort, and a limit. If this layer is sloppy, indexes cannot help and APIs become slow.

Assume the shop tables from the modeling steps already exist.

## Project columns on purpose

```sql
SELECT id, email, created_at
FROM customers
WHERE created_at >= timestamptz '2026-01-01'
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

Select the columns the caller needs. `SELECT *` is fine in `psql` while exploring. It is a poor default in application queries because new columns travel over the network and break code that maps positions.

## Filter with WHERE

`WHERE` reduces rows **before** grouping. Compare values with matching types:

```sql
SELECT id, status, total_cents
FROM orders
WHERE customer_id = 42
  AND status = 'paid'
  AND created_at >= now() - interval '30 days';
```

Prefer `=` and ranges on columns that can be indexed. Avoid wrapping the column in a function (`WHERE date(created_at) = ...`) if you care about index use. That topic returns in the EXPLAIN step.

## Sort with a tie-breaker

`ORDER BY created_at DESC` alone is not deterministic when two orders share a timestamp. Add a unique column:

```sql
ORDER BY created_at DESC, id DESC
```

Stable order is required for pagination. Without it, page 2 can repeat or skip rows.

## Pagination: LIMIT/OFFSET vs keyset

Offset pagination is easy:

```sql
SELECT id, email
FROM customers
ORDER BY id
LIMIT 20 OFFSET 40;
```

`OFFSET` gets slower as it grows because PostgreSQL still walks the skipped rows. For large lists, use keyset pagination:

```sql
SELECT id, email, created_at
FROM customers
WHERE (created_at, id) < (timestamptz '2026-04-01 12:00:00+00', 1200)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

The client sends the last `(created_at, id)` it saw. New inserts above that cursor do not shuffle the next page.

## NULL behavior

`NULL` is unknown, not a value. `WHERE status = 'paid'` does not return rows where `status` is null. Use `IS NULL` / `IS NOT NULL` when you mean that. `ORDER BY created_at DESC NULLS LAST` makes the sort explicit.

## Checklist

- Queries list columns instead of `SELECT *` in application code.
- `WHERE` uses sargable predicates on real columns.
- `ORDER BY` includes a unique tie-breaker.
- Deep pages use keyset pagination, not huge offsets.

## Next step

Write data with `INSERT`, `UPDATE`, `DELETE`, and `ON CONFLICT` upserts.
