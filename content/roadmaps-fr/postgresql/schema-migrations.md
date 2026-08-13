---
title: Migrations de schéma PostgreSQL
description: Versionner les changements de schéma PostgreSQL, les appliquer dans l’ordre, et élargir puis contracter pour un DDL de production sûr.
date: 2026-04-18
tags: [postgresql, migrations, flyway, schema]
draft: false
readingTime: 9 min
---

## Le schéma est du code

Si une colonne n’existe que parce que quelqu’un a tapé du SQL sur le serveur, tu ne peux pas recréer la base ni relire le changement. Les migrations sont des scripts ordonnés (ou des fichiers déclaratifs) dans git, exécutés de la même façon partout.

Cette page parle du côté **PostgreSQL**. Le branchement Flyway dans Spring appartient à la roadmap Spring Boot.

## À quoi ressemble une migration

```sql
-- V20260418__add_orders_paid_at.sql
ALTER TABLE orders
  ADD COLUMN paid_at timestamptz;

CREATE INDEX orders_paid_at_idx ON orders (paid_at)
  WHERE paid_at IS NOT NULL;
```

Règles qui évitent le chaos :

- ne jamais éditer une migration déjà passée en production
- un changement logique par fichier
- le script aller est obligatoire ; le down est optionnel et souvent inutilisé

Flyway, Liquibase et d’autres outils appliquent la même idée. La base ne voit que du SQL.

## Étendre, puis contracter

Les déploiements cassent quand tu drops une colonne que l’ancienne appli lit encore. Découpe :

1. **Expand** : ajouter la colonne ou la table, backfill, garder l’ancienne
2. Déployer le code qui écrit les deux, puis lit la nouvelle
3. **Contract** : drop de l’ancienne colonne dans une migration plus tardive

```sql
ALTER TABLE customers ADD COLUMN email_normalized text;

UPDATE customers
SET email_normalized = lower(email)
WHERE email_normalized IS NULL;

ALTER TABLE customers
  ALTER COLUMN email_normalized SET NOT NULL;
```

Plus tard, quand l’appli ne cherche plus sur `email`, tu pourras la drop. N’enchaîne pas ajout, backfill, not-null et drop d’un coup sur une grosse table.

## DDL qui verrouille

`ALTER TABLE ... ADD COLUMN` avec une constante par défaut est en général rapide sur un PostgreSQL récent. Certains changements de type réécrivent la table. `CREATE INDEX` sans `CONCURRENTLY` bloque les écritures. Sur une grosse table de prod :

```sql
CREATE INDEX CONCURRENTLY orders_customer_id_idx ON orders (customer_id);
```

`CONCURRENTLY` ne tourne pas dans un bloc de transaction. Vérifie le mode transaction de ton runner avant de copier ce snippet.

## Local et CI

Chaque pull request doit pouvoir appliquer les migrations sur une base vide et sur le schéma précédent. Garde une `shop_test` ou des conteneurs jetables. Ne « répare pas la prod » sans ajouter le même SQL à l’historique.

## À valider

- Les changements de schéma sont des fichiers versionnés.
- Le DDL de production ne se fait pas à la main dans `psql`.
- Les suppressions attendent que l’ancien code soit parti.
- Les gros index utilisent `CONCURRENTLY` si le runner le permet.

## Étape suivante

Faire des sauvegardes que tu sais vraiment restaurer avec `pg_dump` et `pg_restore`.
