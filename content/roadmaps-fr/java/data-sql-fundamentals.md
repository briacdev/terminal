---
title: Données - Fondamentaux SQL
description: "Le SQL indispensable au backend Java : joins, index, transactions, bases d’EXPLAIN et patterns de requêtes qui restent rapides."
date: 2025-01-11
tags: [java, data, sql, databases]
draft: false
readingTime: 16 min
---

## Pourquoi cette étape est importante

Même avec un ORM, performance et correction backend dépendent de la culture SQL.
Sans lire plans et logique de joins, les incidents production deviennent durs à résoudre.

Le SQL n’est pas optionnel pour un backend Java sérieux.

## Opérations de requête cœur

```sql
SELECT id, email
FROM users
WHERE active = true
ORDER BY created_at DESC
LIMIT 20;
```

À maîtriser :

- `SELECT`, `WHERE`, `ORDER BY`, `LIMIT` / `OFFSET`
- `INSERT`, `UPDATE`, `DELETE`
- agrégats (`COUNT`, `SUM`, `AVG`) avec `GROUP BY`

## Joins

```sql
SELECT u.id, u.email, o.total
FROM users u
JOIN orders o ON o.user_id = u.id;
```

Types importants :

- `INNER JOIN` : uniquement les lignes correspondantes
- `LEFT JOIN` : conserve les lignes de gauche même sans match
- `RIGHT JOIN` : moins courant en pratique

Sachez ce qui se passe quand des lignes manquent d’un côté.
Préférez des conditions de join explicites aux cross joins accidentels.

## Index

Les index accélèrent lectures et tris, mais coûtent en écriture et stockage.

Bons candidats :

- colonnes des `WHERE` fréquents
- clés de join / clés étrangères
- colonnes de tri (`ORDER BY`)
- contraintes d’unicité

Mauvais pattern :

- beaucoup d’index inutilisés
- indexer des colonnes peu sélectives sans preuve

## Transactions

Les transactions regroupent des opérations de façon atomique.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

En cas d’échec, le rollback restaure la cohérence.
Comprenez les bases d’isolation (dirty reads, non-repeatable reads, phantoms) à un niveau pratique.

## Bases d’optimisation

- ne sélectionner que les colonnes nécessaires
- éviter `SELECT *` sur les chemins chauds
- paginer les grands résultats
- inspecter les plans avec `EXPLAIN` / `EXPLAIN ANALYZE`
- filtrer tôt ; éviter les fonctions sur colonnes indexées dans le `WHERE` si possible

## Filtrage et pagination

La pagination par keyset scale souvent mieux qu’un `OFFSET` profond sur de grandes tables.
Définissez toujours un ordre de tri stable pour les API paginées.

## Erreurs fréquentes

- requêtes répétées style N+1 depuis l’application
- index manquants sur filtres/joins
- transactions longues qui retiennent des locks
- ignorer les effets du niveau d’isolation
- mettre un cache avant d’avoir mesuré le plan de requête

## Checklist pratique

- écrire un inner join et un left join users/orders
- ajouter un index pour un filtre fréquent et comparer `EXPLAIN`
- encapsuler un transfert dans `BEGIN` / `COMMIT` avec rollback
- réécrire un `SELECT *` chaud en colonnes explicites

## À retenir

1. Le SQL est une compétence cœur, même avec un ORM
2. Maîtriser joins, index et transactions
3. Utiliser `EXPLAIN` et mesurer avant d’optimiser à l’aveugle
4. Optimiser à la fois vitesse de lecture et coût d’écriture
