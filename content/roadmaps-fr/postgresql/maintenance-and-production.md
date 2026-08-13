---
title: Maintenance et production PostgreSQL
description: Exploiter PostgreSQL en production : autovacuum, pooling de connexions, réplication, et une checklist opérationnelle courte.
date: 2026-04-20
tags: [postgresql, production, autovacuum, pgbouncer]
draft: false
readingTime: 10 min
---

## La production est une habitude

Les étapes précédentes t’ont appris à modeler, interroger et récupérer des données. Cette dernière page est le minimum d’exploitation : vacuum, connexions, réplicas, et ce qu’il faut surveiller. Tu n’as pas à devenir DBA aujourd’hui. Tu dois arrêter de traiter PostgreSQL comme une boîte noire dès que des utilisateurs en dépendent.

## Autovacuum et bloat

PostgreSQL s’appuie sur MVCC : updates et deletes laissent d’anciennes versions de lignes. **Vacuum** récupère l’espace, **ANALYZE** rafraîchit les stats. L’autovacuum fait les deux en fond.

S’il n’arrive plus à suivre, les tables gonflent et les plans se dégradent. À regarder :

```sql
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum, last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

Ne désactive pas l’autovacuum « pour aller plus vite ». Traite la cause : transactions longues, trop de lignes churn, workers affamés. Un `VACUUM` manuel est pour l’urgence ou un gros job, pas un rituel quotidien sur un système sain.

## Pool de connexions

Chaque connexion PostgreSQL coûte cher. Des dizaines de process applicatifs multipliés par vingt connexions saturent `max_connections`. Place un pool devant :

- pool in-process pour une instance
- [PgBouncer](https://www.pgbouncer.org/) quand plusieurs instances partagent la base

Le mode transaction est le plus courant pour du web. Le mode session est nécessaire si tu t’appuies sur des réglages de session (`SET`, tables temporaires, certains prepared statements). Surveille `numbackends` dans `pg_stat_database` et les wait events de `pg_stat_activity`.

## Réplication et failover

La réplication streaming donne un standby pour la lecture ou le failover. Les offres managées exposent souvent une URL primaire et une URL replica. Règles applicatives :

- les écritures uniquement sur le primaire
- accepter le lag si tu lis sur un standby
- savoir qui déclenche le failover et comment l’URL bascule

La haute disponibilité est une procédure répétée, pas une case cochée. Couple-la aux backups testés à l’étape précédente.

## Petite liste de surveillance

- disque et WAL
- nombre de connexions vs `max_connections`
- plus longue transaction ouverte
- retard d’autovacuum (`n_dead_tup`)
- requêtes lentes (`pg_stat_statements` si l’extension est là)
- âge du dernier backup et date du dernier restore d’entraînement

```sql
SELECT pid, now() - xact_start AS xact_age, state, query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY xact_start;
```

Une transaction ouverte depuis des heures est un bug de production, même si la requête a l’air idle.

## Minimum sécurité

- pas de superuser pour le rôle appli
- connexions chiffrées en transit
- grants minimaux par schéma
- secrets hors git

Le chiffrement au repos et `pgcrypto` sont des couches en plus. Le chiffrement de colonne ne remplace pas le contrôle d’accès.

## Fin du parcours

Tu peux installer PostgreSQL, modeler une boutique, l’interroger, l’indexer, transacter correctement, utiliser JSONB et la recherche là où ils aident, migrer le schéma, restaurer un dump, et exploiter avec une checklist courte. Reviens à n’importe quelle étape quand un incident de prod s’y rattache. La [documentation PostgreSQL](https://www.postgresql.org/docs/current/) reste la référence.

## À valider

- L’autovacuum tourne et les dead tuples ne croissent pas sans limite.
- Les applis passent par un pool.
- Les écritures vont au primaire ; le lag replica est compris.
- Backups, timeouts et privilèges de rôles sont documentés.
