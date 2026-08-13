---
title: Layered Design
description: "Keep controllers thin, put business rules in services, and map DTOs so persistence models stay internal."
date: 2026-03-18
tags: [spring-boot, architecture, dto]
draft: false
readingTime: 10 min
---

## Where this lesson sits

You can accept HTTP and reject bad payloads. This lesson is structure: who owns HTTP, who owns rules, who will own persistence in the next lessons.

## What you will learn

- The controller / service / repository split
- Why business rules do not live in controllers
- Why APIs expose DTOs, not persistence types

## Mental model

Three layers, one job each:

- **Controller**: HTTP in and out, status codes, validation trigger
- **Service**: rules, orchestration, transactions later
- **Repository**: load and save. In this lesson it can still be a Map. Lesson 8 replaces it with Spring Data.

DTOs sit at the HTTP boundary. Persistence models sit at the database boundary. Mapping is boring and necessary. If you return an entity, a later `@OneToMany` will leak into JSON and lazy-loading will explode during serialization.

Keep services unaware of `HttpServletRequest`. Keep repositories unaware of JSON records.

## Practical example

```java
package com.briac.catalog.product;

public record ProductDraft(String sku, String name, int stock) {}
public record ProductView(String sku, String name, int stock) {}
```

```java
package com.briac.catalog.product;

import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductView create(ProductDraft draft) {
        if (productRepository.exists(draft.sku())) {
            throw new IllegalStateException("sku already exists");
        }
        return productRepository.save(draft);
    }
}
```

The controller maps `CreateProductRequest` to `ProductDraft` and `ProductView` to `ProductResponse`. The service never imports `org.springframework.web`.

## Go further on the blog

DTO mechanics are covered in [Understanding DTOs in Java Spring Boot](/blog/understanding-dtos-in-java-spring-boot). This lesson only places DTOs in the layer diagram.

## Common mistakes

- Injecting a repository into a controller and calling it "simpler"
- Sharing one class as entity, request, and response
- Putting authorization or HTTP headers inside a service

## Next lesson

Next: [Spring Data JPA Basics](/spring-boot/spring-data-jpa-basics).

## Official docs

- [Spring Boot web](https://docs.spring.io/spring-boot/reference/web/servlet.html)

## Takeaway

- Each layer has one reason to change
- DTOs protect the API from the database
- Services stay HTTP-free so they stay testable
