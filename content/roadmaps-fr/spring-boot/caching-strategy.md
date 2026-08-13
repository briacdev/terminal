---
title: Stratégie de cache
description: "Accélérer les lectures avec Spring Cache: @Cacheable, TTL et eviction, et une invalidation correcte après écriture."
date: 2026-03-26
tags: [spring-boot, cache, performance]
draft: false
readingTime: 10 min
---

## Où se situe cette leçon

Les lectures sont correctes mais peuvent être chères. Le cache est une couche de vitesse optionnelle sur un service déjà juste. Ce n'est pas une seconde base.

## Ce que vous allez apprendre

- Le fonctionnement de `@Cacheable` / `@CacheEvict`
- Pourquoi TTL et eviction doivent être explicites
- Comment les écritures invalident les bonnes clés

## Modèle mental

Spring Cache est une abstraction. Caffeine est une implémentation in-process courante. Redis sert à plusieurs instances. Cette leçon reste sur l'abstraction. L'article Caffeine du blog est l'implémentation.

Cachez **par sku**, pas tout le catalogue, tant que vous ne connaissez pas le trafic. Après un changement de stock, évincez ce sku. Un stock périmé est un bug métier.

## Exemple pratique

```java
@Cacheable(cacheNames = "products", key = "#sku")
public ProductView bySku(String sku) {
    return productRepository.findBySku(sku)
        .map(ProductMapper::toView)
        .orElseThrow();
}

@CacheEvict(cacheNames = "products", key = "#sku")
public void onStockChanged(String sku) {}
```

Activez le cache avec `@EnableCaching` et un TTL. Un cache infini finit par mentir.

## Aller plus loin sur le blog

Setup Caffeine: [Caching in Spring Boot with Caffeine](/fr/blog/how-to-implement-caching-in-spring-boot-with-caffeine).

## Erreurs fréquentes

- Cacher des méthodes qui écrivent
- Oublier l'éviction après update
- Un seul nom de cache pour des types sans rapport

## Leçon suivante

Suite: [Traitements async](/fr/spring-boot/async-processing).

## Documentation officielle

- [Abstraction Spring Cache](https://docs.spring.io/spring-framework/reference/integration/cache.html)
- [Caching Spring Boot](https://docs.spring.io/spring-boot/reference/io/caching.html)

## À retenir

- Cachez les lectures, évincez aux écritures
- Les clés doivent matcher le lookup réel
- Le TTL est aussi un outil de justesse
