---
title: Recherche plein texte PostgreSQL
description: Mettre en place une recherche plein texte PostgreSQL avec tsvector, tsquery, ranking, et un index GIN maintenu.
date: 2026-04-17
tags: [postgresql, recherche, tsvector, gin]
draft: false
readingTime: 9 min
---

## LIKE n’est pas une recherche

`LIKE '%carnet%'` s’indexe mal en B-tree classique et ignore la langue. La recherche plein texte tokenise, enlève les mots vides, et classe les matches. Elle convient aux noms de produits, articles d’aide, et documents similaires.

## tsvector et tsquery

`tsvector` est le document indexé. `tsquery` est la requête.

```sql
ALTER TABLE products
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('french', coalesce(name, '') || ' ' || coalesce(sku, ''))
  ) STORED;

CREATE INDEX products_search_idx ON products USING gin (search_vector);

SELECT sku, name,
       ts_rank(search_vector, query) AS rank
FROM products,
     websearch_to_tsquery('french', 'carnet noir') AS query
WHERE search_vector @@ query
ORDER BY rank DESC, id
LIMIT 20;
```

`websearch_to_tsquery` accepte une saisie type moteur de recherche. `plainto_tsquery` est plus strict. `to_tsquery` demande des opérateurs (`&`, `|`) et casse facilement avec une saisie brute.

Choisis une configuration de langue (`french`, `english`). Mélanger les langues dans un seul vecteur sans plan donne un ranking médiocre.

## Colonne générée contre trigger

Un `tsvector` généré stocké reste aligné sur `name` et `sku`. Un trigger sert quand tu concatènes aussi des tables liées. Commence par une colonne générée sur une table.

## Ranking et extraits

`ts_rank` (ou `ts_rank_cd`) ordonne. `ts_headline` peut surligner un fragment pour l’UI. C’est suffisant pour un catalogue modeste. Ce n’est pas un moteur de search dédié si tu as besoin de fautes d’orthographe, de facettes, et d’une pertinence multi-langue à grande échelle.

## Entretenir l’index

Un GIN sur `tsvector` peut gonfler après beaucoup d’updates. L’autovacuum gère la plupart des cas. Après un gros chargement, `ANALYZE products`. Si la recherche est le produit, surveille son temps de réponse comme le SQL du checkout.

## Quand ne pas l’utiliser

- Lookup exact de SKU : `=` et un index unique
- Préfixe de code : `text_pattern_ops` ou `LIKE 'ABC%'` avec un index adapté
- Containment de clé JSON : opérateurs JSONB de l’étape précédente

## À valider

- La recherche passe par `tsvector` + GIN, pas par un `LIKE` à joker initial.
- La saisie utilisateur passe par `websearch_to_tsquery` ou un `plainto_tsquery` nettoyé.
- La configuration de langue colle au contenu.
- Les identifiants exacts restent des lookups relationnels.

## Étape suivante

Versionner le schéma avec des migrations, pour ne plus dépendre d’un `ALTER TABLE` improvisé en production.
