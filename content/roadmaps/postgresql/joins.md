---
title: PostgreSQL Joins Explained
description: Use INNER JOIN and LEFT JOIN in PostgreSQL without duplicating rows, and keep join SQL readable with aliases.
date: 2026-04-09
tags: [postgresql, joins, sql, inner-join]
draft: false
readingTime: 9 min
---

## Joins reconstruct relationships

You split data across tables on purpose. Joins put those facts back together for a query. The modeling step created `customers`, `orders`, and `order_items`. This step reads them as one result.

## INNER JOIN

`INNER JOIN` keeps rows that match on both sides:

```sql
SELECT o.id AS order_id,
       c.email,
       o.status,
       o.total_cents
FROM orders o
INNER JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'paid'
ORDER BY o.created_at DESC, o.id DESC;
```

If a customer has no paid orders, that customer does not appear. If an order pointed at a missing customer, foreign keys already prevented that row.

## LEFT JOIN

`LEFT JOIN` keeps every row from the left table. Missing matches become `NULL` on the right:

```sql
SELECT c.id,
       c.email,
       o.id AS order_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
ORDER BY c.id, o.id;
```

Customers without orders still appear, with `order_id` null. That is how you find "registered but never purchased".

Filter on the right table in `ON`, not in `WHERE`, when you need to keep unmatched left rows:

```sql
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.id
 AND o.status = 'paid'
```

`WHERE o.status = 'paid'` after a left join turns it into an inner join, because `NULL = 'paid'` is unknown and the row disappears.

## Row explosion

Joining `orders` to `order_items` multiplies rows: one order with three items becomes three result rows. That is correct for line-level reports. It is wrong if you then `SUM(o.total_cents)` and accidentally triple the order total.

When you need order totals plus item details, either:

- aggregate items in a subquery / CTE, then join once per order, or
- return items as JSON with `json_agg` after grouping

Do not `SUM` a parent column on a child join.

## Aliases and join style

Use short aliases (`c`, `o`, `oi`) and qualify every column. PostgreSQL still accepts `FROM a, b WHERE a.id = b.a_id`. Prefer explicit `JOIN ... ON` so the relationship is visible and `CROSS JOIN` cannot hide in a missing condition.

`RIGHT JOIN` is `LEFT JOIN` with the tables flipped. `FULL JOIN` keeps unmatched rows from both sides. You will rarely need either in application SQL.

## Checklist

- `INNER JOIN` for required matches, `LEFT JOIN` for optional ones.
- Filters on the optional table live in `ON` when you want to keep unmatched rows.
- You never aggregate a parent amount across a child join without grouping carefully.
- Every selected column is qualified.

## Next step

Summarize rows with `GROUP BY`, `HAVING`, and window functions.
