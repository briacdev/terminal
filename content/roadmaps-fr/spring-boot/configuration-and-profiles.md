---
title: Configuration et profils
description: "Externaliser la configuration Spring Boot avec application.yml, des profils local/staging/production, et des secrets sûrs."
date: 2026-03-15
tags: [spring-boot, configuration, profiles]
draft: false
readingTime: 10 min
---

## Où se situe cette leçon

Les beans sont câblés. Les valeurs doivent maintenant changer selon l'environnement sans toucher au code: ports, URLs, flags, secrets.

## Ce que vous allez apprendre

- Comment `application.yml` et les variables d'environnement se superposent
- Comment séparer local, staging et production avec des profils
- Comment binder des propriétés typées plutôt que disperser des `@Value`

## Modèle mental

Spring Boot lit la configuration depuis plusieurs sources. Les fichiers de `src/main/resources` sont la base. Les variables d'environnement et les arguments CLI les surchargent. C'est ainsi que le même jar tourne en local et en production.

Les profils activent une tranche: `application-local.yml`, `application-staging.yml`, `application-prod.yml`. Ne commitez jamais les mots de passe de production. Injectez les secrets au runtime.

`@ConfigurationProperties` vaut mieux que beaucoup de `@Value`. Vous obtenez un objet typé, de la validation, et un seul endroit pour documenter les clés.

## Exemple pratique

```yaml
spring:
  application:
    name: catalog-api
  profiles:
    default: local

catalog:
  alert-channel: ops
  low-stock-threshold: 5
```

```java
@ConfigurationProperties(prefix = "catalog")
public record CatalogProperties(String alertChannel, int lowStockThreshold) {}
```

Surchargez en production avec `SPRING_PROFILES_ACTIVE=prod`. Gardez les mots de passe hors du YAML versionné.

## Erreurs fréquentes

- Committer `application-prod.yml` avec de vrais secrets
- Recopier les mêmes clés dans trois YAML au lieu d'un défaut plus des overrides
- Lire `System.getenv` dans les services au lieu de binder des propriétés

## Leçon suivante

Suite: [Controllers REST](/fr/spring-boot/rest-controllers).

## Documentation officielle

- [Configuration externalisée](https://docs.spring.io/spring-boot/reference/features/external-config.html)
- [Profils](https://docs.spring.io/spring-boot/reference/features/profiles.html)

## À retenir

- La config est de la donnée, pas du code
- Les profils surchargent les defaults; les secrets restent hors Git
- Bindez le YAML sur un record
