---
title: "What Vue.js Is"
description: "Learn what Vue.js actually is: a progressive UI framework, how Vue 3 fits the ecosystem, and when a SPA is the right starting point versus Nuxt."
date: 2026-04-01
tags: ["vue", "vue3", "fundamentals", "frontend"]
draft: false
readingTime: "8 min"
---

## Why start here

Vue.js is a **progressive JavaScript framework** for building user interfaces. Progressive means you can drop it into one page, or grow it into a full single-page app with a router and stores. You do not need the whole ecosystem on day one.

This page only answers three questions: what Vue is, when it is a good fit, and which tools belong in a Vue 3 project. Setup, templates, and reactivity come in the next steps.

## Vue 3 in one mental model

Vue keeps three jobs separate:

- **Template**: declare what the UI looks like from state
- **State**: hold data that can change
- **Reactivity**: update the DOM when that data changes

You describe the UI. Vue tracks dependencies and patches the DOM. You rarely write `document.querySelector` yourself.

Vue 3 is the current line. This roadmap uses the **Composition API** and `<script setup>` everywhere. The Options API still works, but new Vue 3 code should not start there.

## When Vue is a good fit

Choose Vue when:

- you want a readable component model with templates
- you are building an interactive dashboard, admin UI, or product SPA
- the team prefers explicit files over a heavy compiler-first stack
- you may later add Vue Router and Pinia without rewriting the app

Choose something else when:

- the site is mostly content and SEO is the product (start with the [Nuxt roadmap](/nuxt) instead)
- you already have a large React codebase and no Vue constraint
- you only need a few static pages with almost no client state

Vue is not "React but smaller". It is a different reactivity model and a different default for templates.

## The ecosystem you will actually use

Keep the first toolbox small:

| Tool | Role |
| --- | --- |
| **Vue 3** | UI and reactivity |
| **Vite** | Dev server and production bundler |
| **Vue Router** | Client-side routes |
| **Pinia** | Shared app state, when local state is not enough |
| **Vitest** | Unit and component tests |

Nuxt wraps Vue with file-based routing, SSR, and server routes. This Vue roadmap stays on **client-side Vue + Vite**. If you need SSR, finish this path first, then switch to Nuxt. Teaching Nuxt here would duplicate that track.

## A tiny Vue app, without a build step

This snippet is only for intuition. Real projects use Vite.

```html
<div id="app">{{ message }}</div>
<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Hello Vue 3')
      return { message }
    }
  }).mount('#app')
</script>
```

`createApp` builds an application instance. `mount` attaches it to a DOM node. `ref` is a reactive value. The next pages replace this CDN demo with a Vite project and single-file components.

## Mistakes that waste the first week

- Mixing Options API and Composition API in the same new project
- Installing Pinia and Vue Router before you can write a component
- Treating Vue as a jQuery replacement and mutating the DOM by hand
- Skipping official docs and copying outdated Vue 2 `filters` / `$set` snippets

## Checklist before the next step

- You can explain Vue as a UI layer, not a backend
- You know this roadmap uses Vue 3 + Composition API
- You will not study Nuxt until the Vue SPA path is done
- You are ready to scaffold a Vite app

## Official sources

- [Vue.js guide: Introduction](https://vuejs.org/guide/introduction.html)
- [Vue.js: Why Vue](https://vuejs.org/guide/extras/ways-of-using-vue.html)
- [Vue 3 Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq.html)
