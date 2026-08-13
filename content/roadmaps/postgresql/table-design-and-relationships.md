---
title: Table Design and Relationships in PostgreSQL
description: Design PostgreSQL tables for one-to-many and many-to-many relationships, with practical normalization and key choices.
date: 2026-04-06
tags: [postgresql, modeling, normalization, relationships]
draft: false
readingTime: 10 min
---

## Design tables around facts, not screens

A UI screen is a bad schema. If you copy a checkout page into one wide table, you will duplicate customer emails, lose history, and make reporting painful. Model the facts: who the customer is, what was ordered, and which products were in the order.

This step sits after types and constraints because relationships only work when keys exist.

## One-to-many

One customer has many orders. The "many" side stores the foreign key:

```sql
CREATE TABLE customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);

CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers (id),
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Do not store a comma-separated `order_ids` column on `customers`. That pattern breaks joins, constraints, and indexes.

## Many-to-many

An order contains many products, and a product appears in many orders. That needs a join table:

```sql
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  name text NOT NULL
);

CREATE TABLE order_items (
  order_id bigint NOT NULL REFERENCES orders (id),
  product_id bigint NOT NULL REFERENCES products (id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  PRIMARY KEY (order_id, product_id)
);
```

`unit_price_cents` lives on `order_items`, not only on `products`. Product prices change. The order must remember the price at purchase time.

## How far to normalize

Normalization removes duplicate facts. Third normal form is a good default for transactional apps:

- one fact in one place
- no repeating groups
- no attributes that depend on another non-key attribute

Stop before the schema becomes a maze. Storing `total_cents` on `orders` can be acceptable if you treat it as a stored snapshot of the line items and keep it consistent in a transaction. Derived values that change constantly are better computed in queries.

## Surrogate vs natural keys

Use a surrogate `id` as the primary key in most application tables. Keep natural keys (`email`, `sku`) as `UNIQUE` columns. Natural primary keys become painful when the business value can change or when you need a stable identifier in URLs and foreign keys.

## One-to-one

Rare, but valid: a `customer_profiles` table with `customer_id` as both primary key and foreign key. Split a table only when the extra columns are optional, large, or owned by another bounded context.

## Design questions that keep you honest

Before adding a column, ask:

- Is this a fact about this entity, or about a related entity?
- Can it have several values over time? Then it may need its own table.
- Will I filter or join on it? Then it should be a real column, not a note in JSON.

JSONB comes later for attributes that truly vary. Core relationships stay relational.

## Checklist

- One-to-many uses a foreign key on the many side.
- Many-to-many uses an explicit join table.
- Historical values (price paid) are stored where the event happened.
- Unique business keys exist even when `id` is the primary key.

## Next step

Read data with `SELECT`, `WHERE`, `ORDER BY`, and pagination that stays stable.
