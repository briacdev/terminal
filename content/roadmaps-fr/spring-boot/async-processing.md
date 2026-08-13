---
title: Traitements async
description: "Déporter le travail lent avec @Async, un executor dédié, et une gestion d'erreurs visible hors du thread HTTP."
date: 2026-03-27
tags: [spring-boot, async, performance]
draft: false
readingTime: 10 min
---

## Où se situe cette leçon

Certains travaux ne doivent pas bloquer le thread HTTP: alerte Slack, API partenaire lente. `@Async` déplace ce travail. Ce n'est pas un scheduler. Le scheduling est la leçon suivante.

## Ce que vous allez apprendre

- Quand `@Async` est approprié
- Pourquoi il faut définir un executor
- Comment les erreurs sur un autre thread restent visibles

## Modèle mental

Le controller revient après la mise en file. Un pool exécute plus tard. Définissez un `Executor` nommé. `@Async` ne marche que sur des méthodes **public** appelées via le proxy Spring. `this.asyncMethod()` ne fait rien.

Retournez `CompletableFuture` si l'appelant doit connaître le succès. Sinon, un `AsyncUncaughtExceptionHandler`.

N'utilisez pas `@Async` pour une écriture dont la réponse HTTP dépend.

## Exemple pratique

```java
@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean(name = "catalogExecutor")
    Executor catalogExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("catalog-async-");
        executor.initialize();
        return executor;
    }
}
```

```java
@Async("catalogExecutor")
public void dispatchLowStock(String sku, int remaining) {}
```

## Erreurs fréquentes

- Appeler `@Async` sur `this`
- Pools non bornés
- Ignorer les exceptions hors requête

## Leçon suivante

Suite: [Tâches planifiées](/fr/spring-boot/scheduled-jobs).

## Documentation officielle

- [Spring async](https://docs.spring.io/spring-framework/reference/integration/scheduling.html#scheduling-annotation-support-async)

## À retenir

- `@Async` pour le travail dont la réponse HTTP n'a pas besoin
- Nommez et dimensionnez l'executor
- Les pannes doivent quand même être loguées
