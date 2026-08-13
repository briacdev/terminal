---
title: EXPLAIN ANALYZE et plans de requêtes PostgreSQL
description: Lire un EXPLAIN ANALYZE PostgreSQL, repérer sequential scans et jointures coûteuses, puis tuner une requête à la fois.
date: 2026-04-13
tags: [postgresql, explain, plan-de-requete, performance]
draft: false
readingTime: 10 min
---

## Mesurer avant d’ajouter un index

Sans plan, tu devines. `EXPLAIN` montre l’intention. `EXPLAIN ANALYZE` exécute la requête et affiche temps et cardinalités réels.

Méthode : reproduire, expliquer, changer une chose, réexpliquer.

## Lancer EXPLAIN ANALYZE

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT o.id, c.email
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'paid'
  AND o.created_at >= now() - interval '7 days'
ORDER BY o.created_at DESC, o.id DESC
LIMIT 20;
```

`BUFFERS` montre cache contre disque. Ça compte davantage que le nom des nœuds une fois la forme du plan claire.

N’analyse pas à la légère une requête qui écrit. `EXPLAIN ANALYZE` d’un `UPDATE`/`DELETE` **exécute** l’écriture. Entoure d’une transaction et `ROLLBACK` si tu expérimentes.

## Où regarder d’abord

Lis de l’intérieur vers l’extérieur. PostgreSQL commence au nœud le plus profond.

Signaux utiles :

- **Seq Scan** sur une grande table avec un `WHERE` sélectif : un index manque probablement
- **Index Scan** et **Bitmap Heap Scan** peuvent tous les deux être sains
- **Nested Loop** avec une inner side énorme : l’estimation de jointure est peut-être fausse
- **Sort** + **Limit** : un index déjà trié peut éviter le sort
- **actual rows** très loin de **planned rows** : statistiques périmées (`ANALYZE` la table)

Le temps est par nœud. Un nœud laid à 0,2 ms n’est pas le problème.

## Une itération concrète

1. Capturer la requête avec `EXPLAIN ANALYZE` sur un volume réaliste
2. Identifier le nœud le plus coûteux
3. Changer **une** chose : prédicat, index, réécriture de jointure, ou `SET enable_seqscan = off` en diagnostic seulement
4. Comparer le nouveau plan

Ne laisse jamais `enable_seqscan = off` en production. C’est une lampe, pas une config.

## Statistiques

PostgreSQL planifie avec des stats de table. Après un gros chargement :

```sql
ANALYZE orders;
```

L’autovacuum s’en charge d’habitude. Si les estimations sont aberrantes après un import, lance `ANALYZE` avant de créer cinq index.

## À valider

- Le SQL lent est capturé avec `EXPLAIN (ANALYZE, BUFFERS)`.
- Tu as comparé lignes prévues et lignes réelles.
- Une seule variable change entre deux explains.
- Aucun réglage de session diagnostique ne reste dans l’appli.

## Étape suivante

Envelopper les écritures liées dans une transaction, avec un niveau d’isolation compris.
