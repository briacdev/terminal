---
title: Java fonctionnel - Streams
description: "Traiter des collections avec les Streams Java : map, filter, reduce, collectors, règles de lisibilité et quand une boucle reste meilleure."
date: 2025-01-04
tags: [java, functional, streams, collections]
draft: false
readingTime: 16 min
---

## Pourquoi cette étape est importante

Les streams expriment clairement les transformations de données, surtout pour filtrage, agrégation et reporting.
Bien utilisés, ils réduisent le boilerplate. Mal utilisés, ils nuisent à la lisibilité.

Ils excellent pour des pipelines déclaratifs sur collections.

## Modèle mental d’un pipeline

Un pipeline stream a trois parties :

1. Source (`List`, `Set`, tableau, etc.)
2. Opérations intermédiaires (`filter`, `map`, `sorted`)
3. Opération terminale (`collect`, `forEach`, `count`, `reduce`)

```java
List<String> names = List.of("alice", "bob", "anna");

List<String> result = names.stream()
    .filter(n -> n.startsWith("a"))
    .map(String::toUpperCase)
    .toList();

System.out.println(result); // [ALICE, ANNA]
```

Les opérations intermédiaires sont lazy ; rien ne s’exécute sans opération terminale.

## `map`, `filter`, `reduce`

- `filter` : garder les éléments correspondants
- `map` : transformer chaque élément
- `reduce` : combiner les éléments en un résultat

```java
int total = List.of(10, 20, 30).stream()
    .filter(n -> n >= 20)
    .reduce(0, Integer::sum);

System.out.println(total); // 50
```

Aussi utiles :

- `flatMap` pour une expansion un-vers-plusieurs
- `distinct`, `sorted`, `limit`, `skip`

## Collectors

Les collectors façonnent le résultat final.

```java
Map<String, Long> countByRole = List.of("admin", "user", "admin").stream()
    .collect(Collectors.groupingBy(r -> r, Collectors.counting()));

System.out.println(countByRole); // {admin=2, user=1}
```

Collectors utiles :

- `toList()` / `toSet()`
- `groupingBy(...)`
- `partitioningBy(...)`
- `joining(...)`
- `counting()`, `summingInt(...)`

## Éviter la sur-utilisation

Les streams ne sont pas toujours le meilleur choix.
Préférez les boucles quand :

- la logique est très stateful
- plusieurs effets de bord sont nécessaires
- debugger une longue chaîne est plus dur qu’une boucle simple

## Attention aux parallel streams

`parallelStream()` peut aider sur du bulk CPU-bound, mais peut aussi dégrader la latence et compliquer ordre/debug.
Mesurez avant d’activer le parallélisme.

## Erreurs fréquentes

- effets de bord dans `map` / `filter`
- chaînes trop longues à l’intention floue
- streams dans des hot loops sans mesure
- croire que parallel améliore toujours
- muter des collections partagées depuis un stream

## Règle pratique

Streams pour transformations déclaratives.
Boucles pour contrôle de flux complexe et workflows mutables.

## Checklist pratique

- filtrer et mapper une liste vers une nouvelle liste immuable
- grouper avec `Collectors.groupingBy`
- réécrire un stream en boucle et comparer la lisibilité
- retirer un effet de bord d’un `map`

## À retenir

1. Penser en étapes : source → transform → terminal
2. Maîtriser `map`, `filter`, `reduce`, `collect`
3. Garder le code stream court et lisible
4. Ne pas forcer un stream quand une boucle est plus claire
