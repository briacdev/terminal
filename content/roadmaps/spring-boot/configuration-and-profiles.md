---
title: Configuration and Profiles
description: "Externalize Spring Boot settings with application.yml, local/staging/production profiles, and safe secret handling."
date: 2026-03-15
tags: [spring-boot, configuration, profiles]
draft: false
readingTime: 10 min
---

## Where this lesson sits

Beans are wired. Now values must change per environment without code changes: ports, URLs, feature flags, and secrets.

## What you will learn

- How `application.yml` and environment variables layer
- How to split local, staging, and production with profiles
- How to bind typed properties instead of scattering `@Value`

## Mental model

Spring Boot reads configuration from several sources. Files in `src/main/resources` are the baseline. Environment variables and command-line args override them. That is how the same jar runs locally and in production.

Profiles activate a slice of config: `application-local.yml`, `application-staging.yml`, `application-prod.yml`. Never put production passwords in Git. Inject secrets at runtime.

`@ConfigurationProperties` is better than many `@Value` fields. You get a typed object, validation, and one place to document keys.

## Practical example

```yaml
# application.yml
spring:
  application:
    name: catalog-api
  profiles:
    default: local

catalog:
  alert-channel: ops
  low-stock-threshold: 5
```

```yaml
# application-prod.yml
catalog:
  alert-channel: prod-ops
  low-stock-threshold: 2
```

```java
package com.briac.catalog.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "catalog")
public record CatalogProperties(String alertChannel, int lowStockThreshold) {}
```

Enable it once:

```java
@SpringBootApplication
@EnableConfigurationProperties(CatalogProperties.class)
public class CatalogApplication {}
```

Override in production with env vars such as `CATALOG_ALERTCHANNEL` or `SPRING_PROFILES_ACTIVE=prod`. Keep database passwords out of YAML committed to the repo.

## Common mistakes

- Committing `application-prod.yml` with real credentials
- Copy-pasting the same keys into three YAML files instead of defaults plus overrides
- Reading `System.getenv` in services instead of binding properties

## Next lesson

Next: [REST Controllers](/spring-boot/rest-controllers).

## Official docs

- [Externalized configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)
- [Profiles](https://docs.spring.io/spring-boot/reference/features/profiles.html)
- [Type-safe configuration properties](https://docs.spring.io/spring-boot/reference/features/external-config.html#features.external-config.typesafe-configuration-properties)

## Takeaway

- Config is data, not code
- Profiles override defaults; secrets stay outside Git
- Bind YAML to a record instead of scattering string keys
