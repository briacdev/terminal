---
title: Data - JPA and Hibernate
description: "Use JPA/Hibernate effectively: entity mapping, lazy vs eager loading, N+1 prevention, transactions, and safe API projection patterns."
date: 2025-01-13
tags: [java, data, jpa, hibernate]
draft: false
readingTime: 17 min
---

## Why this step matters

JPA/Hibernate accelerates development, but hidden query behavior can create major performance issues if misunderstood.

Treat the ORM as a productivity layer on top of SQL, not a replacement for SQL literacy.

## Entity mapping basics

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;
}
```

Core annotations:

- `@Entity`, `@Table`
- `@Id`, `@GeneratedValue`
- relation mapping (`@OneToMany`, `@ManyToOne`, `@ManyToMany`)
- `@Column` for constraints and naming

Keep entities focused on persistence concerns.

## Relationships and ownership

Decide which side owns the foreign key.
Prefer `@ManyToOne` on the child side for simpler mapping.
Bidirectional relations need careful synchronization of both sides.

## Lazy vs eager loading

- `LAZY`: load relation only when accessed
- `EAGER`: load relation immediately

Default recommendation: prefer `LAZY` and fetch intentionally for each use case.

Accessing a lazy association outside an open persistence context causes lazy-loading failures.

## N+1 query problem

N+1 appears when you load a list of entities, then lazily load each relation one by one.

Typical mitigations:

- `JOIN FETCH` in JPQL
- entity graphs
- DTO / projection queries for read models
- batch fetching where appropriate

Always inspect SQL logs in development.

## Transaction boundaries

Keep transactions around coherent business operations.

```java
@Transactional
public void processOrder(Long orderId) {
    // load, validate, update, persist
}
```

Do not keep transactions open while calling remote HTTP APIs.
Flush and commit timing affect when constraints are checked.

## Read models vs write models

- write path: entities and aggregates
- read path: projections / DTOs tailored to the screen or API

Returning entities directly from public APIs often leaks persistence details and triggers accidental lazy loads.

## Practical advice

- distinguish write-model entities from read DTO/projections
- log SQL in development to understand generated queries
- measure before tuning fetch strategies
- write integration tests for critical data flows

## Common mistakes

- default eager loading everywhere
- returning entities directly in public APIs
- ignoring flush/transaction timing
- no test coverage for data-access behavior
- fixing N+1 by adding more eager fetches blindly

## Practice checklist

- map a simple entity with id and unique email
- reproduce an N+1 in logs, then fix it with `JOIN FETCH` or a projection
- wrap a multi-step write in `@Transactional`
- return a DTO instead of an entity from a service method

## Takeaway

1. JPA boosts productivity, but SQL understanding is still required
2. Manage loading strategy intentionally
3. Watch for N+1 and fix with explicit fetch strategy
4. Keep transaction scope clear and minimal
