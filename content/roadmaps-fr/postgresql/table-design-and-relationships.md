---
title: Concevoir des tables et des relations PostgreSQL
description: Modéliser des relations one-to-many et many-to-many dans PostgreSQL, avec une normalisation utile et des clés stables.
date: 2026-04-06
tags: [postgresql, modelisation, normalisation, relations]
draft: false
readingTime: 10 min
---

## Modéliser des faits, pas un écran

Un écran de checkout est un mauvais schéma. Si tu copies la page dans une table large, tu dupliques les emails, tu perds l’historique, et le reporting devient pénible. Modélise les faits : le client, la commande, les lignes produits.

Cette étape vient après types et contraintes : sans clés, les relations ne tiennent pas.

## One-to-many

Un client a plusieurs commandes. La clé étrangère est du côté « plusieurs » :

```sql
CREATE TABLE customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);

CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers (id),
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

N’empile pas des `order_ids` séparés par des virgules chez le client. Ça casse jointures, contraintes et index.

## Many-to-many

Une commande contient plusieurs produits, un produit apparaît dans plusieurs commandes. Il faut une table de liaison :

```sql
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  name text NOT NULL
);

CREATE TABLE order_items (
  order_id bigint NOT NULL REFERENCES orders (id),
  product_id bigint NOT NULL REFERENCES products (id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  PRIMARY KEY (order_id, product_id)
);
```

`unit_price_cents` est sur la ligne, pas seulement sur le produit. Le prix catalogue change. La commande doit se souvenir du prix payé.

## Jusqu’où normaliser

La normalisation enlève les faits en double. La troisième forme normale est un bon défaut pour du transactionnel :

- un fait à un seul endroit
- pas de groupes qui se répètent
- pas d’attribut qui dépend d’un autre attribut non clé

Arrête avant que le schéma devienne un labyrinthe. Stocker `total_cents` sur `orders` peut être acceptable si c’est un instantané des lignes, tenu dans la même transaction. Une valeur recalculée en permanence se calcule plutôt dans la requête.

## Clé technique contre clé naturelle

Garde `id` comme clé primaire dans la plupart des tables métier. Les clés naturelles (`email`, `sku`) restent en `UNIQUE`. Une PK naturelle devient douloureuse dès que la valeur métier peut changer, ou dès qu’il te faut un identifiant stable dans les URLs.

## One-to-one

Plus rare : `customer_profiles` avec `customer_id` à la fois PK et FK. Découpe seulement si les colonnes sont optionnelles, volumineuses, ou appartiennent à un autre contexte.

## Questions utiles avant d’ajouter une colonne

- Ce fait parle-t-il de cette entité, ou d’une entité voisine ?
- Peut-il avoir plusieurs valeurs dans le temps ? Alors il mérite peut-être sa table.
- Vas-tu filtrer ou joindre dessus ? Alors ce n’est pas une note JSON.

JSONB viendra pour les attributs vraiment variables. Les relations cœur restent relationnelles.

## À valider

- One-to-many : FK du côté many.
- Many-to-many : table de liaison explicite.
- Les valeurs historiques (prix payé) sont stockées sur l’événement.
- Les clés métier uniques existent même avec un `id` technique.

## Étape suivante

Lire les données avec `SELECT`, `WHERE`, `ORDER BY`, et une pagination stable.
