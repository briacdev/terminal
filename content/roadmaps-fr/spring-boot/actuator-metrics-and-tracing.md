---
title: Actuator, métriques et tracing
description: "Opérer une app Spring Boot avec les probes Actuator, les métriques Micrometer, et des traces corrélables."
date: 2026-03-29
tags: [spring-boot, actuator, observability]
draft: false
readingTime: 11 min
---

## Où se situe cette leçon

Le travail de fond existe. La production a encore besoin d'un signal de santé, de métriques et de traces. Actuator est l'API d'exploitation de Spring Boot.

## Ce que vous allez apprendre

- Liveness vs readiness
- Ce que Micrometer enregistre
- Pourquoi les traces ont besoin d'un id de corrélation

## Modèle mental

**Liveness**: Kubernetes doit-il redémarrer le process? **Readiness**: doit-il recevoir du trafic? Un process peut être vivant mais pas prêt.

Exposez `/actuator/health` à l'orchestrateur. N'exposez pas `/actuator/env` sur internet. `management.endpoints.web.exposure.include` est une allow-list.

Micrometer chronomètre les requêtes. Les traces relient un appel HTTP entre services. Mettez le trace id dans les logs.

## Exemple pratique

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
```

## Erreurs fréquentes

- Exposer tous les endpoints Actuator
- La même probe pour liveness et readiness
- Des logs sans id de requête

## Leçon suivante

Suite: [Build et containerisation](/fr/spring-boot/build-and-containerization).

## Documentation officielle

- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/)
- [Metrics](https://docs.spring.io/spring-boot/reference/actuator/metrics.html)

## À retenir

- La santé pose deux questions: redémarrer vs recevoir du trafic
- Métriques et traces évitent le SSH
- Actuator est une surface d'attaque; exposez peu
