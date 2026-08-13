---
title: Project Setup
description: "Create a clean Spring Boot project with Initializr, standard folders, and a Maven or Gradle wrapper workflow."
date: 2026-03-13
tags: [spring-boot, setup, maven, gradle]
draft: false
readingTime: 10 min
---

## Where this lesson sits

Lesson 1 explained what Boot is. This lesson is how you create a project you can share with a team: Initializr, folders, and a wrapper.

## What you will learn

- How to generate a project with Spring Initializr
- Where production code, tests, and config live
- Why Maven or Gradle wrappers beat a global CLI

## Mental model

Initializr is not a toy. It emits the same conventions most Spring Boot codebases use: `src/main/java`, `src/main/resources`, `src/test/java`, a parent BOM or plugin, and `mvnw` / `gradlew`.

Keep the main class in the root package (`com.briac.catalog`) and put feature packages under it. Component scanning starts there.

Pick **one** build tool and stay with it. Maven is usually simpler for a first API. Gradle is fine if the team already uses it. The wrapper pins the tool version so CI and laptops do not drift.

Do not dump every starter into the first generation. `Spring Web` is enough until a later lesson needs JPA, Security, or Actuator.

## Practical example

A typical first generation:

- Project: Maven
- Java: 21
- Packaging: jar
- Dependencies: Spring Web

```text
catalog-api
├── src/main/java/com/briac/catalog/CatalogApplication.java
├── src/main/resources/application.yml
├── src/test/java/com/briac/catalog/CatalogApplicationTests.java
├── pom.xml
└── mvnw
```

Prefer the wrapper:

```bash
./mvnw spring-boot:run
./mvnw test
./mvnw clean package
```

## Go further on the blog

Maven lifecycle details live in [Introduction to Maven in a Java Spring Boot project](/blog/introduction-to-maven-in-a-java-spring-boot-project). This lesson only covers the setup choices that unblock the rest of the path.

## Common mistakes

- Generating the project with Security, JPA, Mail, and Actuator "just in case"
- Running a global `mvn` while CI uses a different wrapper version
- Placing application classes above the main-class package

## Next lesson

Next: [Dependency Injection and Beans](/spring-boot/dependency-injection-and-beans).

## Official docs

- [Spring Initializr](https://start.spring.io/)
- [Spring Boot build systems](https://docs.spring.io/spring-boot/reference/using/build-systems.html)
- [Gradle Wrapper basics](https://docs.gradle.org/userguide/gradle_wrapper_basics.html)

## Takeaway

- Initializr plus a wrapper is the team-safe starting point
- Folder and package conventions are part of how Boot finds your code
- Add dependencies when a later lesson needs them, not on day one
