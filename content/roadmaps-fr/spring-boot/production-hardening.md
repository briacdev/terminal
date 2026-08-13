---
title: Durcissement production
description: "Durcir une API Spring Boot en production: defaults sûrs, rollback, et un runbook opérationnel en cas d'incident."
date: 2026-04-01
tags: [spring-boot, production, operations]
draft: false
readingTime: 11 min
---

## Où se situe cette leçon

C'est la leçon 21 sur 21. L'API est construite, testée, observée, déployée. Le durcissement est le contrat production: defaults sûrs, rollback, réponse écrite aux incidents.

## Ce que vous allez apprendre

- Quels defaults Boot verrouiller
- Pourquoi le rollback doit être répété
- Ce qu'un runbook court contient

## Modèle mental

La production est hostile. Concevez l'annulation rapide.

Defaults sûrs: pas d'Actuator public hors health, HTTPS en bordure, secrets hors YAML, Flyway `validate` au boot, anonymat seulement sur les routes documentées.

Rollback: garder le tag d'image précédent. Les migrations doivent rester compatibles avec l'ancienne app si vous reculez le binaire.

Un runbook tient en une page: santé, sha déployé, revert, contacts, logs.

## Exemple pratique

Checklist minimale:

1. `SPRING_PROFILES_ACTIVE=prod`
2. Allow-list Actuator = health
3. Le tag précédent est encore dans le registry
4. L'on-call connaît `/actuator/health`
5. Une migration Flyway ratée arrête la nouvelle instance; l'ancienne garde le trafic

Si vous ne savez pas annuler le dernier deploy en dix minutes, ce n'est pas encore durci.

## Erreurs fréquentes

- Le premier test production est le lancement client
- Migration destructive dans le même train qu'une feature risquée
- Des dashboards que l'on-call n'ouvre pas

## Leçon suivante

Vous avez terminé le parcours. Revenez à la [roadmap Spring Boot](/fr/spring-boot) pour une vue d'ensemble.

## Documentation officielle

- [Production-ready features](https://docs.spring.io/spring-boot/reference/actuator/)
- [Deployment](https://docs.spring.io/spring-boot/reference/deploying/index.html)

## À retenir

- Les settings production sont explicites
- Le rollback est une feature que l'on répète
- Un runbook transforme un incident en procédure
