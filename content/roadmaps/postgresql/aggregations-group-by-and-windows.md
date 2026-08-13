---
title: GROUP BY, Aggregations, and Window Functions in PostgreSQL
description: Summarize PostgreSQL rows with GROUP BY and HAVING, then use window functions for ranks and running totals without collapsing rows.
date: 2026-04-10
tags: [postgresql, group-by, window-functions, sql]
draft: false
readingTime: 10 min
---

## Two ways to compute over groups

Aggregation collapses rows: one result per group. Window functions keep every row and add a computed column. You need both. Mixing them up is how reports silently lie.

## GROUP BY and aggregates

```sql
SELECT customer_id,
       count(*) AS order_count,
       sum(total_cents) AS spent_cents
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
ORDER BY spent_cents DESC, customer_id;
```

Every selected column must either appear in `GROUP BY` or be wrapped in an aggregate (`count`, `sum`, `avg`, `min`, `max`). PostgreSQL will reject `SELECT email, count(*) FROM customers` without grouping `email`.

Useful extras:

- `count(*)` counts rows
- `count(email)` counts non-null emails
- `bool_or(status = 'paid')` is true if any row in the group is paid

## HAVING vs WHERE

`WHERE` filters rows before grouping. `HAVING` filters groups after aggregation:

```sql
SELECT customer_id, count(*) AS order_count
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING count(*) >= 3;
```

Do not put `count(*) >= 3` in `WHERE`. The count does not exist yet.

## Window functions

Windows compute over a partition without collapsing the result:

```sql
SELECT id,
       customer_id,
       total_cents,
       rank() OVER (
         PARTITION BY customer_id
         ORDER BY total_cents DESC, id
       ) AS amount_rank,
       sum(total_cents) OVER (
         PARTITION BY customer_id
         ORDER BY created_at, id
       ) AS running_spent_cents
FROM orders
WHERE status = 'paid';
```

Each order remains one row. `amount_rank = 1` is that customer's largest paid order. `running_spent_cents` is a running total.

`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG()`, and `LEAD()` are the functions you will use first. `PARTITION BY` is the window equivalent of `GROUP BY`.

## Combine both carefully

A common pattern: aggregate in a subquery, then rank groups.

```sql
SELECT customer_id, spent_cents,
       rank() OVER (ORDER BY spent_cents DESC) AS spend_rank
FROM (
  SELECT customer_id, sum(total_cents) AS spent_cents
  FROM orders
  WHERE status = 'paid'
  GROUP BY customer_id
) totals;
```

That is cleaner than trying to rank and collapse in one messy layer.

## Checklist

- Non-aggregated columns are in `GROUP BY`.
- Row filters use `WHERE`; group filters use `HAVING`.
- Windows are used when you still need the original rows.
- Parent amounts are never summed on an exploded join.

## Next step

Break complex SQL into subqueries and `WITH` clauses you can read six months later.
