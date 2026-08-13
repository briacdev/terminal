---
title: Concurrency - CompletableFuture
description: "Build asynchronous Java pipelines with CompletableFuture: thenApply, thenCompose, thenCombine, timeouts, and explicit error handling."
date: 2025-01-09
tags: [java, concurrency, completablefuture, async]
draft: false
readingTime: 16 min
---

## Why this step matters

Many backend flows call multiple services and should not block a request thread for each step.
`CompletableFuture` enables non-blocking composition and clearer async pipelines.

Use it when you need to coordinate independent I/O-bound work and assemble one final result.

## Basic async task

```java
CompletableFuture<String> userFuture = CompletableFuture.supplyAsync(() -> fetchUserName(42));
String name = userFuture.join();
```

- `supplyAsync`: run a supplier asynchronously
- `join()`: wait for the result and wrap checked failures as unchecked exceptions

Prefer delaying `join()` until the end of a pipeline.

## Transform and chain

```java
CompletableFuture<String> greeting = CompletableFuture
    .supplyAsync(() -> "briac")
    .thenApply(String::toUpperCase)
    .thenApply(name -> "hello " + name);
```

- `thenApply`: sync transform of the previous value
- `thenCompose`: chain another future and flatten nested futures
- `thenAccept`: consume the value without returning a new one

Rule of thumb: if the next step returns a `CompletableFuture`, use `thenCompose`.

## Compose multiple async tasks

```java
CompletableFuture<User> user = CompletableFuture.supplyAsync(() -> loadUser(1));
CompletableFuture<List<Order>> orders = CompletableFuture.supplyAsync(() -> loadOrders(1));

CompletableFuture<UserDashboard> dashboard = user.thenCombine(
    orders,
    UserDashboard::new
);
```

`thenCombine` waits for both futures and merges their results.
For more than two inputs, start with `allOf(...)` then extract each result.

## Error handling

```java
CompletableFuture<String> safe = CompletableFuture
    .supplyAsync(this::callRemote)
    .exceptionally(ex -> "fallback");
```

Useful handlers:

- `exceptionally(...)`: recover with a fallback value
- `handle(...)`: map success and failure in one place
- `whenComplete(...)`: observe outcome without changing the value

Always decide whether a failure should fail the whole request or degrade gracefully.

## Timeouts

```java
CompletableFuture<String> result = CompletableFuture
    .supplyAsync(this::callRemote)
    .orTimeout(2, TimeUnit.SECONDS)
    .exceptionally(ex -> "timeout-fallback");
```

Timeouts prevent hung calls from holding threads and user requests indefinitely.

## Custom executor tips

Heavy blocking I/O should not flood the common ForkJoinPool.
Pass an explicit `Executor` when the work is blocking or long-running.

```java
CompletableFuture.supplyAsync(this::callRemote, ioExecutor);
```

## Common mistakes

- calling `join()` too early and serializing async work
- mixing heavy blocking I/O in the default common pool
- forgetting failure and timeout paths
- building unreadable mega-chains without named intermediate steps

## Practice checklist

- chain `supplyAsync` + `thenApply` + `exceptionally`
- combine two independent futures with `thenCombine`
- add `orTimeout` and a fallback
- move blocking work onto a dedicated executor

## Takeaway

1. Use `CompletableFuture` for composition, not only for “run async”
2. Prefer `thenCompose` / `thenCombine` for clear pipelines
3. Handle timeouts and failures explicitly
4. Keep async chains readable and observable
