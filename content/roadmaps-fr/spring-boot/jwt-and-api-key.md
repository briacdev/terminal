---
title: Approches JWT et API Key
description: "Choisir l'authentification API: JWT pour les utilisateurs, clés API pour le service-to-service, rotation et compromis."
date: 2026-03-23
tags: [spring-boot, security, jwt, api-key]
draft: false
readingTime: 11 min
---

## Où se situe cette leçon

La filter chain est en place. Choisissez un style de credential pour une API. Ce n'est pas un tutoriel de lib JWT, ni une copie de l'article API key du blog. C'est une leçon de décision.

## Ce que vous allez apprendre

- Quand le JWT convient aux APIs utilisateurs
- Quand les clés API conviennent au service-to-service
- À quoi ressemblent rotation et validation

## Modèle mental

**JWT**: `Authorization: Bearer <token>`. Le resource server valide signature, expiration, issuer, puis mappe les claims. Adapté aux utilisateurs et aux access tokens courts. Pas de secrets dans les claims.

**Clé API**: header `X-API-Key`. Le serveur compare un hash, vérifie statut et scopes, authentifie un principal technique. Adapté aux jobs, partenaires, CLIs. Les clés doivent être hashées, rotatives, révocables.

Ne mélangez pas les deux sur toutes les routes sans raison.

## Exemple pratique

Un filtre a un job: transformer un header en `Authentication` ou rejeter.

```java
String header = request.getHeader("X-API-Key");
if (header == null || header.isBlank()) {
    response.sendError(401);
    return;
}
ApiClient client = apiKeyService.authenticate(header);
SecurityContextHolder.getContext().setAuthentication(client.toAuthentication());
filterChain.doFilter(request, response);
```

`authenticate` compare un hash. La rotation émet une nouvelle clé, accepte les deux pendant une fenêtre, puis révoque l'ancienne.

Pour le JWT, préférez le support resource-server de Spring Security OAuth2.

## Aller plus loin sur le blog

Une implémentation concrète de filtre API key: [How to implement key authentication](/fr/blog/how-to-implement-key-authentication-in-a-spring-boot-api).

## Erreurs fréquentes

- Stocker les clés en clair
- Un JWT qui n'expire jamais
- La même clé statique dans le bundle frontend

## Leçon suivante

Suite: [Tests unitaires](/fr/spring-boot/unit-testing).

## Documentation officielle

- [OAuth2 resource server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html)

## À retenir

- JWT pour les utilisateurs et l'accès court
- Clés API pour les machines, hashées et rotatives
- La validation a lieu dans la filter chain
