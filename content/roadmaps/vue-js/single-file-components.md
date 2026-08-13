---
title: "Single-File Components"
description: "Understand Vue single-file components: script setup, template, and style blocks, how Vue compiles a .vue file, and how to keep one component per file."
date: 2026-04-03
tags: ["vue", "sfc", "components", "script-setup"]
draft: false
readingTime: "8 min"
---

## The .vue file contract

A **single-file component** (SFC) is one `.vue` file with three optional blocks:

- `<script setup>`: component logic
- `<template>`: markup
- `<style>`: CSS for that component

Vue's compiler turns that file into a render function plus a script module. You never ship the `.vue` source to the browser as-is.

This page is about the file format. Directives and reactivity are the following steps.

## A minimal SFC

```vue
<script setup lang="ts">
const title = 'Status board'
</script>

<template>
  <section>
    <h1>{{ title }}</h1>
  </section>
</template>

<style scoped>
h1 {
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
```

Bindings declared in `<script setup>` are automatically available in the template. You do not `return` them.

## script setup vs a classic setup() function

`<script setup>` is syntactic sugar on top of `setup()`. It is the default for Vue 3.4+ apps:

- less boilerplate
- better TypeScript inference
- top-level `await` is allowed in async setup (use carefully)

Use a second `<script>` block only for options that `<script setup>` cannot express, such as `inheritAttrs: false` via `defineOptions`.

## One component per file

Name the file after the component: `UserBadge.vue`, not `helpers.vue`. Import it where you need it:

```vue
<script setup lang="ts">
import UserBadge from '@/components/UserBadge.vue'
</script>

<template>
  <UserBadge />
</template>
```

In Vue 3, imported components are available in the template without registration.

## What the compiler does

At a high level:

1. Parse the three blocks
2. Compile the template into a render function
3. Scope CSS if `scoped` is set
4. Bundle the result with Vite

`scoped` adds a unique attribute to elements so styles do not leak. It is not a CSS-in-JS runtime.

## File naming and folder habits

- Use **PascalCase** for component files: `SearchField.vue`
- Keep presentational components in `src/components`
- Keep page-level views in `src/views` once routing exists
- Avoid a 400-line SFC; split when template, script, and style stop fitting on one screen

## Mistakes that break SFCs

- Putting two root components in one file
- Using Options API `data()` inside `<script setup>`
- Forgetting `lang="ts"` in a TypeScript project
- Expecting `scoped` styles to style child component internals (they do not, unless you use `:deep()`)

## Checklist

- You can create a `.vue` file with script, template, and optional style
- You know `<script setup>` exposes bindings automatically
- You import components instead of registering them globally
- You keep one public component per file

## Official sources

- [SFC syntax](https://vuejs.org/api/sfc-spec.html)
- [script setup](https://vuejs.org/api/sfc-script-setup.html)
- [SFC CSS features](https://vuejs.org/api/sfc-css-features.html)
