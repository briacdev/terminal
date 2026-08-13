---
title: Les jointures PostgreSQL expliquées
description: Utiliser INNER JOIN et LEFT JOIN dans PostgreSQL sans multiplier les lignes par accident, avec des alias lisibles.
date: 2026-04-09
tags: [postgresql, jointures, sql, inner-join]
draft: false
readingTime: 9 min
---

## La jointure reconstitue ce que le schéma a séparé

Tu as éclaté les faits dans plusieurs tables. La jointure les rassemble pour une lecture. Les étapes de modélisation ont créé `customers`, `orders` et `order_items`. Ici, on les relit ensemble.

## INNER JOIN

On ne garde que les lignes qui matchent des deux côtés :

```sql
SELECT o.id AS order_id,
       c.email,
       o.status,
       o.total_cents
FROM orders o
INNER JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'paid'
ORDER BY o.created_at DESC, o.id DESC;
```

Un client sans commande payée n’apparaît pas. Une commande vers un client inexistant a déjà été refusée par la clé étrangère.

## LEFT JOIN

On garde toutes les lignes de gauche. L’absence à droite devient `NULL` :

```sql
SELECT c.id,
       c.email,
       o.id AS order_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
ORDER BY c.id, o.id;
```

Les clients sans commande restent visibles, `order_id` à null. C’est le « inscrit, jamais acheté ».

Filtre la table de droite dans le `ON` si tu veux conserver les non-matchs :

```sql
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.id
 AND o.status = 'paid'
```

`WHERE o.status = 'paid'` après un left join le transforme en inner join : `NULL = 'paid'` est inconnu, la ligne disparaît.

## Explosion de lignes

Joindre `orders` à `order_items` multiplie les lignes : trois articles, trois résultats. C’est correct pour un détail de lignes. C’est faux si tu fais ensuite `SUM(o.total_cents)` et que tu triples le total.

Pour un total commande plus le détail :

- agrège les lignes dans une sous-requête / CTE, puis joins une fois par commande, ou
- agrège en JSON avec `json_agg` après un `GROUP BY`

Ne somme pas une colonne parent sur une jointure enfant.

## Alias et style

Alias courts (`c`, `o`, `oi`) et colonnes toujours qualifiées. PostgreSQL accepte encore `FROM a, b WHERE a.id = b.a_id`. Préfère `JOIN ... ON` : la relation est visible, un `CROSS JOIN` ne se cache pas dans une condition oubliée.

`RIGHT JOIN` est un `LEFT JOIN` inversé. `FULL JOIN` garde les orphelins des deux côtés. En SQL applicatif, tu en auras rarement besoin.

## À valider

- `INNER JOIN` pour un match obligatoire, `LEFT JOIN` pour un match optionnel.
- Les filtres de la table optionnelle sont dans le `ON` quand tu veux garder les non-matchs.
- Tu n’agrèges pas un montant parent sur une jointure explosée.
- Chaque colonne sélectionnée est qualifiée.

## Étape suivante

Résumer les lignes avec `GROUP BY`, `HAVING` et les fonctions de fenêtrage.
