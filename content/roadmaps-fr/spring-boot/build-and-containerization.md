---
title: Build et containerisation
description: "Packager une API Spring Boot en jar exécutable, construire une image Docker, et injecter la config hors de l'image."
date: 2026-03-30
tags: [spring-boot, docker, build]
draft: false
readingTime: 10 min
---

## Où se situe cette leçon

L'app peut être observée. Packager comme la production: jar exécutable, puis conteneur, config injectée au runtime.

## Ce que vous allez apprendre

- Comment Boot construit un fat jar
- Une stratégie d'image Docker simple
- Pourquoi config et secrets restent hors de l'image

## Modèle mental

`./mvnw package` produit un jar avec serveur embarqué. Docker enveloppe ce jar plus un JRE.

Image petite, user non-root. Ne gravez pas les mots de passe dans l'image. Passez `SPRING_DATASOURCE_PASSWORD` au runtime. L'image est immuable.

## Exemple pratique

```dockerfile
FROM eclipse-temurin:21-jre
RUN useradd -r spring
WORKDIR /app
COPY target/catalog-api.jar app.jar
USER spring
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

## Erreurs fréquentes

- Conteneur en root
- Copier le cache Maven dans l'image finale
- JDBC de production dans le Dockerfile

## Leçon suivante

Suite: [Pipeline CI/CD](/fr/spring-boot/ci-cd-pipeline).

## Documentation officielle

- [Packaging](https://docs.spring.io/spring-boot/reference/packaging/index.html)
- [Container images](https://docs.spring.io/spring-boot/reference/packaging/container-images/index.html)

## À retenir

- Le jar est l'unité de déploiement; Docker est une enveloppe
- La config runtime entre par l'environnement
- Images petites, non-root, sans secrets
