---
title: "Syntaxe template et directives"
description: "Maîtriser les templates Vue : interpolation, v-bind, v-on, v-if, v-show, v-for, et la règle d'une key stable sans mélanger v-if et v-for."
date: 2026-04-04
tags: ["vue", "templates", "directives", "v-for"]
draft: false
readingTime: "9 min"
---

## HTML, plus des attributs v-

Un template Vue ressemble à du HTML. Les **directives** sont des attributs `v-*` qui lient des données, écoutent des événements ou répètent des nœuds.

On suppose ici que les valeurs existent déjà dans `<script setup>`. `ref` est l'étape suivante.

## Texte et attributs

```vue
<p>{{ nomAffiche }}</p>
<img :src="urlAvatar" :alt="nomAffiche">
<button :disabled="estEnregistrement">Enregistrer</button>
```

`v-bind` se raccourcit en `:`. `v-html` injecte du HTML : à éviter pour du contenu utilisateur non assaini. L'interpolation suffit presque toujours.

## Événements

`v-on` se raccourcit en `@` :

```vue
<button type="button" @click="handleEnregistrer">Enregistrer</button>
<input :value="recherche" @input="handleSaisieRecherche">
```

Préfixe `handle` sur les handlers. Une expression d'une ligne peut rester dans le template ; dès qu'il y a un `if`, ça sort en fonction.

## Afficher ou cacher

| Directive | Effet |
| --- | --- |
| `v-if` / `v-else-if` / `v-else` | Crée ou détruit les nœuds |
| `v-show` | Bascule `display`, le nœud reste monté |

`v-if` pour un bloc rare ou coûteux. `v-show` pour un panneau que tu ouvres souvent et dont tu veux garder l'état interne.

```vue
<p v-if="statut === 'erreur'">Impossible de charger la liste.</p>
<p v-else-if="livres.length === 0">Aucun livre pour l'instant.</p>
<ul v-else>
  <li v-for="livre in livres" :key="livre.id">{{ livre.titre }}</li>
</ul>
```

## Listes et keys

`v-for` répète un nœud. La **`:key` doit identifier l'élément**, pas sa position, dès que la liste peut être triée ou filtrée.

```vue
<li v-for="tache in taches" :key="tache.id">
  {{ tache.titre }}
</li>
```

Interdit : `v-if` et `v-for` sur le même élément. Filtre la liste en script, ou enveloppe le `v-for` dans un `<template>`.

## Raccourcis à connaître

| Complet | Court |
| --- | --- |
| `v-bind:src` | `:src` |
| `v-on:click` | `@click` |
| `v-slot:entete` | `#entete` |

Les codebases Vue utilisent les formes courtes.

## Ce que le template ne doit pas faire

Pas de `map` / `filter` complexes dans le markup. Le template lit l'état. Les calculs vivent dans `<script setup>`.

## Checklist

- Texte, attributs et événements sont liés
- Tu sais choisir `v-if` ou `v-show`
- Chaque `v-for` a une key stable
- `v-if` et `v-for` ne partagent pas le même nœud

## Sources

- [Syntaxe de template](https://vuejs.org/guide/essentials/template-syntax.html)
- [Rendu de listes](https://vuejs.org/guide/essentials/list.html)
- [Gestion des événements](https://vuejs.org/guide/essentials/event-handling.html)
