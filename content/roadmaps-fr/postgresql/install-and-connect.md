---
title: Installer PostgreSQL en local et se connecter avec psql
description: Installer un serveur PostgreSQL sur ta machine, créer un rôle et une base, puis ouvrir une session avec psql ou un client graphique.
date: 2026-04-02
tags: [postgresql, installation, psql, setup]
draft: false
readingTime: 9 min
---

## Objectif concret

Il te faut un PostgreSQL local que tu peux casser sans conséquence. Un instance cloud viendra plus tard. Pour apprendre, un portable est plus rapide : tu crées des bases, tu les supprimes, tu inspectes les catalogues tout de suite.

À la fin de la page, tu dois pouvoir démarrer le serveur, lancer `psql`, et exécuter `SELECT version();`.

## Installer une version actuelle

Choisis un canal officiel selon l’OS, pas un installeur au hasard.

- **Linux (Debian/Ubuntu)** : [téléchargements Linux](https://www.postgresql.org/download/linux/)
- **macOS** : Postgres.app ou Homebrew, via [téléchargements macOS](https://www.postgresql.org/download/macosx/)
- **Windows** : installeur EDB, [téléchargements Windows](https://www.postgresql.org/download/windows/)
- **Docker** : utile pour isoler le serveur sans paquets système

Vérifie que le client est dans le `PATH` :

```bash
psql --version
```

PostgreSQL 16 ou 17 est une base d’apprentissage solide.

## Créer un rôle et une base

Toute connexion passe par un **rôle**. Sur beaucoup d’installs locales, ton utilisateur OS est déjà superuser. Crée quand même un rôle « appli » pour prendre les bons réflexes :

```sql
CREATE ROLE shop_app LOGIN PASSWORD 'local-only-secret';
CREATE DATABASE shop OWNER shop_app;
GRANT ALL PRIVILEGES ON DATABASE shop TO shop_app;
```

Même en local, ne recycle pas un mot de passe de production.

Connexion :

```bash
psql -h localhost -U shop_app -d shop
```

Si l’auth `peer` bloque le mot de passe sous Linux, `-h localhost` force le TCP et les règles de `pg_hba.conf`.

## Premières commandes psql

```text
\l          lister les bases
\c shop     basculer sur la base shop
\dt         lister les tables
\d customers
\q          quitter
```

Puis du vrai SQL :

```sql
SELECT version();
SELECT current_user, current_database();
```

Si ces deux requêtes répondent, l’environnement est prêt.

## Les GUI restent optionnelles

Garde `psql` comme réflexe : les messages d’erreur et les scripts se transposent sur un serveur. Une GUI aide à parcourir les tables :

- [pgAdmin](https://www.pgadmin.org/)
- DBeaver, TablePlus, ou l’outil de ton IDE

Ne saute pas `psql`. Un incident de production se traite plus souvent dans un terminal.

## Forme de l’URL

Les applications reçoivent en général :

```text
postgresql://shop_app:local-only-secret@localhost:5432/shop
```

Rôle, mot de passe, hôte, port (`5432` par défaut), nom de **base**. La page suivante explique pourquoi ce nom n’est pas un schéma.

## Pièges fréquents

- Installer seulement le client, pas le serveur
- Rester collé à la base `postgres` au lieu de créer une base métier
- Utiliser le superuser `postgres` depuis le code
- Oublier `-h localhost` sous Linux et tomber sur l’auth peer

## À valider

- `psql --version` fonctionne.
- Tu te connectes à une base créée par toi, pas seulement `postgres`.
- `SELECT current_user, current_database();` affiche les bonnes valeurs.
- Tu as noté l’URL de connexion pour plus tard.

## Étape suivante

Distinguer bases, rôles et schémas, puis régler `search_path` au lieu de tout poser dans `public`.
