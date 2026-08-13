---
title: Controllers REST
description: "Construire des endpoints HTTP avec Spring MVC: mappings, records requête/réponse, et statuts HTTP corrects."
date: 2026-03-16
tags: [spring-boot, rest, api]
draft: false
readingTime: 11 min
---

## Où se situe cette leçon

La config est externalisée. Cette leçon, c'est la surface HTTP: mappings, records, et statuts. La validation attend la leçon 6. Les couches attendent la leçon 7.

## Ce que vous allez apprendre

- Comment `@RestController` relie HTTP et méthodes
- Comment garder requête et réponse en records
- Quels statuts renvoyer à la création, à la lecture, et si la ressource manque

## Modèle mental

Un controller REST est une couche de traduction. Il lit HTTP, appelle une méthode, écrit HTTP. Il ne parle pas à la base. Pour cette leçon, un service en mémoire suffit.

Noms dans les chemins (`/products/{sku}`). Verbes HTTP pour les actions. `201` plus `Location` à la création, `200` à la lecture, `404` si le sku est inconnu.

Les records rendent le contrat JSON explicite. N'exposez pas une entité JPA: vous n'avez pas encore JPA, et ce couplage appartiendra aux leçons data.

## Exemple pratique

```java
@RestController
@RequestMapping("/products")
public class ProductController {
    private final Map<String, ProductResponse> catalog = new ConcurrentHashMap<>();

    @GetMapping("/{sku}")
    ResponseEntity<ProductResponse> get(@PathVariable String sku) {
        ProductResponse product = catalog.get(sku);
        return product == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(product);
    }

    @PostMapping
    ResponseEntity<ProductResponse> create(@RequestBody CreateProductRequest request) {
        ProductResponse created = new ProductResponse(request.sku(), request.name(), request.stock());
        catalog.put(created.sku(), created);
        return ResponseEntity.created(URI.create("/products/" + created.sku())).body(created);
    }
}
```

## Aller plus loin sur le blog

Le design HTTP est développé dans [Understanding RESTful APIs](/fr/blog/understanding-restful-apis-a-guide-with-spring-boot) et [Best practices for RESTful API design](/fr/blog/best-practices-for-restful-api-design).

## Erreurs fréquentes

- Renvoyer `200` pour une création, ou `200` vide pour une ressource absente
- Mettre du SQL ou des règles métier dans le controller
- Utiliser des verbes dans l'URL (`/createProduct`)

## Leçon suivante

Suite: [Validation et gestion des erreurs](/fr/spring-boot/validation-and-error-handling).

## Documentation officielle

- [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service)
- [Web MVC](https://docs.spring.io/spring-framework/reference/web/webmvc.html)

## À retenir

- Les controllers traduisent HTTP; ils ne sont pas la couche métier
- Les records documentent le JSON
- Les statuts font partie de l'API
