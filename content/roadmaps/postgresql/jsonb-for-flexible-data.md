---
title: JSONB in PostgreSQL for Flexible Data
description: Use PostgreSQL JSONB for optional attributes while keeping relational columns for IDs, amounts, status, and join keys.
date: 2026-04-16
tags: [postgresql, jsonb, json, modeling]
draft: false
readingTime: 10 min
---

## JSONB is a column type, not a schema strategy

PostgreSQL can store JSON as `json` or `jsonb`. `jsonb` is the one you want for application data: it is parsed, stored in binary form, and indexable. This page is about **when** to use it. A dedicated blog article already walks through JSON operators in depth. Do not copy that catalog here.

Keep IDs, foreign keys, money, status, and timestamps as real columns. Put JSONB on attributes that vary by row and are not worth a migration every week.

## JSON vs JSONB

`json` stores the original text, including key order and duplicate keys. `jsonb` stores a decomposed value. Equality, containment, and GIN indexes work on `jsonb`. For new columns, use `jsonb`.

```sql
ALTER TABLE products
  ADD COLUMN attributes jsonb NOT NULL DEFAULT '{}'::jsonb;
```

## A healthy mixed model

```sql
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb
);

UPDATE products
SET attributes = jsonb_build_object('color', 'black', 'weight_g', 42)
WHERE sku = 'SKU-1';
```

You can still query JSONB when needed:

```sql
SELECT sku, name
FROM products
WHERE attributes ->> 'color' = 'black';
```

If `color` becomes a filter on every listing page, promote it to a real column. JSONB is for the long tail, not for the primary access path.

## Indexing JSONB

A GIN index supports containment (`@>`):

```sql
CREATE INDEX products_attributes_gin ON products USING gin (attributes);

SELECT sku
FROM products
WHERE attributes @> '{"color": "black"}'::jsonb;
```

Expression indexes help a single extracted field:

```sql
CREATE INDEX products_color_idx
  ON products ((attributes ->> 'color'));
```

Do not GIN-index a JSONB column you never filter. The write cost is real.

## Constraints on JSON

You can require keys with `CHECK (attributes ? 'color')` or validate shape with `jsonb_typeof`. Keep these checks small. If the document has a strict schema, it probably wanted columns.

## What to avoid

- Storing the entire order as one JSON blob
- Duplicating `customer_id` only inside JSON
- Querying `attributes::text LIKE '%black%'`
- Using `json` because "it keeps formatting"

## Checklist

- Core facts are columns; JSONB holds optional extras.
- New JSON columns are `jsonb`, not `json`.
- Filters you run every minute have a GIN or expression index, or became columns.
- Containment queries use `@>`, not text search on JSON.

## Next step

Add full-text search for human language, which is a different tool from JSONB containment.
