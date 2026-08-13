---
title: Tâches planifiées
description: "Exécuter du travail de fond avec @Scheduled: cron vs délai fixe, contrôle des chevauchements, et tâches idempotentes."
date: 2026-03-28
tags: [spring-boot, scheduling, jobs]
draft: false
readingTime: 9 min
---

## Où se situe cette leçon

L'async gère "fais ça après la requête". Les jobs planifiés gèrent "fais ça toutes les N minutes", même sans trafic HTTP.

## Ce que vous allez apprendre

- `@Scheduled` en cron vs délai fixe vs taux fixe
- Empêcher les exécutions qui se chevauchent
- Pourquoi les jobs de fond doivent être idempotents

## Modèle mental

Le délai fixe attend N ms **après la fin** du run précédent. Le taux fixe vise un intervalle horloge et peut chevaucher. Le cron exprime un calendrier.

Un job qui se chevauche double-écrit. Sur plusieurs instances, il faut un lock. Idempotent: deux runs avec la même entrée ne corrompent pas les données.

Les méthodes `@Scheduled` vivent dans une classe dédiée, pas dans un controller.

## Exemple pratique

```java
@Component
public class StaleReservationJob {
    @Scheduled(fixedDelayString = "PT5M")
    public void release() {
        reservationService.releaseExpired();
    }
}
```

Activez avec `@EnableScheduling`.

## Erreurs fréquentes

- Lancer le même job sur chaque replica Kubernetes
- `fixedRate` pour un job plus long que l'intervalle
- De l'HTTP dans un job sans timeout

## Leçon suivante

Suite: [Actuator, métriques et tracing](/fr/spring-boot/actuator-metrics-and-tracing).

## Documentation officielle

- [Scheduling Spring Boot](https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html)

## À retenir

- Délai vs cron selon "après la fin" vs "à l'heure"
- Les jobs doivent survivre aux retries
- Plusieurs instances exigent un lock
