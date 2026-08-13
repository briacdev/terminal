---
title: "Performance et rendu Vue"
description: "Rendre Vue 3 moins cher : keys stables, v-once et v-memo avec mesure, composants lourds en lazy-load, et moins de watchers accidentels."
date: 2026-04-17
tags: ["vue", "performance", "rendu", "lazy-load"]
draft: false
readingTime: "9 min"
---

## Mesurer avant de mémoïser

Vue est assez rapide pour un back-office classique. On optimise quand une liste saccade ou qu'une route pèse, pas parce qu'un article a cité `v-memo`.

Onglet performance des Vue DevTools + profiler navigateur. Ensuite seulement les techniques ci-dessous, sur un hotspot **mesuré**.

## Keys = identité

```vue
<!-- Fragile si la liste se trie -->
<li v-for="(tache, index) in taches" :key="index">
```

```vue
<li v-for="tache in taches" :key="tache.id">
```

C'est d'abord de la correction. Ça évite aussi des patchs DOM inutiles.

## Trop de watch

Chaque `watch` est un abonnement. Un watcher qui écrit un `ref` qui le relance, c'est une boucle. Le dérivé va dans `computed`.

Évite `{ deep: true }` sur un gros arbre. Watch un champ, ou un computed qui extrait la tranche utile.

## Découper le bundle

```ts
import { defineAsyncComponent } from 'vue'

const PanneauGraphique = defineAsyncComponent(() => import('@/components/PanneauGraphique.vue'))
```

Pour graphiques, éditeur markdown, cartes. Pas pour un bouton de 20 lignes.

Avec Vue Router, `() => import('@/views/LivreVue.vue')` découpe déjà par page. C'est souvent le premier gain.

## v-once et v-memo

`v-once` fige un sous-arbre. Texte légal statique : oui. Valeur qui changera : non.

`v-memo` (Vue 3.2+) saute un re-rendu si une liste de deps n'a pas changé. Utile sur un `v-for` énorme. Facile de mémoïser les mauvaises deps et d'afficher de l'UI périmée. Profile d'abord.

## Gros objets en props

Un littéral d'objet recréé à chaque rendu (`:config="{ ...enorme }"` dans le template) coûte. Stabilise-le en script ou en `computed`.

`shallowRef` aide pour une instance tierce que Vue n'a pas à proxifier en profondeur.

## Checklist

- Les keys de liste sont des ids stables
- Les vues lourdes sont des imports de route async
- Peu de watchers, pas de deep par défaut
- `v-memo` seulement après un profil

## Sources

- [Mécanisme de rendu](https://vuejs.org/guide/extras/rendering-mechanism.html)
- [Composants async](https://vuejs.org/guide/components/async.html)
- [v-memo](https://vuejs.org/api/built-in-directives.html#v-memo)
