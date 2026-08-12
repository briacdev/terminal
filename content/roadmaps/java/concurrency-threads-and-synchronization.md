---
title: Concurrency - Threads and Synchronization
description: "Understand Java threads, race conditions, synchronized blocks, ReentrantLock, volatile, and Atomic types for safe shared-state code."
date: 2025-01-07
tags: [java, concurrency, threads, synchronization]
draft: false
readingTime: 16 min
---

## Why this step matters

Modern backend services handle many requests simultaneously.
Without concurrency basics, shared state becomes inconsistent and bugs become non-deterministic.

This step builds the mental model you need before thread pools and async pipelines.

## Thread lifecycle basics

A thread typically moves through:

- new
- runnable / running
- blocked or waiting
- terminated

```java
Thread t = new Thread(() -> System.out.println("worker"));
t.start();
```

Calling `run()` directly does not start a new thread.
Prefer higher-level executors in real applications; learn raw threads to understand what pools manage for you.

## Race condition example

A race condition happens when multiple threads update shared state without coordination.

```java
class Counter {
    int value = 0;

    void increment() {
        value++; // not atomic
    }
}
```

Two threads can read the same value and overwrite each other.
Symptoms often appear only under load.

## `synchronized`

Use `synchronized` to guard critical sections.

```java
class SafeCounter {
    private int value = 0;

    synchronized void increment() {
        value++;
    }

    synchronized int get() {
        return value;
    }
}
```

This ensures one thread enters the synchronized method at a time for that instance.
Keep critical sections small.

## Locks (`ReentrantLock`)

Locks give more control than `synchronized`.

```java
Lock lock = new ReentrantLock();

lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}
```

Use locks when you need features like `tryLock()`, interruptible locking, or fairness policies.
Always unlock in `finally`.

## Visibility and atomicity

- `volatile`: visibility for reads/writes, not full atomic compound updates
- `AtomicInteger`: atomic operations without an explicit lock for simple counters

```java
AtomicInteger counter = new AtomicInteger();
counter.incrementAndGet();
```

Visibility bugs can look like “stale cache” behavior across threads.

## Design guidance

Prefer immutability and confinement (no sharing) over heavy locking.
Share less mutable state and concurrency becomes easier.

## Common mistakes

- sharing mutable objects without synchronization
- locking too much code (throughput collapse)
- forgetting `unlock()` in lock-based code
- assuming concurrency bugs will be easy to reproduce
- synchronizing on public objects that other code can lock

## Practice checklist

- reproduce a race on an unsynchronized counter
- fix it with `synchronized`, then with `AtomicInteger`
- protect a critical section with `ReentrantLock` and `finally`
- identify one shared mutable field in a sample service and decide how to confine or protect it

## Takeaway

1. Understand race conditions and shared mutable state risk
2. Use `synchronized` or locks for critical sections
3. Prefer atomic classes for simple shared counters
4. Keep thread-safe design explicit and minimal
