---
title: CriteriaBuilder et requêtes dynamiques
description: "Construire des filtres type-safe et composables avec CriteriaBuilder et les Specifications JPA quand les query methods ne suffisent plus."
date: 2026-03-20
tags: [spring-boot, jpa, specifications]
draft: false
readingTime: 11 min
---

## Où se situe cette leçon

`findBySku` ne suffit plus quand l'UI envoie des filtres optionnels. Les query methods explosent en `findByNameAndStockGreaterThanAnd...`. Les Specifications gardent ces filtres composables.

## Ce que vous allez apprendre

- Quand les query methods cessent de passer à l'échelle
- Comment CriteriaBuilder construit des prédicats type-safe
- Comment composer des `Specification` Spring Data

## Modèle mental

Une `Specification` est une fonction: `(root, query, cb) -> Predicate`. Vous les combinez avec `and` / `or`. Un paramètre absent devient un spec neutre, pas une nouvelle méthode.

C'est un outil de lecture. N'y cachez pas des updates. Le billet de blog sur les Specifications détaille un formulaire de recherche complet. Cette leçon n'enseigne que la composition, sans recopier cet article.

## Exemple pratique

```java
public final class ProductSpecifications {
    public static Specification<ProductEntity> nameContains(String name) {
        return (root, query, cb) -> name == null || name.isBlank()
            ? cb.conjunction()
            : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<ProductEntity> stockAtLeast(Integer min) {
        return (root, query, cb) -> min == null
            ? cb.conjunction()
            : cb.greaterThanOrEqualTo(root.get("stock"), min);
    }
}
```

```java
var spec = ProductSpecifications.nameContains(name)
    .and(ProductSpecifications.stockAtLeast(minStock));
return productRepository.findAll(spec, pageable);
```

## Aller plus loin sur le blog

Le parcours recherche + pagination est dans [JPA Specifications in Spring Boot](/fr/blog/jpa-specifications-in-spring-boot-pagination-and-dynamic-search).

## Erreurs fréquentes

- Une méthode repository par combinaison de cases à cocher
- Du JPQL concatené
- Oublier `JpaSpecificationExecutor`

## Leçon suivante

Suite: [Migrations de base de données](/fr/spring-boot/database-migrations).

## Documentation officielle

- [JPA Specifications](https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html)

## À retenir

- Les filtres optionnels vivent dans des specifications composables
- CriteriaBuilder garde les prédicats type-safe
- Les query methods restent pour les lookups nommés et simples
