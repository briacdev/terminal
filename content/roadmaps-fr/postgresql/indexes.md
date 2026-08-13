---
title: Index PostgreSQL et bases du B-tree
description: Créer des index B-tree PostgreSQL sur les filtres et les jointures, en tenant compte du coût d’écriture de chaque index.
date: 2026-04-12
tags: [postgresql, index, btree, performance]
draft: false
readingTime: 10 min
---

## Un index est un échange

Un index est une structure triée qui évite de parcourir toute la table. Chaque `INSERT`, `UPDATE` et `DELETE` doit aussi l’entretenir. Le bon index rend une requête chaude bon marché. Dix index inutiles ralentissent les écritures et occupent l’autovacuum.

Cette page traite du **B-tree**, type par défaut. Le GIN pour JSONB et le plein texte vient plus loin.

## Quoi indexer en premier

Bons candidats :

- clés étrangères de jointure (`orders.customer_id`)
- colonnes de `WHERE` fréquents (`orders.status` seulement si c’est sélectif)
- colonnes de tri pour la pagination curseur (`created_at`, `id`)

```sql
CREATE INDEX orders_customer_id_idx ON orders (customer_id);
CREATE INDEX orders_paid_created_id_idx
  ON orders (created_at DESC, id DESC)
  WHERE status = 'paid';
```

Le second est un **index partiel** : il ne contient que les commandes payées. Plus petit, plus rapide, si le prédicat colle à la requête.

## Ordre d’un B-tree multi-colonnes

Un index sur `(customer_id, created_at)` aide :

- `WHERE customer_id = 42`
- `WHERE customer_id = 42 AND created_at >= ...`

Il n’aide presque pas, à lui seul, un `WHERE created_at >= ...` sans `customer_id`. Mets les égalités d’abord, les plages ensuite, comme dans la requête.

Une contrainte unique crée déjà un index unique. Ne le duplique pas.

## Quand l’index reste inutilisé

PostgreSQL peut quand même scanner la table si :

- elle est minuscule
- le prédicat matche presque toutes les lignes
- la colonne est enveloppée dans une fonction
- tu ramènes trop de colonnes et le fetch tas domine

Un index inutilisé se paie à chaque écriture. La page suivante montre comment le vérifier avec `EXPLAIN`.

## Entretien

Nomme les index d’après table et colonnes (`orders_customer_id_idx`). Supprime ceux que `pg_stat_user_indexes` montre inutilisés après une période réaliste. Reconstruire n’est rarement le premier geste ; le bloat et l’autovacuum sont pour l’étape production.

```sql
SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE relname = 'orders';
```

## À valider

- Les FK de jointure ont un index.
- Les index composites suivent le vrai `WHERE` / `ORDER BY`.
- Un index partiel n’existe que si le prédicat est stable et fréquent.
- Tu sais citer la requête que chaque nouvel index doit aider.

## Étape suivante

Lire `EXPLAIN ANALYZE` pour arrêter de deviner si l’index sert.
