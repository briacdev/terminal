---
title: "Vue Router Essentials"
description: "Add Vue Router to a Vite app: nested routes, dynamic params, navigation guards, and route-aware UI with useRoute and useRouter."
date: 2026-04-11
tags: ["vue", "vue-router", "routing", "spa"]
draft: false
readingTime: "10 min"
---

## Client-side routes, not server folders

Vue Router maps URL paths to Vue components **in the browser**. Vite still serves one `index.html`. The router swaps views without a full reload.

This page stays on Vue Router 4. File-based routing is a Nuxt topic and is not duplicated here.

## Install and register

```bash
npm install vue-router@4
```

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/projects/:id',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
      props: true
    }
  ]
})
```

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

createApp(App).use(router).mount('#app')
```

`App.vue` needs a `<RouterView />` outlet. Navigation uses `<RouterLink to="/">`, not raw `<a>` for internal routes (so the SPA does not reload).

## Dynamic params

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <p>Project {{ route.params.id }}</p>
</template>
```

With `props: true` on the route, `:id` arrives as a prop instead of `route.params`. Prefer that when the view is a reusable component.

When the same component is reused for `/projects/1` and `/projects/2`, watch the param. `onMounted` will not run again.

```ts
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()

watch(
  () => route.params.id,
  (id) => {
    // reload project id
  },
  { immediate: true }
)
```

## Nested routes

```ts
{
  path: '/settings',
  component: SettingsLayout,
  children: [
    { path: 'profile', component: ProfileView },
    { path: 'billing', component: BillingView }
  ]
}
```

The parent template must include a nested `<RouterView />`. URLs become `/settings/profile`.

## Navigation guards

```ts
router.beforeEach((to) => {
  const isLoggedIn = Boolean(localStorage.getItem('token'))

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'home' }
  }
})
```

Return a route location to redirect. Return `false` to cancel. Do not mix `next()` (Vue Router 3 style) with the Vue Router 4 return API.

Guards are for auth and dirty-form warnings. They are not a place to fetch all application data.

## Route-aware UI

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const handleClose = () => {
  router.push({ name: 'home' })
}
</script>
```

`useRoute()` is the current location. `useRouter()` is the imperative API (`push`, `replace`, `back`).

## Checklist

- Router is registered in `main.ts`
- Internal links use `RouterLink`
- Param changes are watched when the view is reused
- Guards return a location or nothing, no Vue Router 3 `next`

## Official sources

- [Vue Router: Introduction](https://router.vuejs.org/introduction.html)
- [Dynamic route matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html)
- [Navigation guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
