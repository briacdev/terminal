---
title: Validation et gestion des erreurs
description: "Valider les payloads avec Bean Validation et renvoyer un contrat d'erreur API unique via un handler global."
date: 2026-03-17
tags: [spring-boot, validation, errors]
draft: false
readingTime: 11 min
---

## Où se situe cette leçon

Les endpoints existent. Les clients enverront des noms vides et du stock négatif. Cette leçon, c'est le contrat de frontière: valider l'entrée et renvoyer une seule forme d'erreur.

## Ce que vous allez apprendre

- Annoter les records de requête avec Bean Validation
- Centraliser les exceptions avec `@RestControllerAdvice`
- Stabiliser le JSON d'erreur

## Modèle mental

Validez au bord. `@Valid` sur le `@RequestBody` exécute les contraintes avant le corps de méthode. Les violations ne doivent pas fuiter en stack trace ni en JSON différent par controller.

Un `@ExceptionHandler` global mappe:

- `MethodArgumentNotValidException` vers `400`
- "not found" métier vers `404`
- les pannes inattendues vers `500` sans détail interne

Le body d'erreur est un contrat, comme un body de succès.

## Exemple pratique

```java
public record CreateProductRequest(
    @NotBlank String sku,
    @NotBlank String name,
    @Min(0) int stock
) {}
```

```java
@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ApiError invalid(MethodArgumentNotValidException ex) {
        var field = ex.getBindingResult().getFieldErrors().get(0);
        return new ApiError("VALIDATION_ERROR", field.getDefaultMessage(), field.getField());
    }
}
```

## Erreurs fréquentes

- Un JSON d'erreur différent par controller
- Avaler une validation et renvoyer `200`
- Un `try/catch` dans chaque méthode au lieu d'un advice unique

## Leçon suivante

Suite: [Design en couches](/fr/spring-boot/layered-design).

## Documentation officielle

- [Bean Validation](https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html)
- [ExceptionHandler](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html)

## À retenir

- Les contraintes vivent sur le record de requête
- Une classe d'advice possède le mapping HTTP des erreurs
- Le JSON d'erreur fait partie de l'API publique
