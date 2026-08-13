---
title: Scheduled Jobs
description: "Run background work with @Scheduled: cron vs fixed delay, overlap control, and idempotent jobs that survive retries."
date: 2026-03-28
tags: [spring-boot, scheduling, jobs]
draft: false
readingTime: 9 min
---

## Where this lesson sits

Async handles "do this after the request". Scheduled jobs handle "do this every N minutes", even with no HTTP traffic: reconcile stock, expire carts, pull a feed.

## What you will learn

- `@Scheduled` with cron vs fixed delay vs fixed rate
- How to prevent overlapping runs
- Why background jobs must be idempotent

## Mental model

Fixed delay waits N ms **after the previous run finishes**. Fixed rate aims at a wall-clock interval and can overlap if a run is slow. Cron expresses calendar time.

Overlapping jobs double-write. Use a single-thread scheduler, a lock, or `shedlock` when you scale to several instances. One instance running a job twice is already a bug if the job is not idempotent.

Idempotent means running the job twice with the same input does not corrupt data. "Set status to EXPIRED where expiry < now" is safer than "decrement stock by 1 for each stale row" without a processed-id table.

`@Scheduled` methods belong on a dedicated class, not on a REST controller.

## Practical example

```java
package com.briac.catalog.jobs;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class StaleReservationJob {
    private final ReservationService reservationService;

    public StaleReservationJob(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @Scheduled(fixedDelayString = "PT5M")
    public void release() {
        reservationService.releaseExpired();
    }
}
```

Enable with `@EnableScheduling`. Keep `releaseExpired()` a no-op when there is nothing to do.

## Common mistakes

- Running the same job on every Kubernetes replica
- Using `fixedRate` for a job that can last longer than the interval
- Doing HTTP work inside a job without timeouts

## Next lesson

Next: [Actuator, Metrics and Tracing](/spring-boot/actuator-metrics-and-tracing).

## Official docs

- [Scheduling](https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html)
- [Scheduled annotation](https://docs.spring.io/spring-framework/reference/integration/scheduling.html#scheduling-annotation-support-scheduled)

## Takeaway

- Pick delay vs cron based on "after finish" vs "on the clock"
- Jobs must survive retries
- Multi-instance deployments need a lock
