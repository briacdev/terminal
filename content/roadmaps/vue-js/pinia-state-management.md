---
title: "Pinia State Management"
description: "Use Pinia for shared Vue state: setup stores, getters, actions, and a clear rule for when a ref in the component is enough."
date: 2026-04-12
tags: ["vue", "pinia", "state", "stores"]
draft: false
readingTime: "9 min"
---

## Local state first

If only one component needs a value, keep a `ref`. If a parent and a child need it, use props and events. **Pinia** is for state that many distant views must share: the current user, a cart, a UI theme, an auth token.

Installing Pinia on day one usually means the store becomes a junk drawer.

## Install and register

```bash
npm install pinia
```

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
```

Register Pinia **before** you use stores in components.

## Setup store (recommended)

```ts
// src/stores/useAuthStore.ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => Boolean(token.value))

  const handleLogin = (nextToken: string) => {
    token.value = nextToken
  }

  const handleLogout = () => {
    token.value = null
  }

  return { token, isAuthenticated, handleLogin, handleLogout }
})
```

This is the same Composition API you already know. Option stores (`state` / `getters` / `actions` objects) work; setup stores stay consistent with `<script setup>`.

## Using a store in a component

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
</script>

<template>
  <p v-if="isAuthenticated">Signed in</p>
  <button type="button" @click="authStore.handleLogout">Log out</button>
</template>
```

Destructure state with `storeToRefs` or you lose reactivity. Keep actions on the store object (`authStore.handleLogout`). Do not wrap actions in `storeToRefs`.

## What not to put in Pinia

- Form drafts that never leave one page
- Derived lists that a `computed` in the view can own
- Direct DOM nodes or Vue component instances
- A copy of every server entity "just in case"

Fetch results can live in a store if two routes need the same cache. Otherwise a composable that fetches on mount is simpler.

## DevTools

Vue DevTools shows Pinia stores. Use that timeline when a value changes and you cannot see who wrote it.

## Checklist

- Pinia is registered once in `main.ts`
- Stores are setup functions with explicit ids
- Shared cross-route state only
- State destructuring goes through `storeToRefs`

## Official sources

- [Pinia introduction](https://pinia.vuejs.org/introduction.html)
- [Defining a store](https://pinia.vuejs.org/core-concepts/)
- [storeToRefs](https://pinia.vuejs.org/core-concepts/#using-the-store)
