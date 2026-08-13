---
title: Database Migrations
description: "Version your schema with Flyway so local, staging, and production databases evolve in the same controlled order."
date: 2026-03-21
tags: [spring-boot, flyway, migrations]
draft: false
readingTime: 10 min
---

## Where this lesson sits

Entities imply a schema. Hibernate `ddl-auto=update` is not a release process. Flyway versions the schema the same way Git versions code.

## What you will learn

- Why schema changes belong in versioned scripts
- How Flyway names and orders migrations
- How to keep local, staging, and production aligned

## Mental model

Each migration is an immutable SQL file: `V1__create_products.sql`, `V2__add_product_sku_index.sql`. Flyway records applied versions in `flyway_schema_history`. Never edit a script that already ran in shared environments. Add `V3`.

Repeatable migrations (`R__`) are for views you can rebuild. Versioned migrations are for tables and data backfills.

Turn off Hibernate schema generation in every environment that uses Flyway. One writer of the schema.

## Practical example

```sql
-- src/main/resources/db/migration/V1__create_products.sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0
);
```

```yaml
spring:
  flyway:
    enabled: true
  jpa:
    hibernate:
      ddl-auto: validate
```

`validate` fails fast if the entity mapping does not match the migrated schema. That is what you want before production.

## Go further on the blog

A longer Flyway setup with examples is in [Flyway for database migrations in Spring Boot applications](/blog/flyway-for-database-migrations-in-spring-boot-applications). This lesson only places Flyway in the learning path.

## Common mistakes

- Using `ddl-auto=update` in production
- Rewriting `V1` after it ran on staging
- Hand-running SQL in prod that does not exist as a migration

## Next lesson

Next: [Security Fundamentals](/spring-boot/security-fundamentals).

## Official docs

- [Flyway with Spring Boot](https://docs.spring.io/spring-boot/reference/howto/data-initialization.html#howto.data-initialization.migration-tool.flyway)
- [Flyway documentation](https://documentation.red-gate.com/flyway)

## Takeaway

- Schema history is code
- Migrations are append-only in shared environments
- Hibernate validates; Flyway migrates
