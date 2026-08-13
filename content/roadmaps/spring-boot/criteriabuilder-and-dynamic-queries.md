---
title: CriteriaBuilder and Dynamic Queries
description: "Build type-safe, composable filters with CriteriaBuilder and Spring Data JPA Specifications when query methods are not enough."
date: 2026-03-20
tags: [spring-boot, jpa, specifications]
draft: false
readingTime: 11 min
---

## Where this lesson sits

`findBySku` is not enough when the catalog UI sends optional filters: name, min stock, in-stock only. Query methods explode into `findByNameAndStockGreaterThanAnd...`. Specifications keep those filters composable.

## What you will learn

- When query methods stop scaling
- How CriteriaBuilder builds type-safe predicates
- How to compose Spring Data `Specification`s

## Mental model

A `Specification` is a function: `(root, query, cb) -> Predicate`. You combine them with `and` / `or`. Missing request params become `null` specs that you skip, instead of a combinatorial method list.

This is still a read-path tool. Do not hide writes behind giant criteria updates. Keep write paths as explicit service methods.

The blog post on JPA Specifications walks through pagination plus a full search form. This lesson only teaches composition so you do not copy that article.

## Practical example

```java
package com.briac.catalog.product;

import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecifications {
    private ProductSpecifications() {}

    public static Specification<ProductEntity> nameContains(String name) {
        return (root, query, cb) -> name == null || name.isBlank()
            ? cb.conjunction()
            : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<ProductEntity> stockAtLeast(Integer min) {
        return (root, query, cb) -> min == null
            ? cb.conjunction()
            : cb.greaterThanOrEqualTo(root.get("stock"), min);
    }
}
```

```java
public interface ProductRepository extends JpaRepository<ProductEntity, Long>, JpaSpecificationExecutor<ProductEntity> {}
```

```java
var spec = ProductSpecifications.nameContains(name)
    .and(ProductSpecifications.stockAtLeast(minStock));
return productRepository.findAll(spec, pageable);
```

## Go further on the blog

A complete search-and-page walkthrough is in [JPA Specifications in Spring Boot](/blog/jpa-specifications-in-spring-boot-pagination-and-dynamic-search).

## Common mistakes

- Creating one repository method per UI checkbox combination
- Building JPQL with string concatenation
- Forgetting `JpaSpecificationExecutor` on the repository

## Next lesson

Next: [Database Migrations](/spring-boot/database-migrations).

## Official docs

- [JPA Specifications](https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html)
- [Criteria API](https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1#a4665)

## Takeaway

- Optional filters belong in composable specifications
- CriteriaBuilder keeps predicates type-safe
- Query methods stay for the simple, named lookups
