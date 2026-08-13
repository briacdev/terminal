---
title: Fondamentaux Spring Boot
description: "Comprendre ce que Spring Boot ajoute à Spring: starters, auto-configuration, et une première application exécutable."
date: 2026-03-12
tags: [spring-boot, fundamentals, auto-configuration]
draft: false
readingTime: 9 min
---

## Où se situe cette leçon

C'est la leçon 1 sur 21. Avant les dossiers Maven, les beans ou les mappings REST, il faut une image claire de ce que Spring Boot fait vraiment.

## Ce que vous allez apprendre

- Le lien entre Spring Boot et le Spring Framework
- À quoi servent les starters et l'auto-configuration
- Comment une application minimale démarre et répond en HTTP

## Modèle mental

Spring Boot n'est pas un second framework. Le Spring Framework fournit toujours le conteneur, la couche web et le modèle de programmation. Boot ajoute des **conventions**: des ensembles de dépendances (starters), une mise en route basée sur le classpath (auto-configuration), et des defaults adaptés à la production, comme un serveur embarqué.

`@SpringBootApplication` combine configuration, détection des composants et auto-configuration. Le scan part du package de la classe principale. L'auto-configuration n'est pas une magie qui vous combat: si vous déclarez votre propre bean, Boot s'efface en général.

Cette leçon s'arrête à ce modèle. La structure de projet est la leçon 2. Le câblage des beans est la leçon 3.

## Exemple pratique

```java
package com.briac.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class CatalogApplication {
    public static void main(String[] args) {
        SpringApplication.run(CatalogApplication.class, args);
    }
}

@RestController
class HealthPingController {
    @GetMapping("/ping")
    String ping() {
        return "pong";
    }
}
```

`spring-boot-starter-web` suffit ici. Il apporte Spring MVC et un Tomcat embarqué. Vous n'ajoutez pas Tomcat à la main.

## Erreurs fréquentes

- Voir Boot comme un remplaçant de Spring plutôt que comme une façon d'assembler Spring
- Ajouter Data JPA, Security et Actuator dès le premier jour, puis déboguer cinq couches à la fois
- Placer la classe principale dans un sous-package, ce qui empêche le scan des packages voisins

## Leçon suivante

Suite: [Initialisation du projet](/fr/spring-boot/project-setup).

## Documentation officielle

- [Référence Spring Boot](https://docs.spring.io/spring-boot/reference/)
- [Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
- [Building an Application with Spring Boot](https://spring.io/guides/gs/spring-boot)

## À retenir

- Boot accélère l'assemblage; Spring reste le modèle de programmation
- Starters et auto-configuration sont des defaults, pas un comportement impossible à surcharger
- Un endpoint `/ping` suffit pour valider le modèle avant d'ajouter de la structure
