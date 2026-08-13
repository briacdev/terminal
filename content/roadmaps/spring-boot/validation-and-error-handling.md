---
title: Validation and Error Handling
description: "Validate incoming payloads with Bean Validation and return one consistent API error contract from a global handler."
date: 2026-03-17
tags: [spring-boot, validation, errors]
draft: false
readingTime: 11 min
---

## Where this lesson sits

Endpoints exist. Clients will send empty names and negative stock. This lesson is the boundary contract: validate input and return one error shape.

## What you will learn

- How Bean Validation annotates request records
- How `@RestControllerAdvice` centralizes exceptions
- How to keep a stable JSON error body

## Mental model

Validate at the edge. `@Valid` on the `@RequestBody` runs constraints before your method body. Constraint violations should not leak as a stack trace or as a different JSON shape per controller.

A global `@ExceptionHandler` maps:

- `MethodArgumentNotValidException` to `400`
- domain "not found" to `404`
- unexpected failures to `500` without internal details

The error body is a contract, same as a success body. Clients should parse `code` and `message` everywhere.

## Practical example

```java
package com.briac.catalog.web;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateProductRequest(
    @NotBlank String sku,
    @NotBlank String name,
    @Min(0) int stock
) {}
```

```java
@PostMapping
ResponseEntity<ProductResponse> create(@Valid @RequestBody CreateProductRequest request) {
    // mapping only
}
```

```java
package com.briac.catalog.web;

public record ApiError(String code, String message, String field) {}
```

```java
package com.briac.catalog.web;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ApiError invalid(MethodArgumentNotValidException ex) {
        var field = ex.getBindingResult().getFieldErrors().get(0);
        return new ApiError("VALIDATION_ERROR", field.getDefaultMessage(), field.getField());
    }
}
```

## Common mistakes

- Returning a different error JSON from each controller
- Swallowing validation failures and returning `200`
- Putting `try/catch` in every method instead of one advice class

## Next lesson

Next: [Layered Design](/spring-boot/layered-design).

## Official docs

- [Bean Validation](https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html)
- [Annotated controllers: exceptions](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html)

## Takeaway

- Constraints belong on the request record
- One advice class owns HTTP error mapping
- Error JSON is part of the public API
