---
title: "Computed, watch et cycle de vie"
description: "Séparer état dérivé (computed), effets de bord (watch) et hooks de cycle de vie Vue, sans transformer chaque valeur en watcher."
date: 2026-04-06
tags: ["vue", "computed", "watch", "cycle-de-vie"]
draft: false
readingTime: "10 min"
---

## Trois outils, trois jobs

Après `ref` / `reactive` :

- **computed** : calculer une valeur à partir d'autres
- **watch / watchEffect** : déclencher un effet de bord
- **hooks de cycle de vie** : agir au montage, avant le démontage

Un watcher qui recopie `a * 2` dans `b` est un `computed` manqué. `onMounted` n'est pas un endroit pour resynchroniser une prop si un computed suffit.

## computed : cache et dépendances

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const lignes = ref([
  { id: 1, fait: true, libelle: 'Relire la PR' },
  { id: 2, fait: false, libelle: 'Écrire les tests' }
])

const restantes = computed(() => lignes.value.filter((ligne) => !ligne.fait).length)
</script>

<template>
  <p>{{ restantes }} ouvertes</p>
</template>
```

`computed` est paresseux et mis en cache. Listes filtrées, libellés formatés, `disabled` d'un bouton : c'est sa zone.

Les computed inscriptibles existent. Un débutant n'en a presque jamais besoin.

## watch : source explicite

Utilise `watch` pour un fetch, un `localStorage`, un widget tiers.

```ts
import { ref, watch } from 'vue'

const recherche = ref('')

watch(recherche, async (suivant, precedent) => {
  if (suivant === precedent) {
    return
  }

  // charger des suggestions
})
```

Options utiles : `immediate`, `deep` (à éviter sur un gros arbre), `flush: 'post'` si tu as besoin du DOM à jour.

## watchEffect : suivi automatique

```ts
import { watchEffect } from 'vue'

watchEffect(() => {
  document.title = `${restantes.value} tâches ouvertes`
})
```

Pratique, et facile à abuser. En revue de code, `watch` avec une source nommée se lit mieux.

## Hooks vraiment utiles

| Hook | Moment |
| --- | --- |
| `onMounted` | DOM prêt : focus, mesure, abonnement |
| `onBeforeUnmount` | Annuler timer, fetch, listener |
| `onUpdated` | Rare ; préfère un watch sur la donnée |

```ts
import { onBeforeUnmount, onMounted } from 'vue'

onMounted(() => {
  window.addEventListener('keydown', handleTouche)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleTouche)
})
```

Pas de `onCreated` dans `<script setup>` : le setup **est** la création.

## Anti-patterns

- Watcher qui calcule au lieu d'un computed
- Fetch dans `watchEffect` sans abort
- `onUpdated` pour « réparer » le DOM à chaque rendu
- Un watcher par ligne d'une liste au lieu d'un watch sur la liste

## Checklist

- Le dérivé passe par `computed`
- L'effet de bord a une source `watch` claire
- Le travail DOM se nettoie au démontage
- Tu peux expliquer pourquoi un `watchEffect` s'est relancé

## Sources

- [Propriétés calculées](https://vuejs.org/guide/essentials/computed.html)
- [Watchers](https://vuejs.org/guide/essentials/watchers.html)
- [Hooks de cycle de vie](https://vuejs.org/guide/essentials/lifecycle.html)
