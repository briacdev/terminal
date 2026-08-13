---
title: Async Processing
description: "Offload slow work with @Async, a dedicated executor, and error handling that does not hide failures on another thread."
date: 2026-03-27
tags: [spring-boot, async, performance]
draft: false
readingTime: 10 min
---

## Where this lesson sits

Some work should not block the HTTP thread: sending a Slack alert, calling a slow partner API. `@Async` moves that work. It is not a scheduler. Scheduling is the next lesson.

## What you will learn

- When `@Async` is appropriate
- Why you must define an executor
- How errors on another thread become visible

## Mental model

The controller returns after the service queues work. A thread pool runs the method later. If you use the default executor, you share a pool you do not understand. Define a named `Executor` bean and point `@Async("catalogExecutor")` at it.

`@Async` only works on **public** methods called through the Spring proxy. `this.asyncMethod()` inside the same class does nothing.

Return `CompletableFuture` if the caller must know success. Otherwise attach an `AsyncUncaughtExceptionHandler` so failures are logged and metered, not swallowed.

Do not use `@Async` for database writes that the HTTP response depends on.

## Practical example

```java
package com.briac.catalog.config;

import java.util.concurrent.Executor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean(name = "catalogExecutor")
    Executor catalogExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("catalog-async-");
        executor.initialize();
        return executor;
    }
}
```

```java
@Service
public class AlertDispatcher {
    @Async("catalogExecutor")
    public void dispatchLowStock(String sku, int remaining) {
        // Slack or mail I/O
    }
}
```

## Common mistakes

- Calling `@Async` methods on `this`
- Unbounded pools that die under load
- Ignoring exceptions because they happen off-request

## Next lesson

Next: [Scheduled Jobs](/spring-boot/scheduled-jobs).

## Official docs

- [Spring async](https://docs.spring.io/spring-framework/reference/integration/scheduling.html#scheduling-annotation-support-async)
- [Task execution](https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html)

## Takeaway

- `@Async` is for work the HTTP response does not need
- Name the executor and size it
- Failures must still be logged
