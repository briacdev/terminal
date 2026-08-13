---
title: Java fonctionnel - Optional
description: "Modéliser l’absence de valeur avec Optional en Java : map, flatMap, orElseGet, orElseThrow et bonnes pratiques aux frontières d’API."
date: 2025-01-05
tags: [java, functional, optional, null-safety]
draft: false
readingTime: 14 min
---

## Pourquoi cette étape est importante

`null` est une source fréquente de bugs en production.
`Optional` aide à modéliser l’absence explicitement et à éviter des `NullPointerException` cachées.

Utilisez-le pour rendre le “peut être manquant” visible dans le système de types aux frontières d’API.

## Idée centrale

`Optional<T>` signifie : la valeur peut être présente ou absente.

```java
Optional<String> token = Optional.of("abc");
Optional<String> missing = Optional.empty();
```

Utilisez :

- `of(...)` quand la valeur est garantie non nulle
- `ofNullable(...)` quand elle peut être nulle
- `empty()` pour l’absence

## Opérations courantes

```java
Optional<String> email = Optional.ofNullable("briac@example.com");

String domain = email
    .map(e -> e.substring(e.indexOf("@") + 1))
    .orElse("unknown");

System.out.println(domain); // example.com
```

- `map` : transformer si présent
- `flatMap` : enchaîner des appels qui retournent Optional
- `orElse` / `orElseGet` : valeurs de repli
- `orElseThrow` : échouer explicitement
- `ifPresent` / `ifPresentOrElse` : style effet de bord

## `map` vs `flatMap`

La différence clé est la forme de retour.

- `map` applique `T -> R` et retourne `Optional<R>`
- `flatMap` applique `T -> Optional<R>` et retourne `Optional<R>` (aplati)

Si votre mapper retourne déjà un `Optional`, `map` crée un imbriquement.

```java
Optional<User> user = findUser("briac");

Optional<Optional<String>> wrong = user.map(u -> findCityByUser(u.id()));
Optional<String> correct = user.flatMap(u -> findCityByUser(u.id()));
```

Utilisez `map` quand le mapper retourne une valeur simple :

```java
Optional<String> username = user.map(User::username);
```

Utilisez `flatMap` quand le mapper retourne un `Optional` :

```java
Optional<String> city = user.flatMap(u -> findCityByUser(u.id()));
```

## Bonnes pratiques aux frontières d’API

Bon :

- retourner `Optional<T>` depuis des méthodes de type query (`findById`)

À éviter :

- champs `Optional` dans entités/DTO
- `Optional` en paramètre de méthode dans la plupart des cas
- retourner `null` depuis une méthode qui retourne déjà `Optional`

## `orElse` vs `orElseGet`

`orElse` évalue toujours son argument.
`orElseGet` calcule le fallback de façon lazy.

```java
String value = optional.orElseGet(() -> expensiveFallback());
```

Préférez `orElseGet` si le fallback est coûteux.
Préférez `orElseThrow` si l’absence est une vraie erreur.

## Erreurs fréquentes

- appeler `Optional.get()` sans vérifier la présence
- tout envelopper dans Optional (sur-conception)
- retourner `null` au lieu de `Optional.empty()`
- mettre Optional sur des champs obligatoires juste pour “faire moderne”

## Checklist pratique

- remplacer un retour nullable par `Optional`
- enchaîner `map` et `flatMap` pour une recherche imbriquée
- choisir intentionnellement `orElse`, `orElseGet` ou `orElseThrow`
- retirer un champ `Optional` d’un DTO si vous en trouvez un

## À retenir

1. Utiliser Optional pour modéliser l’absence explicitement
2. Composer avec `map` et `flatMap`
3. Utiliser `orElseGet` / `orElseThrow` intentionnellement
4. Garder Optional aux frontières API/query, pas partout
