---
title: "Setup Vite et structure du projet"
description: "Créer une application Vue 3 avec Vite, choisir Node et le lockfile, puis comprendre le rôle de main.ts, App.vue, index.html et de l'alias @."
date: 2026-04-02
tags: ["vue", "vite", "setup", "outillage"]
draft: false
readingTime: "9 min"
---

## Pourquoi le scaffold compte

Une app Vue 3 moderne est presque toujours un projet **Vite**. Vite démarre vite (sans jeu de mot obligatoire), s'appuie sur ESM en développement, et produit le bundle de production avec Rollup. Si tu ne sais pas quel fichier fait quoi, chaque étape suivante ressemble à de la magie.

Cette page s'arrête à l'outillage. Les SFC viennent ensuite.

## Prérequis

Installe un **Node.js LTS** actuel (20 ou 22), puis un seul gestionnaire de paquets :

```bash
node -v
npm -v
```

`npm`, `pnpm` ou `bun` : choisis-en un. Ne mélange pas deux lockfiles dans le même dépôt.

## Créer le projet

```bash
npm create vue@latest
```

Réponses recommandées pour ce parcours :

- TypeScript : **oui**
- JSX : non
- Vue Router : non (on l'ajoute plus tard, volontairement)
- Pinia : non
- Vitest : oui si tu veux tester tôt
- ESLint : oui

Puis :

```bash
cd <nom-du-projet>
npm install
npm run dev
```

L'URL locale affichée dans le terminal doit ouvrir la page d'accueil Vite + Vue.

## À quoi sert chaque fichier

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

- `index.html` est la vraie entrée HTML. Vite y injecte le script.
- `src/main.ts` crée l'application et la monte sur `#app`.
- `src/App.vue` est le composant racine.
- `vite.config.ts` contient plugins et alias.

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

Tant qu'il n'y a pas de routeur, c'est tout le démarrage.

## Commandes du quotidien

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur avec rechargement à chaud |
| `npm run build` | Bundle dans `dist/` |
| `npm run preview` | Sert `dist/` en local |

Si `dev` échoue, vérifie d'abord la version de Node, puis réinstalle `node_modules` avec le même lockfile.

## Alias `@`

Vite + Vue mappe en général `@` vers `src`. Écris :

```ts
import BadgeStatut from '@/components/BadgeStatut.vue'
```

Vérifie que `vite.config.ts` **et** `tsconfig.json` déclarent le même alias, sinon TypeScript et Vite ne seront pas d'accord.

## Ne rien ajouter « pour plus tard »

Pas de kit UI, pas de store, pas de framework CSS à cette étape. Un Vite propre se débogue plus vite. Router, Pinia et Tailwind arriveront aux pages qui en ont besoin.

## Checklist

- Node LTS est dans le PATH
- `npm run dev` démarre sans erreur
- Tu sais désigner `main.ts`, `App.vue` et `index.html`
- L'alias `@` compile

## Sources

- [Démarrer une app Vue](https://vuejs.org/guide/quick-start.html)
- [Vite : premiers pas](https://vite.dev/guide/)
- [Plugin Vue pour Vite](https://vite.dev/guide/features.html#vue)
