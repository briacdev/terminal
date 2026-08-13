---
title: Livraison - Docker et CI/CD
description: "Livrer des apps Java de façon fiable : images Docker, gates qualité CI, stratégies CD (rolling, blue/green, canary) et secrets hors image."
date: 2025-01-17
tags: [java, delivery, docker, cicd]
draft: false
readingTime: 16 min
---

## Pourquoi cette étape est importante

Livrer un logiciel de façon fiable est aussi important que l’écrire.
Docker et la CI/CD rendent les builds reproductibles et les déploiements plus sûrs.

Une bonne boucle de livraison transforme “ça marche sur ma machine” en “ça marche en production”.

## Containeriser l’application

Pattern Dockerfile typique Java :

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Utilisez des images runtime légères et contrôlez la taille.
Préférez les multi-stage builds si vous compilez dans Docker.

Taguez les images avec des versions immuables (SHA de commit ou version de release), pas seulement `latest`.

## Essentiels d’un pipeline CI

Un pipeline de base doit exécuter :

1. checks lint / format
2. tests unitaires
3. build du package
4. tests d’intégration optionnels
5. build et publication d’image

Échouez vite sur les quality gates.
Buildez une fois et promouvez le même artefact à travers les environnements.

## CD et stratégies de déploiement

Stratégies courantes :

- rolling update
- blue/green
- canary

### Rolling update

Vous remplacez progressivement les anciennes instances par les nouvelles.
Le trafic continue pendant le rollout, sans downtime complet.

Forces :

- simple à mettre en place sur la plupart des plateformes
- peu d’infra supplémentaire

Limite :

- rollback parfois plus lent car anciennes et nouvelles versions coexistent

### Blue/Green

Vous gardez deux environnements complets :

- `blue` = version production actuelle
- `green` = nouvelle version candidate

Quand `green` est validée, vous basculez tout le trafic d’un coup.

Forces :

- rollback très rapide (rebascule vers `blue`)
- risque réduit au moment du cutover

Limite :

- coût d’infra plus élevé (double environnement)

### Canary

Vous envoyez d’abord une petite part du trafic (par ex. 5 %) vers la nouvelle version.
Si les métriques restent saines, vous augmentez progressivement (20 %, 50 %, 100 %).

Forces :

- détection précoce des régressions utilisateurs réels
- rayon d’impact limité en cas d’échec

Limite :

- nécessite une forte observabilité et un routage fin

Commencez simple, ajoutez le progressive rollout quand nécessaire.

## Gestion des environnements

Gardez secrets et config hors des images.
Utilisez les secret stores de plateforme ou la gestion de secrets CI.
Ne jamais cuire des credentials production dans les couches Docker.

## Health checks et rollback

Exposez des endpoints de santé et branchez-les à l’orchestrateur.
Définissez un déclencheur de rollback : hausse du taux d’erreur, health checks en échec, ou SLO cassés.

## Erreurs fréquentes

- déployer directement depuis les machines développeurs
- sauter les gates de tests avant déploiement
- tags d’image mutables sans traçabilité
- pas de stratégie de rollback
- stocker des secrets dans l’image ou dans les logs CI en clair

## Checklist pratique

- écrire un Dockerfile minimal pour un JAR packagé
- ajouter tests unitaires + package comme stages CI obligatoires
- choisir une stratégie de rollout et documenter son rollback
- sortir un secret du code vers un secret store

## À retenir

1. Builder une fois, déployer de façon cohérente
2. Automatiser tests et packaging en CI
3. Utiliser une stratégie de rollout sûre en CD
4. Garder le déploiement observable et réversible
