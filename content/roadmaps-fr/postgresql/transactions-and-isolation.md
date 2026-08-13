---
title: Transactions PostgreSQL et niveaux d’isolation
description: Garder les transactions PostgreSQL courtes, comprendre ACID en pratique, et choisir Read Committed ou Repeatable Read.
date: 2026-04-14
tags: [postgresql, transactions, isolation, acid]
draft: false
readingTime: 9 min
---

## Une transaction est un contrat

Elle groupe des ordres pour qu’ils committent tous ou rollbackent tous. C’est le A et le D d’ACID : atomique, et durable une fois commité. Isolation et cohérence sont les parties souvent mal comprises.

Garde les transactions **courtes**. Une transaction qui tient des lignes pendant un appel HTTP de paiement bloquera d’autres writers.

## BEGIN, COMMIT, ROLLBACK

```sql
BEGIN;

UPDATE accounts SET balance_cents = balance_cents - 1000 WHERE id = 1;
UPDATE accounts SET balance_cents = balance_cents + 1000 WHERE id = 2;

COMMIT;
```

Si le second update échoue, le `ROLLBACK` (ou l’abort de session) remet les deux lignes. Dans le code, la librairie cliente démarre souvent la transaction pour toi. Sache où elle commence et où elle finit.

Un ordre unique a déjà sa transaction. `BEGIN` sert à **plusieurs** ordres qui doivent réussir ensemble.

## Niveaux que tu utiliseras vraiment

Le défaut PostgreSQL est **Read Committed**. Chaque ordre voit les lignes commitées avant son début. Deux `SELECT` de la même transaction peuvent voir des données différentes si une autre session a commité entre les deux.

**Repeatable Read** (et **Serializable**) donnent un snapshot stable pour toute la transaction. Si une écriture concurrente rend le snapshot dangereux, PostgreSQL peut lever une erreur de sérialisation. Il faut alors réessayer.

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT sum(total_cents) FROM orders WHERE customer_id = 42 AND status = 'paid';
-- les autres ordres voient encore le même snapshot
COMMIT;
```

Repeatable Read pour un rapport qui ne doit pas mélanger ancien et nouveau. Reste sur Read Committed pour du CRUD requête/réponse, sauf anomalie prouvée.

**Serializable** est le plus strict. Utilise-le quand le métier ne tolère pas le write skew et que tu acceptes de retry.

## Ce qu’ACID ne promet pas

Ni « pas de verrous », ni « l’application ne verra jamais d’erreur ». Le moteur n’appliquera pas la moitié d’une transaction commité. À toi de poser la frontière : les deux côtés d’un virement dans la même transaction ; pas de transaction ouverte autour d’un aller-retour HTTP.

## Erreurs à gérer

- deadlock (page suivante)
- violation d’unicité
- échec de sérialisation (`SQLSTATE 40001`)

Retry ou message utilisateur selon le cas. Avaler l’erreur et boucler sans limite n’est pas une stratégie.

## À valider

- Les changements métier multi-lignes partagent une transaction.
- Aucune transaction n’attend un appel HTTP externe.
- Tu connais le niveau d’isolation de la session (souvent Read Committed).
- Les erreurs de sérialisation ne sont retried que si tu as choisi Repeatable Read ou Serializable.

## Étape suivante

Voir comment les verrous de ligne et les deadlocks apparaissent quand deux transactions touchent les mêmes lignes.
