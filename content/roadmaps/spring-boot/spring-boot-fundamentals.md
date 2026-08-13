---
title: Spring Boot Fundamentals
description: "Understand what Spring Boot adds on top of Spring: starters, auto-configuration, and a first runnable application."
date: 2026-03-12
tags: [spring-boot, fundamentals, auto-configuration]
draft: false
readingTime: 9 min
---

## Where this lesson sits

This is lesson 1 of 21. Before Maven folders, beans, or REST mappings, you need a clear picture of what Spring Boot actually does.

## What you will learn

- How Spring Boot relates to the Spring Framework
- What starters and auto-configuration are for
- How a minimal application boots and answers HTTP

## Mental model

Spring Boot is not a second framework. The Spring Framework still provides the container, web stack, and programming model. Boot adds **conventions**: curated dependency sets (starters), classpath-based setup (auto-configuration), and production-friendly defaults such as an embedded server.

`@SpringBootApplication` combines configuration, component scanning, and auto-configuration. Scanning starts from the package of your main class. Auto-configuration is not magic that fights you: if you declare your own bean, Boot usually backs off.

This lesson stays on that model. Project layout belongs to lesson 2. Bean wiring belongs to lesson 3.

## Practical example

```java
package com.briac.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class CatalogApplication {
    public static void main(String[] args) {
        SpringApplication.run(CatalogApplication.class, args);
    }
}

@RestController
class HealthPingController {
    @GetMapping("/ping")
    String ping() {
        return "pong";
    }
}
```

`spring-boot-starter-web` is enough for this example. It pulls Spring MVC and an embedded Tomcat. You do not add Tomcat yourself.

## Common mistakes

- Treating Boot as a replacement for Spring instead of an opinionated way to assemble Spring
- Adding Data JPA, Security, and Actuator on day one, then debugging five layers at once
- Putting the main class in a nested package so sibling packages are never scanned

## Next lesson

Next: [Project Setup](/spring-boot/project-setup).

## Official docs

- [Spring Boot reference](https://docs.spring.io/spring-boot/reference/)
- [Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
- [Building an Application with Spring Boot](https://spring.io/guides/gs/spring-boot)

## Takeaway

- Boot speeds up assembly; Spring still owns the programming model
- Starters and auto-configuration are curated defaults, not hidden behavior you cannot override
- One ping endpoint is enough to prove the mental model before you add structure
