---
title: PostgreSQL Indexes and B-tree Basics
description: Create PostgreSQL B-tree indexes on filter and join columns, and understand the write cost of every extra index.
date: 2026-04-12
tags: [postgresql, indexes, btree, performance]
draft: false
readingTime: 10 min
---

## Indexes are a trade

An index is a sorted structure that helps PostgreSQL find rows without scanning the whole table. Every `INSERT`, `UPDATE`, and `DELETE` must also maintain that structure. The right index makes a hot query cheap. Ten unused indexes make writes slow and autovacuum busier.

This page covers **B-tree**, the default index type. GIN for JSONB and full-text search appears in those later steps.

## What to index first

Good first candidates:

- foreign keys you join on (`orders.customer_id`)
- columns in frequent `WHERE` clauses (`orders.status` only if selective)
- columns used for sorting in keyset pagination (`created_at`, `id`)

```sql
CREATE INDEX orders_customer_id_idx ON orders (customer_id);
CREATE INDEX orders_paid_created_id_idx
  ON orders (created_at DESC, id DESC)
  WHERE status = 'paid';
```

The second example is a **partial index**: it only contains paid orders. Smaller indexes are faster when the predicate matches the query.

## Multi-column B-tree order

A B-tree on `(customer_id, created_at)` helps:

- `WHERE customer_id = 42`
- `WHERE customer_id = 42 AND created_at >= ...`

It does **not** help much as a standalone index for `WHERE created_at >= ...` without `customer_id`. Put equality columns first, range columns after, matching the query.

Unique constraints already create unique indexes. Do not duplicate them.

## When an index will not be used

PostgreSQL may still scan the table when:

- the table is tiny
- the predicate matches most rows (`WHERE status = 'paid'` on a table that is 95% paid)
- the column is wrapped in a function
- you asked for so many columns that the heap fetch dominates

An unused index is still paid for on every write. The next page shows how to confirm usage with `EXPLAIN`.

## Maintenance habits

Name indexes after table and columns (`orders_customer_id_idx`). Drop indexes that `pg_stat_user_indexes` shows as unused after a realistic production period. Rebuild is rarely the first fix; bloat and autovacuum belong to the production step.

```sql
SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE relname = 'orders';
```

## Checklist

- Foreign keys used in joins have indexes.
- Composite indexes match real `WHERE`/`ORDER BY` order.
- Partial indexes exist only when a stable predicate is common.
- You can name one query each new index is supposed to help.

## Next step

Read `EXPLAIN ANALYZE` so you stop guessing whether an index is used.
