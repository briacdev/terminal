---
title: "Vite Setup and Project Structure"
description: "Scaffold a Vue 3 app with Vite, install Node.js tooling, and learn what each generated file is for before you write components."
date: 2026-04-02
tags: ["vue", "vite", "setup", "tooling"]
draft: false
readingTime: "9 min"
---

## Why the scaffold matters

A Vue 3 app is almost always a **Vite** project. Vite starts fast, uses native ESM in development, and rolls a production bundle with Rollup. If the folder layout is unclear, every later step feels like magic.

This page is only about tooling and files. Single-file components are the next lesson.

## Prerequisites

Install a current **Node.js LTS** (20 or 22). Then pick one package manager and keep it:

```bash
node -v
npm -v
```

Use `npm`, `pnpm`, or `bun`. Do not mix lockfiles in the same repo.

## Create the app

The official Vue scaffold:

```bash
npm create vue@latest
```

Recommended answers for this roadmap:

- TypeScript: **Yes**
- JSX: No
- Vue Router: No (you add it later on purpose)
- Pinia: No
- Vitest: Yes if you want tests early, otherwise add it later
- ESLint: Yes
- Vue DevTools: optional

Then:

```bash
cd <project-name>
npm install
npm run dev
```

Open the printed local URL. You should see the Vite + Vue starter page.

## What each generated file is for

A typical tree:

```text
src/
  assets/
  components/
  App.vue
  main.ts
index.html
vite.config.ts
package.json
tsconfig.json
```

- `index.html` is the real HTML entry. Vite injects the script from here.
- `src/main.ts` creates the app and mounts it on `#app`.
- `src/App.vue` is the root component.
- `vite.config.ts` holds aliases, plugins, and the Vue plugin.
- `src/components/` is where reusable UI files go.

Entry file:

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

That is the whole boot sequence until you add a router.

## Scripts you will run daily

| Command | Job |
| --- | --- |
| `npm run dev` | Hot-reload development server |
| `npm run build` | Production bundle in `dist/` |
| `npm run preview` | Serve `dist/` locally |

If `dev` fails, check the Node version first, then delete `node_modules` and reinstall with the same lockfile.

## Path aliases

Vite + Vue usually maps `@` to `src`. Prefer:

```ts
import HelloWorld from '@/components/HelloWorld.vue'
```

over long relative paths. Confirm the alias in both `vite.config.ts` and `tsconfig.json` so TypeScript and Vite agree.

## Keep the first install small

Do not add UI kits, state libraries, or CSS frameworks in this step. A clean Vite app is easier to debug. You will add Router, Pinia, and Tailwind only when those pages in the roadmap need them.

## Checklist

- Node LTS is installed and on your PATH
- `npm run dev` serves the starter without errors
- You can point to `main.ts`, `App.vue`, and `index.html`
- TypeScript and the `@` alias both work

## Official sources

- [Create a Vue app](https://vuejs.org/guide/quick-start.html)
- [Vite: Getting started](https://vite.dev/guide/)
- [Vite: Vue plugin](https://vite.dev/guide/features.html#vue)
