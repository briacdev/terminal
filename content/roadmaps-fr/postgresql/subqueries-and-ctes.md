---
title: Sous-requêtes et CTE PostgreSQL
description: Structurer du SQL PostgreSQL lisible avec sous-requêtes indépendantes, sous-requêtes corrélées et clauses WITH.
date: 2026-04-11
tags: [postgresql, cte, sous-requete, sql]
draft: false
readingTime: 9 min
---

## Donner un nom aux étapes

Les jointures longues avec agrégats imbriqués deviennent illisibles. Sous-requêtes et CTE nomment des résultats intermédiaires. La lisibilité est la première raison de s’en servir. La performance vient ensuite, et elle n’est pas automatique.

## Sous-requête indépendante

Elle ne dépend pas de la ligne externe. PostgreSQL peut la calculer une fois :

```sql
SELECT id, email
FROM customers
WHERE id IN (
  SELECT customer_id
  FROM orders
  WHERE status = 'paid'
    AND created_at >= now() - interval '7 days'
);
```

`EXISTS` est souvent plus clair quand tu ne veux que la présence :

```sql
SELECT c.id, c.email
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
    AND o.status = 'paid'
);
```

`EXISTS` peut s’arrêter au premier match. `IN` avec des `NULL` a une logique à trois valeurs surprenante : pour « a au moins une », préfère `EXISTS`.

## Sous-requête corrélée

Elle utilise des colonnes de la requête externe. Conceptuellement, elle tourne par ligne :

```sql
SELECT c.id, c.email,
  (
    SELECT max(o.created_at)
    FROM orders o
    WHERE o.customer_id = c.id
  ) AS last_order_at
FROM customers c;
```

Facile à écrire, facile à rendre lente. Si tu as plusieurs agrégats par client, joins une sous-requête déjà groupée plutôt que de corréler trois fois.

## WITH (CTE)

La CTE nomme une étape :

```sql
WITH paid_orders AS (
  SELECT customer_id, sum(total_cents) AS spent_cents
  FROM orders
  WHERE status = 'paid'
  GROUP BY customer_id
)
SELECT c.email, p.spent_cents
FROM paid_orders p
JOIN customers c ON c.id = p.customer_id
WHERE p.spent_cents >= 10000
ORDER BY p.spent_cents DESC, c.id;
```

Utilise-la quand l’ensemble intermédiaire est réutilisé, ou quand le métier mérite un nom (`paid_orders`).

Depuis PostgreSQL 12, beaucoup de CTE non récursives peuvent être inlinées. Ne suppose pas qu’une CTE est une barrière d’optimisation. Pour forcer la matérialisation : `WITH paid_orders AS MATERIALIZED (...)`.

## CTE récursives

Elles parcourent des arbres (catégories, organigrammes). Attends d’avoir une hiérarchie. Ce n’est pas un style par défaut.

## Quel outil choisir

- **EXISTS** : présence booléenne
- **Sous-requête scalaire** : une valeur par ligne, avec parcimonie
- **Table dérivée / CTE** : étape nommée de filtre ou d’agrégat
- **JOIN** : deux ensembles dont tu as besoin dans le résultat

Si la CTE n’enveloppe qu’un filtre simple, un `WHERE` suffit.

## À valider

- Les tests de présence passent par `EXISTS`.
- Les corrélations lourdes sont réécrites en jointure vers un ensemble groupé.
- Les CTE ont des noms métier.
- Tu n’ajoutes pas `MATERIALIZED` « pour la perf » sans mesurer.

## Étape suivante

Poser des index B-tree sur les colonnes vraiment filtrées et jointes.
