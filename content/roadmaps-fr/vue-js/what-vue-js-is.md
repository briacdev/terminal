---
title: "Comprendre Vue.js"
description: "Vue.js expliqué sans jargon inutile : framework progressif, rôle de Vue 3, écosystème Vite / Router / Pinia, et cas où une SPA Vue suffit avant d'ouvrir Nuxt."
date: 2026-04-01
tags: ["vue", "vue3", "fondations", "frontend"]
draft: false
readingTime: "8 min"
---

## À quoi sert cette première page

Vue.js est un **framework JavaScript progressif** pour construire des interfaces. Progressif veut dire : tu peux l'embarquer sur une page existante, ou construire une application complète avec routeur et stores. Tu n'as pas besoin de tout l'écosystème dès le premier commit.

Ici, on ne configure rien. On fixe seulement le modèle mental, les bons cas d'usage, et la frontière avec Nuxt.

## Le modèle mental Vue 3

Vue sépare trois responsabilités :

- le **template** décrit l'UI à partir de l'état
- l'**état** contient les données qui changent
- la **réactivité** met à jour le DOM quand ces données changent

Tu déclares. Vue suit les dépendances et patche le DOM. Tu n'écris presque jamais `document.querySelector`.

Cette roadmap utilise uniquement la **Composition API** et `<script setup>`. L'Options API existe encore, mais un projet Vue 3 neuf n'a aucune raison de commencer avec `data()` et `methods`.

## Quand Vue est un bon choix

Vue convient bien si :

- tu veux des templates lisibles plutôt qu'un JSX obligatoire
- tu construis un back-office, un tableau de bord, un outil interne
- tu veux ajouter Vue Router et Pinia plus tard sans tout réécrire

Passe ton chemin si :

- le site est surtout du contenu et le SEO est le produit (va plutôt vers la [roadmap Nuxt](/fr/nuxt))
- l'équipe a déjà une grosse base React sans contrainte Vue
- tu as trois pages statiques et presque pas d'état client

Vue n'est pas « React en plus léger ». C'est un autre modèle de réactivité et un autre défaut (les templates).

## La boîte à outils de cette roadmap

| Outil | Rôle |
| --- | --- |
| **Vue 3** | UI et réactivité |
| **Vite** | Serveur de dev et bundle de prod |
| **Vue Router** | Routes côté client |
| **Pinia** | État partagé, seulement quand l'état local ne suffit plus |
| **Vitest** | Tests unitaires et de composants |

Nuxt enveloppe Vue avec du routing fichier, du SSR et des routes serveur. Ici, on reste sur **Vue client + Vite**. Si tu as besoin de HTML rendu serveur, tu termines ce parcours puis tu changes de roadmap. Recopier Nuxt dans ces pages créerait du contenu en double.

## Un exemple minuscule, sans Vite

C'est uniquement pour voir `createApp` et `ref`. Le vrai projet arrive à l'étape suivante.

```html
<div id="app">{{ message }}</div>
<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Bonjour Vue 3')
      return { message }
    }
  }).mount('#app')
</script>
```

`createApp` crée l'instance. `mount` la rattache à un nœud DOM.

## Erreurs de première semaine

- Mélanger Options API et Composition API dans un projet neuf
- Installer Pinia et le routeur avant de savoir écrire un composant
- Traiter Vue comme du jQuery et modifier le DOM à la main
- Copier des extraits Vue 2 (`filters`, `$set`) depuis un vieux tutoriel

## Checklist

- Vue est une couche UI, pas un backend
- Le parcours est Vue 3 + Composition API
- Nuxt attend la fin de la SPA
- Prochaine étape : scaffolder Vite

## Sources

- [Guide Vue : introduction](https://vuejs.org/guide/introduction.html)
- [Les façons d'utiliser Vue](https://vuejs.org/guide/extras/ways-of-using-vue.html)
- [FAQ Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
