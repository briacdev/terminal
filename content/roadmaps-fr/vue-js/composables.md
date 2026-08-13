---
title: "Les composables Vue"
description: "Sortir la logique Vue réutilisable dans des fonctions use*, séparer UI et règles métier, et ne pas transformer chaque utilitaire en faux composable."
date: 2026-04-09
tags: ["vue", "composables", "composition-api", "architecture"]
draft: false
readingTime: "9 min"
---

## De la logique qui n'est pas un composant

Un **composable** est une fonction qui s'appuie sur l'API de composition (`ref`, `computed`, `watch`, cycle de vie) et renvoie de l'état réactif plus des fonctions. Les composants restent minces. Les règles vivent dans `src/composables`.

Le préfixe `use` est une convention Vue, pas une obligation du compilateur.

## Un vrai petit composable

```ts
// src/composables/useBasculer.ts
import { ref } from 'vue'

export const useBasculer = (valeurInitiale = false) => {
  const estActif = ref(valeurInitiale)

  const handleActiver = () => {
    estActif.value = true
  }

  const handleDesactiver = () => {
    estActif.value = false
  }

  const handleBasculer = () => {
    estActif.value = !estActif.value
  }

  return { estActif, handleActiver, handleDesactiver, handleBasculer }
}
```

Chaque appel à `useBasculer()` a **son** `estActif`. C'est voulu. Un état partagé entre toutes les vues, c'est Pinia, pas un `ref` module caché dans un composable — sauf si tu documentes clairement un singleton.

## Ce qui a sa place ici

Oui :

- encapsuler `matchMedia` / listeners `window` avec nettoyage
- un helper de pagination locale
- des flags dérivés utilisés par deux vues

Non :

- une fonction qui ne touche aucune API Vue (ça va dans `utils/`)
- fetch + cache + toast + routeur dans un `useApp` de 400 lignes
- partager un `ref` en secret pour toute l'app

## Cycle de vie et nettoyage

```ts
import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useLargeurFenetre = () => {
  const largeur = ref(0)

  const handleRedimension = () => {
    largeur.value = window.innerWidth
  }

  onMounted(() => {
    handleRedimension()
    window.addEventListener('resize', handleRedimension)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleRedimension)
  })

  return { largeur }
}
```

Un composable avec hooks ne s'appelle **que** de façon synchrone dans `<script setup>` ou dans un autre composable. Pas dans un `setTimeout`, pas hors de `setup`.

## Checklist

- Le fichier commence par `use`
- Ça renvoie des refs et des `handle*`, pas un composant
- L'état est par appel, sauf partage volontaire
- Les listeners se démontent
- Le code sans Vue reste dans `utils/`

## Sources

- [Composables](https://vuejs.org/guide/reusability/composables.html)
- [FAQ Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
