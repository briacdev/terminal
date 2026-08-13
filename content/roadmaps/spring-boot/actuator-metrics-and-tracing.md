---
title: Actuator, Metrics and Tracing
description: "Operate a Spring Boot app with Actuator health probes, Micrometer metrics, and request traces you can correlate."
date: 2026-03-29
tags: [spring-boot, actuator, observability]
draft: false
readingTime: 11 min
---

## Where this lesson sits

Background work exists. Production still needs a health signal, metrics, and traces. Actuator is the operations API of Spring Boot.

## What you will learn

- Liveness vs readiness
- What Micrometer records
- Why traces need a correlation id

## Mental model

**Liveness**: should Kubernetes restart the process? **Readiness**: should it receive traffic? A process can be alive but not ready (Flyway still running, downstream down).

Expose `/actuator/health` to the orchestrator. Do not expose `/actuator/env` or heap dumps to the internet. Use `management.endpoints.web.exposure.include` as an allow-list.

Micrometer times requests and counts errors. Export to Prometheus or your vendor. Traces (Micrometer Tracing / OpenTelemetry) connect one HTTP call across services. Put the trace id in logs.

## Practical example

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  endpoint:
    health:
      probes:
        enabled: true
      show-details: never
  tracing:
    sampling:
      probability: 1.0
```

```java
@Service
public class ProductQueryService {
    private final MeterRegistry meterRegistry;

    public ProductView bySku(String sku) {
        return meterRegistry.timer("catalog.product.lookup").record(() -> load(sku));
    }
}
```

In production, sample traces (`probability: 0.1`) unless you are debugging.

## Common mistakes

- Exposing every actuator endpoint publicly
- Using the same probe for liveness and readiness
- Logs without a request or trace id

## Next lesson

Next: [Build and Containerization](/spring-boot/build-and-containerization).

## Official docs

- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/)
- [Metrics](https://docs.spring.io/spring-boot/reference/actuator/metrics.html)
- [Tracing](https://docs.spring.io/spring-boot/reference/actuator/tracing.html)

## Takeaway

- Health is two questions: restart vs receive traffic
- Metrics and traces are how you debug without SSH
- Actuator is part of the attack surface; expose little
