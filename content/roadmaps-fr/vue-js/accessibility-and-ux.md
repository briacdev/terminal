---
title: "Accessibilité et UX dans Vue"
description: "Interfaces Vue accessibles : HTML sémantique, clavier, ARIA seulement si besoin, et gestion du focus à l'ouverture d'une modale ou d'une route."
date: 2026-04-15
tags: ["vue", "a11y", "ux", "aria"]
draft: false
readingTime: "9 min"
---

## Vue ne rend pas une page accessible tout seul

Un composant peut dessiner un `<div>` qui ressemble à un bouton. Lecteur d'écran et clavier verront un div. L'accessibilité, c'est d'abord du HTML.

Les erreurs typiques d'une SPA Vue : div cliquable, label manquant, focus perdu après une route ou une modale.

## Éléments natifs

```vue
<!-- Mauvais -->
<div class="btn" @click="handleEnregistrer">Enregistrer</div>

<!-- Bon -->
<button type="button" @click="handleEnregistrer">Enregistrer</button>
```

`type="button"` évite de soumettre un formulaire par accident. Un lien interne, c'est `<RouterLink>` ou `<a href>`. N'ajoute `role="button"` + `tabindex="0"` + `@keydown` que si tu ne peux vraiment pas utiliser un `<button>`.

## Libellés et erreurs

```vue
<label for="email">E-mail</label>
<input id="email" v-model.trim="email" type="email" autocomplete="email" :aria-invalid="Boolean(messageErreur)" :aria-describedby="messageErreur ? 'email-erreur' : undefined">
<p v-if="messageErreur" id="email-erreur" role="alert">{{ messageErreur }}</p>
```

Chaque champ a un `<label>` visible lié par `for` / `id`. Un `placeholder` n'est pas un label. `role="alert"` annonce l'erreur sans recharger la page.

## Clavier

Si tu n'as vraiment pas de bouton natif :

```vue
<div
  role="button"
  tabindex="0"
  aria-label="Ouvrir les filtres"
  @click="handleOuvrirFiltres"
  @keydown.enter.prevent="handleOuvrirFiltres"
  @keydown.space.prevent="handleOuvrirFiltres"
>
  Filtres
</div>
```

Les modificateurs `.enter` et `.space` aident. Un vrai bouton reste plus court.

## Focus après un changement d'UI

Modale ouverte → focus dedans. Modale fermée → focus sur le bouton d'ouverture.

```ts
import { nextTick, ref } from 'vue'

const estOuvert = ref(false)
const panneauRef = ref<HTMLElement | null>(null)
const ouvreurRef = ref<HTMLButtonElement | null>(null)

const handleOuvrir = async () => {
  estOuvert.value = true
  await nextTick()
  panneauRef.value?.focus()
}

const handleFermer = () => {
  estOuvert.value = false
  ouvreurRef.value?.focus()
}
```

Sans `nextTick`, `focus()` cible un nœud encore absent à cause du `v-if`.

## Images et icônes

Icône décorative : `aria-hidden="true"`. Image utile : `alt`. Bouton icône seule : `aria-label`.

## Checklist

- Bouton = `<button>`, lien = lien
- Formulaires avec labels, `autocomplete`, erreurs annoncées
- Les modales restaurent le focus
- Pas d'ARIA plaqué sur un élément qui a déjà le bon rôle natif

## Sources

- [Vue : accessibilité](https://vuejs.org/guide/best-practices/accessibility.html)
- [MDN : ARIA](https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA)
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
