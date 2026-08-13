---
title: "Build et déploiement d'une app Vue"
description: "Livrer une SPA Vue 3 Vite : build de production, variables d'environnement, hébergement statique, et critère clair pour basculer vers la roadmap Nuxt."
date: 2026-04-18
tags: ["vue", "vite", "deploiement", "production"]
draft: false
readingTime: "9 min"
---

## Ce que « production » veut dire ici

`npm run build` écrit des fichiers statiques dans `dist/` : HTML, JS hashé, CSS hashé, assets. N'importe quel hôte statique peut les servir. Il n'y a pas de serveur Node dans cette architecture, sauf si tu en ajoutes un.

Si tu as besoin de HTML rendu serveur, de routes i18n SSR, ou d'un pipeline de contenu, c'est **Nuxt**, pas un `vite.config` plus gros. Cette page s'arrête à la SPA. La [roadmap Nuxt](/fr/nuxt) commence là où le SSR commence.

## Build et preview en local

```bash
npm run build
npm run preview
```

`preview` sert `dist/` : tu vois les assets manquants et les mauvais chemins publics avant le déploiement. Une image en 404 marche souvent en `dev` et casse en `build`.

## Variables d'environnement

Vite n'expose au client que les variables préfixées `VITE_` :

```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
```

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
```

Aucun secret privé dans `VITE_*`. Tout ce qui est dans le bundle client est public. Les secrets restent côté backend.

`.env`, `.env.local`, `.env.production`. On commit `.env.example`, pas `.env.local`.

## Base path public

Si l'app est à `https://example.com/app/` :

```ts
export default defineConfig({
  base: '/app/'
})
```

L'historique du routeur doit utiliser la même base : `createWebHistory('/app/')`. Un décalage donne des pages blanches au refresh.

## Hébergement statique

| Type | Point d'attention |
| --- | --- |
| Netlify / Cloudflare Pages / GitHub Pages | Fallback SPA : toutes les routes → `index.html` |
| nginx | `try_files $uri $uri/ /index.html;` |
| S3 + CDN | Document d'erreur = `index.html` |

Sans ce fallback, `/livres/12` fait 404 au rafraîchissement : le serveur cherche un vrai fichier.

## Observabilité à l'échelle SPA

Au minimum :

- logger les fetch en échec (URL + statut)
- écouter `error` / `unhandledrejection`, ou un SDK (Sentry, etc.)
- garder les source maps privées sur l'outil d'erreurs, pas en public sur le CDN sauf si tu acceptes le trade-off

Pas besoin d'une stack métriques pour la première mise en ligne.

## Quand passer à Nuxt

Tu quittes ce parcours SPA quand tu as besoin :

- de HTML au premier paint pour du contenu / du SEO marketing
- de `useAsyncData` / `useFetch` serveur
- de routes fichiers et d'API serveur dans le même repo

N'importe pas les patterns Nuxt dans Vite pour simuler du SSR. Change de framework.

## Checklist

- `build` + `preview` passent
- Seules les valeurs publiques utilisent `VITE_`
- L'hôte réécrit les chemins inconnus vers `index.html`
- `base` Vite = `base` du routeur
- Le SSR est reporté à la roadmap Nuxt

## Sources

- [Vite : déploiement statique](https://vite.dev/guide/static-deploy.html)
- [Vite : variables d'env](https://vite.dev/guide/env-and-mode.html)
- [Vue Router : mode history](https://router.vuejs.org/guide/essentials/history-mode.html)
