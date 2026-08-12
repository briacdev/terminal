---
title: Concurrence - CompletableFuture
description: "Construire des pipelines asynchrones en Java avec CompletableFuture : thenApply, thenCompose, thenCombine, timeouts et gestion d’erreurs."
date: 2025-01-09
tags: [java, concurrency, completablefuture, async]
draft: false
readingTime: 16 min
---

## Pourquoi cette étape est importante

Beaucoup de flux backend appellent plusieurs services et ne doivent pas bloquer un thread de requête à chaque étape.
`CompletableFuture` permet une composition non bloquante et des pipelines plus clairs.

Utilisez-le pour coordonner des appels I/O indépendants et assembler un résultat final.

## Tâche async de base

```java
CompletableFuture<String> userFuture = CompletableFuture.supplyAsync(() -> fetchUserName(42));
String name = userFuture.join();
```

- `supplyAsync` : exécute un supplier de façon asynchrone
- `join()` : attend le résultat et remonte les erreurs en exceptions non vérifiées

Préférez retarder `join()` jusqu’à la fin du pipeline.

## Transformer et chaîner

```java
CompletableFuture<String> greeting = CompletableFuture
    .supplyAsync(() -> "briac")
    .thenApply(String::toUpperCase)
    .thenApply(name -> "hello " + name);
```

- `thenApply` : transformation synchrone du résultat précédent
- `thenCompose` : enchaîne un autre futur et aplatit les futurs imbriqués
- `thenAccept` : consomme la valeur sans en produire une nouvelle

Règle : si l’étape suivante retourne déjà un `CompletableFuture`, utilisez `thenCompose`.

## Composer plusieurs tâches asynchrones

```java
CompletableFuture<User> user = CompletableFuture.supplyAsync(() -> loadUser(1));
CompletableFuture<List<Order>> orders = CompletableFuture.supplyAsync(() -> loadOrders(1));

CompletableFuture<UserDashboard> dashboard = user.thenCombine(
    orders,
    UserDashboard::new
);
```

`thenCombine` attend les deux futurs puis fusionne leurs résultats.
Pour plus de deux entrées, partez de `allOf(...)` puis extrayez chaque résultat.

## Gestion d’erreurs

```java
CompletableFuture<String> safe = CompletableFuture
    .supplyAsync(this::callRemote)
    .exceptionally(ex -> "fallback");
```

Handlers utiles :

- `exceptionally(...)` : fallback
- `handle(...)` : succès et échec au même endroit
- `whenComplete(...)` : observer sans modifier la valeur

Décidez si une erreur doit faire échouer toute la requête ou dégrader le service.

## Timeouts

```java
CompletableFuture<String> result = CompletableFuture
    .supplyAsync(this::callRemote)
    .orTimeout(2, TimeUnit.SECONDS)
    .exceptionally(ex -> "timeout-fallback");
```

Les timeouts évitent qu’un appel bloqué retienne indéfiniment des threads.

## Executor dédié

L’I/O bloquante lourde ne doit pas saturer le ForkJoinPool commun.
Passez un `Executor` explicite pour le travail bloquant.

```java
CompletableFuture.supplyAsync(this::callRemote, ioExecutor);
```

## Erreurs fréquentes

- appeler `join()` trop tôt et sérialiser le travail async
- mélanger I/O bloquante lourde avec le common pool
- oublier timeouts et chemins d’erreur
- créer des chaînes illisibles sans étapes nommées

## Checklist pratique

- enchaîner `supplyAsync` + `thenApply` + `exceptionally`
- combiner deux futurs indépendants avec `thenCombine`
- ajouter `orTimeout` et un fallback
- déplacer le travail bloquant vers un executor dédié

## À retenir

1. Utiliser `CompletableFuture` pour la composition, pas seulement l’exécution async
2. Préférer `thenCompose` / `thenCombine` pour des pipelines clairs
3. Gérer explicitement timeouts et erreurs
4. Garder les chaînes lisibles et observables
