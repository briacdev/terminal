---
title: Fondamentaux PostgreSQL
description: Comprendre ce qu’est PostgreSQL, dans quels projets il est le bon choix, et comment instance, base, schéma et tables s’emboîtent.
date: 2026-04-01
tags: [postgresql, fondamentaux, base-de-donnees, sql]
draft: false
readingTime: 8 min
---

## Pourquoi commencer par le produit, pas par la syntaxe

PostgreSQL est un moteur relationnel open source. Il range les données dans des tables, refuse les lignes invalides grâce aux contraintes, et répond en SQL. On le choisit quand on a besoin de relations, de transactions, et d’un outil qui tient de l’ordinateur portable jusqu’à la production.

Cette page ouvre le parcours pour une raison simple : les étapes suivantes parlent toutes le même langage. PostgreSQL n’est pas un fichier `.sql`. C’est un serveur qui connaît les types, les index, les transactions et la concurrence.

## Quand PostgreSQL est un bon défaut

Le moteur convient bien si :

- les objets métier sont liés (clients, commandes, paiements)
- un ensemble d’écritures doit réussir entièrement ou échouer entièrement
- tu veux le SQL, les contraintes et les index au même endroit
- une partie des champs est stricte (montants, dates, clés) et une autre plus souple (JSONB)

Ce n’est pas le premier outil pour un cache, une file de messages, ou un store de documents sans jointures. Redis, un broker, ou une base documentaire font mieux ces métiers.

## La carte mentale à garder

- **Instance** : le processus serveur
- **Base** : un catalogue isolé dans l’instance
- **Schéma** : un espace de noms de tables dans une base
- **Rôle** : un login ou un groupe de droits
- **Table** : des lignes, des colonnes, des types
- **psql** : le client officiel en ligne de commande

Tu n’as pas à tout maîtriser aujourd’hui. Tu dois seulement cesser de les confondre. C’est l’erreur débutant la plus coûteuse.

## Une appli réelle, vue de loin

```text
Application
  -> pool de connexions (PgBouncer ou pool applicatif)
    -> PostgreSQL
      -> base app_production
        -> schéma public
          -> tables customers, orders, order_items
```

L’application ne « parle pas à PostgreSQL » en général. Elle se connecte **avec un rôle**, **à une base**, puis lit et écrit des tables.

## Comment suivre cette roadmap

Les pages vont dans cet ordre :

1. Fondations : installer, se connecter, créer bases et schémas
2. Modélisation : types, contraintes, relations
3. SQL : lire, écrire, joindre, agréger
4. Performance : index et plans
5. Concurrence : transactions et verrous
6. Fonctionnalités : JSONB et recherche plein texte
7. Exploitation : migrations, sauvegardes, production

Chaque page a un seul sujet. Si un thème a déjà sa page plus loin, celle-ci ne le recopie pas.

## Documentation

Garde la [documentation PostgreSQL actuelle](https://www.postgresql.org/docs/current/) ouverte pendant que tu pratiques. C’est la référence pour la syntaxe et le comportement.

## À valider avant de continuer

- Tu décris PostgreSQL comme un moteur relationnel, pas comme « un fichier SQL ».
- Tu cites un cas où il est pertinent et un cas où il ne l’est pas.
- Tu sépares instance, base, schéma et table avec tes mots.
- Tu as mis la doc officielle dans tes favoris.

## Étape suivante

Installe un serveur local et ouvre une session `psql`. Sans ça, le reste du parcours reste abstrait.
