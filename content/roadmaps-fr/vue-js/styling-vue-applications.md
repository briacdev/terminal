---
title: "Styler une application Vue"
description: "CSS scopé, :deep avec parcimonie, et utilitaires Tailwind dans une app Vue 3, sans fuite de styles ni quatrième système CSS."
date: 2026-04-14
tags: ["vue", "css", "scoped", "tailwind"]
draft: false
readingTime: "8 min"
---

## Trois couches, une règle

1. **Reset / tokens** dans un CSS global importé depuis `main.ts`
2. **Utilitaires** (Tailwind ou équivalent) pour espacement, couleur, layout
3. **CSS scopé** dans un SFC seulement pour une règle ponctuelle

N'ajoute pas un quatrième système (styles inline partout + modules + kit UI) sur une petite app.

## CSS scopé

```vue
<template>
  <p class="statut">Prêt</p>
</template>

<style scoped>
.statut {
  color: #d4d4d8;
  font-variant: small-caps;
}
</style>
```

Vue pose un attribut unique. Le sélecteur devient du type `.statut[data-v-f3f3eg]`. Les voisins ne le voient pas.

## Quand utiliser :deep()

Le CSS scopé n'entre pas dans les internes d'un enfant. Pour styler un enfant depuis le parent :

```vue
<style scoped>
.panneau :deep(h2) {
  margin: 0;
}
</style>
```

Si tu perce l'enfant tout le temps, il manque une prop ou un slot.

`:slotted()` cible le contenu passé dans un slot. `:global()` sort du scoping. Pour du vrai global, un fichier CSS d'entrée suffit.

## Tailwind avec Vue

Installe Tailwind via Vite, puis des classes dans le template :

```vue
<button
  type="button"
  class="border border-zinc-600 px-3 py-1 text-xs uppercase tracking-wide hover:bg-white hover:text-black"
>
  Déployer
</button>
```

Tailwind ne remplace pas tout le CSS scopé. Il remplace l'essentiel. Garde `scoped` pour les animations ou les sélecteurs mal exprimés en utilitaires.

## CSS modules (optionnel)

```vue
<template>
  <p :class="$style.legende">Méta</p>
</template>

<style module>
.legende {
  font-size: 0.75rem;
}
</style>
```

Utile dans un gros design system. Excessif pour une SPA de 20 composants.

## Checklist

- Les tokens globaux ont un seul fichier d'entrée
- Le CSS de composant est `scoped` sauf s'il est vraiment global
- `:deep` est un dernier recours
- Les utilitaires couvrent espacement et couleur avant le CSS custom

## Sources

- [CSS des SFC](https://vuejs.org/api/sfc-css-features.html)
- [Tailwind + Vite](https://tailwindcss.com/docs/installation/using-vite)
