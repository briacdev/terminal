---
title: Données - JPA et Hibernate
description: "Utiliser JPA/Hibernate efficacement : mapping d’entités, lazy vs eager, prévention du N+1, transactions et projections sûres pour les API."
date: 2025-01-13
tags: [java, data, jpa, hibernate]
draft: false
readingTime: 17 min
---

## Pourquoi cette étape est importante

JPA/Hibernate accélère le développement, mais un comportement de requêtes opaque peut créer de gros problèmes de performance.

Traitez l’ORM comme une couche de productivité au-dessus de SQL, pas comme un remplacement de la culture SQL.

## Mapping d’entité de base

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;
}
```

Annotations cœur :

- `@Entity`, `@Table`
- `@Id`, `@GeneratedValue`
- relations (`@OneToMany`, `@ManyToOne`, `@ManyToMany`)
- `@Column` pour contraintes et nommage

Gardez les entités centrées sur la persistance.

## Relations et ownership

Décidez quelle côté possède la clé étrangère.
Préférez `@ManyToOne` côté enfant pour un mapping plus simple.
Les relations bidirectionnelles demandent de synchroniser les deux côtés.

## Lazy vs eager loading

- `LAZY` : charge la relation seulement à l’accès
- `EAGER` : charge immédiatement

Recommandation : préférez `LAZY` et fetch intentionnel selon le cas d’usage.

Accéder à une association lazy hors contexte de persistance provoque des erreurs de lazy-loading.

## Problème N+1

Le N+1 apparaît quand vous chargez une liste d’entités, puis chaque relation une par une en lazy.

Mitigations typiques :

- `JOIN FETCH` en JPQL
- entity graphs
- requêtes de projection / DTO pour les lectures
- batch fetching si pertinent

Inspectez toujours les logs SQL en développement.

## Frontières transactionnelles

Gardez les transactions autour d’opérations métier cohérentes.

```java
@Transactional
public void processOrder(Long orderId) {
    // charger, valider, mettre à jour, persister
}
```

Ne gardez pas une transaction ouverte pendant des appels HTTP distants.
Le timing de flush/commit influence quand les contraintes sont vérifiées.

## Modèle en écriture vs modèle en lecture

- écriture : entités et agrégats
- lecture : projections / DTO adaptés à l’écran ou à l’API

Retourner des entités directement depuis une API publique fuit souvent des détails de persistance et déclenche des lazy loads accidentels.

## Conseils pratiques

- distinguer entités d’écriture et DTO/projections de lecture
- logger le SQL en dev pour comprendre les requêtes générées
- mesurer avant d’ajuster les stratégies de fetch
- écrire des tests d’intégration sur les flux data critiques

## Erreurs fréquentes

- eager loading partout par défaut
- retourner des entités dans les API publiques
- ignorer le timing flush/transaction
- aucune couverture de tests sur l’accès data
- “corriger” le N+1 en ajoutant encore plus d’eager

## Checklist pratique

- mapper une entité simple avec id et email unique
- reproduire un N+1 dans les logs, puis le corriger avec `JOIN FETCH` ou une projection
- encapsuler une écriture multi-étapes dans `@Transactional`
- retourner un DTO plutôt qu’une entité depuis un service

## À retenir

1. JPA accélère, mais la compréhension SQL reste indispensable
2. Gérer intentionnellement la stratégie de chargement
3. Surveiller le N+1 et le corriger avec un fetch explicite
4. Garder le scope transactionnel clair et minimal
