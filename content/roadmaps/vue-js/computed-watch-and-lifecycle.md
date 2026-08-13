---
title: "Computed, Watch, and Lifecycle"
description: "Use Vue computed properties for derived state, watch and watchEffect for side effects, and lifecycle hooks such as onMounted without overusing them."
date: 2026-04-06
tags: ["vue", "computed", "watch", "lifecycle"]
draft: false
readingTime: "10 min"
---

## Three different jobs

After `ref` and `reactive`, you still need three tools:

- **computed**: derive a value from other state
- **watch / watchEffect**: run a side effect when state changes
- **lifecycle hooks**: run code when the component is mounted, updated, or unmounted

Do not use a watcher to compute a value you could `computed`. Do not use `onMounted` to sync props into local state if a computed would do.

## computed: cached derived state

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const items = ref([
  { id: 1, done: true, label: 'Write tests' },
  { id: 2, done: false, label: 'Review PR' }
])

const remainingCount = computed(() => items.value.filter((item) => !item.done).length)
</script>

<template>
  <p>{{ remainingCount }} open</p>
</template>
```

`computed` is lazy and cached. It re-evaluates only when its dependencies change. Use it for filtered lists, formatted labels, and disabled-button rules.

Writable computeds exist. Skip them until you have a real two-way derived field. Most beginners do not need them.

## watch: explicit source, explicit effect

Use `watch` when you know the source and the effect is a side effect: fetch, write to `localStorage`, sync a third-party widget.

```ts
import { ref, watch } from 'vue'

const query = ref('')

watch(query, async (nextQuery, previousQuery) => {
  if (nextQuery === previousQuery) {
    return
  }

  // fetch suggestions for nextQuery
})
```

Useful options:

- `{ immediate: true }` to run once on setup
- `{ deep: true }` for nested object changes (prefer watching a `computed` or a specific ref instead)
- `{ flush: 'post' }` if you need the DOM after the update

## watchEffect: auto-tracked effect

`watchEffect` runs immediately and tracks whatever it reads:

```ts
import { watchEffect } from 'vue'

watchEffect(() => {
  document.title = `${remainingCount.value} open tasks`
})
```

It is convenient and easy to over-use. Prefer `watch` when the source should be obvious in code review.

## Lifecycle hooks you actually need

| Hook | When |
| --- | --- |
| `onMounted` | DOM is ready: measure, focus, start a subscription |
| `onBeforeUnmount` | Cancel timers, abort fetches, detach listeners |
| `onUpdated` | Rare; prefer a watcher on the data that changed |

```ts
import { onBeforeUnmount, onMounted } from 'vue'

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
```

There is no `onCreated` in `<script setup>`: the setup function **is** created.

## Anti-patterns

- `watch(x, () => { y.value = x.value * 2 })` instead of `computed`
- Fetching in `watchEffect` without an abort controller
- Using `onUpdated` to "fix" the DOM after every render
- Creating a watcher per list item instead of one watcher on the list

## Checklist

- Derived values go through `computed`
- Side effects go through `watch` with a clear source
- DOM work runs in `onMounted` and is cleaned up
- You can explain why `watchEffect` ran

## Official sources

- [Computed properties](https://vuejs.org/guide/essentials/computed.html)
- [Watchers](https://vuejs.org/guide/essentials/watchers.html)
- [Lifecycle hooks](https://vuejs.org/guide/essentials/lifecycle.html)
