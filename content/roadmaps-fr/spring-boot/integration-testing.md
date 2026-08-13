---
title: Tests d'intégration
description: "Vérifier l'API et la persistance ensemble avec MockMvc, @SpringBootTest, Testcontainers, et des données de test stables."
date: 2026-03-25
tags: [spring-boot, testing, testcontainers]
draft: false
readingTime: 12 min
---

## Où se situe cette leçon

Les règles de service ont des tests unitaires. Les tests d'intégration prouvent les coutures oubliées: HTTP, filtres de sécurité, JPA, Flyway contre un vrai moteur.

## Ce que vous allez apprendre

- Quand utiliser `@SpringBootTest` et MockMvc
- Comment Testcontainers garde PostgreSQL honnête
- Comment semer des données sans polluer les autres tests

## Modèle mental

Un test d'intégration démarre (une partie de) le contexte Spring. MockMvc appelle le dispatcher servlet sans port TCP. Testcontainers lance PostgreSQL pour coller au dialecte de production.

Gardez-les moins nombreux que les tests unitaires. Couvrez les coutures risquées.

Isolez les données: rollback `@Transactional`, SKU uniques, ou schéma propre par classe.

## Exemple pratique

```java
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class ProductApiIT {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired MockMvc mockMvc;

    @Test
    void should_create_product() throws Exception {
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sku\":\"SKU-IT-1\",\"name\":\"Bolt\",\"stock\":10}"))
            .andExpect(status().isCreated());
    }
}
```

## Erreurs fréquentes

- Pointer vers un Postgres local partagé
- Un `sleep` pour "attendre l'app"
- Copier tout `application-prod.yml` dans les tests

## Leçon suivante

Suite: [Stratégie de cache](/fr/spring-boot/caching-strategy).

## Documentation officielle

- [Testcontainers Spring Boot](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html)
- [MockMvc](https://docs.spring.io/spring-framework/reference/testing/spring-mvc-test-framework.html)

## À retenir

- L'intégration protège les coutures invisibles aux tests unitaires
- Testcontainers rend le dialecte SQL réel
- Un setup de données stable fait partie du test
