---
title: Concurrence - Threads et synchronisation
description: "Comprendre les threads Java, les race conditions, synchronized, ReentrantLock, volatile et les types Atomic pour un état partagé sûr."
date: 2025-01-07
tags: [java, concurrency, threads, synchronization]
draft: false
readingTime: 16 min
---

## Pourquoi cette étape est importante

Les services backend modernes traitent beaucoup de requêtes en parallèle.
Sans bases de concurrence, l’état partagé devient incohérent et les bugs non déterministes.

Cette étape pose le modèle mental avant les pools et les pipelines async.

## Cycle de vie d’un thread

Un thread passe typiquement par :

- new
- runnable / running
- blocked ou waiting
- terminated

```java
Thread t = new Thread(() -> System.out.println("worker"));
t.start();
```

Appeler `run()` directement ne démarre pas un nouveau thread.
En pratique, préférez les executors ; apprenez les threads bruts pour comprendre ce que les pools gèrent.

## Exemple de race condition

Une race condition apparaît quand plusieurs threads mettent à jour un état partagé sans coordination.

```java
class Counter {
    int value = 0;

    void increment() {
        value++; // non atomique
    }
}
```

Deux threads peuvent lire la même valeur et s’écraser mutuellement.
Les symptômes n’apparaissent souvent que sous charge.

## `synchronized`

Utilisez `synchronized` pour protéger les sections critiques.

```java
class SafeCounter {
    private int value = 0;

    synchronized void increment() {
        value++;
    }

    synchronized int get() {
        return value;
    }
}
```

Un seul thread entre à la fois dans la méthode synchronisée pour cette instance.
Gardez les sections critiques petites.

## Locks (`ReentrantLock`)

Les locks offrent plus de contrôle que `synchronized`.

```java
Lock lock = new ReentrantLock();

lock.lock();
try {
    // section critique
} finally {
    lock.unlock();
}
```

Utilisez-les pour `tryLock()`, l’interruption ou des politiques d’équité.
Toujours déverrouiller dans un `finally`.

## Visibilité et atomicité

- `volatile` : garantie de visibilité lecture/écriture, pas d’atomicité complète des mises à jour composées
- `AtomicInteger` : opérations atomiques sans lock explicite pour des compteurs simples

```java
AtomicInteger counter = new AtomicInteger();
counter.incrementAndGet();
```

Les bugs de visibilité ressemblent souvent à un “cache périmé” entre threads.

## Conseil de conception

Préférez immutabilité et confinement (pas de partage) aux locks lourds.
Moins d’état mutable partagé = concurrence plus simple.

## Erreurs fréquentes

- partager des objets mutables sans synchronisation
- verrouiller trop de code (chute de débit)
- oublier `unlock()`
- croire que les bugs de concurrence seront faciles à reproduire
- synchroniser sur des objets publics verrouillables ailleurs

## Checklist pratique

- reproduire une race sur un compteur non synchronisé
- la corriger avec `synchronized`, puis avec `AtomicInteger`
- protéger une section critique avec `ReentrantLock` et `finally`
- identifier un champ mutable partagé et décider confinement vs protection

## À retenir

1. Comprendre les race conditions et le risque d’état mutable partagé
2. Utiliser `synchronized` ou des locks pour les sections critiques
3. Préférer les classes atomiques pour les compteurs simples
4. Garder le design thread-safe explicite et minimal
