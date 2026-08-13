---
title: Injection de dépendances et beans
description: "Apprendre le conteneur Spring: cycle de vie des beans, injection par constructeur, et classes de configuration."
date: 2026-03-14
tags: [spring-boot, beans, dependency-injection]
draft: false
readingTime: 11 min
---

## Où se situe cette leçon

Le projet existe. Cette leçon, c'est le conteneur Spring: comment les objets sont créés, câblés, et remplacés dans les tests.

## Ce que vous allez apprendre

- Ce qu'est un bean et son cycle de vie
- Pourquoi l'injection par constructeur doit être le défaut
- Quand une classe `@Configuration` est le bon outil

## Modèle mental

Spring possède le graphe d'objets. Vous déclarez des types; le conteneur les instancie, injecte les collaborateurs, et appelle les callbacks de cycle de vie.

Préférez l'injection par constructeur. Les dépendances obligatoires deviennent `final`, un bean manquant échoue au démarrage, et les tests peuvent faire `new` avec des fakes. L'injection par champ cache le contrat.

Utilisez les stéréotypes (`@Service`, `@Repository`, `@RestController`) pour vos types. Utilisez `@Bean` dans une `@Configuration` pour encapsuler un type tiers.

Le scope par défaut est singleton. C'est correct pour un service sans état. N'y stockez pas de données de requête.

## Exemple pratique

```java
@Service
public class StockAlertService {
    private final SlackNotifier slackNotifier;

    public StockAlertService(SlackNotifier slackNotifier) {
        this.slackNotifier = slackNotifier;
    }

    public void lowStock(String sku, int remaining) {
        slackNotifier.send("ops", sku + " has " + remaining + " left");
    }
}
```

```java
@Configuration
public class TimeConfig {
    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }
}
```

## Erreurs fréquentes

- `@Autowired` sur les champs comme style par défaut
- Dépendances circulaires entre deux `@Service`
- Faire `new` d'un collaborateur dans un type géré par Spring

## Leçon suivante

Suite: [Configuration et profils](/fr/spring-boot/configuration-and-profiles).

## Documentation officielle

- [Beans et injection](https://docs.spring.io/spring-boot/reference/using/spring-beans-and-dependency-injection.html)
- [Vue d'ensemble des beans](https://docs.spring.io/spring-framework/reference/core/beans/introduction.html)

## À retenir

- Le conteneur construit le graphe; vos constructeurs le déclarent
- L'injection par constructeur est le défaut testable
- `@Configuration` sert aux objets que vous ne pouvez pas annoter
