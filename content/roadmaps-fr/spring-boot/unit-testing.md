---
title: Tests unitaires
description: "Tester les services Spring Boot isolément avec JUnit 5, Mockito, et une structure Given/When/Then lisible."
date: 2026-03-24
tags: [spring-boot, testing, junit, mockito]
draft: false
readingTime: 10 min
---

## Où se situe cette leçon

Les choix de sécurité sont faits. Avant de leur faire confiance, il faut des tests rapides de la couche service. Cette leçon, c'est l'isolement. HTTP + base, c'est la leçon 14.

## Ce que vous allez apprendre

- Ce qu'un test unitaire doit couvrir
- Comment Mockito remplace les collaborateurs
- Comment Given / When / Then garde les tests lisibles

## Modèle mental

Un test unitaire construit un service avec des dépendances factices. Il ne démarre pas Tomcat et n'a pas besoin de base. Cette vitesse est le but.

Mockez seulement les types de frontière (repositories, clocks, clients HTTP). Ne mockez pas la classe sous test.

Nommez les tests d'après le comportement: `should_reject_negative_stock_adjustment`.

## Exemple pratique

```java
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock ProductRepository productRepository;
    @InjectMocks ProductService productService;

    @Test
    void should_reduce_stock_when_product_exists() {
        when(productRepository.findBySku("SKU-1"))
            .thenReturn(Optional.of(ProductEntity.testSku("SKU-1", 8)));

        int remaining = productService.reserve("SKU-1", 3);

        assertEquals(5, remaining);
    }
}
```

## Erreurs fréquentes

- `@SpringBootTest` sur chaque test de service
- Mockez la moitié de la classe sous test
- Vérifier qu'un mock a été appelé au lieu du résultat métier

## Leçon suivante

Suite: [Tests d'intégration](/fr/spring-boot/integration-testing).

## Documentation officielle

- [Tests Spring Boot](https://docs.spring.io/spring-boot/reference/testing/index.html)
- [JUnit 5](https://junit.org/junit5/docs/current/user-guide/)

## À retenir

- Les tests unitaires sont rapides parce qu'ils sautent le réseau et la base
- Mockito remplace les repositories, pas le service
- Les noms de comportement battent les noms de méthodes
