---
title: "Composables"
description: "Extract reusable Vue logic into composables named with use, keep UI out of business rules, and avoid turning every function into a fake composable."
date: 2026-04-09
tags: ["vue", "composables", "composition-api", "architecture"]
draft: false
readingTime: "9 min"
---

## Logic that is not a component

A **composable** is a function that uses Vue's Composition API (`ref`, `computed`, `watch`, lifecycle) and returns reactive state plus functions. Components stay thin. Rules live in `src/composables`.

Name them `useSomething`. That is the Vue convention, not a compiler requirement.

## A small, real composable

```ts
// src/composables/useToggle.ts
import { ref } from 'vue'

export const useToggle = (initialValue = false) => {
  const isOn = ref(initialValue)

  const handleOn = () => {
    isOn.value = true
  }

  const handleOff = () => {
    isOn.value = false
  }

  const handleToggle = () => {
    isOn.value = !isOn.value
  }

  return { isOn, handleOn, handleOff, handleToggle }
}
```

Usage:

```vue
<script setup lang="ts">
import { useToggle } from '@/composables/useToggle'

const { isOn, handleToggle } = useToggle()
</script>
```

Each component that calls `useToggle()` gets **its own** `isOn`. That is the point. Shared app-wide state belongs in Pinia, not in a module-level `ref` hidden inside a composable, unless you document that singleton on purpose.

## What belongs in a composable

Good:

- wrapping `matchMedia` / `window` listeners with cleanup
- a local pagination helper
- formatting + derived flags used by two views

Bad:

- a function that never touches Vue APIs (keep it as a plain `utils/` helper)
- fetching plus caching plus toast plus router in one 400-line `useApp`
- secretly sharing a `ref` across the whole app without calling it a store

## Lifecycle and cleanup

If you add a listener, remove it:

```ts
import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useWindowWidth = () => {
  const width = ref(0)

  const handleResize = () => {
    width.value = window.innerWidth
  }

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })

  return { width }
}
```

Calling this composable **outside** `setup` will break hooks. Only call composables synchronously in `<script setup>` or in another composable.

## Checklist

- File name starts with `use`
- Returns refs and `handle*` functions, not a component
- State is per-call unless you intentionally share it
- Listeners are cleaned up
- Plain functions stay in `utils/`

## Official sources

- [Composables](https://vuejs.org/guide/reusability/composables.html)
- [Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq.html)
