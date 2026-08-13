---
title: "Composants Single-File"
description: "Le contrat d'un fichier .vue : blocs script setup, template et style, compilation SFC, et règle d'un composant public par fichier."
date: 2026-04-03
tags: ["vue", "sfc", "composants", "script-setup"]
draft: false
readingTime: "8 min"
---

## Un fichier, trois blocs

Un **single-file component** (SFC) est un fichier `.vue` avec trois blocs optionnels :

- `<script setup>` : la logique
- `<template>` : le markup
- `<style>` : le CSS du composant

Le compilateur Vue transforme ça en fonction de rendu + module script. Le navigateur ne reçoit jamais le `.vue` brut.

Cette page décrit le format de fichier. Les directives et la réactivité viennent après.

## Un SFC minimal

```vue
<script setup lang="ts">
const titre = 'Tableau de présence'
</script>

<template>
  <section>
    <h1>{{ titre }}</h1>
  </section>
</template>

<style scoped>
h1 {
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
```

Les bindings déclarés dans `<script setup>` sont visibles dans le template. Pas de `return`.

## Pourquoi script setup

`<script setup>` est le sucre officiel au-dessus de `setup()`. C'est le défaut raisonnable en Vue 3.4+ :

- moins de boilerplate
- meilleur inférence TypeScript
- `await` de premier niveau possible (à utiliser avec prudence)

Un second bloc `<script>` ne sert que pour des options que `<script setup>` n'exprime pas, par exemple `defineOptions({ inheritAttrs: false })`.

## Un composant par fichier

Le nom du fichier = le nom du composant : `BadgeUtilisateur.vue`, pas `helpers.vue`.

```vue
<script setup lang="ts">
import BadgeUtilisateur from '@/components/BadgeUtilisateur.vue'
</script>

<template>
  <BadgeUtilisateur />
</template>
```

En Vue 3, un import suffit. Plus de `components: { ... }` pour le cas normal.

## Ce que fait le compilateur

1. Il parse les trois blocs
2. Il compile le template en fonction de rendu
3. Il scope le CSS si `scoped` est présent
4. Vite bundle le résultat

`scoped` pose un attribut unique sur les éléments du template. Ce n'est pas un runtime CSS-in-JS.

## Conventions de dossiers

- Fichiers en **PascalCase** : `ChampRecherche.vue`
- UI réutilisable dans `src/components`
- Vues de pages dans `src/views` dès qu'il y a un routeur
- Un SFC de 400 lignes est un signal de découpe

## Pièges

- Deux composants publics dans un seul fichier
- `data()` d'Options API dans `<script setup>`
- Oublier `lang="ts"` dans un projet TypeScript
- Croire que le CSS `scoped` style l'intérieur d'un enfant (il le fait seulement avec `:deep()`)

## Checklist

- Tu sais écrire un `.vue` avec script, template, style
- `<script setup>` expose les bindings tout seul
- Les composants s'importent, ils ne s'enregistrent plus en global
- Un fichier = un composant public

## Sources

- [Spécification SFC](https://vuejs.org/api/sfc-spec.html)
- [script setup](https://vuejs.org/api/sfc-script-setup.html)
- [CSS des SFC](https://vuejs.org/api/sfc-css-features.html)
