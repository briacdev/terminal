---
title: Unit Testing
description: "Test Spring Boot services in isolation with JUnit 5, Mockito, and a Given/When/Then structure that stays readable."
date: 2026-03-24
tags: [spring-boot, testing, junit, mockito]
draft: false
readingTime: 10 min
---

## Where this lesson sits

Security choices are made. Before you trust them, you need fast tests of the service layer. This lesson is isolation. HTTP + database tests are lesson 14.

## What you will learn

- What a unit test should cover
- How Mockito replaces collaborators
- How Given / When / Then keeps tests readable

## Mental model

A unit test constructs a service with fake dependencies. It does not start Tomcat and does not need a database. That speed is the point: you can refactor rules without waiting on Docker.

Mock only types at the boundary (repositories, clocks, HTTP clients). Do not mock the class under test. Do not mock records or simple values.

Name tests after behavior: `should_reject_negative_stock_adjustment`, not `test1`.

## Practical example

```java
package com.briac.catalog.product;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    ProductRepository productRepository;

    @InjectMocks
    ProductService productService;

    @Test
    void should_reduce_stock_when_product_exists() {
        ProductEntity stored = ProductEntity.testSku("SKU-1", 8);
        when(productRepository.findBySku("SKU-1")).thenReturn(Optional.of(stored));

        int remaining = productService.reserve("SKU-1", 3);

        assertEquals(5, remaining);
    }

    @Test
    void should_fail_when_stock_is_insufficient() {
        when(productRepository.findBySku("SKU-1"))
            .thenReturn(Optional.of(ProductEntity.testSku("SKU-1", 1)));

        assertThrows(IllegalStateException.class, () -> productService.reserve("SKU-1", 3));
    }
}
```

## Common mistakes

- `@SpringBootTest` on every service test
- Mocking half of the class under test
- Asserting that a mock was called instead of asserting the business result

## Next lesson

Next: [Integration Testing](/spring-boot/integration-testing).

## Official docs

- [Spring Boot testing](https://docs.spring.io/spring-boot/reference/testing/index.html)
- [JUnit 5](https://junit.org/junit5/docs/current/user-guide/)

## Takeaway

- Unit tests are fast because they skip the network and the database
- Mockito stands in for repositories, not for the service itself
- Behavior names beat method-copy names
