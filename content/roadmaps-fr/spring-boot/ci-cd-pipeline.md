---
title: Pipeline CI/CD
description: "Livrer Spring Boot avec un pipeline qui teste, publie l'artefact, et déploie progressivement au lieu de copier un build local."
date: 2026-03-31
tags: [spring-boot, ci-cd, delivery]
draft: false
readingTime: 10 min
---

## Où se situe cette leçon

Vous savez builder un jar en local. La CI doit builder le même jar, lancer les mêmes tests, et déployer un artefact rollbackable. Cette leçon, c'est le pipeline, pas un vendeur.

## Ce que vous allez apprendre

- Pourquoi les tests sont une porte, pas une option
- Publier un artefact par commit
- Déployer progressivement

## Modèle mental

1. checkout
2. `./mvnw verify`
3. jar / image taguée avec le sha git
4. push vers un registry
5. staging
6. production avec rollback

Ne déployez jamais "ce qu'il y a sur le laptop". Un sha testé est le sha exécuté.

## Exemple pratique

```yaml
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: "21"
          distribution: temurin
      - run: ./mvnw -B verify
```

Puis un job pousse `catalog-api` tagué avec le SHA git. La production déploie ce tag, pas `latest`.

## Erreurs fréquentes

- `latest` comme seul tag
- JDK local différent de la CI
- Skip Testcontainers parce que "c'est lent"

## Leçon suivante

Suite: [Durcissement production](/fr/spring-boot/production-hardening).

## Documentation officielle

- [Build systems](https://docs.spring.io/spring-boot/reference/using/build-systems.html)

## À retenir

- Le pipeline est le seul chemin de livraison supporté
- Un sha git = un artefact
- Le staging existe pour échouer avant les clients
