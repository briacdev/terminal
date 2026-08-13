---
title: Bases, rôles et schémas PostgreSQL
description: Distinguer base, rôle et schéma PostgreSQL, régler search_path, et adopter des noms stables qui tiennent en production.
date: 2026-04-03
tags: [postgresql, schema, roles, search-path]
draft: false
readingTime: 8 min
---

## Les noms mal choisis se paient plus tard

Le réflexe débutant est de créer des tables dans `public` de la base `postgres`. Ça marche cinq minutes. Ensuite les objets se marchent dessus, les droits sont trop larges, et les dumps contiennent n’importe quoi.

Cette étape clarifie les trois couches auxquelles tu es déjà connecté : **base**, **rôle**, **schéma**.

## Base contre schéma

Une **base** est une frontière dure. Tu ne joignes pas une table de `shop` avec une table de `analytics` dans une requête normale. Une session est connectée à **une** base.

Un **schéma** est un espace de noms **dans** une base. `shop.customers` et `reporting.customers` peuvent coexister. La plupart des applications vivent avec une base et un ou deux schémas.

```sql
CREATE SCHEMA shop;
CREATE SCHEMA reporting;

CREATE TABLE shop.customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);
```

## search_path

`SELECT * FROM customers` cherche `customers` dans les schémas de `search_path` :

```sql
SHOW search_path;
```

Pour la session d’apprentissage :

```sql
SET search_path TO shop, public;
SELECT * FROM customers;
```

Pour le rôle applicatif, fixe une valeur par défaut :

```sql
ALTER ROLE shop_app IN DATABASE shop SET search_path TO shop, public;
```

Un `search_path` inattendu est un grand classique du « la table n’existe pas ».

## Rôles et privilèges

Un rôle peut se connecter (`LOGIN`) ou regrouper d’autres rôles. Donne le minimum :

```sql
GRANT USAGE ON SCHEMA shop TO shop_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA shop TO shop_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA shop
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO shop_app;
```

Garde un superuser pour l’admin. Le rôle applicatif ne crée pas d’extensions et ne droppe pas de bases.

## Conventions qui vieillissent bien

- bases : `shop`, `shop_test`
- schémas : `shop`, `reporting`
- tables : noms pluriels en `snake_case` (`order_items`)
- clé primaire : `id`
- clés étrangères : `<singulier>_id` (`customer_id`)

Évite de mélanger `camelCase` et `snake_case`. PostgreSQL passe les identifiants non quotés en minuscules : les `"Customers"` quotés deviennent une taxe permanente.

## À ne pas faire

- Empiler les essais dans la base `postgres`
- Inventer un schéma par feature chaque semaine sans besoin
- Laisser `public` inscriptible pour tout le monde
- Quoter les identifiants (`"Customers"`) sans y être forcé

## À valider

- Tu expliques pourquoi une base n’est pas un schéma.
- `shop.customers` existe et `search_path` la trouve.
- Le rôle appli n’est pas superuser.
- Les noms suivent une seule convention.

## Étape suivante

Choisir les types de colonnes. Un mauvais type est plus dur à rattraper qu’un index manquant.
