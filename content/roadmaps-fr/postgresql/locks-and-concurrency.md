---
title: Verrous, deadlocks et concurrence PostgreSQL
description: Comprendre les verrous de ligne et de table PostgreSQL, diagnostiquer un deadlock, et concevoir des écritures peu contentieuses.
date: 2026-04-15
tags: [postgresql, verrous, deadlock, concurrence]
draft: false
readingTime: 9 min
---

## Les verrous rendent la concurrence correcte

Quand deux sessions mettent à jour la même commande, PostgreSQL ne fusionne pas les écritures. L’une attend un **verrou de ligne**, puis s’exécute après le commit ou le rollback de l’autre. Cette attente est normale. Les attentes sans borne et les deadlocks sont à concevoir pour qu’ils n’arrivent pas.

## Ligne contre table

`UPDATE`, `DELETE` et `SELECT ... FOR UPDATE` verrouillent des lignes. Les autres sessions peuvent encore lire les données commitées en Read Committed. Elles ne peuvent pas mettre à jour les mêmes lignes tant que le verrou n’est pas relâché en fin de transaction.

Les verrous de table apparaissent avec du DDL (`ALTER TABLE`, `CREATE INDEX` sans `CONCURRENTLY`) et certaines commandes de maintenance. Évite de mélanger une longue transaction et un changement de schéma.

```sql
BEGIN;
SELECT id, status
FROM orders
WHERE id = 10
FOR UPDATE;

UPDATE orders SET status = 'paid' WHERE id = 10 AND status = 'draft';
COMMIT;
```

`FOR UPDATE` sert quand tu lis une ligne pour la modifier seulement si l’état est encore le bon. Inutile sur une page en lecture seule.

## Deadlocks

Un deadlock : A attend B et B attend A. PostgreSQL abort une des transactions avec `SQLSTATE 40P01`. On réessaie le perdant.

Réduis-les en verrouillant toujours dans le **même ordre** (les `id` croissants) et en gardant les transactions courtes :

```sql
SELECT id FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
```

## Voir qui attend

```sql
SELECT pid, wait_event_type, wait_event, state, query
FROM pg_stat_activity
WHERE datname = current_database();
```

`pg_locks` + `pg_stat_activity` suffisent à voir un bloqueur. En production, un pooler et des timeouts (`lock_timeout`, `statement_timeout`) empêchent une session coincée de bloquer la table.

```sql
SET lock_timeout = '5s';
SET statement_timeout = '15s';
```

Pose-les sur le rôle applicatif, pas seulement dans ta session `psql`.

## Concevoir pour peu de contention

- Compteur chaud : table à part si beaucoup de sessions l’incrémentent
- Ne pas sérialiser tout le checkout sur une ligne « settings » globale
- Préférer l’insert d’événements à la réécriture d’une ligne d’agrégat très disputée
- Files de jobs : `SKIP LOCKED` pour que les workers ne s’attendent pas

```sql
SELECT id
FROM jobs
WHERE status = 'pending'
ORDER BY id
FOR UPDATE SKIP LOCKED
LIMIT 1;
```

## À valider

- Les updates d’une même entité restent dans des transactions courtes.
- Les verrous multi-lignes suivent un ordre stable.
- Les sessions appli ont des timeouts.
- Les workers de file utilisent `SKIP LOCKED`.

## Étape suivante

Ranger les attributs vraiment variables en JSONB, sans transformer tout le schéma en document.
