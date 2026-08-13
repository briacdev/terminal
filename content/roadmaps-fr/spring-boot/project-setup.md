---
title: Initialisation du projet
description: "Créer un projet Spring Boot propre avec Initializr, une structure standard, et un wrapper Maven ou Gradle."
date: 2026-03-13
tags: [spring-boot, setup, maven, gradle]
draft: false
readingTime: 10 min
---

## Où se situe cette leçon

La leçon 1 expliquait ce qu'est Boot. Celle-ci explique comment créer un projet partageable: Initializr, dossiers, et wrapper.

## Ce que vous allez apprendre

- Générer un projet avec Spring Initializr
- Où vivent le code, les tests et la config
- Pourquoi un wrapper Maven ou Gradle vaut mieux qu'un CLI global

## Modèle mental

Initializr n'est pas un gadget. Il produit les conventions de la plupart des codebases Spring Boot: `src/main/java`, `src/main/resources`, `src/test/java`, un BOM ou un plugin parent, et `mvnw` / `gradlew`.

Gardez la classe principale dans le package racine (`com.briac.catalog`) et placez les packages métier en dessous. Le scan des composants part de là.

Choisissez **un** outil de build et restez-y. Maven est souvent plus simple pour une première API. Gradle convient si l'équipe l'utilise déjà. Le wrapper fige la version de l'outil pour que CI et laptops ne divergent pas.

N'empilez pas tous les starters dès la génération. `Spring Web` suffit jusqu'à ce qu'une leçon plus loin ait besoin de JPA, Security ou Actuator.

## Exemple pratique

Une première génération typique:

- Project: Maven
- Java: 21
- Packaging: jar
- Dependencies: Spring Web

```text
catalog-api
├── src/main/java/com/briac/catalog/CatalogApplication.java
├── src/main/resources/application.yml
├── src/test/java/com/briac/catalog/CatalogApplicationTests.java
├── pom.xml
└── mvnw
```

Préférez le wrapper:

```bash
./mvnw spring-boot:run
./mvnw test
./mvnw clean package
```

## Aller plus loin sur le blog

Le cycle de vie Maven est détaillé dans [Introduction to Maven in a Java Spring Boot project](/fr/blog/introduction-to-maven-in-a-java-spring-boot-project). Cette leçon ne couvre que les choix d'initialisation.

## Erreurs fréquentes

- Générer le projet avec Security, JPA, Mail et Actuator "au cas où"
- Lancer un `mvn` global alors que la CI utilise une autre version du wrapper
- Placer les classes applicatives au-dessus du package de la classe principale

## Leçon suivante

Suite: [Injection de dépendances et beans](/fr/spring-boot/dependency-injection-and-beans).

## Documentation officielle

- [Spring Initializr](https://start.spring.io/)
- [Systèmes de build Spring Boot](https://docs.spring.io/spring-boot/reference/using/build-systems.html)
- [Gradle Wrapper](https://docs.gradle.org/userguide/gradle_wrapper_basics.html)

## À retenir

- Initializr plus un wrapper est le point de départ sûr pour une équipe
- Les conventions de dossiers font partie de la façon dont Boot trouve votre code
- Ajoutez les dépendances quand une leçon suivante en a besoin
