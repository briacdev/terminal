---
title: Bases Spring Data JPA
description: "Persister avec Spring Data JPA: entités, repositories, CRUD, pagination, et conventions de méthodes de requête."
date: 2026-03-19
tags: [spring-boot, jpa, persistence]
draft: false
readingTime: 12 min
---

## Où se situe cette leçon

Les couches sont en place. La persistance devient réelle: entités, repositories, CRUD, pagination. Les filtres dynamiques attendent la leçon 9. Le versioning de schéma attend la leçon 10.

## Ce que vous allez apprendre

- Mapper une table avec `@Entity`
- Obtenir CRUD et paging via `JpaRepository`
- Relier le nom d'une méthode à du SQL

## Modèle mental

Une entité est un modèle de persistance, pas un modèle d'API. Un repository ressemble à une collection. Spring Data génère l'implémentation.

Commencez par:

- `@Id` généré
- associations `LAZY` quand vous ajouterez des relations
- `Pageable` pour les listes, jamais un `findAll()` sans borne dans une API

Les transactions vivent sur le service. Les controllers restent hors transaction.

## Exemple pratique

```java
@Entity
@Table(name = "products")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;

    private String name;
    private int stock;
}
```

```java
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    Optional<ProductEntity> findBySku(String sku);
    Page<ProductEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);
    boolean existsBySku(String sku);
}
```

Il faut `spring-boot-starter-data-jpa` et un driver. En local, PostgreSQL ou H2; en production, alignez-vous sur la vraie base.

## Aller plus loin sur le blog

PostgreSQL: [Setting up PostgreSQL](/fr/blog/setting-up-postgresql-in-a-spring-boot-project-with-spring-data-jpa). H2: [Introduction to H2](/fr/blog/introduction-to-h2-database-in-spring-boot). Transactions: [@Transactional](/fr/blog/understanding-the-transactional-annotation-in-spring-boot). Projections: [JPA projections](/fr/blog/understanding-jpa-projections-in-spring-boot).

## Erreurs fréquentes

- Renvoyer `ProductEntity` depuis un controller
- Mettre `EAGER` sur les collections "pour que le JSON marche"
- Appeler `findAll()` sans pagination

## Leçon suivante

Suite: [CriteriaBuilder et requêtes dynamiques](/fr/spring-boot/criteriabuilder-and-dynamic-queries).

## Documentation officielle

- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/)
- [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa)

## À retenir

- Les entités restent dans la couche persistance
- Les query methods couvrent les lookups simples
- Les listes sont des pages
