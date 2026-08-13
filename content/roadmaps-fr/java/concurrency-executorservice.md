---
title: Concurrence - ExecutorService
description: "Maîtriser ExecutorService en Java : pools de threads, Callable/Future, soumission de tâches et arrêt propre (graceful shutdown)."
date: 2025-01-08
tags: [java, concurrency, executor, futures]
draft: false
readingTime: 15 min
---

## Pourquoi cette étape est importante

Créer un thread brut pour chaque tâche ne scale pas.
`ExecutorService` offre une concurrence contrôlée via des pools réutilisables.

Dans un backend, les pools protègent CPU, mémoire et latence sous charge.

## Pools de threads

Utilisez un pool pour réutiliser les threads et limiter le travail concurrent.

```java
ExecutorService pool = Executors.newFixedThreadPool(4);

Future<Integer> future = pool.submit(() -> computeScore(userId));
Integer score = future.get();

pool.shutdown();
```

Factories courantes :

- `newFixedThreadPool(n)` : concurrence bornée
- `newCachedThreadPool()` : croît selon le besoin (risqué sous pics)
- `newSingleThreadExecutor()` : travail séquentiel ordonné
- `newScheduledThreadPool(n)` : tâches différées / périodiques

En production, préférez un `ThreadPoolExecutor` explicite avec file et politique de rejet claires.

## Callable vs Runnable

- `Runnable` : pas de valeur de retour
- `Callable<T>` : retourne une valeur et peut lever des exceptions checked

```java
Callable<String> task = () -> loadReport(42);
Future<String> future = pool.submit(task);
```

## Travailler avec Future

`Future` représente un résultat qui arrivera plus tard.

Méthodes utiles :

- `get()` : bloquer jusqu’à la fin
- `get(timeout, unit)` : échouer vite si trop lent
- `isDone()` : statut non bloquant
- `cancel(true)` : tenter une interruption

Préférez toujours un timeout sur les chemins de requête.

## Arrêt propre

```java
pool.shutdown();
if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
    pool.shutdownNow();
}
```

- `shutdown()` : refuse les nouvelles tâches, termine la file
- `shutdownNow()` : interrompt le travail en cours et abandonne la file

Branchez l’arrêt sur le cycle de vie de l’application pour éviter les fuites de threads.

## Dimensionner un pool

Il n’y a pas de formule universelle, partez du type de charge :

- CPU-bound : proche du nombre de cœurs
- I/O-bound : plus de concurrence, mesurée avec soin
- mixte : séparer les pools par type de travail

Réglez avec des métriques (profondeur de file, latence, rejets), pas au feeling.

## Erreurs fréquentes

- pools cached non bornés sous pic de trafic
- oubli du shutdown dans les apps longues
- `get()` sans timeout
- soumettre du travail bloquant dans un petit pool critique

## Checklist pratique

- soumettre un `Callable` et lire le `Future` avec timeout
- arrêter un pool avec `awaitTermination`
- comparer fixed vs single-thread executor
- observer taille de file / threads actifs sous charge

## À retenir

1. Préférer les pools à la création manuelle de threads
2. Utiliser `Callable` / `Future` quand un résultat est nécessaire
3. Arrêter proprement les executors
4. Dimensionner et isoler les pools selon la charge mesurée
