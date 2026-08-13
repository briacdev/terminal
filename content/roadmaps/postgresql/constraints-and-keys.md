---
title: Constraints and Keys in PostgreSQL
description: Use NOT NULL, UNIQUE, CHECK, primary keys, and foreign keys so PostgreSQL rejects invalid rows at write time.
date: 2026-04-05
tags: [postgresql, constraints, primary-key, foreign-key]
draft: false
readingTime: 9 min
---

## Let the database refuse bad data

Application validation is necessary. It is not sufficient. A second writer, a script, or a bug will eventually insert a row the API never intended. Constraints are the last line of defense.

This step covers the constraints you should put on almost every table: `NOT NULL`, `UNIQUE`, `CHECK`, primary keys, and foreign keys.

## Primary keys

A primary key uniquely identifies a row and is never null. For the shop schema, `id` is a surrogate key:

```sql
CREATE TABLE customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);
```

`PRIMARY KEY` already implies `UNIQUE` and `NOT NULL`. You still add `UNIQUE` on `email` because email is a business key, not the row identifier.

Natural keys (`email` as primary key) look attractive until the business allows an email change. Surrogate `id` plus unique business columns is the usual production pattern.

## Foreign keys

Foreign keys keep relationships real:

```sql
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers (id),
  status text NOT NULL,
  total_cents integer NOT NULL
);
```

`REFERENCES customers (id)` rejects an order whose customer does not exist. Decide `ON DELETE` explicitly when you create the key:

- `RESTRICT` / `NO ACTION`: refuse to delete a customer that still has orders
- `CASCADE`: delete dependent rows (dangerous for money data)
- `SET NULL`: only if the column is nullable and "orphaned" is a valid state

For orders, `RESTRICT` is the safe default.

## NOT NULL, UNIQUE, CHECK

```sql
ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
    CHECK (status IN ('draft', 'paid', 'cancelled')),
  ADD CONSTRAINT orders_total_cents_check
    CHECK (total_cents >= 0);
```

`NOT NULL` is a constraint. Nullable columns should be rare and meaningful ("unknown" or "not applicable"), not a side effect of skipping defaults.

Name constraints (`orders_status_check`) so error messages and migrations stay readable.

## Multi-column uniqueness

Some rules span two columns:

```sql
CREATE TABLE order_items (
  order_id bigint NOT NULL REFERENCES orders (id),
  product_id bigint NOT NULL REFERENCES products (id),
  quantity integer NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (order_id, product_id)
);
```

That primary key says: one product line per order. A second insert of the same pair fails.

## What constraints do not replace

Constraints do not replace indexes you add for read performance, and they do not replace transactions. They also cannot express every business rule (discounts that depend on a remote service). Put the mechanical rules in PostgreSQL. Keep the fuzzy rules in the application.

## Common mistakes

- Nullable foreign keys that should be required
- No `CHECK` on status, then ten spellings of `cancelled`
- Relying on the ORM "unique" option without a real unique index
- `ON DELETE CASCADE` on financial tables

## Checklist

- Every table has a primary key.
- Foreign keys exist for real relationships.
- Status and amounts have `CHECK` constraints.
- Constraint names are stable and readable.

## Next step

Design tables and relationships: one-to-many, many-to-many, and how far to normalize.
