---
title: pgcopycat
description: CLI de clonage applicatif PostgreSQL pour les workflows de refresh local, construit en Go autour de pg_dump, pg_restore et psql.
tags: [go, postgresql, cli, tooling]
stack: [go, postgresql]
year: 2026
active: true
cover: /projects/pgcopycat.webp
links:
  repo: https://github.com/briacdev/pgcopycat
---

## Contexte du projet

`pgcopycat` est né d’un besoin très concret côté développement : récupérer une copie locale exploitable d’une base applicative PostgreSQL sans chercher à cloner toute l’administration d’une instance.

Dans beaucoup d’équipes, le refresh local repose encore sur un mélange d’historique shell, de commandes de dump connues par une seule personne, d’étapes manuelles, et d’un vrai risque de restauration sur la mauvaise cible. Tant que cela marche, personne n’y touche. Le jour où cela casse, on perd du temps sur un processus qui aurait dû être fiable depuis longtemps.

L’objectif de `pgcopycat` est de transformer ce workflow fragile en commande reproductible, avec des vérifications claires, des garde-fous, et une configuration réutilisable.

Plutôt que de se positionner comme un produit de migration PostgreSQL au niveau cluster, l’outil reste volontairement centré sur la couche applicative : schémas, tables, index, séquences, vues et données selon le mode choisi.

## Le problème qu’il résout

Le vrai besoin n’est pas de “copier tout PostgreSQL”. Le besoin est d’obtenir une base applicative utilisable par les développeurs.

Cette nuance est importante. Dans un workflow de refresh local, on n’a pas forcément besoin de restaurer les rôles, les owners, les ACL, ou toute la logique d’administration globale. On veut surtout déplacer proprement la structure applicative et, si nécessaire, une partie ou la totalité des données, avec un niveau de sécurité raisonnable.

`pgcopycat` s’appuie donc sur des outils PostgreSQL natifs déjà éprouvés :

- `pg_dump`
- `pg_restore`
- `psql`

Le projet ne cherche pas à remplacer l’écosystème PostgreSQL. Il organise ces briques dans un flux plus cohérent pour les besoins quotidiens d’une équipe.

## Conception du workflow

L’un des points forts du projet est son double mode d’exécution.

Sans arguments, `pgcopycat` peut guider l’utilisateur dans un parcours interactif : vérification des outils clients PostgreSQL, détection des profils existants, saisie de la source et de la destination, configuration d’exclusions, validation des extensions manquantes, puis récapitulatif final avant exécution.

Ce mode le rend accessible à des développeurs qui ne veulent pas mémoriser tous les flags.

En parallèle, le projet supporte aussi une exécution plus opérationnelle via des fichiers YAML et des profils réutilisables. C’est essentiel, car les besoins de refresh reviennent souvent sous des formes récurrentes : copie locale complète, clone de schéma pour test, restauration partielle, ou dry-run avant une opération plus sensible.

Le résultat est un outil utilisable à la fois comme assistant ponctuel et comme routine stable dans une équipe.

## Capacités principales

### Modes de clonage

`pgcopycat` propose plusieurs stratégies selon l’objectif :

- `full`
- `schema-only`
- `data-only`

Cela évite d’imposer le même comportement à tous les environnements. Parfois seule la structure compte. Parfois seules les données sont utiles. Parfois il faut les deux.

### Filtres configurables

Le projet permet d’inclure ou d’exclure des schémas et des tables, y compris dans les cas où l’on souhaite conserver la structure d’une table sans restaurer ses données. C’est particulièrement utile pour les tables d’audit lourdes, les historiques, les jobs, ou les jeux de données qui n’ont aucun intérêt en local.

### Gestion des extensions

Un refresh échoue souvent tard parce que la destination ressemble à la source, mais n’a pas exactement les mêmes extensions installées. `pgcopycat` remonte ce problème dès les pre-checks et peut, selon la configuration, s’assurer que les extensions nécessaires existent côté cible.

### Resynchronisation des séquences

Le décalage des séquences après restauration est un problème classique : la base semble saine, puis le premier insert échoue ou produit un comportement incohérent. `pgcopycat` prend ce sujet en charge dans le workflow pour rendre la base restaurée directement exploitable.

### Reporting

Chaque exécution produit un rapport final qui récapitule le profil ou fichier utilisé, les modes choisis, les filtres, l’état des extensions, la resynchronisation des séquences, les étapes exécutées, la durée et le statut final. C’est beaucoup plus lisible et audit-able qu’une simple suite de commandes dans un terminal.

## Modèle de sécurité

`pgcopycat` adopte volontairement une posture prudente sur les opérations destructrices.

Le projet intègre plusieurs garde-fous contre les erreurs les plus courantes :

- vérification des outils avant même de poser les questions base de données
- contrôle de l’identité source/destination avant exécution
- refus de restaurer dans une cible non vide en mode sûr
- détection anticipée des extensions manquantes
- confirmation explicite avant les actions sensibles, sauf si l’utilisateur force l’exécution

Cette couche de sécurité fait partie de la vraie valeur du projet. Le but n’est pas seulement d’aller plus vite, mais de réduire les erreurs quand on agit sous pression.

## Pourquoi ce projet est utile

`pgcopycat` occupe un espace intéressant entre les scripts maison improvisés et les outils plus lourds de migration ou d’orchestration.

Pour une petite équipe, il peut remplacer une checklist fragile par une commande unique et plus fiable.

Pour une équipe plus structurée, il peut formaliser les refreshs locaux et de préproduction sans introduire une plateforme trop complexe.

C’est aussi un bon exemple du type d’outillage que j’aime construire : périmètre clair, valeur opérationnelle immédiate, bons défauts, et respect des outils natifs déjà utilisés en production.

## Direction actuelle

Le projet se positionne aujourd’hui comme un utilitaire PostgreSQL orienté développeur, avec une attention forte sur :

- les profils de refresh réutilisables
- la sécurité côté destination
- une bonne ergonomie en mode interactif comme en mode scriptable
- un clonage applicatif prévisible, sans dériver vers l’administration cluster complète

Il est particulièrement pertinent pour les équipes qui veulent fiabiliser leurs workflows de refresh local tout en restant proches des outils standards PostgreSQL.

## Liens externes

- Repository : [github.com/briacdev/pgcopycat](https://github.com/briacdev/pgcopycat)
