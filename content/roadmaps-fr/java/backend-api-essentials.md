---
title: Backend - Essentiels API
description: "Concevoir des API Java maintenables : architecture en couches, DTO, validation, contrats d’erreur cohérents et configuration par environnement."
date: 2025-01-14
tags: [java, backend, api, architecture]
draft: false
readingTime: 16 min
---

## Pourquoi cette étape est importante

Une API backend doit rester maintenable quand les fonctionnalités grandissent.
Architecture et contrats comptent plus que le choix de framework.

Cette étape est agnostique pour s’appliquer à Spring, Jakarta EE ou des serveurs légers.

## Architecture en couches

Baseline pratique :

- couche transport : entrée/sortie HTTP
- couche application/service : règles métier
- couche data access : persistance

Chaque couche a une responsabilité claire.
Les dépendances pointent vers les règles métier, pas vers les frameworks.

## DTO et contrats

Exposez des DTO aux frontières d’API.
N’exposez pas les modèles de persistance directement.

```java
public record CreateUserRequest(String username, String email) {}
public record UserResponse(Long id, String username, String email) {}
```

Cela évite le couplage API/stockage et facilite le versioning.

## Stratégie de validation

Validez tôt à la frontière :

- champs requis
- contraintes de format
- préconditions métier

```java
public record CreateUserRequest(String username, String email) {
    public void validate() {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("username required");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("invalid email");
        }
    }
}
```

Les validateurs de framework sont bienvenus ; l’essentiel est d’échouer vite avec des messages clairs.

## Contrat de gestion d’erreurs

Utilisez une forme d’erreur cohérente sur tous les endpoints.

```java
public record ErrorResponse(String code, String message, String requestId) {}
```

Bénéfices :

- clients plus simples
- monitoring/alerting plus faciles
- comportement API prévisible

Mappez les échecs métier vers des codes HTTP stables (`400`, `401`, `403`, `404`, `409`, `500`) sans fuiter l’interne.

## Configuration et environnements

Externalisez la config au lieu de durcir des valeurs :

- port
- URL de base de données
- clés API / secrets
- feature flags

Environnements typiques :

- local
- staging
- production

Ne commitez jamais de secrets. Préférez variables d’environnement ou secret manager.

## Logs et traçabilité

Incluez request IDs et champs de contexte stables dans les logs.
Le debug production devient bien plus rapide, et cela prépare l’étape observabilité.

## Idempotence et méthodes HTTP

Comprenez la sémantique HTTP :

- `GET` doit être safe
- `PUT` / `DELETE` sont souvent idempotents
- `POST` peut créer des doublons sans clés d’idempotence

## Erreurs fréquentes

- logique métier dans la couche transport
- validation dupliquée partout
- formats d’erreur incohérents
- config d’environnement mélangée au code source
- retourner des entités DB depuis les controllers

## Checklist pratique

- dessiner les couches d’un use case “créer une commande”
- définir request/response records pour un endpoint
- implémenter validation de frontière + erreur partagée
- externaliser un réglage (ex. URL DB) hors du code

## À retenir

1. Construire autour de frontières de couches claires
2. Garder des contrats API explicites avec des DTO
3. Valider aux frontières et standardiser les erreurs
4. Garder la configuration externe et consciente de l’environnement
