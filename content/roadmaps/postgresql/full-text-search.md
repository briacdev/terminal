---
title: Full-Text Search in PostgreSQL
description: Build PostgreSQL full-text search with tsvector, tsquery, ranking, and a maintained search index for product or article text.
date: 2026-04-17
tags: [postgresql, full-text-search, tsvector, gin]
draft: false
readingTime: 9 min
---

## Search is not LIKE

`LIKE '%notebook%'` cannot use a normal B-tree index well and does not understand language. PostgreSQL full-text search tokenizes text, removes stop words, and ranks matches. Use it for product names, help articles, and similar documents.

## tsvector and tsquery

`tsvector` is the indexed document. `tsquery` is the user query.

```sql
ALTER TABLE products
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(sku, ''))
  ) STORED;

CREATE INDEX products_search_idx ON products USING gin (search_vector);

SELECT sku, name,
       ts_rank(search_vector, query) AS rank
FROM products,
     websearch_to_tsquery('english', 'black notebook') AS query
WHERE search_vector @@ query
ORDER BY rank DESC, id
LIMIT 20;
```

`websearch_to_tsquery` accepts a Google-like string from a search box. `plainto_tsquery` is stricter. `to_tsquery` needs operators (`&`, `|`) and is easy to break with raw user input.

Pick a text search configuration that matches the language (`english`, `french`). Mixing languages in one vector without a plan produces weak ranking.

## Generated columns vs triggers

A stored generated `tsvector` stays in sync with `name` and `sku`. Triggers are useful when you also concatenate related tables. Start with a generated column on one table.

## Ranking and highlighting

`ts_rank` (or `ts_rank_cd`) orders results. `ts_headline` can highlight fragments for a UI. Ranking is good enough for modest catalogs. It is not a replacement for a dedicated search engine when you need typo tolerance, faceting, and multi-language relevance at large scale.

## Maintain the index

GIN indexes on `tsvector` can bloat after heavy updates. Autovacuum should handle most cases. After huge bulk loads, `ANALYZE products` so plans stay sane. If search is the product, monitor query time the same way you monitor checkout SQL.

## When not to use it

- Exact SKU lookup: use `=` and a unique index
- Prefix search on codes: `text_pattern_ops` or `LIKE 'ABC%'` with a suitable index
- JSON key containment: use JSONB operators from the previous step

## Checklist

- Search uses `tsvector` plus GIN, not leading-wildcard `LIKE`.
- User input goes through `websearch_to_tsquery` or a sanitized `plainto_tsquery`.
- The configuration language matches the content.
- Exact identifiers still use relational lookups.

## Next step

Version schema changes with migrations so production never depends on a manual `ALTER TABLE` in `psql`.
