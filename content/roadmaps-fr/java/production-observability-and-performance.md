---
title: Production - Observabilité et performance
description: "Opérer des services Java en production : logs structurés, métriques, tracing distribué, profiling et tuning de performance fondé sur la mesure."
date: 2025-01-18
tags: [java, production, observability, performance]
draft: false
readingTime: 20 min
---

## Pourquoi cette étape est importante

Si tu ne peux pas observer ton système, tu ne peux pas l'exploiter de façon fiable.
En production, la vitesse de diagnostic compte autant que la vitesse d'exécution.

## Logs structurés

Préfère des logs structurés au texte libre.
Inclure des champs stables comme :

- timestamp
- level
- nom du service
- request id / trace id
- user id ou tenant id si pertinent
- nom d'evenement metier (ex: `order_created`)

Cela accelere la recherche, la correlation et l'alerting.

## Comment faire de bons logs

Un bon log repond vite a 4 questions :

1. quoi s'est passe ?
2. sur quelle entite ?
3. avec quel contexte ?
4. avec quel niveau de gravite ?

Regles pratiques :

- loguer des evenements, pas des romans
- garder des messages courts et stables
- ajouter les variables utiles en champs (id, status, duree)
- ne jamais loguer des secrets (mot de passe, token brut, carte)
- logger les exceptions avec stack trace uniquement quand utile
- utiliser `INFO` pour metier normal, `WARN` pour degration, `ERROR` pour echec

## Dependances de logs (Java)

Stack recommandee (simple et robuste):

- API: SLF4J
- implementation: Logback
- option JSON: logstash-logback-encoder

### Maven

```xml
<dependencies>
  <dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>2.0.16</version>
  </dependency>

  <dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.5.8</version>
  </dependency>

  <dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>8.0</version>
  </dependency>
</dependencies>
```

### Gradle

```groovy
dependencies {
  implementation 'org.slf4j:slf4j-api:2.0.16'
  runtimeOnly 'ch.qos.logback:logback-classic:1.5.8'
  runtimeOnly 'net.logstash.logback:logstash-logback-encoder:8.0'
}
```

Important: evite d'avoir plusieurs bindings SLF4J en meme temps (sinon logs incoherents et warnings au demarrage).

## Exemple de configuration Logback (texte)

Fichier `logback.xml` minimal avec correlation id via MDC :

```xml
<configuration>
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level [%thread] %logger{36} trace=%X{traceId} - %msg%n</pattern>
    </encoder>
  </appender>

  <root level="INFO">
    <appender-ref ref="STDOUT" />
  </root>
</configuration>
```

## Exemple de configuration JSON

Pour envoyer facilement les logs vers Loki/ELK/OpenSearch :

```xml
<configuration>
  <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="net.logstash.logback.encoder.LogstashEncoder" />
  </appender>

  <root level="INFO">
    <appender-ref ref="JSON" />
  </root>
</configuration>
```

## Correlation ID (MDC)

Le but: rattacher tous les logs d'une requete a un meme identifiant.

```java
import org.slf4j.MDC;

public void handleRequest(String traceId) {
    MDC.put("traceId", traceId);
    try {
        logger.info("request_started path=/api/orders");
        // traitement
        logger.info("request_completed status=200");
    } finally {
        MDC.remove("traceId");
    }
}
```

## Exemples de logs: mauvais vs bons

Mauvais:

```java
logger.info("ca marche");
logger.error("erreur");
```

Bons:

```java
logger.info("order_created orderId={} customerId={} amount={} currency={}",
    orderId, customerId, amount, currency);

logger.warn("payment_retry orderId={} attempt={} reason={}",
    orderId, attempt, reason);

logger.error("payment_failed orderId={} provider={} traceId={}",
    orderId, provider, traceId, ex);
```

## Niveau de logs: regle simple

- `DEBUG`: details techniques pour debug local/staging
- `INFO`: evenements metier normaux
- `WARN`: anomalie recuperable ou degradation
- `ERROR`: echec fonctionnel/technique a traiter

## Metriques et tracing

Les metriques repondent a: "que se passe-t-il ?"
Le tracing repond a: "ou est depense le temps a travers les services ?"

Metriques de base:

- taux de requetes
- percentiles de latence (p50/p95/p99)
- taux d'erreur
- memoire JVM/GC

## Approche alerting

Alerter sur les symptomes qui impactent les utilisateurs, pas sur des evenements techniques bruyants.
Definir des seuils orientes SLO quand possible.

## Workflow de profiling et tuning

1. mesurer la base
2. identifier le goulot
3. changer une chose
4. mesurer a nouveau

Ne jamais optimiser a l'aveugle.

## Goulots classiques

- trop d'aller-retours base de donnees
- I/O bloquante sous forte charge
- pression allocation/GC elevee
- algorithmes inefficaces sur chemins chauds

## Erreurs frequentes

- pas de correlation id dans les logs
- metriques collectees mais non exploitees en dashboard/alertes
- tuning JVM sans preuve
- micro-optimisations avant correction des hotspots d'architecture

## A retenir

1. Des logs exploitables accelerent directement le diagnostic production
2. Standardiser stack + format de logs (SLF4J + Logback + JSON si besoin)
3. Correlation ID obligatoire pour les APIs
4. Utiliser logs, metriques et traces ensemble
5. Tuner la performance via une boucle de mesure, pas a l'intuition
