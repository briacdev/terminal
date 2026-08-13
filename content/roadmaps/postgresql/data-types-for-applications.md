---
title: PostgreSQL Data Types for Application Design
description: Choose practical PostgreSQL types for IDs, money, time, text, and booleans so your schema matches real application data.
date: 2026-04-04
tags: [postgresql, data-types, schema, modeling]
draft: false
readingTime: 10 min
---

## Pick types for how the app uses the data

This page is not a catalog of every PostgreSQL type. The blog already covers that survey. Here the job is narrower: choose types that match application facts and stay cheap to query.

Wrong types create silent bugs: rounding money, storing local time as UTC, or using `varchar(255)` as a substitute for thinking.

## Types you will use constantly

### Identity and integers

Prefer `bigint GENERATED ALWAYS AS IDENTITY` for surrogate keys in new tables:

```sql
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  stock integer NOT NULL DEFAULT 0
);
```

Use `integer` for small counts. Use `bigint` for primary keys so you do not outgrow them. Avoid `serial` in new designs; identity is the SQL-standard replacement.

### Money and exact numbers

Never store currency in `float` or `double precision`. Use `numeric` for exact decimals, or store minor units as `integer` (`total_cents`):

```sql
CREATE TABLE payments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency char(3) NOT NULL
);
```

`numeric` is right when the scale is not fixed. Integers are simpler when every amount is cents.

### Time

Use `timestamptz` for events that happen in the real world (`created_at`, `paid_at`). Use `date` for calendar days (`birth_date`, `delivery_date`). Use `interval` for durations.

```sql
created_at timestamptz NOT NULL DEFAULT now()
```

`timestamp` without time zone looks simpler and then becomes ambiguous across servers.

### Text

Prefer `text` unless a short code truly has a fixed length (`currency char(3)`). A `varchar(n)` limit is a business rule. Put it in a `CHECK` or in the application if the rule may change. Do not copy `varchar(255)` from old MySQL habits by default.

### Booleans and enums

`boolean` is perfect for true/false flags. For a small closed set of statuses, a `text` column plus `CHECK` is often clearer than a PostgreSQL `ENUM`, because changing enum values requires migrations that are easy to get wrong.

```sql
status text NOT NULL CHECK (status IN ('draft', 'paid', 'cancelled'))
```

## Types to postpone

You will meet `jsonb`, arrays, `tsvector`, and `uuid` later. Do not start a first schema as "everything is JSON" or "every id is UUID" unless you have a reason. Relational columns stay easier to constrain and join.

If you need a UUID because ids are generated outside the database, `uuid` is a valid primary key type. It is a choice, not a default.

## A compact shop schema

```sql
CREATE TABLE customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers (id),
  status text NOT NULL CHECK (status IN ('draft', 'paid', 'cancelled')),
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

This schema is reused in the next SQL pages. Keep it.

## Checklist

- IDs use identity `bigint` unless you have a UUID requirement.
- Money is `numeric` or integer cents, never float.
- Event times are `timestamptz`.
- Status values are constrained, not free text.

## Next step

Add constraints and keys so illegal rows cannot enter the table, even if the application has a bug.
