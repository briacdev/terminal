---
title: INSERT, UPDATE, DELETE et UPSERT PostgreSQL
description: Insérer, modifier et supprimer des lignes PostgreSQL sans accident, avec RETURNING et des upserts ON CONFLICT idempotents.
date: 2026-04-08
tags: [postgresql, insert, update, upsert, sql]
draft: false
readingTime: 9 min
---

## Une écriture sans WHERE est un incident

Une lecture trop large est lente. Une écriture trop large casse des données. Cette page couvre les quatre formes d’écriture du quotidien.

## INSERT

```sql
INSERT INTO customers (email)
VALUES ('ada@example.com')
RETURNING id, email, created_at;
```

`RETURNING` ramène l’`id` généré sans seconde requête. Insère plusieurs lignes d’un coup quand elles vont ensemble :

```sql
INSERT INTO products (sku, name)
VALUES
  ('SKU-1', 'Carnet'),
  ('SKU-2', 'Crayon');
```

## UPDATE

Toujours un `WHERE`. En cas de doute, ouvre une transaction :

```sql
BEGIN;

UPDATE orders
SET status = 'paid'
WHERE id = 10
  AND status = 'draft'
RETURNING id, status;

COMMIT;
```

Le filtre `status = 'draft'` rend l’opération idempotente : la relancer ne transforme pas une commande annulée en payée.

## DELETE

Pour des enregistrements métier à auditer, un soft delete (`deleted_at`) est souvent plus sage. `DELETE` convient aux lignes vraiment jetables :

```sql
DELETE FROM order_items
WHERE order_id = 10
  AND product_id = 3
RETURNING *;
```

Ne lance jamais `DELETE FROM order_items;` sur une base partagée. `TRUNCATE` est encore plus définitif et contourne certains triggers. C’est un outil d’admin.

## UPSERT via ON CONFLICT

Une API idempotente a souvent besoin d’« insérer, ou mettre à jour si ça existe » :

```sql
INSERT INTO customers (email)
VALUES ('ada@example.com')
ON CONFLICT (email)
DO UPDATE SET email = EXCLUDED.email
RETURNING id, email;
```

`EXCLUDED` désigne la ligne qu’on aurait insérée. La cible du conflit doit avoir une contrainte ou un index unique.

`DO NOTHING` suffit quand le doublon est inoffensif :

```sql
INSERT INTO products (sku, name)
VALUES ('SKU-1', 'Carnet')
ON CONFLICT (sku) DO NOTHING;
```

## Écritures en volume

Préfère un seul ordre pour un lot, plutôt qu’une boucle d’inserts unitaires. Pour un vrai flux massif, `COPY` est l’outil. Garde les boucles applicatives pour les petits volumes.

## Pièges

- `UPDATE` / `DELETE` sans `WHERE`
- Attraper les violations d’unicité dans l’appli au lieu d’`ON CONFLICT`
- Changer un statut sans vérifier l’état courant
- Insérer l’enfant avant le parent (les FK t’arrêteront ; insère dans l’ordre)

## À valider

- Chaque `UPDATE`/`DELETE` a un `WHERE` sélectif.
- Les valeurs générées reviennent via `RETURNING`.
- Les upserts visent une vraie unicité.
- Les changements de statut sont conditionnels.

## Étape suivante

Relier les tables avec des jointures pour lire une commande et son client en une requête.
