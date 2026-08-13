---
title: Contraintes et clés dans PostgreSQL
description: Protéger les données PostgreSQL avec NOT NULL, UNIQUE, CHECK, clés primaires et clés étrangères dès l’écriture.
date: 2026-04-05
tags: [postgresql, contraintes, cle-primaire, cle-etrangere]
draft: false
readingTime: 9 min
---

## La base doit pouvoir dire non

La validation applicative est nécessaire. Elle ne suffit pas. Un script, un second writer, ou un bug finira par insérer une ligne que l’API n’avait pas prévue. Les contraintes sont le dernier filet.

Cette étape couvre celles que presque chaque table devrait avoir : `NOT NULL`, `UNIQUE`, `CHECK`, clé primaire, clé étrangère.

## Clé primaire

Elle identifie la ligne et n’est jamais nulle. Dans la boutique, `id` est une clé technique :

```sql
CREATE TABLE customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);
```

`PRIMARY KEY` implique déjà `UNIQUE` et `NOT NULL`. Tu ajoutes quand même `UNIQUE` sur `email` : c’est une clé métier, pas l’identifiant de ligne.

Une clé naturelle (`email` en PK) séduit jusqu’au jour où l’email change. Le duo `id` + colonnes métier uniques est le schéma de production habituel.

## Clés étrangères

```sql
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers (id),
  status text NOT NULL,
  total_cents integer NOT NULL
);
```

`REFERENCES` refuse une commande sans client. Choisis `ON DELETE` explicitement :

- `RESTRICT` / `NO ACTION` : interdire de supprimer un client encore référencé
- `CASCADE` : supprimer les enfants (dangereux pour de l’argent)
- `SET NULL` : seulement si la colonne est nullable et que « orphelin » a un sens

Pour des commandes, `RESTRICT` est le défaut prudent.

## NOT NULL, UNIQUE, CHECK

```sql
ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
    CHECK (status IN ('draft', 'paid', 'cancelled')),
  ADD CONSTRAINT orders_total_cents_check
    CHECK (total_cents >= 0);
```

`NOT NULL` est une contrainte. Une colonne nullable doit vouloir dire « inconnu » ou « sans objet », pas « on a oublié la valeur par défaut ».

Nomme les contraintes (`orders_status_check`) : les erreurs et les migrations restent lisibles.

## Unicité sur plusieurs colonnes

```sql
CREATE TABLE order_items (
  order_id bigint NOT NULL REFERENCES orders (id),
  product_id bigint NOT NULL REFERENCES products (id),
  quantity integer NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (order_id, product_id)
);
```

Une seule ligne produit par commande. Un second insert du même couple échoue.

## Ce que les contraintes ne remplacent pas

Ni les index de lecture, ni les transactions. Elles n’expriment pas non plus toutes les règles (une remise calculée ailleurs). Mets les règles mécaniques dans PostgreSQL. Garde les règles floues dans l’application.

## Erreurs fréquentes

- Clé étrangère nullable alors qu’elle est obligatoire
- Pas de `CHECK` sur le statut, puis dix graphies de `cancelled`
- Option « unique » de l’ORM sans vrai index unique
- `ON DELETE CASCADE` sur des tables financières

## À valider

- Chaque table a une clé primaire.
- Les relations réelles ont une clé étrangère.
- Statuts et montants ont des `CHECK`.
- Les noms de contraintes sont stables.

## Étape suivante

Concevoir les relations : one-to-many, many-to-many, et jusqu’où normaliser.
