---
title: Sécurité - Bases de la sécurité applicative
description: "Sécuriser des API Java : AuthN/AuthZ, stratégies token vs session, durcissement des endpoints, secrets et réponses d’erreur sûres."
date: 2025-01-15
tags: [java, security, api, auth]
draft: false
readingTime: 16 min
---

## Pourquoi cette étape est importante

La sécurité est une question d’architecture, pas un patch de dernière minute.
Des frontières faibles créent des incidents production coûteux.

Chaque endpoint backend est une surface d’attaque jusqu’à preuve du contraire.

## AuthN vs AuthZ

- Authentification (AuthN) : qui appelle ?
- Autorisation (AuthZ) : que peut faire cet appelant ?

Les deux sont nécessaires.
Ne traitez jamais “connecté” comme “autorisé à tout”.

## Approche token vs session

Session :

- état côté serveur
- simple pour les apps web classiques
- nécessite un stockage de session scalable et une protection CSRF pour les cookies

Token :

- requêtes sans état avec jeton signé
- courant pour APIs et services distribués
- exige validation stricte, expiration et stratégie de révocation

Choisissez selon les contraintes d’architecture, pas selon la mode.

## Checklist de durcissement des endpoints

- politique d’accès deny-by-default
- routes publiques explicites uniquement
- validation d’entrée et limites de taille de payload
- rate limiting sur les endpoints sensibles
- politique CORS stricte si pertinent
- HTTPS partout en production

## Mots de passe et secrets

- ne jamais stocker des credentials en clair
- hasher fortement les mots de passe (bcrypt/argon2 via une lib éprouvée)
- externaliser et faire tourner les secrets
- ne pas logger tokens, mots de passe ou données sensibles
- préférer des access tokens courts avec contrôle de refresh

## Stratégie de réponse d’erreur

Retournez des erreurs d’auth génériques pour éviter de fuiter des détails internes.
Exemple : un contrat clair `401` / `403` sans exposer si un email existe, sauf exigence produit contraire.

## Modèle d’accès pratique

Placez les contrôles rôle/permission près des opérations métier :

- rôle pour un accès grossier (`admin`, `member`)
- permission pour des actions fines (`read:invoice`, `write:invoice`)

Centralisez les décisions d’autorisation pour les rendre testables et auditables.

## Menaces API de base

Surveillez :

- injections (SQL, commande, template)
- contrôles d’accès cassés (IDOR)
- mass assignment / over-posting
- désérialisation non sûre
- exposition excessive de données dans les réponses

## Erreurs fréquentes

- mélanger auth et logique métier partout
- endpoints publics par accident
- pas de politique d’expiration token/session
- pas de piste d’audit sur actions sensibles
- faire confiance aux claims de rôle côté client sans validation serveur

## Checklist pratique

- classer les routes d’une API : public / authentifié / autorisé
- concevoir un contrôle de permission pour une écriture sensible
- sortir les secrets des fichiers de config vers des variables d’environnement
- vérifier que les erreurs ne fuient ni stack traces ni énumération d’utilisateurs

## À retenir

1. Séparer clairement identité (AuthN) et permissions (AuthZ)
2. Choisir token ou session selon l’architecture
3. Durcir les endpoints avec un mindset deny-by-default
4. Traiter secrets, credentials et logs d’auth comme des assets critiques
