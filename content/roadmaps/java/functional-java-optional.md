---
title: Functional Java - Optional
description: "Model missing values safely with Java Optional: map, flatMap, orElseGet, orElseThrow, and API-boundary best practices."
date: 2025-01-05
tags: [java, functional, optional, null-safety]
draft: false
readingTime: 14 min
---

## Why this step matters

`null` is a frequent source of production bugs.
`Optional` helps model absence explicitly and avoid hidden `NullPointerException`.

Use it to make “maybe missing” part of the type system at API boundaries.

## Core idea

`Optional<T>` means: value may or may not be present.

```java
Optional<String> token = Optional.of("abc");
Optional<String> missing = Optional.empty();
```

Use:

- `of(...)` when value is guaranteed non-null
- `ofNullable(...)` when value may be null
- `empty()` for no value

## Common operations

```java
Optional<String> email = Optional.ofNullable("briac@example.com");

String domain = email
    .map(e -> e.substring(e.indexOf("@") + 1))
    .orElse("unknown");

System.out.println(domain); // example.com
```

- `map`: transform if present
- `flatMap`: chain Optional-returning calls
- `orElse` / `orElseGet`: fallback values
- `orElseThrow`: fail explicitly
- `ifPresent` / `ifPresentOrElse`: side-effect style handling

## `map` vs `flatMap`

The key difference is the return shape.

- `map` applies a function `T -> R` and returns `Optional<R>`
- `flatMap` applies a function `T -> Optional<R>` and returns `Optional<R>` (flattened)

If your mapper already returns an `Optional`, `map` creates nesting.

```java
Optional<User> user = findUser("briac");

Optional<Optional<String>> wrong = user.map(u -> findCityByUser(u.id()));
Optional<String> correct = user.flatMap(u -> findCityByUser(u.id()));
```

Use `map` when your mapper returns a plain value:

```java
Optional<String> username = user.map(User::username);
```

Use `flatMap` when your mapper returns an `Optional`:

```java
Optional<String> city = user.flatMap(u -> findCityByUser(u.id()));
```

## API boundary best practices

Good:

- return `Optional<T>` from query-like methods (`findById`)

Avoid:

- fields of type `Optional` in entities/DTOs
- `Optional` as method parameters in most cases
- returning `null` from a method that already returns `Optional`

## `orElse` vs `orElseGet`

`orElse` always evaluates its argument.
`orElseGet` computes fallback lazily.

```java
String value = optional.orElseGet(() -> expensiveFallback());
```

Prefer `orElseGet` when fallback is costly.
Prefer `orElseThrow` when absence is a real error.

## Common mistakes

- using `Optional.get()` without checking presence
- wrapping everything in Optional (over-design)
- returning `null` instead of `Optional.empty()`
- using Optional for mandatory fields just to feel “modern”

## Practice checklist

- replace a nullable return with `Optional`
- chain `map` and `flatMap` for a nested lookup
- choose between `orElse`, `orElseGet`, and `orElseThrow` intentionally
- remove an `Optional` field from a DTO if you find one

## Takeaway

1. Use Optional to model missing values explicitly
2. Compose with `map` and `flatMap`
3. Use `orElseGet` / `orElseThrow` intentionally
4. Keep Optional at API/query boundaries, not everywhere
