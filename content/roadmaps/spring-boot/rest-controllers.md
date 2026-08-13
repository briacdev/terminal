---
title: REST Controllers
description: "Build HTTP endpoints with Spring MVC: request mappings, request/response records, and correct status codes."
date: 2026-03-16
tags: [spring-boot, rest, api]
draft: false
readingTime: 11 min
---

## Where this lesson sits

Config is externalized. This lesson is the HTTP surface: mappings, records, and status codes. Validation and a global error body wait until lesson 6. Layers wait until lesson 7.

## What you will learn

- How `@RestController` maps HTTP to methods
- How to keep request and response payloads as records
- Which status codes to return for create, read, and missing resources

## Mental model

A REST controller is a translation layer. It reads HTTP, calls a method, and writes HTTP. It should not talk to the database. For this lesson a tiny in-memory service is enough so you can focus on the contract.

Use nouns in paths (`/products`, `/products/{sku}`). Use HTTP verbs for actions. Return `201` with a `Location` header on create, `200` on read, `404` when the sku is unknown.

Records make the JSON contract explicit. Do not return a JPA entity from a controller; that coupling belongs to later data lessons, and you do not have JPA yet.

## Practical example

```java
package com.briac.catalog.web;

public record ProductResponse(String sku, String name, int stock) {}
public record CreateProductRequest(String sku, String name, int stock) {}
```

```java
package com.briac.catalog.web;

import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final Map<String, ProductResponse> catalog = new ConcurrentHashMap<>();

    @GetMapping("/{sku}")
    ResponseEntity<ProductResponse> get(@PathVariable String sku) {
        ProductResponse product = catalog.get(sku);
        return product == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(product);
    }

    @PostMapping
    ResponseEntity<ProductResponse> create(@RequestBody CreateProductRequest request) {
        ProductResponse created = new ProductResponse(request.sku(), request.name(), request.stock());
        catalog.put(created.sku(), created);
        return ResponseEntity.created(URI.create("/products/" + created.sku())).body(created);
    }
}
```

## Go further on the blog

HTTP method and status-code design is expanded in [Understanding RESTful APIs](/blog/understanding-restful-apis-a-guide-with-spring-boot) and [Best practices for RESTful API design](/blog/best-practices-for-restful-api-design). This lesson only builds the mapping habit.

## Common mistakes

- Returning `200` for a create, or `200` with an empty body for a missing resource
- Putting SQL or business rules inside the controller
- Using verbs in URLs (`/createProduct`) instead of HTTP methods

## Next lesson

Next: [Validation and Error Handling](/spring-boot/validation-and-error-handling).

## Official docs

- [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service)
- [Web on Servlet Stack](https://docs.spring.io/spring-framework/reference/web/webmvc.html)

## Takeaway

- Controllers translate HTTP; they are not the business layer
- Records document the JSON contract
- Status codes are part of the API, not an afterthought
