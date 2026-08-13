---
title: Migrations de base de données
description: "Versionner le schéma avec Flyway pour que local, staging et production évoluent dans le même ordre contrôlé."
date: 2026-03-21
tags: [spring-boot, flyway, migrations]
draft: false
readingTime: 10 min
---

## Où se situe cette leçon

Les entités impliquent un schéma. `ddl-auto=update` n'est pas un processus de release. Flyway versionne le schéma comme Git versionne le code.

## Ce que vous allez apprendre

- Pourquoi les changements de schéma appartiennent à des scripts versionnés
- Comment Flyway nomme et ordonne les migrations
- Comment aligner local, staging et production

## Modèle mental

Chaque migration est un SQL immuable: `V1__create_products.sql`, `V2__add_product_sku_index.sql`. Flyway enregistre les versions dans `flyway_schema_history`. N'éditez jamais un script déjà joué sur un environnement partagé. Ajoutez `V3`.

Les migrations répétables (`R__`) servent aux vues. Les versionnées servent aux tables.

Désactivez la génération de schéma Hibernate partout où Flyway tourne. Un seul auteur du schéma.

## Exemple pratique

```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0
);
```

```yaml
spring:
  flyway:
    enabled: true
  jpa:
    hibernate:
      ddl-auto: validate
```

`validate` échoue vite si le mapping ne correspond plus au schéma migré.

## Aller plus loin sur le blog

Un setup Flyway plus long est dans [Flyway for database migrations](/fr/blog/flyway-for-database-migrations-in-spring-boot-applications).

## Erreurs fréquentes

- `ddl-auto=update` en production
- Réécrire `V1` après un run sur staging
- Du SQL manuel en prod qui n'existe pas en migration

## Leçon suivante

Suite: [Fondamentaux sécurité](/fr/spring-boot/security-fundamentals).

## Documentation officielle

- [Flyway avec Spring Boot](https://docs.spring.io/spring-boot/reference/howto/data-initialization.html#howto.data-initialization.migration-tool.flyway)

## À retenir

- L'historique de schéma est du code
- Les migrations sont append-only sur les environnements partagés
- Hibernate valide; Flyway migre
