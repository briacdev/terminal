---
title: Integration Testing
description: "Prove the API and persistence stack together with MockMvc, @SpringBootTest, Testcontainers, and stable test data."
date: 2026-03-25
tags: [spring-boot, testing, testcontainers]
draft: false
readingTime: 12 min
---

## Where this lesson sits

Service rules have unit tests. Integration tests prove the slices that unit tests skip: HTTP, security filters, JPA, and Flyway against a real engine.

## What you will learn

- When to use `@SpringBootTest` and MockMvc
- How Testcontainers keeps PostgreSQL honest
- How to seed data without polluting other tests

## Mental model

An integration test boots (part of) the Spring context. MockMvc calls the dispatcher servlet without a real TCP port. Testcontainers starts PostgreSQL so SQL dialect and constraints match production.

Keep these tests fewer than unit tests. Cover the risky seams: create product, auth rejection, migration compatibility. Do not re-test every branch already covered by Mockito.

Isolate data: `@Transactional` rollback, or unique SKUs per test, or a clean schema per class. Shared mutable rows make tests flake.

## Practical example

```java
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class ProductApiIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void datasource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    MockMvc mockMvc;

    @Test
    void should_create_product() throws Exception {
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sku\":\"SKU-IT-1\",\"name\":\"Bolt\",\"stock\":10}"))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Location"));
    }
}
```

## Common mistakes

- Hitting a shared local Postgres that other developers also mutate
- Sleeping in tests to "wait for the app"
- Copying the entire production `application-prod.yml` into tests

## Next lesson

Next: [Caching Strategy](/spring-boot/caching-strategy).

## Official docs

- [Spring Boot Testcontainers](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html)
- [MockMvc](https://docs.spring.io/spring-framework/reference/testing/spring-mvc-test-framework.html)

## Takeaway

- Integration tests protect seams unit tests cannot see
- Testcontainers makes the database dialect real
- Stable data setup is part of the test, not an afterthought
