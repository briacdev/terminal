---
title: "Vue Performance and Rendering"
description: "Keep Vue 3 rendering cheap: stable list keys, v-once and v-memo when they help, lazy-loaded heavy components, and fewer accidental watchers."
date: 2026-04-17
tags: ["vue", "performance", "rendering", "lazy-load"]
draft: false
readingTime: "9 min"
---

## Measure before you memoize

Vue is fast enough for typical admin UIs. Performance work starts when a list stutters or a route feels heavy, not when you copy `v-memo` from a blog.

Use Vue DevTools' performance tab and the browser profiler. Then apply the techniques below to a **measured** hotspot.

## Keys that match identity

Wrong keys reuse the wrong DOM node:

```vue
<!-- Fragile if the list sorts -->
<li v-for="(task, index) in tasks" :key="index">
```

Right keys follow the record:

```vue
<li v-for="task in tasks" :key="task.id">
```

This is a correctness issue first. It also avoids extra patch work.

## Do not over-watch

Each `watch` is a subscription. A watcher that writes another `ref` that triggers the same watcher is a loop. Derived data belongs in `computed`.

Avoid `watch` with `{ deep: true }` on a large reactive tree. Watch a specific field or a computed that returns the slice you care about.

## Split the bundle with defineAsyncComponent

```ts
import { defineAsyncComponent } from 'vue'

const ChartPanel = defineAsyncComponent(() => import('@/components/ChartPanel.vue'))
```

Use this for charts, markdown editors, and maps. Do not lazy-load a 20-line button.

With Vue Router, route-level `() => import('@/views/ProjectView.vue')` already splits by page. That is usually the first win.

## v-once and v-memo

`v-once` renders a subtree once. Use it for static legal text, not for values that will change.

`v-memo` (Vue 3.2+) skips re-render of a node if a dependency list is unchanged. It is useful in huge `v-for` lists. It is easy to memo the wrong dependencies and show stale UI. Profile first.

## Props and large objects

Passing a new object literal every render (`:style="{ margin: 0 }"` is fine; `:config="{ ...huge }"` inside the template is not). Create stable objects in script or `computed`.

`shallowRef` helps when you store a large third-party instance you do not need Vue to deep-proxy.

## Checklist

- List keys are stable ids
- Heavy views are async route components
- Watchers are few and not deep-by-default
- You profiled before adding `v-memo`

## Official sources

- [Vue: Rendering mechanism](https://vuejs.org/guide/extras/rendering-mechanism.html)
- [Async components](https://vuejs.org/guide/components/async.html)
- [v-memo](https://vuejs.org/api/built-in-directives.html#v-memo)
