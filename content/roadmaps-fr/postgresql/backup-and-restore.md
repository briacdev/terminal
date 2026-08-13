---
title: Sauvegarde et restauration PostgreSQL avec pg_dump
description: Sauvegarder PostgreSQL avec pg_dump, restaurer avec pg_restore, et vérifier les recoveries au lieu de faire confiance au fichier.
date: 2026-04-19
tags: [postgresql, sauvegarde, pg-dump, restauration]
draft: false
readingTime: 9 min
---

## Une sauvegarde jamais restaurée n’est qu’un espoir

Les backups existent pour restaurer. `pg_dump` est la sauvegarde logique que tu utiliseras d’abord en tant que dev : elle copie le contenu vers un fichier rechargeable ailleurs. Les sauvegardes physiques et le PITR s’adressent aux ops avec archivage WAL. Maîtrise dump/restore avant de compter sur le PITR.

## Logique contre physique

- **Logique** (`pg_dump` / `pg_dumpall`) : objets SQL ou format custom. Idéal pour copier un schéma, changer de version, ou peupler un laptop.
- **Physique** (base backup + WAL) : copie des fichiers. Nécessaire pour un PITR (« restaurer à 03:12 UTC »).

Cette page reste sur le logique, dont chaque développeur a besoin. Le physique appartient au runbook de l’hébergeur (Postgres managé, Barman, pgBackRest).

## Dump d’une base

```bash
pg_dump -h localhost -U shop_app -d shop -Fc -f shop.dump
```

`-Fc` est le format custom : `pg_restore` peut ensuite choisir des tables. Le SQL brut (`-Fp`) se lit, mais il est moins souple.

Schéma seul, utile en travaillant les migrations :

```bash
pg_dump -h localhost -U shop_app -d shop --schema-only -f shop-schema.sql
```

## Restore

Crée une cible vide, puis restaure :

```bash
createdb -h localhost -U postgres shop_copy
pg_restore -h localhost -U postgres -d shop_copy --no-owner shop.dump
```

`--no-owner` évite l’échec si le rôle propriétaire d’origine n’existe pas en local. Restaure dans un **nouveau** nom de base pour t’entraîner. Restaurer par-dessus la prod n’est pas une répétition.

## Quoi vérifier

```sql
SELECT count(*) FROM shop.customers;
SELECT max(created_at) FROM shop.orders;
```

Compare les comptes et un horodatage récent avec la source. Restaure aussi selon un calendrier, pas seulement après un incident. Un dump illisible découvert pendant une panne est un second incident.

## Limites de pg_dump

Un dump est un instantané des données commitées au début (avec des nuances sur les très grosses bases). Ce n’est pas du PITR. Ça ne remplace pas la réplication. Un volume énorme peut demander un dump/restore parallèle (`-j`) et du disque.

Exclure des tables trop lourdes en local :

```bash
pg_dump -Fc -f shop.dump --exclude-table-data=shop.audit_events
```

## À valider

- Tu dumpes et restaures la base boutique sur ta machine.
- La restauration est testée, pas seulement le job de dump.
- La prod a un responsable de restore et un objectif de délai.
- Tu sais si tu as du PITR ou seulement des dumps logiques.

## Étape suivante

Garder la base saine en production : autovacuum, pooling, et un minimum de haute disponibilité.
