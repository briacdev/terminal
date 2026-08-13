---
title: PostgreSQL Databases, Roles, and Schemas
description: Separate PostgreSQL databases, roles, and schemas, then use search_path and naming conventions that stay stable in production.
date: 2026-04-03
tags: [postgresql, schema, roles, search-path]
draft: false
readingTime: 8 min
---

## Why names and namespaces matter

Beginners often create tables in the default `public` schema of the `postgres` database and move on. That works for five minutes and becomes expensive later: objects collide, permissions are too broad, and backups contain junk.

This step teaches the three layers you already connected to: **database**, **role**, and **schema**.

## Database vs schema

A **database** is a hard boundary. You cannot join a table in `shop` with a table in `analytics` in one regular query. You connect to one database at a time.

A **schema** is a namespace inside one database. Tables `shop.customers` and `reporting.customers` can coexist. Most applications use one database and one or two schemas.

```sql
CREATE SCHEMA shop;
CREATE SCHEMA reporting;

CREATE TABLE shop.customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);
```

## search_path

If you write `SELECT * FROM customers`, PostgreSQL looks for `customers` in the schemas listed in `search_path`. Inspect it:

```sql
SHOW search_path;
```

Set it for the current session while you learn:

```sql
SET search_path TO shop, public;
SELECT * FROM customers;
```

For an application role, set a default so the app does not depend on whoever ran `SET` last:

```sql
ALTER ROLE shop_app IN DATABASE shop SET search_path TO shop, public;
```

Unqualified names plus a surprising `search_path` are a classic source of "the table is missing" bugs.

## Roles and privileges

A role can log in (`LOGIN`) or group other roles. Grant the minimum needed:

```sql
GRANT USAGE ON SCHEMA shop TO shop_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA shop TO shop_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA shop
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO shop_app;
```

Keep a superuser for administration only. Application roles should not create extensions or drop databases.

## Naming conventions that age well

Pick rules and keep them:

- databases: `shop`, `shop_test`
- schemas: `shop`, `reporting`
- tables: plural nouns, `snake_case` (`order_items`)
- primary keys: `id`
- foreign keys: `<singular>_id` (`customer_id`)

Do not mix `camelCase` tables with `snake_case` columns. PostgreSQL folds unquoted identifiers to lowercase, which makes quoted mixed-case names a permanent tax.

## What not to do

- Put every experiment in the `postgres` database
- Create a schema per feature every week without a reason
- Leave `public` writable for every role
- Quote identifiers (`"Customers"`) unless you have no choice

## Checklist

- You can explain why a database is not a schema.
- `shop.customers` exists and `search_path` finds it.
- The app role is not a superuser.
- Table and column names follow one convention.

## Next step

Choose data types on purpose. A wrong type is harder to fix than a missing index.
