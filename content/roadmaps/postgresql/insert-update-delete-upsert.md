---
title: INSERT, UPDATE, DELETE, and UPSERT in PostgreSQL
description: Insert, update, and delete PostgreSQL rows safely with WHERE, RETURNING, and ON CONFLICT upserts for idempotent writes.
date: 2026-04-08
tags: [postgresql, insert, update, upsert, sql]
draft: false
readingTime: 9 min
---

## Writes need as much care as reads

A read with a missing `WHERE` is slow. A write with a missing `WHERE` is a production incident. This step covers the four write shapes you will use constantly.

## INSERT

```sql
INSERT INTO customers (email)
VALUES ('ada@example.com')
RETURNING id, email, created_at;
```

`RETURNING` gives the generated `id` without a second query. Insert several rows in one statement when they belong together:

```sql
INSERT INTO products (sku, name)
VALUES
  ('SKU-1', 'Notebook'),
  ('SKU-2', 'Pencil');
```

## UPDATE

Always include `WHERE`. Start in a transaction when you are unsure:

```sql
BEGIN;

UPDATE orders
SET status = 'paid'
WHERE id = 10
  AND status = 'draft'
RETURNING id, status;

COMMIT;
```

The `status = 'draft'` predicate makes the update idempotent: running it twice does not move a cancelled order to paid.

## DELETE

Prefer soft deletes (`deleted_at`) for business records you may need to audit. Use `DELETE` for truly disposable rows:

```sql
DELETE FROM order_items
WHERE order_id = 10
  AND product_id = 3
RETURNING *;
```

Never run `DELETE FROM order_items;` against a shared database. `TRUNCATE` is even more final and bypasses some row-level triggers. Treat it as an admin tool.

## UPSERT with ON CONFLICT

Idempotent APIs often need "insert, or update if it exists":

```sql
INSERT INTO customers (email)
VALUES ('ada@example.com')
ON CONFLICT (email)
DO UPDATE SET email = EXCLUDED.email
RETURNING id, email;
```

`EXCLUDED` refers to the would-be inserted row. You need a unique constraint or unique index on the conflict target (`email`).

`DO NOTHING` is useful when duplicates are harmless:

```sql
INSERT INTO products (sku, name)
VALUES ('SKU-1', 'Notebook')
ON CONFLICT (sku) DO NOTHING;
```

## Bulk writes

Prefer one statement for a batch over a loop of single-row inserts from the application. If you must stream many rows, `COPY` is the bulk tool. Keep application loops for low-volume work only.

## Common mistakes

- `UPDATE` or `DELETE` without `WHERE`
- Catching unique violations in the app instead of using `ON CONFLICT`
- Updating a row without checking its current status
- Inserting children before the parent exists (foreign keys will stop you; insert in order)

## Checklist

- Every `UPDATE`/`DELETE` has a selective `WHERE`.
- Writes that need generated values use `RETURNING`.
- Upserts target a real unique constraint.
- Status changes are conditional on the previous status.

## Next step

Connect tables with joins so you can read an order and its customer in one query.
