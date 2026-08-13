---
title: GROUP BY, agrégations et fenêtres PostgreSQL
description: Agréger des lignes PostgreSQL avec GROUP BY et HAVING, puis calculer rangs et cumuls avec des fonctions de fenêtrage.
date: 2026-04-10
tags: [postgresql, group-by, window-functions, sql]
draft: false
readingTime: 10 min
---

## Deux façons de calculer sur un groupe

L’agrégation compacte : un résultat par groupe. La fenêtre garde chaque ligne et ajoute une colonne calculée. Il te faut les deux. Les confondre, c’est produire des rapports faux.

## GROUP BY

```sql
SELECT customer_id,
       count(*) AS order_count,
       sum(total_cents) AS spent_cents
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
ORDER BY spent_cents DESC, customer_id;
```

Toute colonne sélectionnée est soit dans le `GROUP BY`, soit dans une agrégation (`count`, `sum`, `avg`, `min`, `max`). PostgreSQL refuse `SELECT email, count(*) FROM customers` sans grouper `email`.

Utile aussi :

- `count(*)` compte les lignes
- `count(email)` ignore les emails nuls
- `bool_or(status = 'paid')` est vrai si une ligne du groupe est payée

## HAVING contre WHERE

`WHERE` filtre avant le groupement. `HAVING` filtre les groupes :

```sql
SELECT customer_id, count(*) AS order_count
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING count(*) >= 3;
```

N’écris pas `count(*) >= 3` dans le `WHERE` : le compte n’existe pas encore.

## Fonctions de fenêtrage

La fenêtre calcule sur une partition sans écraser le résultat :

```sql
SELECT id,
       customer_id,
       total_cents,
       rank() OVER (
         PARTITION BY customer_id
         ORDER BY total_cents DESC, id
       ) AS amount_rank,
       sum(total_cents) OVER (
         PARTITION BY customer_id
         ORDER BY created_at, id
       ) AS running_spent_cents
FROM orders
WHERE status = 'paid';
```

Chaque commande reste une ligne. `amount_rank = 1` est la plus grosse commande payée du client. `running_spent_cents` est un cumul.

Commence par `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG()`, `LEAD()`. `PARTITION BY` joue le rôle du `GROUP BY` pour la fenêtre.

## Combiner les deux

Pattern fréquent : agréger dans une sous-requête, puis classer les groupes.

```sql
SELECT customer_id, spent_cents,
       rank() OVER (ORDER BY spent_cents DESC) AS spend_rank
FROM (
  SELECT customer_id, sum(total_cents) AS spent_cents
  FROM orders
  WHERE status = 'paid'
  GROUP BY customer_id
) totals;
```

C’est plus lisible qu’un mélange rang + compactage dans la même couche.

## À valider

- Les colonnes non agrégées sont dans le `GROUP BY`.
- Filtres de lignes : `WHERE`. Filtres de groupes : `HAVING`.
- Tu utilises une fenêtre quand tu as encore besoin des lignes d’origine.
- Les montants parent ne sont pas sommés sur une jointure explosée.

## Étape suivante

Découper le SQL complexe en sous-requêtes et en `WITH` encore lisibles dans six mois.
