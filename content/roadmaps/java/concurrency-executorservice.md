---
title: Concurrency - ExecutorService
description: "Control Java concurrency with ExecutorService: thread pools, Callable/Future, task submission, and graceful shutdown patterns."
date: 2025-01-08
tags: [java, concurrency, executor, futures]
draft: false
readingTime: 15 min
---

## Why this step matters

Creating a raw thread for every task does not scale.
`ExecutorService` gives controlled concurrency through reusable thread pools.

In backend services, pools protect CPU, memory, and latency under load.

## Thread pools

Use a pool to reuse threads and limit concurrent work.

```java
ExecutorService pool = Executors.newFixedThreadPool(4);

Future<Integer> future = pool.submit(() -> computeScore(userId));
Integer score = future.get();

pool.shutdown();
```

Common factories:

- `newFixedThreadPool(n)`: bounded concurrency
- `newCachedThreadPool()`: grows as needed (risky under load spikes)
- `newSingleThreadExecutor()`: ordered sequential work
- `newScheduledThreadPool(n)`: delayed/periodic tasks

For production, prefer an explicit `ThreadPoolExecutor` with clear queue and rejection policy.

## Callable vs Runnable

- `Runnable`: no return value
- `Callable<T>`: returns a value and can throw checked exceptions

```java
Callable<String> task = () -> loadReport(42);
Future<String> future = pool.submit(task);
```

## Working with Future

`Future` represents a result that may arrive later.

Useful methods:

- `get()`: block until done
- `get(timeout, unit)`: fail fast on slow tasks
- `isDone()`: non-blocking status check
- `cancel(true)`: attempt interruption

Always prefer timeouts in request paths.

## Graceful shutdown

```java
pool.shutdown();
if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
    pool.shutdownNow();
}
```

- `shutdown()`: stop accepting new tasks, finish queued ones
- `shutdownNow()`: interrupt running tasks and discard queued work

Hook shutdown into application lifecycle so pools do not leak threads.

## Choosing pool size

There is no universal formula, but start from workload type:

- CPU-bound: near core count
- I/O-bound: higher concurrency, carefully measured
- mixed: separate pools by workload

Tune with metrics (queue depth, latency, rejection rate), not guesses.

## Common mistakes

- unbounded cached pools under traffic spikes
- forgetting shutdown in long-running apps
- calling `get()` without timeout
- submitting blocking work to a tiny shared pool used by critical paths

## Practice checklist

- submit a `Callable` and read the `Future` with timeout
- shut down a pool with `awaitTermination`
- compare fixed vs single-thread executor behavior
- log queue size or active count while load testing

## Takeaway

1. Prefer pools over manual thread creation
2. Use `Callable`/`Future` when you need results
3. Shut down executors cleanly
4. Size and isolate pools based on measured workload
