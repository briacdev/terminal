---
title: "Essentiels de Vue Router"
description: "Ajouter Vue Router à une app Vite : routes imbriquées, params dynamiques, guards, et UI liée à la route avec useRoute et useRouter."
date: 2026-04-11
tags: ["vue", "vue-router", "routing", "spa"]
draft: false
readingTime: "10 min"
---

## Des routes client, pas des dossiers serveur

Vue Router associe des chemins d'URL à des composants **dans le navigateur**. Vite sert toujours un seul `index.html`. Le routeur échange les vues sans rechargement complet.

Le routing par fichiers, c'est Nuxt. On ne le recopie pas ici.

## Installer et brancher

```bash
npm install vue-router@4
```

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import AccueilVue from '@/views/AccueilVue.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'accueil', component: AccueilVue },
    {
      path: '/livres/:id',
      name: 'livre',
      component: () => import('@/views/LivreVue.vue'),
      props: true
    }
  ]
})
```

```ts
createApp(App).use(router).mount('#app')
```

`App.vue` contient `<RouterView />`. La navigation interne passe par `<RouterLink>`, pas par un `<a>` brut (sinon la SPA se recharge).

## Params dynamiques

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <p>Livre {{ route.params.id }}</p>
</template>
```

Avec `props: true`, `:id` arrive en prop. Plus clair si la vue est réutilisable.

Si le même composant sert `/livres/1` puis `/livres/2`, `onMounted` ne se relance pas. Watch le param :

```ts
watch(
  () => route.params.id,
  (id) => {
    // recharger le livre
  },
  { immediate: true }
)
```

## Routes imbriquées

```ts
{
  path: '/compte',
  component: CompteLayout,
  children: [
    { path: 'profil', component: ProfilVue },
    { path: 'factures', component: FacturesVue }
  ]
}
```

Le parent a son propre `<RouterView />`. Les URLs deviennent `/compte/profil`.

## Guards

```ts
router.beforeEach((to) => {
  const estConnecte = Boolean(localStorage.getItem('jeton'))

  if (to.meta.requiresAuth && !estConnecte) {
    return { name: 'accueil' }
  }
})
```

Retourner une location = redirection. `false` = annuler. N'utilise plus le `next()` de Vue Router 3.

Les guards servent à l'auth et aux formulaires sales. Ce n'est pas l'endroit pour charger toutes les données de l'app.

## UI consciente de la route

`useRoute()` = location courante. `useRouter()` = `push`, `replace`, `back`.

## Checklist

- Le routeur est enregistré dans `main.ts`
- Les liens internes sont des `RouterLink`
- Un changement de param rewatch la vue réutilisée
- Les guards retournent une location, pas `next()`

## Sources

- [Introduction Vue Router](https://router.vuejs.org/introduction.html)
- [Correspondance dynamique](https://router.vuejs.org/guide/essentials/dynamic-matching.html)
- [Guards de navigation](https://router.vuejs.org/guide/advanced/navigation-guards.html)
