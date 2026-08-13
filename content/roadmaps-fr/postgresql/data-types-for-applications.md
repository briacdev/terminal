---
title: Types de données PostgreSQL pour une application
description: Choisir les types PostgreSQL adaptés aux identifiants, montants, dates, textes et statuts d’une vraie application métier.
date: 2026-04-04
tags: [postgresql, types, schema, modelisation]
draft: false
readingTime: 10 min
---

## Choisir un type, c’est choisir un contrat

Cette page n’est pas l’inventaire de tous les types PostgreSQL. Cet inventaire existe déjà côté blog. Ici, l’objectif est plus étroit : aligner les colonnes sur des faits métier, et rester simple à interroger.

Un type faux crée des bugs silencieux : arrondis d’argent, heures locales prises pour de l’UTC, ou `varchar(255)` copié par habitude.

## Les types du quotidien

### Identifiants et entiers

Pour une nouvelle table, préfère `bigint GENERATED ALWAYS AS IDENTITY` :

```sql
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  stock integer NOT NULL DEFAULT 0
);
```

`integer` suffit pour des compteurs modestes. `bigint` protège les clés primaires de la saturation. Évite `serial` sur un schéma neuf : identity est le remplacement standard SQL.

### Argent

Ne stocke jamais une monnaie en `float` / `double precision`. Utilise `numeric` pour les décimales exactes, ou des centimes en `integer` (`total_cents`) :

```sql
CREATE TABLE payments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency char(3) NOT NULL
);
```

`numeric` convient quand l’échelle n’est pas figée. Les entiers sont plus simples quand tout est en centimes.

### Temps

`timestamptz` pour un événement réel (`created_at`, `paid_at`). `date` pour un jour calendaire. `interval` pour une durée.

```sql
created_at timestamptz NOT NULL DEFAULT now()
```

`timestamp` sans fuseau a l’air plus simple, puis devient ambigu d’un serveur à l’autre.

### Texte

Préfère `text`, sauf code vraiment de longueur fixe (`currency char(3)`). Une limite `varchar(n)` est une règle métier : place-la dans un `CHECK` ou dans l’application si elle peut bouger. Ne recopie pas `varchar(255)` par réflexe MySQL.

### Booléens et statuts

`boolean` pour le vrai/faux. Pour un petit ensemble fermé, `text` + `CHECK` est souvent plus clair qu’un `ENUM` PostgreSQL, dont l’évolution est pénible en migration.

```sql
status text NOT NULL CHECK (status IN ('draft', 'paid', 'cancelled'))
```

## Types à laisser pour plus tard

`jsonb`, tableaux, `tsvector`, `uuid` arriveront dans d’autres pages. N’ouvre pas un premier schéma en « tout est JSON » ou « tout est UUID » sans raison. Les colonnes relationnelles se contraignent et se joignent plus facilement.

Un `uuid` en clé primaire est légitime si l’identifiant naît hors de la base. C’est un choix, pas un défaut.

## Mini schéma boutique

```sql
CREATE TABLE customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers (id),
  status text NOT NULL CHECK (status IN ('draft', 'paid', 'cancelled')),
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Les pages SQL suivantes réutilisent ce schéma. Garde-le.

## À valider

- Les `id` sont en identity `bigint`, sauf besoin UUID.
- L’argent est en `numeric` ou en centimes, jamais en flottant.
- Les événements sont en `timestamptz`.
- Les statuts sont contraints, pas du texte libre.

## Étape suivante

Ajouter contraintes et clés pour que la base refuse les lignes impossibles, même si l’appli a un bug.
