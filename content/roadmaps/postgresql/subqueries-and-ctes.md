---
title: Subqueries and CTEs in PostgreSQL
description: Write readable PostgreSQL SQL with independent subqueries, correlated subqueries, and WITH clauses, and know when each shape helps.
date: 2026-04-11
tags: [postgresql, cte, subquery, sql]
draft: false
readingTime: 9 min
---

## Split a hard query into named steps

Long joins with nested aggregates become unreadable. Subqueries and CTEs let you name intermediate results. Readability is the first reason to use them. Performance is a second reason, and it is not automatic.

## Independent subqueries

An independent subquery does not reference the outer row. PostgreSQL can compute it once:

```sql
SELECT id, email
FROM customers
WHERE id IN (
  SELECT customer_id
  FROM orders
  WHERE status = 'paid'
    AND created_at >= now() - interval '7 days'
);
```

`EXISTS` is often clearer when you only care about presence:

```sql
SELECT c.id, c.email
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
    AND o.status = 'paid'
);
```

`EXISTS` can stop at the first match. `IN` with a subquery that returns nulls has surprising three-valued logic; prefer `EXISTS` for "has at least one".

## Correlated subqueries

A correlated subquery uses columns from the outer query. It conceptually runs per row:

```sql
SELECT c.id, c.email,
  (
    SELECT max(o.created_at)
    FROM orders o
    WHERE o.customer_id = c.id
  ) AS last_order_at
FROM customers c;
```

This is easy to write and easy to make slow. If you need several aggregates per customer, join to a grouped subquery instead of correlating three times.

## WITH (CTE)

CTEs name steps:

```sql
WITH paid_orders AS (
  SELECT customer_id, sum(total_cents) AS spent_cents
  FROM orders
  WHERE status = 'paid'
  GROUP BY customer_id
)
SELECT c.email, p.spent_cents
FROM paid_orders p
JOIN customers c ON c.id = p.customer_id
WHERE p.spent_cents >= 10000
ORDER BY p.spent_cents DESC, c.id;
```

Use CTEs when an intermediate set is reused or when the business meaning deserves a name (`paid_orders`, `latest_items`).

From PostgreSQL 12 onward, many non-recursive CTEs can be inlined like subqueries. Do not assume a CTE is an optimization fence. If you need to materialize, say so with `WITH paid_orders AS MATERIALIZED (...)`.

## Recursive CTEs

Recursive `WITH` walks trees (categories, org charts). Skip them until you have a hierarchy. They are a different tool, not a default style.

## When to prefer which

- **EXISTS**: boolean presence
- **Scalar subquery**: one value per outer row, used sparingly
- **Derived table / CTE**: named grouping or filtering step
- **JOIN**: combining two row sets you both need in the result

If a CTE only wraps a simple filter, a `WHERE` clause is enough.

## Checklist

- Presence checks use `EXISTS`.
- Heavy per-row correlated subqueries are rewritten as joins to grouped sets.
- CTEs have names that match the business step.
- You did not add `MATERIALIZED` or extra CTEs "for performance" without measuring.

## Next step

Add B-tree indexes on the columns you actually filter and join.
