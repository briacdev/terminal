---
title: Design en couches
description: "Garder les controllers fins, placer les règles métier dans les services, et mapper des DTO sans exposer la persistance."
date: 2026-03-18
tags: [spring-boot, architecture, dto]
draft: false
readingTime: 10 min
---

## Où se situe cette leçon

Vous acceptez HTTP et refusez les mauvais payloads. Cette leçon, c'est la structure: qui possède HTTP, qui possède les règles, qui possédera la persistance ensuite.

## Ce que vous allez apprendre

- La séparation controller / service / repository
- Pourquoi les règles métier ne vivent pas dans les controllers
- Pourquoi l'API expose des DTO, pas des types de persistance

## Modèle mental

Trois couches, un job chacune:

- **Controller**: HTTP, statuts, déclenchement de la validation
- **Service**: règles, orchestration, transactions plus tard
- **Repository**: charger et sauver. Ici encore une Map. La leçon 8 le remplace par Spring Data.

Les DTO sont à la frontière HTTP. Les modèles de persistance sont à la frontière base. Le mapping est ennuyeux et nécessaire. Si vous renvoyez une entité, un `@OneToMany` fuira dans le JSON.

Les services ignorent `HttpServletRequest`. Les repositories ignorent les records JSON.

## Exemple pratique

```java
@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductView create(ProductDraft draft) {
        if (productRepository.exists(draft.sku())) {
            throw new IllegalStateException("sku already exists");
        }
        return productRepository.save(draft);
    }
}
```

Le controller mappe `CreateProductRequest` vers `ProductDraft`. Le service n'importe jamais `org.springframework.web`.

## Aller plus loin sur le blog

Les DTO sont traités dans [Understanding DTOs in Java Spring Boot](/fr/blog/understanding-dtos-in-java-spring-boot).

## Erreurs fréquentes

- Injecter un repository dans un controller "pour aller plus vite"
- Une seule classe pour entité, requête et réponse
- Mettre l'autorisation ou les headers HTTP dans un service

## Leçon suivante

Suite: [Bases Spring Data JPA](/fr/spring-boot/spring-data-jpa-basics).

## Documentation officielle

- [Spring Boot web](https://docs.spring.io/spring-boot/reference/web/servlet.html)

## À retenir

- Chaque couche a une raison de changer
- Les DTO protègent l'API de la base
- Les services sans HTTP restent testables
