---
title: Spring Data JPA Basics
description: "Persist data with Spring Data JPA: entities, repositories, CRUD methods, pagination, and query-method naming."
date: 2026-03-19
tags: [spring-boot, jpa, persistence]
draft: false
readingTime: 12 min
---

## Where this lesson sits

Layers are in place. Persistence now becomes real: entities, repositories, CRUD, and pagination. Dynamic filters wait until lesson 9. Schema versioning waits until lesson 10.

## What you will learn

- How to map a table with `@Entity`
- How `JpaRepository` gives CRUD and paging
- How query methods map to SQL by name

## Mental model

An entity is a persistence model, not an API model. A repository is a collection-like interface. Spring Data generates the implementation from the method name or from `@Query`.

Start with:

- `@Id` and a generated primary key
- `LAZY` associations when you add relations later
- `Pageable` for lists, never unbounded `findAll()` in an API

Transactions belong on the service, usually via `@Transactional` on write methods. Controllers stay transaction-free.

## Practical example

```java
package com.briac.catalog.product;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;

    private String name;
    private int stock;
}
```

```java
package com.briac.catalog.product;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    Optional<ProductEntity> findBySku(String sku);
    Page<ProductEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);
    boolean existsBySku(String sku);
}
```

You need `spring-boot-starter-data-jpa` and a driver. Local can be PostgreSQL or H2; production should match PostgreSQL if that is your real database.

## Go further on the blog

Wiring PostgreSQL is in [Setting up PostgreSQL in a Spring Boot project](/blog/setting-up-postgresql-in-a-spring-boot-project-with-spring-data-jpa). H2 for experiments is in [Introduction to H2](/blog/introduction-to-h2-database-in-spring-boot). Transactions are in [Understanding @Transactional](/blog/understanding-the-transactional-annotation-in-spring-boot). Read models are in [JPA projections](/blog/understanding-jpa-projections-in-spring-boot). This lesson only installs the repository habit.

## Common mistakes

- Returning `ProductEntity` from a REST controller
- Using `EAGER` on collections "to make JSON work"
- Calling `findAll()` without paging on a growing table

## Next lesson

Next: [CriteriaBuilder and Dynamic Queries](/spring-boot/criteriabuilder-and-dynamic-queries).

## Official docs

- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/)
- [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa)

## Takeaway

- Entities stay inside the persistence layer
- Query methods cover simple lookups
- Lists are pages, not unbounded dumps
