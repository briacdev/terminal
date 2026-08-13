---
title: "Composants, props et événements"
description: "Découper une UI Vue en enfants, descendre des données typées via props, et remonter des actions avec emit. Flux unidirectionnel sans store."
date: 2026-04-07
tags: ["vue", "props", "emit", "composants"]
draft: false
readingTime: "9 min"
---

## Le flux à une voie

Deux directions, pas plus :

- les **props** descendent (parent → enfant)
- les **événements** remontent (enfant → parent)

Le parent possède les données. L'enfant ne mute jamais une prop. S'il a besoin d'un changement, il émet, le parent met à jour la source.

Les slots sont la page suivante.

## Props typées

```vue
<script setup lang="ts">
interface PropsCarteLivre {
  titre: string
  emprunte?: boolean
}

const props = withDefaults(defineProps<PropsCarteLivre>(), {
  emprunte: false
})
</script>

<template>
  <article>
    <h2>{{ props.titre }}</h2>
    <p v-if="props.emprunte">Déjà emprunté</p>
  </article>
</template>
```

Dans le template, `{{ titre }}` marche aussi. En script, `props.titre` se cherche mieux. Une prop optionnelle a un défaut via `withDefaults`.

## Émettre

```vue
<script setup lang="ts">
const emit = defineEmits<{
  rendre: [id: string]
  renommer: [id: string, titre: string]
}>()

const handleRendre = (id: string) => {
  emit('rendre', id)
}
</script>
```

Le parent écoute :

```vue
<CarteLivre
  :titre="livre.titre"
  :emprunte="livre.emprunte"
  @rendre="handleLivreRendu"
/>
```

Noms d'événements courts, style DOM : `rendre`, `update:titre`. Pas `onRendre`.

## Ne pas écrire dans une prop

```ts
props.emprunte = true
```

Vue avertit en développement. Émets un événement, ou garde un `ref` local si l'enfant édite un brouillon pas encore sauvé.

Le vrai two-way sur un champ custom, c'est `defineModel`, à la page formulaires.

## Quand extraire un composant

- le bloc est réutilisé
- le template mélange liste, formulaire et en-tête
- tu veux tester ce morceau isolément

Un `<button>` n'a pas besoin de son fichier. Le composant doit mériter le split.

## Checklist

- Props typées, défauts si optionnelles
- L'enfant émet, il n'écrit pas dans les props
- Le parent reste la source de vérité
- Les noms d'événements ne commencent pas par `on`

## Sources

- [Props](https://vuejs.org/guide/components/props.html)
- [Événements](https://vuejs.org/guide/components/events.html)
- [Bases des composants](https://vuejs.org/guide/essentials/component-basics.html)
