---
title: Dependency Injection and Beans
description: "Learn the Spring container: bean lifecycle, constructor injection, and when to write a configuration class."
date: 2026-03-14
tags: [spring-boot, beans, dependency-injection]
draft: false
readingTime: 11 min
---

## Where this lesson sits

The project now exists. This lesson is the Spring container: how objects are created, wired, and replaced in tests.

## What you will learn

- What a bean is and how its lifecycle works
- Why constructor injection should be the default
- When a `@Configuration` class is the right tool

## Mental model

Spring owns the object graph. You declare types; the container instantiates them, injects collaborators, and calls lifecycle callbacks.

Prefer constructor injection. Required dependencies become `final`, missing beans fail at startup, and tests can `new` the class with fakes. Field injection hides the contract and makes tests clumsier.

Use stereotype annotations (`@Service`, `@Repository`, `@RestController`) for your own types. Use `@Bean` methods in a `@Configuration` class when you wrap a third-party type or need explicit construction.

Bean scope is singleton by default. That is correct for stateless services. Do not store request data on a singleton.

## Practical example

```java
package com.briac.catalog.notify;

import org.springframework.stereotype.Service;

@Service
public class SlackNotifier {
    public void send(String channel, String text) {
        // outbound call in a later lesson
    }
}
```

```java
package com.briac.catalog.notify;

import org.springframework.stereotype.Service;

@Service
public class StockAlertService {
    private final SlackNotifier slackNotifier;

    public StockAlertService(SlackNotifier slackNotifier) {
        this.slackNotifier = slackNotifier;
    }

    public void lowStock(String sku, int remaining) {
        slackNotifier.send("ops", sku + " has " + remaining + " left");
    }
}
```

A configuration class is useful for types you do not own:

```java
package com.briac.catalog.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TimeConfig {
    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }
}
```

## Common mistakes

- `@Autowired` on fields as the default style
- Circular dependencies between two `@Service` classes
- Creating collaborators with `new` inside a Spring-managed type, which bypasses the container and makes mocking harder

## Next lesson

Next: [Configuration and Profiles](/spring-boot/configuration-and-profiles).

## Official docs

- [Spring beans and dependency injection](https://docs.spring.io/spring-boot/reference/using/spring-beans-and-dependency-injection.html)
- [Bean overview](https://docs.spring.io/spring-framework/reference/core/beans/introduction.html)

## Takeaway

- The container builds the graph; your constructors declare it
- Constructor injection is the testable default
- `@Configuration` is for objects you cannot annotate
