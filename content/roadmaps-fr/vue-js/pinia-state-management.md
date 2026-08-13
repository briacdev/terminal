---
title: "Gestion d'état avec Pinia"
description: "Partager l'état Vue avec Pinia : stores en setup, getters, actions, et règle claire pour rester sur un ref local quand ça suffit."
date: 2026-04-12
tags: ["vue", "pinia", "etat", "stores"]
draft: false
readingTime: "9 min"
---

## L'état local d'abord

Une valeur pour un seul composant = `ref`. Parent + enfant = props et événements. **Pinia** sert l'état que plusieurs vues éloignées doivent partager : utilisateur courant, panier, thème, jeton.

Installer Pinia le premier jour transforme souvent le store en tiroir fourre-tout.

## Installer

```bash
npm install pinia
```

```ts
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).use(router).mount('#app')
```

Pinia **avant** toute utilisation de store dans un composant.

## Store en setup (recommandé)

```ts
// src/stores/useAuthStore.ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const jeton = ref<string | null>(null)
  const estAuthentifie = computed(() => Boolean(jeton.value))

  const handleConnexion = (suivant: string) => {
    jeton.value = suivant
  }

  const handleDeconnexion = () => {
    jeton.value = null
  }

  return { jeton, estAuthentifie, handleConnexion, handleDeconnexion }
})
```

C'est la Composition API déjà connue. Les option stores marchent ; les setup stores restent alignés avec `<script setup>`.

## Dans un composant

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const { estAuthentifie } = storeToRefs(authStore)
</script>

<template>
  <p v-if="estAuthentifie">Connecté</p>
  <button type="button" @click="authStore.handleDeconnexion">Déconnexion</button>
</template>
```

Destructurer l'état avec `storeToRefs`, sinon tu perds la réactivité. Les actions restent sur l'objet store.

## Ce qui n'a rien à faire dans Pinia

- Brouillon de formulaire d'une seule page
- Liste dérivée qu'un `computed` de vue peut porter
- Nœuds DOM ou instances de composants
- Une copie de toutes les entités serveur « au cas où »

Un résultat de fetch peut vivre dans un store si deux routes partagent le cache. Sinon un composable qui fetch au montage est plus simple.

## Checklist

- Pinia enregistré une fois dans `main.ts`
- Stores setup avec un id explicite
- Uniquement de l'état transversal
- `storeToRefs` pour l'état, pas pour les actions

## Sources

- [Introduction Pinia](https://pinia.vuejs.org/introduction.html)
- [Définir un store](https://pinia.vuejs.org/core-concepts/)
- [storeToRefs](https://pinia.vuejs.org/core-concepts/#using-the-store)
