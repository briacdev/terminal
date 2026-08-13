---
title: JSONB PostgreSQL pour des données flexibles
description: Utiliser JSONB dans PostgreSQL pour des attributs optionnels, tout en gardant colonnes relationnelles pour IDs, montants et jointures.
date: 2026-04-16
tags: [postgresql, jsonb, json, modelisation]
draft: false
readingTime: 10 min
---

## JSONB est un type de colonne, pas une stratégie de schéma

PostgreSQL stocke du JSON en `json` ou en `jsonb`. Pour des données applicatives, prends `jsonb` : valeur parsée, forme binaire, index possible. Cette page répond surtout au **quand**. Un article de blog détaille déjà les opérateurs. On ne recopie pas ce catalogue.

Garde IDs, clés étrangères, montants, statuts et horodatages en colonnes. Réserve JSONB aux attributs qui varient d’une ligne à l’autre et qui ne méritent pas une migration par semaine.

## json contre jsonb

`json` garde le texte d’origine, y compris l’ordre des clés. `jsonb` stocke une valeur décomposée. Égalité, containment et index GIN portent sur `jsonb`. Pour une colonne neuve, choisis `jsonb`.

```sql
ALTER TABLE products
  ADD COLUMN attributes jsonb NOT NULL DEFAULT '{}'::jsonb;
```

## Un mélange sain

```sql
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb
);

UPDATE products
SET attributes = jsonb_build_object('color', 'noir', 'weight_g', 42)
WHERE sku = 'SKU-1';
```

Tu peux encore filtrer :

```sql
SELECT sku, name
FROM products
WHERE attributes ->> 'color' = 'noir';
```

Si `color` devient le filtre de toutes les listes, promeus-le en colonne. JSONB est la longue traîne, pas le chemin d’accès principal.

## Indexer JSONB

Un index GIN aide le containment (`@>`) :

```sql
CREATE INDEX products_attributes_gin ON products USING gin (attributes);

SELECT sku
FROM products
WHERE attributes @> '{"color": "noir"}'::jsonb;
```

Un index d’expression aide un champ extrait :

```sql
CREATE INDEX products_color_idx
  ON products ((attributes ->> 'color'));
```

N’indexe pas en GIN une colonne JSONB que tu ne filtres jamais. Le coût d’écriture est réel.

## Contraintes sur le JSON

Tu peux exiger une clé avec `CHECK (attributes ? 'color')` ou tester le type avec `jsonb_typeof`. Garde ces checks petits. Un document au schéma strict voulait probablement des colonnes.

## À éviter

- Toute la commande dans un blob JSON
- Dupliquer `customer_id` uniquement dans le JSON
- `attributes::text LIKE '%noir%'`
- Choisir `json` « pour garder le formatage »

## À valider

- Les faits cœur sont des colonnes ; JSONB porte les extras.
- Les colonnes JSON neuves sont en `jsonb`.
- Un filtre lancé en continu a un index, ou est devenu une colonne.
- Les recherches de containment passent par `@>`, pas par du texte.

## Étape suivante

Ajouter la recherche plein texte, un outil différent du containment JSONB.
