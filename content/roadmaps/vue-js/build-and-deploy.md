---
title: "Build and Deploy a Vue App"
description: "Ship a Vue 3 Vite SPA: production builds, environment variables, static hosting, and a clear rule for when to leave Vue+Vite and continue on the Nuxt roadmap."
date: 2026-04-18
tags: ["vue", "vite", "deploy", "production"]
draft: false
readingTime: "9 min"
---

## What "production" means for a Vite Vue app

`npm run build` writes static files to `dist/`: HTML, hashed JS, hashed CSS, assets. Any static host can serve them. There is no Node server in this architecture unless you add one yourself.

If you need server-rendered HTML, i18n routes with SSR, or a content pipeline, that is **Nuxt**, not a bigger Vite config. This page stops at the SPA. The [Nuxt roadmap](/nuxt) starts where SSR begins.

## Build and preview locally

```bash
npm run build
npm run preview
```

`preview` serves `dist/` so you catch missing assets and wrong public paths before deploy. If images 404, you likely used a path that works only in `dev`.

## Environment variables

Vite only exposes variables prefixed with `VITE_` to client code:

```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
```

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
```

Never put a private API secret in `VITE_*`. Anything in the client bundle is public. Secrets stay on a backend.

Use `.env`, `.env.local`, `.env.production`. Commit `.env.example`, not `.env.local`.

## Public base path

If the app is hosted at `https://example.com/app/`, set:

```ts
// vite.config.ts
export default defineConfig({
  base: '/app/'
})
```

Router history must use the same base: `createWebHistory('/app/')`. A mismatch produces blank pages on refresh.

## Static hosting checklist

| Host type | Notes |
| --- | --- |
| Netlify / Cloudflare Pages / GitHub Pages | SPA fallback: all routes rewrite to `index.html` |
| nginx | `try_files $uri $uri/ /index.html;` |
| S3 + CDN | Error document = `index.html` |

Without that fallback, `/projects/12` returns 404 on refresh because the server looks for a real file.

## Observability at SPA scale

At minimum:

- log failed fetches with the URL and status
- add a window `error` / `unhandledrejection` listener, or a small SDK (Sentry, etc.)
- keep source maps private on the error tracker, not world-readable on the CDN unless you accept that trade-off

You do not need a metrics stack to ship the first version.

## When to move to Nuxt

Leave this Vue SPA path when you need:

- first-paint HTML for marketing or docs SEO
- `useAsyncData` / `useFetch` on the server
- file-based routes and server API routes in one repo

Do not copy Nuxt patterns into Vite to fake SSR. Switch the framework.

## Checklist

- `build` + `preview` succeed
- Only public values use `VITE_`
- Host rewrites unknown paths to `index.html`
- Router `base` matches Vite `base`
- SSR needs are deferred to the Nuxt roadmap

## Official sources

- [Vite: Building for production](https://vite.dev/guide/static-deploy.html)
- [Vite: Env variables](https://vite.dev/guide/env-and-mode.html)
- [Vue Router: HTML5 history mode](https://router.vuejs.org/guide/essentials/history-mode.html)
