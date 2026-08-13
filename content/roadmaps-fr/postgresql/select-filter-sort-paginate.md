---
title: SELECT PostgreSQL : filtrer, trier et paginer
description: Écrire des SELECT PostgreSQL précis avec WHERE, ORDER BY, LIMIT, et une pagination par curseur qui reste stable.
date: 2026-04-07
tags: [postgresql, select, pagination, sql]
draft: false
readingTime: 9 min
---

## Ne lire que ce que l’appelant demande

Le SQL de production n’est souvent pas malin. C’est un `SELECT` précis, un filtre, un tri, une limite. Si cette couche est floue, les index n’aident pas et l’API rampe.

On suppose les tables boutique déjà créées.

## Projeter les colonnes

```sql
SELECT id, email, created_at
FROM customers
WHERE created_at >= timestamptz '2026-01-01'
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

Liste les colonnes utiles. `SELECT *` est pratique dans `psql`. C’est un mauvais défaut dans le code : une nouvelle colonne circule sur le réseau et casse les mappings par position.

## Filtrer avec WHERE

`WHERE` réduit les lignes **avant** le groupement. Compare des types compatibles :

```sql
SELECT id, status, total_cents
FROM orders
WHERE customer_id = 42
  AND status = 'paid'
  AND created_at >= now() - interval '30 days';
```

Préfère `=` et les plages sur des colonnes indexables. Évite d’enrober la colonne dans une fonction (`WHERE date(created_at) = ...`) si tu comptes sur l’index. On y reviendra avec `EXPLAIN`.

## Trier avec un départage

`ORDER BY created_at DESC` seul n’est pas déterministe si deux commandes partagent l’instant. Ajoute une colonne unique :

```sql
ORDER BY created_at DESC, id DESC
```

Sans ordre stable, la page 2 peut répéter ou sauter des lignes.

## Pagination OFFSET contre curseur

Offset, version simple :

```sql
SELECT id, email
FROM customers
ORDER BY id
LIMIT 20 OFFSET 40;
```

Plus `OFFSET` grandit, plus PostgreSQL marche sur les lignes ignorées. Pour les listes longues, pagine par curseur :

```sql
SELECT id, email, created_at
FROM customers
WHERE (created_at, id) < (timestamptz '2026-04-01 12:00:00+00', 1200)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

Le client renvoie le dernier couple `(created_at, id)`. Les inserts plus récents ne mélangent pas la page suivante.

## NULL

`NULL` n’est pas une valeur, c’est l’inconnu. `WHERE status = 'paid'` n’inclut pas les `status` nuls. Utilise `IS NULL` / `IS NOT NULL`. `ORDER BY created_at DESC NULLS LAST` rend le tri explicite.

## À valider

- Le code applicatif évite `SELECT *`.
- Les prédicats `WHERE` portent sur de vraies colonnes.
- `ORDER BY` a un départage unique.
- Les pages profondes n’utilisent pas d’énormes `OFFSET`.

## Étape suivante

Écrire des données avec `INSERT`, `UPDATE`, `DELETE` et `ON CONFLICT`.
